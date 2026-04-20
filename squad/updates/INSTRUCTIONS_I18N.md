# GUIDELINES: INTERNATIONALIZATION (i18n)

**Task for @code:**
You are to execute phases [4.2] and [4.3] of `PLAN.md`.
Please adhere strictly to the instructions below to implement `react-i18next` without destroying current component logic and layouts.

## 1. i18n Architecture Setup & Config (Step 4.3 objective)
- **Action:** Install dependencies by running `npm install i18next react-i18next` in the terminal from the `telapsi` directory.
- Create a configuration file at `src/i18n/config.js`. 
- Initialize `i18next` with `pt` (Portuguese) as the default language and `en` (English) as a fallback.
- Import `src/i18n/config.js` into `src/main.jsx` so the context is established globally.

## 2. Extract and Map Harcoded Strings (Step 4.2 objective)
- Carefully map and extract **all** hardcoded Portuguese strings from the entire application into `JSON` locale files.
- Create `src/i18n/locales/pt.json` and `src/i18n/locales/en.json`.
- Group keys logically by component or context (e.g., `"navbar.home": "Início"`, `"login.button": "Entrar com Google"`, etc.).
- Convert static strings, button labels, `alert()` messages, dropdown options, and `<input placeholder="...">` text into `t("...")` calls using the `useTranslation()` hook.

*Key directories to scan for hardcoded strings:*
- `src/routes/` (`Landpage`, `Login`, `Professor`, etc.)
- `src/sections/` (`NavBar`, `Hero`, `Sobre`, `Catalogo`, `Planejamento`, `FAQ`, `Footer`)
- `src/tools/` (Forms, Modals, Menus, Lists)

## 3. Integrate Toggle Functionality (Step 4.3 objective)
- Construct Language Switcher UI elements.
- **Public Site:** Place the toggle cleanly inside `src/sections/NavBar.jsx`.
- **Educational Area:** Place the toggle inside the sidebar `src/tools/Menu.jsx`.
- Connect the switcher UI to the `i18n.changeLanguage()` API method.
- Ensure the selected language state persists or defaults gracefully without visually jarring layout shifts when strings expand or compress between linguistic translations.

**Note:** Refrain from arbitrarily refactoring logic. Stick specifically to string injection (`t()`) and verifying that the structure holds properly.
