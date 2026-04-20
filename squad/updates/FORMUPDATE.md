# Lessons Form Layout Standardization

## Objective
The "Lessons" form (`PlanejadorAulas.jsx`) is currently using an outdated, hardcoded layout structure that deviates from the premium design system established in the "Movies" form (`CadastroFilme.jsx`). This update standardizes the layout, spacing, and styling of the Lessons tool to match the rest of the application.

## 1. Global Layout Fixes (PlanejadorAulas.css)
**Action:** Remove hardcoded layout rules and colors that conflict with `Content.css`.
*   Remove custom `section-block`, `form-row`, and `form-group` definitions.
*   Remove hardcoded роxo Telapsi (`#483d8b`) and use `var(--purple1)` or `var(--purple2)`.
*   Ensure the container uses `var(--padding-body)` for alignment.

## 2. Standardize Component Structure
All form sections in `PlanejadorAulas.jsx` and its sub-components (`src/tools/aulas/components/`) must be updated to use the following classes:

### Main Wrapper Classes:
*   `className="section-block"` → `className="form-section"`
*   `className="form-row"` (Ensure it matches the flex behavior in `Content.css`)
*   `className="form-group"` (Use with `flex-grow` or `w-small` as needed)

### Input & Select IDs:
Ensure elements use the correct IDs for global styling hooks:
*   `input` → `id="text-input"` or `id="number-input"`
*   `select` → `id="select-input"`
*   `label` → `id="label-input"`
*   `textarea` → `id="text-area-input"`

## 3. Specific Component Updates

### InfoGeraisForm.jsx
*   Change `.section-block` to `.form-section`.
*   Update the "Audience" and "Duration" selects to use `id="select-input"`.
*   Use `flex-grow` on the title row and `w-small` (or wrap in a `flex-grow` pair) for the meta row.

### MidiaSelector.jsx
*   Refactor `cenas-resumo` and `cenas-selection-box` to use the application's clean design system (e.g., matching the scene list style in `CadastroFilme.jsx`).
*   Remove all inline styles (`style={{...}}`).
*   Ensure the movie selector `select` uses `id="select-input"`.

### MetodologiaForm.jsx & AtividadesExtrasForm.jsx
*   Standardize headings and row spacing.
*   Ensure all `textarea` elements use `id="text-area-input"`.

## 4. Button Standardization
*   Ensure the "Cancel" and "Save" buttons in the footer use `ButtonMain` with consistent styling.
*   The "Back" button in the header should use `ButtonMain` and include the standard `<i><Icones icone="fa-chevron-left" /></i>`.
