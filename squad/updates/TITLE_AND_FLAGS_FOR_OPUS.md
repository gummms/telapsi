# Coding Instructions for Claude Opus 4.6
## Two isolated changes. Read all sections before touching any file.

---

## Change 1 — Movie Titles: Use `tituloOriginal` Instead of Translating `titulo`

### Context

Movie titles in Firestore are stored as two fields:
- `titulo` — the Portuguese/localized title (e.g. "Uma Mente Brilhante")
- `tituloOriginal` — the original language title (e.g. "A Beautiful Mind")

Currently, `filme.titulo` is wrapped in `<T>` and sent through Google Translate, which produces awkward machine-translated titles. The correct behavior when language is EN is to **show `tituloOriginal` directly** — no API call needed.

The `filmeTitulo` field on lesson documents (`aulas`) is denormalized from `filme.titulo` and must follow the same rule.

### Rule

- When `language === "pt"` → show `filme.titulo` (Portuguese title)
- When `language !== "pt"` → show `filme.tituloOriginal` (original title, no translation)
- If `tituloOriginal` is missing/empty, fall back to `filme.titulo`

### Implementation Pattern

Create a small helper **inline** in each affected component (do NOT create a shared utility file). The pattern is:

```jsx
const displayTitle = (titulo, tituloOriginal) =>
  language !== "pt" && tituloOriginal ? tituloOriginal : titulo;
```

Call `useLanguage()` if not already imported in the component.

### Files to Modify

#### 1. `src/sections/Catalogo.jsx`

- Already imports `T`. Add import of `useLanguage`.
- Inside the component body, destructure `const { language } = useLanguage();`
- Replace `<h3><T>{filme.titulo}</T></h3>` with:
  ```jsx
  <h3>{language !== "pt" && filme.tituloOriginal ? filme.tituloOriginal : filme.titulo}</h3>
  ```
- The `alt` attribute on the `<img>` tag can stay as `filme.titulo` (accessibility, not translated).

#### 2. `src/tools/filmes/CatalogoFilmes.jsx`

- Already imports `useLanguage` (check; add if not present).
- Same inline pattern:
  ```jsx
  <h3>{language !== "pt" && filme.tituloOriginal ? filme.tituloOriginal : filme.titulo}</h3>
  ```
- Remove `<T>` wrapper — no translation call needed.

#### 3. `src/tools/filmes/FichaFilme.jsx`

- Already imports `T`. Add import of `useLanguage`.
- Inside the component body: `const { language } = useLanguage();`
- Replace the `<h1>` title:
  ```jsx
  <h1>{language !== "pt" && filme.tituloOriginal ? filme.tituloOriginal : filme.titulo}</h1>
  ```
- The `tituloOriginal` line (already un-translated at line 115) is correct as-is — leave it untouched.

#### 4. `src/tools/aulas/AulasLista.jsx`

`filmeTitulo` on lesson cards is the denormalized title. It does NOT have a corresponding `filmeOriginalTitulo` field — it is a plain string in Firestore. Do NOT translate it with `<T>`. Instead, **remove the `<T>` wrapper** from both occurrences and leave the raw value:

- Line 143: `<T>{aula.filmeTitulo}</T>` → `{aula.filmeTitulo}`
- Line 204: `<T>{aulaBase.filmeTitulo}</T>` → `{aulaBase.filmeTitulo}`

> Reason: The denormalized `filmeTitulo` is set at lesson creation time from `filme.titulo`. Translating it via the API would produce the same awkward machine-translated title. Since we cannot retroactively fix the denormalized data without a migration, the safest choice is to leave it as stored (the original PT title) in all languages. This is a known limitation of the denormalization, not a bug in the translation system.

#### 5. `src/sections/Planejamento.jsx`

Same reasoning as AulasLista. Remove `<T>` from `aula.filmeTitulo`:

- Line 100: `<T>{aula.filmeTitulo}</T>` → `{aula.filmeTitulo}`

---

## Change 2 — Language Switcher: Replace PT/EN Text with SVG Flags

### Context

The language switcher currently shows text labels "PT" and "EN". These must be replaced with SVG flag icons representing Brazil (PT) and USA (EN). No image files are available and emojis are forbidden. The solution is **inline SVG** rendered directly in JSX.

### SVGs to Use

Use clean, minimal rectangular flag SVGs with a `width="28" height="20"` viewBox.

**Brazilian flag SVG** (green rectangle, yellow diamond, blue circle, white band):
```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 20" width="28" height="20" aria-label="Português (Brasil)">
  <rect width="28" height="20" fill="#009B3A"/>
  <polygon points="14,2 26,10 14,18 2,10" fill="#FEDF00"/>
  <circle cx="14" cy="10" r="4.5" fill="#002776"/>
  <path d="M9.7 9.2 Q14 7.2 18.3 9.2" stroke="white" stroke-width="1.1" fill="none"/>
</svg>
```

**US flag SVG** (13 stripes red/white, blue canton, simplified stars as white dots):
```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 20" width="28" height="20" aria-label="English (US)">
  <rect width="28" height="20" fill="#B22234"/>
  <rect y="1.54" width="28" height="1.54" fill="white"/>
  <rect y="4.62" width="28" height="1.54" fill="white"/>
  <rect y="7.69" width="28" height="1.54" fill="white"/>
  <rect y="10.77" width="28" height="1.54" fill="white"/>
  <rect y="13.85" width="28" height="1.54" fill="white"/>
  <rect y="16.92" width="28" height="1.54" fill="white"/>
  <rect width="11.2" height="10.77" fill="#3C3B6E"/>
  <g fill="white">
    <circle cx="1.4" cy="1.35" r="0.7"/>
    <circle cx="2.8" cy="2.69" r="0.7"/>
    <circle cx="4.2" cy="1.35" r="0.7"/>
    <circle cx="5.6" cy="2.69" r="0.7"/>
    <circle cx="7.0" cy="1.35" r="0.7"/>
    <circle cx="8.4" cy="2.69" r="0.7"/>
    <circle cx="9.8" cy="1.35" r="0.7"/>
    <circle cx="1.4" cy="4.04" r="0.7"/>
    <circle cx="2.8" cy="5.38" r="0.7"/>
    <circle cx="4.2" cy="4.04" r="0.7"/>
    <circle cx="5.6" cy="5.38" r="0.7"/>
    <circle cx="7.0" cy="4.04" r="0.7"/>
    <circle cx="8.4" cy="5.38" r="0.7"/>
    <circle cx="9.8" cy="4.04" r="0.7"/>
    <circle cx="1.4" cy="6.73" r="0.7"/>
    <circle cx="2.8" cy="8.08" r="0.7"/>
    <circle cx="4.2" cy="6.73" r="0.7"/>
    <circle cx="5.6" cy="8.08" r="0.7"/>
    <circle cx="7.0" cy="6.73" r="0.7"/>
    <circle cx="8.4" cy="8.08" r="0.7"/>
    <circle cx="9.8" cy="6.73" r="0.7"/>
  </g>
</svg>
```

### CSS Changes Required

The current `.lang-btn` is sized for text (`font-size: 0.85rem`, `padding: 0.6rem 0`). Flags are wider than text. Update in `src/components/Buttons.css`:

Find the block `.lang-switcher .lang-btn` (lines 344–363) and change only these properties:

```css
/* Change from: */
padding: 0.6rem 0 !important;
font-size: 0.85rem !important;
font-weight: 700 !important;

/* Change to: */
padding: 0.35rem 0 !important;
font-size: 0 !important;      /* hide any text fallback */
```

Also update `.lang-switcher` min-width (line 319) from `100px` to `84px` to fit the narrower flag buttons.

### JSX Changes Required

**Both `NavBar.jsx` and `Menu.jsx`** contain the language switcher. In each file, replace the two `<ButtonMain>` label texts inside `.lang-switcher` with the inline SVGs.

**Pattern in NavBar.jsx** — replace lines 57–68:

```jsx
<li className={`lang-switcher ${language === "en" ? "en-active" : "pt-active"}`}>
  <ButtonMain
    onClick={() => { changeLanguage("pt"); closeMenu(); }}
    className={`lang-btn ${language === "pt" ? "active" : ""}`}
    aria-label="Português (Brasil)"
  >
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 20" width="28" height="20" style={{borderRadius:"3px",display:"block"}}>
      <rect width="28" height="20" fill="#009B3A"/>
      <polygon points="14,2 26,10 14,18 2,10" fill="#FEDF00"/>
      <circle cx="14" cy="10" r="4.5" fill="#002776"/>
      <path d="M9.7 9.2 Q14 7.2 18.3 9.2" stroke="white" strokeWidth="1.1" fill="none"/>
    </svg>
  </ButtonMain>
  <ButtonMain
    onClick={() => { changeLanguage("en"); closeMenu(); }}
    className={`lang-btn ${language === "en" ? "active" : ""}`}
    aria-label="English (US)"
  >
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 20" width="28" height="20" style={{borderRadius:"3px",display:"block"}}>
      <rect width="28" height="20" fill="#B22234"/>
      <rect y="1.54" width="28" height="1.54" fill="white"/>
      <rect y="4.62" width="28" height="1.54" fill="white"/>
      <rect y="7.69" width="28" height="1.54" fill="white"/>
      <rect y="10.77" width="28" height="1.54" fill="white"/>
      <rect y="13.85" width="28" height="1.54" fill="white"/>
      <rect y="16.92" width="28" height="1.54" fill="white"/>
      <rect width="11.2" height="10.77" fill="#3C3B6E"/>
      <g fill="white">
        <circle cx="1.4" cy="1.35" r="0.7"/><circle cx="2.8" cy="2.69" r="0.7"/>
        <circle cx="4.2" cy="1.35" r="0.7"/><circle cx="5.6" cy="2.69" r="0.7"/>
        <circle cx="7.0" cy="1.35" r="0.7"/><circle cx="8.4" cy="2.69" r="0.7"/>
        <circle cx="9.8" cy="1.35" r="0.7"/>
        <circle cx="1.4" cy="4.04" r="0.7"/><circle cx="2.8" cy="5.38" r="0.7"/>
        <circle cx="4.2" cy="4.04" r="0.7"/><circle cx="5.6" cy="5.38" r="0.7"/>
        <circle cx="7.0" cy="4.04" r="0.7"/><circle cx="8.4" cy="5.38" r="0.7"/>
        <circle cx="9.8" cy="4.04" r="0.7"/>
        <circle cx="1.4" cy="6.73" r="0.7"/><circle cx="2.8" cy="8.08" r="0.7"/>
        <circle cx="4.2" cy="6.73" r="0.7"/><circle cx="5.6" cy="8.08" r="0.7"/>
        <circle cx="7.0" cy="6.73" r="0.7"/><circle cx="8.4" cy="8.08" r="0.7"/>
        <circle cx="9.8" cy="6.73" r="0.7"/>
      </g>
    </svg>
  </ButtonMain>
</li>
```

**Apply the exact same SVG content** in `Menu.jsx` for the lang-switcher `<li>` block (lines 46–59), replacing `PT` and `EN` text with the same SVGs and adding `aria-label` props.

> NOTE: JSX SVG attributes use camelCase: `strokeWidth` not `stroke-width`, `fillOpacity` not `fill-opacity`. The `style` prop on `<svg>` uses `{{borderRadius:"3px",display:"block"}}` so the flag corners are slightly rounded and block-level for clean alignment.

---

## Files Summary

| File | What changes |
|---|---|
| `src/sections/Catalogo.jsx` | Add `useLanguage`, inline ternary for title display |
| `src/tools/filmes/CatalogoFilmes.jsx` | Same as above |
| `src/tools/filmes/FichaFilme.jsx` | Add `useLanguage`, inline ternary for title display |
| `src/tools/aulas/AulasLista.jsx` | Remove `<T>` from filmeTitulo (2 occurrences) |
| `src/sections/Planejamento.jsx` | Remove `<T>` from filmeTitulo (1 occurrence) |
| `src/sections/NavBar.jsx` | Replace PT/EN text with inline SVG flags |
| `src/tools/Menu.jsx` | Replace PT/EN text with inline SVG flags |
| `src/components/Buttons.css` | Adjust lang-btn padding, remove font-size, reduce min-width |

## Do NOT touch

- `translationService.js`
- `T.jsx`
- `useTranslate.js`
- `LanguageContext.jsx`
- Any form components (CadastroFilme, SceneForm, PlanejadorAulas)
- Any CSS file other than `Buttons.css`
