# UPDATE 1.3: Language Switcher UI Polish

## Objective
The `PT | EN` language toggle buttons in the application are currently too generic and unstyled. They must be polished to match the application's premium aesthetic.

## Execution Steps for @code:

### 1. Style Language Switcher in `NavBar.css` and `Menu.css`
*   Current State: It renders as bare text buttons separated by a pipe (`|`).
*   Action: Create a visually appealing toggle or pill-style grouping for the language buttons. 
*   CSS Requirements:
    *   Remove default button borders and backgrounds.
    *   Add a subtle background to the container (e.g., `background-color: var(--gray100)`).
    *   Make the buttons behave like a segmented control: the `.active` button should have a distinct background (e.g., solid white or primary color) and a subtle box-shadow.
    *   Add transition effects for hover and active states.
*   Ensure these styles are applied identically in the landing page `NavBar` and the Educational Area `Menu/ProfessorNav`.
