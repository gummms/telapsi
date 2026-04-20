# Mobile Refactor and Responsiveness Guidelines

This document provides instructions for `@code` to execute steps 5.2 and 5.3 of `PLAN.md` for the Telapsi platform. 

We require a premium, responsive design that looks stunning and functions flawlessly on smaller screens. 

## 1. General CSS Rules for Fluid & Responsive Views
We are heavily utilizing Vanilla CSS to achieve maximum flexibility and bespoke styling. Adhere to the following rules:

*   **Standard Breakpoint**: Prioritize a mobile-first or desktop-first approach utilizing `@media (max-width: 768px)` for mobile devices and `@media (max-width: 1024px)` for tablets where necessary.
*   **Fluid Typography and Spacing**: Ensure padding, margins, and typography scale appropriately.
*   **Flexbox and Grid Refactoring**: The application relies heavily on horizontal flex layouts. On mobile, these need to switch to vertical stacking (`flex-direction: column`). Use gap property to manage spacing cleanly.
*   **Touch Targets**: Ensure all interactive elements (buttons, links, inputs) have a minimum touch target size (44x44px equivalent) to ensure accessibility on mobile.

## 2. Refactoring Landpage Sections for Mobile (Step 5.2)

Update the CSS (and modify JSX structure if absolutely necessary) for the main public views:

*   **`NavBar.jsx` & `NavBar.css`**: 
    *   **Crucial Update**: The horizontal menu `<ul>` needs to be hidden on mobile behind a hamburger menu toggle. Create state in `NavBar.jsx` to handle the open/close state, and present the menu items (including the language switcher) in a vertical dropdown or an off-canvas overlay.
*   **`Hero.jsx` & `Hero.css`**: 
    *   Stack the text block and the hero image vertically. 
    *   Ensure the title does not overflow visually on small screens.
*   **`Sobre.jsx` & `Sobre.css`**: 
    *   Stack the main text container and the "ethical guidelines" container vertically.
*   **`Catalogo.jsx`, `Planejamento.jsx` & their CSS**: 
    *   The `.cards-grid-horizontal` display grid needs to adjust to a single column (`grid-template-columns: 1fr`) on mobile devices.
*   **`Footer.jsx` & `Footer.css`**:
    *   Stack text sections and center layout text to optimize reading on narrow screens.

## 3. Refactoring Professor Dashboard & Layouts (Step 5.3)

The internal area features complex layouts and data entry forms.

*   **`Professor Layout` (`Professor.jsx`, `Content.css`)**: 
    *   The typical split-pane layout (Sidebar + Main Content) breaks on mobile.
*   **`Menu.jsx` & `Menu.css`**:
    *   The sidebar menu should become an off-canvas drawer OR a bottom navigation bar on mobile to preserve vertical space for content. Add a hamburger menu in a mobile-only top header within the Professor layout if choosing the drawer route.
*   **Forms (`PlanejadorAulas.jsx`, `CadastroFilme.jsx` and components)**:
    *   Ensure all `.form-row` wrappers use `flex-direction: column` on mobile so inputs stack instead of shrinking horizontally.
    *   Select dropdowns and text areas must expand to `width: 100%`.
    *   Ensure padding inside the form containers is reduced for mobile.
    *   Make sure form submission action buttons (`.form-footer-actions`, `.footer-actions`) are stacked or span full width making them accessible for thumbs.
*   **`CatalogoFilmes.jsx` & `AulasLista.jsx`**:
    *   Switch horizontal grids to `1fr` columns so cards take up full width.

## Final Review Criteria for @code
Before considering this complete, verify:
1. No horizontal scrolling occurs on a 375px wide viewport.
2. The language toggler remains accessible in both Desktop and Mobile navigation views.
3. Forms can be filled out completely on mobile without zooming out or struggling with small inputs.
