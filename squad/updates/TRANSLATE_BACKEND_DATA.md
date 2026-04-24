# Update: Translate All Backend (Firestore) Data Dynamically

## Problem Statement

The current `<T>` component only translates **hardcoded Portuguese strings** written directly inside JSX. All data fetched from Firestore — movie titles, synopses, scene descriptions, clinical correlations, debate questions, lesson plan objectives, methodology steps, etc. — is rendered as raw `{variable}` expressions and **never passes through the translation pipeline**.

This means when the user switches to English, only the UI chrome (headings, labels, button text) translates, but the **actual educational content stays in Portuguese**. This defeats the entire purpose of the translation feature.

## Root Cause

The `<T>` component works like this:
```jsx
<T>Hardcoded Portuguese text</T>  // ✅ Gets translated
{filme.sinopse}                    // ❌ Never touches the translation API
```

Backend data is always inserted via JSX expressions `{variable}`, which bypass `<T>` entirely.

## Solution: Wrap ALL dynamic backend data in `<T>`

The `<T>` component and `useTranslate` hook already handle arbitrary strings — they're not limited to hardcoded text. The fix is purely mechanical: wrap every Firestore-sourced text expression with `<T>`.

**Before:**
```jsx
<h1>{filme.titulo}</h1>
<p>{cena.descricao}</p>
```

**After:**
```jsx
<h1><T>{filme.titulo}</T></h1>
<p><T>{cena.descricao}</T></p>
```

The existing batching + caching in `translationService.js` will handle the API cost automatically. No new architecture needed.

### Important: What NOT to wrap
- **Numbers** (year, duration, scene count) — these don't need translation
- **URLs** (cover images, links) — these are not text
- **Timestamps / minutagem** (e.g., `01:23:45`) — time codes are universal
- **Proper nouns used as identifiers** — movie titles in the original language field (`tituloOriginal`) should stay as-is since they ARE the original-language title by definition

### What TO wrap (all text content from Firestore)
- Movie titles (`titulo`), genre (`genero1`, `genero2`), country (`pais`), director (`direcao`), cast (`elenco`), synopsis (`sinopse`)
- Scene titles, descriptions, teaching tips (`dicaAula`), clinical correlations (`correlacaoClinica`), debate questions (`questoesDebate[]`), comparison points (`pontosComparacao.*`), related themes (`temasRelacionados[]`), keywords (`palavrasChave[]`)
- Lesson plan titles, audience (`publico`), objectives (`objetivos[]`), methodology step titles and topics, dynamics (`dinamica`), guide questions (`perguntasGuia[]`), technical summary points (`resumoTecnico[]`)
- Linked movie title on lesson cards (`filmeTitulo`)

---

## Files to Modify & Exact Changes

### 1. `src/sections/Catalogo.jsx`

Wrap the movie card data rendered inside the `.map()`:

| Line Pattern | Current | Change To |
|---|---|---|
| Movie title | `{filme.titulo}` | `<T>{filme.titulo}</T>` |
| Genre + country | `{filme.genero1}`, `{filme.genero2}`, `{filme.pais}` | Wrap each in `<T>` |
| Keywords | `{tag}` (inside palavrasChave map) | `<T>{tag}</T>` |

### 2. `src/sections/Planejamento.jsx`

Wrap lesson card data:

| Field | Current | Change To |
|---|---|---|
| `aula.publico` | `{aula.publico}` | `<T>{aula.publico}</T>` |
| `aula.titulo` | `{aula.titulo}` | `<T>{aula.titulo}</T>` |
| `aula.filmeTitulo` | `{aula.filmeTitulo}` | `<T>{aula.filmeTitulo}</T>` |

### 3. `src/tools/filmes/FichaFilme.jsx` (MOST CRITICAL — the movie detail sheet)

This is the richest content view. Wrap ALL text fields:

**Movie header section:**
- `{filme.titulo}` → `<T>{filme.titulo}</T>`
- `{filme.genero1}`, `{filme.genero2}`, `{filme.pais}` → wrap each in `<T>`
- `{filme.direcao}` → `<T>{filme.direcao}</T>`
- `{filme.elenco}` (both array-joined and string form) → wrap the final rendered text in `<T>`
- `{filme.sinopse}` → `<T>{filme.sinopse}</T>`

**Scene carousel (inside `cenas.map()`):**
- `{cena.titulo}` → `<T>{cena.titulo}</T>`
- `{cena.descricao}` → `<T>{cena.descricao}</T>`
- `{cena.dicaAula}` → `<T>{cena.dicaAula}</T>`
- `{tema}` (inside temasRelacionados map) → `<T>{tema}</T>`
- `{kw}` (inside palavrasChave map) → `<T>{kw}</T>`
- `{cena.correlacaoClinica}` → `<T>{cena.correlacaoClinica}</T>`
- `{q}` (inside questoesDebate map) → `<T>{q}</T>`
- `{cena.pontosComparacao.noFilme}` → `<T>{cena.pontosComparacao.noFilme}</T>`
- `{cena.pontosComparacao.naClinica}` → `<T>{cena.pontosComparacao.naClinica}</T>`
- `{cena.pontosComparacao.aspectoConceitual}` → `<T>{cena.pontosComparacao.aspectoConceitual}</T>`
- `{cena.pontosComparacao.observacaoNarrativa}` → `<T>{cena.pontosComparacao.observacaoNarrativa}</T>`

### 4. `src/tools/filmes/CatalogoFilmes.jsx` (teacher's catalog view)

Same movie card pattern as Catalogo.jsx:
- `{filme.titulo}` → `<T>{filme.titulo}</T>`
- `{filme.genero1}`, `{filme.genero2}`, `{filme.pais}` → wrap each
- `{tag}` inside palavrasChave map → `<T>{tag}</T>`

### 5. `src/tools/aulas/AulasLista.jsx` (teacher's lesson list)

- `{aula.titulo}` → `<T>{aula.titulo}</T>` (appears in card title AND group title)
- `{aula.publico}` → `<T>{aula.publico}</T>`
- `{aula.filmeTitulo}` → `<T>{aula.filmeTitulo}</T>`
- Group title `{titulo}` (from aulasAgrupadas) → `<T>{titulo}</T>`
- `{publico}` (section header in group card) → `<T>{publico}</T>`

### 6. `src/tools/aulas/FichaAula.jsx` (lesson plan detail sheet)

**Header:**
- `{aula.titulo}` → `<T>{aula.titulo}</T>`
- `{aula.publico}` → `<T>{aula.publico}</T>`
- `{filmeDetalhes.titulo}` → `<T>{filmeDetalhes.titulo}</T>`

**Body — objectives:**
- Inside `renderList()`: the function renders items from `aula.objetivos` array — each `{item}` string must be wrapped in `<T>`.
- **Fix `renderList()`** helper to wrap each item: change `{item}` → `<T>{item}</T>` for both `<li>` and `<p>` renders.
- **Fix `renderTextWithLines()`** helper to wrap each line: change `{str}` → `<T>{str}</T>`.

**Body — methodology steps:**
- `{etapa.titulo}` → `<T>{etapa.titulo}</T>`
- `{t}` inside topicosValidos map → `<T>{t}</T>` (rename loop variable to avoid confusion)

**Body — scenes list:**
- `{cena.nomeFilme}` → `<T>{cena.nomeFilme}</T>`
- `{cena.titulo}` → `<T>{cena.titulo}</T>`
- `{cena.descricao}` → `<T>{cena.descricao}</T>`

**Sidebar cards:**
- Dynamics content goes through `renderTextWithLines()` — already covered by fixing that helper.
- Guide questions go through `renderList()` — already covered.
- Technical summary goes through `renderList()` — already covered.

### 7. `src/components/T.jsx` — Small Enhancement Needed

Currently `T` only handles string children. When we do `<T>{filme.sinopse}</T>`, if `filme.sinopse` is `undefined` or `null`, it would call `String(null)` → `"null"`. Add a guard:

```jsx
const T = ({ children }) => {
  // Guard against null/undefined from backend data
  if (children == null || children === "") return null;
  const text = typeof children === "string" ? children : String(children);
  const translated = useTranslate(text);
  return translated;
};
```

**Note:** Hooks can't be called conditionally. The guard must return AFTER the hook call, or the hook must handle it internally. The `useTranslate` hook already handles empty/null text by returning it as-is, so this is already safe. Just ensure the `T` component returns `null` instead of the string `"null"` or `"undefined"`.

### 8. No Changes Needed

These files do NOT render backend data and need no changes:
- `NavBar.jsx`, `Menu.jsx`, `Hero.jsx`, `Sobre.jsx`, `FAQ.jsx`, `FAQList.jsx`, `Footer.jsx`, `Login.jsx`, `TabsHeader.jsx`
- `CadastroFilme.jsx`, `SceneForm.jsx`, `PlanejadorAulas.jsx` — these are *input forms*, not display views. Users type in Portuguese; the API translates when the content is *viewed*.

---

## Constraints Reminder
1. **NO content modification** — the original Portuguese data in Firestore is untouched.
2. **NO database migration scripts** — the API translates on-the-fly.
3. **NO new components or services** — reuse the existing `<T>`, `useTranslate`, and `translationService`.
4. **Preserve all existing UI/UX** — only add `<T>` wrappers around data expressions.

## API Cost Consideration

The batching + caching system already mitigates this. When a user opens FichaFilme with 10 scenes, all the text from all scenes gets batched into a handful of API calls (instead of 50+ individual ones). Once cached, switching back and forth between PT/EN costs zero API calls for previously seen content.
