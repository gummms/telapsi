# UPDATE 1.4: Fix Modal Overlay Z-Index

## Objective
When a movie card is opened on the landing page, the website's top Navbar sits above the modal component, breaking the visual immersion. The modal should cover the entire screen, including the Navbar.

## Execution Steps for @code:

### 1. Adjust `z-index` in `FichaFilme.css`
*   Current State: The `.ficha-overlay` element likely has a `z-index` lower than the `.navbar` in `NavBar.css`.
*   Action: Open `src/tools/filmes/FichaFilme.css` and locate `.ficha-overlay`.
*   Update the `z-index` property to a value extremely high (e.g., `z-index: 9999;`) to ensure it always renders on top of the `.navbar` context.
*   Also verify that `.ficha-container` naturally follows the overlay stacking context.
