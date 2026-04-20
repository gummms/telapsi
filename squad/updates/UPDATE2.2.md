# UPDATE 2.2: Print Functionality for Teaching Guides

## Objective
Add a "Print / PDF" button to the movie cards (Guias Didáticos / Teaching Guides) and adapt the CSS print rules so that exporting the FichaFilme to PDF results in a clean, readable document similar to how it works for Lesson Plans (`FichaAula`).

## Execution Steps for @code:

### 1. Add Print Button to `FichaFilme.jsx`
*   **Action**: Insert a print button in the header of `FichaFilme.jsx` (next to the close button). Use the `ButtonMain` component (following the standard of UPDATE 2.1) and add an icon (like `fa-print`).
*   **Action**: The `onClick` handler should call `window.print()`.
*   **i18n**: Add a translation key for this button in `pt.json` and `en.json` under `movie_card.print` or similar.

### 2. Implement `@media print` in `FichaFilme.css`
*   **Action**: Add custom `@media print` rules at the bottom of `FichaFilme.css`.
*   **Constraints for PDF layout**: 
    *   Hide all non-essential UI elements like the close button, print button, nav arrows, and background overlays (`.ficha-overlay` background should be white/transparent).
    *   Ensure the content blocks stack vertically and naturally. Avoid forced heights (`height: 90vh`) during print so all content is rendered across multiple pages.
    *   Set text colors to pure black (`#000`) for readability and ink-saving. 
    *   Use `page-break-inside: avoid` on `.detail-box` or `.cena-slide` components so they don't break awkwardly across pages.
