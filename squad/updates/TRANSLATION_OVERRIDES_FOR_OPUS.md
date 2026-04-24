# Translation Fixes — Instructions for Claude Opus 4.6 (@code)
## Read the full document before touching any file.

---

## Problem 1 — Wrong Translations (Literal vs. Contextual)

### Why this happens

Google Translate API translates words in isolation without UI context.
Short ambiguous Portuguese words get the wrong English equivalent:

| Source (PT) | API Output (EN) | Correct (EN) |
|---|---|---|
| `Início` | "Start" | "Home" |
| `Sobre` | "On" | "About" |
| `Sair` | "To go out" | "Logout" |
| `Área Didática` | "Didactic Area" | "Teaching Area" |

### Solution: Static Override Map in `translationService.js`

Add a `TRANSLATION_OVERRIDES` constant at the top of `translationService.js`.
This map is checked **before** adding a text to the API queue.
If a match is found, the override is returned instantly — no API call made.

The override map must be keyed by the **exact source string** as it appears in JSX.

Add this block immediately after the constants section (after `const DEBOUNCE_MS = 80;`):

```js
/**
 * Static override map for translations that the Google API gets wrong.
 * Key: exact PT source string (must match the <T> child exactly).
 * Value: correct EN translation.
 * Add new entries here whenever a UI label is mistranslated.
 */
const TRANSLATION_OVERRIDES = {
  en: {
    "Início": "Home",
    "Sobre": "About",
    "Sair": "Logout",
    "ÁREA DIDÁTICA": "TEACHING AREA",
    "Área didática": "Teaching Area",
    "Voltar para o site": "Back to website",
    "Sobre o Telapsi": "About Telapsi",
    "Saiba mais": "Learn more",
    "Guias Didáticos": "Teaching Guides",
    "Planos de Aula": "Lesson Plans",
    "Perguntas Frequentes": "Frequently Asked Questions",
  },
};
```

Then modify `translateText` to check this map **before** the cache and before queuing.
Insert the override check after the `!API_KEY` guard and before the cache check:

```js
// Check static overrides first (handles UI labels the API mistranslates)
if (TRANSLATION_OVERRIDES[targetLang]?.[text] !== undefined) {
  return Promise.resolve(TRANSLATION_OVERRIDES[targetLang][text]);
}
```

### Complete updated `translateText` function (for reference):

```js
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
  // Static override — checked before cache and before API
  if (TRANSLATION_OVERRIDES[targetLang]?.[text] !== undefined) {
    return Promise.resolve(TRANSLATION_OVERRIDES[targetLang][text]);
  }
  // In-memory cache
  if (cache[targetLang]?.[text] !== undefined) {
    return Promise.resolve(cache[targetLang][text]);
  }
  // Add to batched queue
  return new Promise((resolve, reject) => {
    if (!queue[targetLang]) queue[targetLang] = [];
    queue[targetLang].push({ text, resolve, reject });
    clearTimeout(timers[targetLang]);
    timers[targetLang] = setTimeout(() => flushQueue(targetLang), DEBOUNCE_MS);
  });
}
```

---

## Problem 2 — Untranslated Elements

### 2.1 Hero section "Sobre o Telapsi" button — `src/sections/Hero.jsx`

**Root cause:** The button uses the `text` prop on `ButtonMain`:
```jsx
<ButtonMain path="#sobre" text="Sobre o Telapsi" id="btn-sobre" />
```

The `text` prop renders as a raw string inside `ButtonMain` — it never passes through `<T>`.

**Fix:** Replace the `text` prop usage with `children` syntax, wrapping the label in `<T>`:

```jsx
// Replace this (line 36):
<ButtonMain path="#sobre" text="Sobre o Telapsi" id="btn-sobre" />

// With this:
<ButtonMain path="#sobre" id="btn-sobre">
  <T>Sobre o Telapsi</T>
</ButtonMain>
```

No changes needed to `ButtonMain.jsx` itself — it already renders `{children}`.

---

## Files to Modify

| File | Change |
|---|---|
| `src/services/translationService.js` | Add `TRANSLATION_OVERRIDES` constant + override check in `translateText` |
| `src/sections/Hero.jsx` | Replace `text="Sobre o Telapsi"` prop with `<T>` children |

## Files to NOT touch

- `T.jsx`
- `useTranslate.js`
- `LanguageContext.jsx`
- `NavBar.jsx` — the strings there (`Início`, `Sobre`, etc.) are already in `<T>`; the fix is in the service
- `Menu.jsx` — same: `Sair` is already in `<T>`; the fix is in the service
- Any component other than the two listed above

---

## Expected Results After Fix

| Label | Before fix | After fix |
|---|---|---|
| `Início` | "Start" | "Home" |
| `Sobre` | "On" | "About" |
| `Sair` | "To go out" | "Logout" |
| `Sobre o Telapsi` (hero button) | Not translated | "About Telapsi" |
| `Guias Didáticos` | "Didactic Guides" (may vary) | "Teaching Guides" |
| `Planos de Aula` | varies | "Lesson Plans" |

---

## Why This Architecture Is Correct

- The override map is **language-keyed** (`en: {...}`) so it can be extended to other languages in the future without changing any component code.
- Overrides are resolved **synchronously** (no API call, no cache lookup) — zero latency.
- Everything else continues to flow through the Google Cloud Translation API unchanged.
- Adding new corrections in the future only requires appending to `TRANSLATION_OVERRIDES.en` — no component changes needed.
