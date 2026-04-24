# Bug Fixes — Instructions for Claude Opus 4.6 (@code)
## Read ALL sections before touching any file. Six independent issues.

---

## Issue 1 — Genre Slash Prefix/Suffix (`/Drama`, `Drama/`)

### Diagnosis
Some movies in Firestore have genres stored with a leading or trailing slash
(e.g. `"/Drama"`, `"Suspense/"`) due to a past data-entry bug. The fix is
**not** to clean Firestore — it is to sanitize the value at render time.

### Helper function
In each of the three affected files, apply this inline sanitizer wherever
`filme.genero1` or `filme.genero2` is rendered:

```js
const cleanGenre = (g) => g ? g.replace(/^\/+|\/+$/g, "").trim() : "";
```

### Files to modify

#### `src/sections/Catalogo.jsx`
Add the helper inside the component body (after `const { language } = useLanguage();`):
```js
const cleanGenre = (g) => g ? g.replace(/^\/+|\/+$/g, "").trim() : "";
```
Then replace the genre rendering block (currently lines ~68-71):
```jsx
{/* BEFORE */}
{filme.ano} • <T>{filme.genero1}</T>
{filme.genero2 && <> • <T>{filme.genero2}</T></>} • {filme.duracao}min • <T>{filme.pais}</T>

{/* AFTER */}
{filme.ano} • <T>{cleanGenre(filme.genero1)}</T>
{filme.genero2 && cleanGenre(filme.genero2) && <> • <T>{cleanGenre(filme.genero2)}</T></>} • {filme.duracao}min • <T>{filme.pais}</T>
```

#### `src/tools/filmes/CatalogoFilmes.jsx`
Same helper and same pattern. Locate the `<p className="filme-meta">` block and apply `cleanGenre()` to both `filme.genero1` and `filme.genero2`.

#### `src/tools/filmes/FichaFilme.jsx`
Same helper. Apply to the `.meta-line` rendering of `filme.genero1` and `filme.genero2` (currently line 112-113).

---

## Issue 2 — Movie Poster Shrunk in Full-View (`FichaFilme`)

### Diagnosis
`.poster-container` has `max-width: 8rem`. For landscape or tall-aspect images,
the img renders at `height: auto` which can make portrait posters collapse.
The CSS needs a fixed minimum height and `object-fit: cover`.

### File to modify: `src/tools/filmes/FichaFilme.css`

Find the `.poster-container` and `.poster-container img` blocks (lines 57-66):

```css
/* BEFORE */
.poster-container {
  max-width: 8rem;
  display: flex;
}

.poster-container img {
  width: 100%;
  height: auto;
  border-radius: 0.5rem;
}
```

Replace with:

```css
/* AFTER */
.poster-container {
  flex-shrink: 0;
  width: 8rem;
  min-height: 11rem;
  display: flex;
  align-items: flex-start;
}

.poster-container img {
  width: 100%;
  height: 100%;
  min-height: 11rem;
  object-fit: cover;
  border-radius: 0.5rem;
}
```

---

## Issue 3 — "Vários Filmes" Not Translated

### Diagnosis
Two-part problem:
1. The string `"Vários Filmes"` is **written to Firestore** as a plain string by `formsService.js` and `PlanejadorAulas.jsx` at lesson save time.
2. `filmeTitulo` is rendered as `{aula.filmeTitulo}` without any `<T>` wrapper (this was intentionally removed previously because machine-translated movie titles were wrong — but "Vários Filmes" is a UI string, not a title).

### Fix — Part A: Add to override map in `translationService.js`
In the `TRANSLATION_OVERRIDES.en` object, add:
```js
"Vários Filmes": "Multiple Films",
```

### Fix — Part B: Re-wrap `filmeTitulo` in `<T>` selectively
The previous decision to remove `<T>` from `filmeTitulo` was correct for movie titles, but wrong for the "Vários Filmes" sentinel value. The cleanest solution is to re-wrap it in `<T>` unconditionally — movie titles will now pass through the translation service, but since they are not in the override map and are proper nouns, the API will either leave them alone or the `tituloOriginal` logic already handles the display-level title. The `filmeTitulo` field on lesson cards is informational metadata, so API translation of it is acceptable.

In `src/tools/aulas/AulasLista.jsx`, re-wrap `filmeTitulo` in `<T>`:
- Line 143: `{aula.filmeTitulo}` → `<T>{aula.filmeTitulo}</T>`
- Line 204: `{aulaBase.filmeTitulo}` → `<T>{aulaBase.filmeTitulo}</T>`

In `src/sections/Planejamento.jsx`:
- Line ~100: `{aula.filmeTitulo}` → `<T>{aula.filmeTitulo}</T>`

---

## Issue 4 — Lesson Cards Have Mismatching Heights

### Diagnosis
`.aula-grid` uses `align-items: start` (intentionally set to prevent stretching),
but this means cards with multi-line titles are taller than others, creating
an uneven grid. The desired behaviour is: **equal-height cards within each row**,
with the button always pinned to the bottom.

`.aula-info` already has `flex-direction: column; flex-grow: 1` and
`.aula-card-actions` has `margin-top: auto` — this is the right pattern.
The fix is simply to make `.aula-card` and `.aula-grid` cooperate for equal heights.

### File to modify: `src/tools/aulas/AulasLista.css`

Find `.aula-grid` (lines 1-6):
```css
/* BEFORE */
.aula-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(25rem, 1fr));
  gap: 1.5rem;
  align-items: start;
}
```

Change `align-items: start` to `align-items: stretch`:
```css
/* AFTER */
.aula-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(25rem, 1fr));
  gap: 1.5rem;
  align-items: stretch;
}
```

Also ensure `.aula-card` has `height: 100%` so it fills its grid cell:
```css
/* AFTER — add height: 100% to .aula-card */
.aula-card {
  display: flex;
  border: 1px solid var(--graystroke);
  border-radius: 0.8rem;
  background: #fff;
  transition: all 0.2s;
  position: relative;
  overflow: hidden;
  height: 100%;         /* ADD THIS LINE */
}
```

---

## Issue 5 — Redundant / Legacy Firestore Fields Causing Empty Sinopse

### Diagnosis
Some movies in Firestore have only `sinopse` → works fine with `<T>{filme.sinopse}</T>`.
Some movies have `sinopse_pt` and `sinopse_en` (legacy multi-language fields) but no `sinopse` → the `filme.sinopse` render shows nothing.

The same pattern may exist for titles: some movies may have `titulo_pt`, `titulo_en`, `tituloOriginal` alongside `titulo`.

The code currently reads `filme.sinopse` and `filme.tituloOriginal`. If these are missing on a document (because the document uses the old schema), the fields will be `undefined`.

### Fix — fallback chains in `FichaFilme.jsx`

The sinopse line (line 129):
```jsx
{/* BEFORE */}
<strong><T>Sinopse</T>:</strong> <T>{filme.sinopse}</T>

{/* AFTER — fallback to sinopse_pt if sinopse is missing */}
<strong><T>Sinopse</T>:</strong> <T>{filme.sinopse || filme.sinopse_pt || ""}</T>
```

The title display (line 106) — already uses `tituloOriginal`. Extend to also fall back to `titulo_en` if `tituloOriginal` is absent:
```jsx
{/* BEFORE */}
<h1>{language !== "pt" && filme.tituloOriginal ? filme.tituloOriginal : filme.titulo}</h1>

{/* AFTER */}
<h1>{language !== "pt" && (filme.tituloOriginal || filme.titulo_en) 
  ? (filme.tituloOriginal || filme.titulo_en) 
  : (filme.titulo || filme.titulo_pt)}</h1>
```

The `Título original` display line (line 117):
```jsx
{/* BEFORE */}
<strong><T>Título original</T>:</strong> {filme.tituloOriginal}

{/* AFTER */}
<strong><T>Título original</T>:</strong> {filme.tituloOriginal || filme.titulo_en || filme.titulo}
```

Apply the same sinopse fallback in `src/sections/Catalogo.jsx` and `src/tools/filmes/CatalogoFilmes.jsx` if `sinopse` is displayed there (check — if not, skip).

---

## Files Summary

| File | Issue(s) |
|---|---|
| `src/services/translationService.js` | Issue 3A: add "Vários Filmes" to overrides |
| `src/sections/Catalogo.jsx` | Issue 1: genre slash sanitizer; Issue 5: sinopse fallback (if applicable) |
| `src/tools/filmes/CatalogoFilmes.jsx` | Issue 1: genre slash sanitizer; Issue 5: sinopse fallback (if applicable) |
| `src/tools/filmes/FichaFilme.jsx` | Issue 1: genre slash sanitizer; Issue 5: title + sinopse fallbacks |
| `src/tools/filmes/FichaFilme.css` | Issue 2: poster-container fixed dimensions + object-fit |
| `src/tools/aulas/AulasLista.jsx` | Issue 3B: re-wrap filmeTitulo in `<T>` |
| `src/sections/Planejamento.jsx` | Issue 3B: re-wrap filmeTitulo in `<T>` |
| `src/tools/aulas/AulasLista.css` | Issue 4: align-items: stretch + height: 100% |

## Do NOT touch
- `formsService.js` — "Vários Filmes" is stored by intent; fix is at display layer
- `PlanejadorAulas.jsx` — same
- `T.jsx`, `useTranslate.js`, `LanguageContext.jsx`
- Any form/admin components
- Any other CSS file
