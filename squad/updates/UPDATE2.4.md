# UPDATE 2.4: Language Switcher Polish

## Objective
The language switcher (`PT | EN`) currently requires the user to click *exactly* on the text abbreviation. The click area needs to be expanded, and a neat animation added for interaction feedback.

## Execution Steps for @code:

### 1. Expand Click Area
*   **Target Files**: `NavBar.css` and `Menu.css` (specifically the `.lang-switcher` and `.lang-switcher-menu` button styling).
*   **Action**: Ensure the padding inside the button elements applies to the clickable area. If necessary, convert them to `display: inline-flex` or `display: block` so the entire pill area is clickable, not just the text label.

### 2. Add Interaction Animations
*   **Action**: Create a subtle scale or color transition effect when clicking or hovering over the language options.
*   **Constraint**: The animation must feel highly responsive but not exaggerated (e.g., a quick `transform: scale(0.95)` on `:active`).
