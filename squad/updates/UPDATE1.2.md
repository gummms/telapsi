# UPDATE 1.2: Educational Area Layout Refactor

## Objective
Convert the Educational Area configuration from a left-sided vertical column (Sidebar) to a horizontal top Navbar, while making sure the logout behavior is consistent.

## Execution Steps for @code:

### 1. Refactor `Menu.jsx` into a Top Navbar
*   Current State: `Menu.jsx` and `Menu.css` act as a left sidebar.
*   Action: Refactor `Menu.css` to position the nav element as a sticky top navbar (similar to the landing page `NavBar.jsx`), spanning 100% width, with horizontal links.
*   Mobile: It must still convert to a hamburger or slide-in menu on mobile devices below 768px.

### 2. Update the "WEBSITE" Button to "Logout"
*   Current State: The button in `Menu.jsx` says `t("menu.website_button")` ("WEBSITE") but actually triggers `handleLogout`, logging the user out and redirecting to `/`.
*   Action: Change the label and functionality to clearly indicate "Logout" / "Sair". 
*   Add a new i18n key in `pt.json` and `en.json` (e.g., `"menu": { "logout": "Sair" }` and `"logout": "Logout"`).
*   Use this new key in the `Menu.jsx` logout button.

### 3. Ensure `Professor.jsx` Layout Accommodates Top Nav
*   Action: Update `Professor.css` to remove any CSS grid instructions that force a 2-column sidebar layout (e.g. `grid-template-columns: 250px 1fr`).
*   The `Professor` component should behave like a normal vertical flow page: Top Navbar, Content in the middle, Footer at the bottom.
