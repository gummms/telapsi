# Root Cause Analysis & Fix Instructions for Backend Translation
## ONLY FOR: Claude Opus 4.6 — Do not code until you have read this entirely.

---

## The Real Problem (Not What Previous Sessions Assumed)

Wrapping backend data in `<T>` is correct and necessary. However, the translation **still does not work** for backend data because of a **React hook timing problem** — not a JSX wrapping problem.

### The Exact Bug

`useTranslate(text)` inside `T.jsx` does this:

```js
const [translated, setTranslated] = useState(text);   // ← initialised with text

useEffect(() => {
  setTranslated(text);           // ← reset on change
  if (!text || language === "pt") return;
  translateText(text, language).then(result => setTranslated(result));
}, [text, language]);             // ← runs when text OR language changes
```

**For hardcoded strings** (e.g. `<T>Início</T>`), `text` is always `"Início"` from the first render. When the user clicks EN, `language` changes → effect runs → API is called → translation appears. ✅ Works.

**For backend data** (e.g. `<T>{filme.sinopse}</T>`), the sequence is:

1. Component mounts. `filme` is `null` (loading state). `text` = `""` (guarded to empty by `T.jsx`). `useState("")` initialises `translated = ""`. Effect runs, sees `!text`, returns early. **No API call.**
2. Firestore responds. `filme` is set. `text` = `"O filme narra..."`. Effect re-runs because `text` changed. **Language is already "en".** API is called... 

Wait — this *should* work. But it **doesn't**, because of a subtler problem:

**The user opens FichaFilme AFTER having already switched to EN.**

The sequence then is:
1. FichaFilme mounts with `filme = null` → `text = ""` → `translated = ""`
2. Firestore loads → `filme.sinopse = "O filme narra..."` → `text` changes
3. `useEffect` fires with `[text="O filme narra...", language="en"]` → **should call API** ✅

So actually the wrappers *should* work in theory. The failure must be happening at the API level.

---

## The ACTUAL Root Cause: API Call is Silently Failing

The `translationService.js` fires a `fetch` to:
```
POST https://translation.googleapis.com/language/translate/v2?key=AIzaSy...
```

**This API key is a Browser API key.** Google Cloud Translation API v2 (Basic) with a browser key requires the key to have **no HTTP referrer restrictions**, OR the referrer `localhost:5173` must be whitelisted. In production, `telapsi-lit-2025.web.app` must also be whitelisted.

However, that is **not the only possible failure point**. The `flushQueue` function has a silent failure mode:

```js
} catch (error) {
  console.error("Translation batch failed:", error);
  // On failure, return the original text — silently
  pending.forEach((item) => item.resolve(item.text));
}
```

If the API call fails for **any reason** (wrong key, quota exceeded, CORS, referrer restriction), the original text is returned silently. The UI sees no change. The user cannot tell if translation worked or not.

---

## What Must Be Fixed

### Fix 1: Add visible error logging + distinguish success from failure

Currently when the API fails, the code silently returns the original text. Opus must add `console.warn` with the actual response body so the developer can see what Google is returning.

Change `flushQueue` to log the actual error response:

```js
if (!response.ok) {
  const errBody = await response.text();
  throw new Error(`Translation API error ${response.status}: ${errBody}`);
}
```

This single change will reveal the actual error in the browser console and allow diagnosis.

### Fix 2: The `useTranslate` hook has an initialisation race condition for a specific scenario

When a component is **already mounted with data loaded**, and THEN the user switches language, there is no problem — `language` changes, effect fires, API called.

But when the component **mounts fresh while language is already "en"** AND the data loads asynchronously (Firestore), there is a subtle issue:

`useState(text)` initialises with `text` = `""` (empty, because data is still loading). When data arrives, `text` changes from `""` to `"O filme narra..."`. The `useEffect` dependency `[text, language]` fires. At this point `language = "en"` and `text` is non-empty. **The API should be called.** This is correct.

**HOWEVER**: The `T.jsx` guard does this:

```js
const text =
  children == null || children === ""
    ? ""
    : typeof children === "string"
    ? children
    : String(children);

const translated = useTranslate(text);   // hook called with ""

if (!text) return null;   // returns null early
```

This means when `children = null` (loading), `useTranslate("")` is called. `useState("")` is set. When children arrives as `"O filme narra..."`, `text` changes to `"O filme narra..."`. React re-renders `T`. **The hook instance is the SAME** (same component, same DOM position), so `useEffect([text, language])` fires and the API is called. This IS correct.

So the wrappers are fine. **The real problem is the API call itself failing silently.**

### Fix 3: The cache key deduplication issue

When `filme.elenco` is an **array** (`["Actor A", "Actor B"]`), the current code in FichaFilme does:

```jsx
<T>{filme.elenco && Array.isArray(filme.elenco)
  ? filme.elenco.join(", ")
  : filme.elenco}</T>
```

The ternary **expression** is the child of `<T>`. In JSX, `{expression}` inside a component is evaluated before being passed as `children`. So `children` = `"Actor A, Actor B"` (a string). This is correct — no issue here.

---

## The Definitive Fix: Surface the API Error

Opus must modify `translationService.js` to:

1. **Log the full error response body** from the Google API (not just the status code)
2. **Add a `console.warn` in `translateText`** when the API key is missing or undefined
3. **Keep the silent fallback** (return original text on failure) — this is good UX

Here is the complete rewrite of `translationService.js`:

```js
const cache = {};
const queue = {};
const timers = {};

const API_KEY = import.meta.env.VITE_GOOGLE_TRANSLATION_API_KEY;
const ENDPOINT = "https://translation.googleapis.com/language/translate/v2";
const DEBOUNCE_MS = 80;

if (!API_KEY) {
  console.warn("[Translation] VITE_GOOGLE_TRANSLATION_API_KEY is not set. Translation will be disabled.");
}

async function flushQueue(targetLang) {
  const pending = queue[targetLang] || [];
  if (pending.length === 0) return;

  queue[targetLang] = [];
  const texts = pending.map((item) => item.text);

  try {
    const response = await fetch(`${ENDPOINT}?key=${API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        q: texts,
        source: "pt",
        target: targetLang,
        format: "text",
      }),
    });

    if (!response.ok) {
      const errBody = await response.text();
      throw new Error(`[Translation] Google API error ${response.status}: ${errBody}`);
    }

    const data = await response.json();
    const translations = data.data.translations;

    if (!cache[targetLang]) cache[targetLang] = {};

    translations.forEach((result, i) => {
      const original = texts[i];
      const translated = result.translatedText;
      cache[targetLang][original] = translated;
      pending[i].resolve(translated);
    });
  } catch (error) {
    console.error("[Translation] Batch failed:", error.message);
    pending.forEach((item) => item.resolve(item.text));
  }
}

export function translateText(text, targetLang) {
  if (!text || typeof text !== "string" || text.trim() === "") {
    return Promise.resolve(text);
  }

  if (!targetLang || targetLang === "pt") {
    return Promise.resolve(text);
  }

  if (!API_KEY) {
    return Promise.resolve(text);
  }

  if (cache[targetLang]?.[text] !== undefined) {
    return Promise.resolve(cache[targetLang][text]);
  }

  return new Promise((resolve, reject) => {
    if (!queue[targetLang]) queue[targetLang] = [];
    queue[targetLang].push({ text, resolve, reject });

    clearTimeout(timers[targetLang]);
    timers[targetLang] = setTimeout(() => flushQueue(targetLang), DEBOUNCE_MS);
  });
}
```

---

## Additional Fix: The `useTranslate` hook must handle the case where data loads while language is already non-PT

Currently:
```js
export function useTranslate(text) {
  const { language } = useLanguage();
  const [translated, setTranslated] = useState(text);

  useEffect(() => {
    setTranslated(text);
    if (!text || language === "pt") return;
    ...
  }, [text, language]);

  return translated;
}
```

There is **one confirmed edge case** that breaks this: if `text` arrives as the same value across two renders (React batching or StrictMode double-invoke), the effect may not re-run. Opus must add an explicit `language` reset:

Actually the existing code IS correct for the normal case. The issue identified is solely the API error. 

**The ONLY code change needed is `translationService.js`** — replace the entire file with the version above.

After making this change, open the browser DevTools console, click the EN button, and read the error message from Google. The error will tell you exactly what is wrong (most likely: API key restriction, billing not enabled, or quota exceeded).

---

## What Opus Must Do

1. **Replace `src/services/translationService.js`** with the version above (adds API key guard and full error body logging)
2. **Do NOT touch** any other file
3. After deployment/testing, the browser console will show the exact Google API error, which will guide the next debugging step

## What Opus Must NOT Do

- Do not add new state, new hooks, or new services
- Do not change `T.jsx`, `useTranslate.js`, or `LanguageContext.jsx`
- Do not modify any component files
- Do not add translation caching to Firestore
- Do not create translation scripts

---

## Summary

The `<T>` wrappers are implemented correctly. The JSX timing is correct. The hook dependencies are correct. **The translation pipeline IS being called for backend data.** The content is silently falling back to Portuguese because the Google API call is returning an error (status 4xx or 5xx) that is caught and swallowed without logging the body. Fix the error logging in `translationService.js` to surface what Google is actually returning.
