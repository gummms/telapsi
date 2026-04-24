# Dynamic Translation (Google Cloud API) Implementation Guide

This guide provides step-by-step instructions for `@code` to implement a dynamic, on-the-fly translation system using the Google Cloud Translation API. This will entirely replace the `react-i18next` library flow.

## Guidelines & Strict Constraints
1. **NO UI/UX Changes:** Keep the application exactly as it is. Do NOT change layout, styling, or routing.
2. **NO Content Modification:** The original Portuguese strings within the JSX files must remain intact. Do not extract strings to JSON dictionaries.
3. **API Usage:** Use the REST API endpoint `https://translation.googleapis.com/language/translate/v2` with the `VITE_GOOGLE_TRANSLATION_API_KEY` (already available in `.env`).
4. **Custom Language Switcher:** We must use our existing language toggle buttons (PT / EN) located in `NavBar.jsx` and `Menu.jsx`. Do NOT implement the default Google Translate dropdown widget.

## Implementation Steps

### 1. Global State (LanguageContext)
Create a lightweight React context to manage the active language globally, replacing `i18n.language`.
- Create `src/context/LanguageContext.jsx`.
- It should manage a `language` state (defaulting to `'pt'`).
- Export a `LanguageProvider` and a `useLanguage` hook.

### 2. Translation Service (Debouncing & Caching)
To avoid hitting Google Cloud API rate limits (Too Many Requests), we must batch translations and cache results locally.
- Create `src/services/translationService.js`.
- **Batching:** When a component requests a translation, add the string to a queue. Use a short timeout (e.g., 50ms-100ms) to group multiple requests before firing a single API call to Google.
- **Caching:** Maintain an in-memory `Map` (or `sessionStorage`) of translated strings (e.g., `{'pt-to-en': {'Olá': 'Hello'}}`). Always check the cache before queueing a string.
- Only make API calls when `targetLanguage` is NOT `'pt'`. If the target is `'pt'`, return the original text.

### 3. Translation Wrappers (`useTranslate` and `<T>`)
Create tools for components to seamlessly request translations.
- **Hook:** Create `src/hooks/useTranslate.js` that takes text, subscribes to `LanguageContext`, checks the cache/queue via `translationService`, and returns the translated text asynchronously.
- **Component:** Create `src/components/T.jsx` which wraps text nodes: `const T = ({ children }) => { ... }`. It should use the `useTranslate` hook and render the translated string.

### 4. Component Refactoring
Remove all `react-i18next` dependencies and replace them with the new context and wrappers.
- Remove `import { useTranslation } from "react-i18next";` from all components (like `NavBar.jsx`, `Hero.jsx`, forms, etc.).
- Replace the `t("...")` calls with the new `<T>` wrapper or the `useTranslate` hook. *Important: Put the original Portuguese strings back into the components as the source text.*
- **NavBar & Menu:** Update the language switcher buttons to use `useLanguage().changeLanguage` instead of `i18n`. The buttons must remain as they are visually.
- **main.jsx:** Remove `i18n/config` imports and wrap the application in `<LanguageProvider>`.

### 5. Final Cleanup
- Run `npm uninstall i18next react-i18next`.
- Remove `src/i18n` directory and locale files if they exist.
