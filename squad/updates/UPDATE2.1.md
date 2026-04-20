# UPDATE 2.1: Button Component Standardization

## Objective
Standardize all buttons across the application to forcefully utilize the `ButtonMain.jsx` component instead of native HTML `<button>` elements, while preserving their unique styles via CSS classes.

## Execution Steps for @code:

### 1. Audit and Replace Native Buttons
*   **Target Files**: `Menu.jsx`, `NavBar.jsx`, `CatalogoFilmes.jsx`, `AulasLista.jsx`, `Login.jsx`, `FichaFilme.jsx`, `FichaAula.jsx`, `PlanejadorAulas.jsx`, `CadastroFilme.jsx`, and `SceneForm.jsx`.
*   **Action**: Replace any generic `<button>` elements with the `<ButtonMain>` component.
*   **Constraints**: 
    *   If a button is purely an icon toggle (like the hamburger menu), verify if `ButtonMain` is suitable.
    *   Maintain the existing `onClick`, `id`, and `className` props. `ButtonMain` might need to be adjusted to accept `onClick`, `className`, `type`, and `disabled` props if it doesn't already.

### 2. Update ButtonMain Component
*   **Action**: Ensure `ButtonMain.jsx` accepts forwarding of standard button props (`onClick`, `disabled`, `className`, `type`, children rendering instead of just text config if necessary).
*   **Constraint**: Do not break any existing `ButtonMain` implementations (like the one in `Hero.jsx` which uses a `path` prop).
