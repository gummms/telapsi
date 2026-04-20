# UPDATE 1.1: Role-Based Buttons & Routing Polish

## Objective
Ensure the educational area (Teacher Dashboard) is strictly read-only for common users and provides creation actions only for Admins.

## Execution Steps for @code:

### 1. Update `AulasLista.jsx`
*   Current State: The component receives an `onCreateNew` prop but never renders a button to trigger it.
*   Action: In `src/tools/aulas/AulasLista.jsx`, inside the `.tool-header` or next to the `h1` Title, conditionally render a button that says "Adicionar Plano" (or equivalent i18n key) with a `(+)` icon, ONLY IF `onCreateNew` is truthy.
*   Example: `{onCreateNew && (<button onClick={onCreateNew} className="btn"><i><Icones icone="fa-plus"/></i> Novo</button>)}`

### 2. Update `CatalogoFilmes.jsx`
*   Current State: The component receives an `onAddNew` prop but never renders a button to trigger it.
*   Action: In `src/tools/filmes/CatalogoFilmes.jsx`, inside the `.tool-header` or next to the `h1` Title, conditionally render a button that says "Adicionar Filme" (or equivalent i18n key) with a `(+)` icon, ONLY IF `onAddNew` is truthy.

### 3. Verify Form Access
*   Ensure that normal users (non-admins) cannot see the (+) buttons and are therefore locked in a read-only state. `TabAulas.jsx` and `TabFilmes.jsx` already handle passing `null` to these props if not admin. You only need to implement the visual buttons in the lists.
