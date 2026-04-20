# UPDATE 2.3: Form Redesign & WCAG 2.1 Spacing Audit

## Objective
Update the styling of the application forms (`SceneForm`, `CadastroFilme`, `PlanejadorAulas`) to align with the premium aesthetic of the application. Perform a global spacing check following WCAG 2.1 principles to ensure readability.

## Execution Steps for @code:

### 1. Update Global Input Styles
*   **Action**: Ensure that forms use modern styling: larger input padding, softer borders (e.g., `border: 1px solid var(--graystroke)`), smooth focus states (like a subtle outline with `var(--purple2)`), and standardized border-radius.
*   **Action**: Apply a consistent layout structure for form groups, specifically giving labels and inputs enough breathing space.

### 2. Form Spacing & Rhythm Audit
*   **Target Files**: `Forms.css` or form-specific CSS files.
*   **Action**: Ensure WCAG 2.1 standards are met regarding element spacing. There must be a *minimum* of `0.5rem` (8px) breathing space between distinct UI elements (buttons, inputs, labels, list items). In layouts where space allows, prefer `1rem` or more to create visual hierarchy.

### 3. Redesign Specific Outdated Forms
*   **Target**: `SceneForm.jsx`, `CadastroFilme.jsx`, and `PlanejadorAulas.jsx`.
*   **Action**: Clean up messy layouts, stack columns logically for mobile and desktop, and modernize the "add" or "remove" button groupings within these forms to feel polished rather than cluttered.
*   **Action**: Ensure mobile responsivity.
