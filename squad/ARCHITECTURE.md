# TELAPSI: STRUCTURAL ARCHITECTURE

This document defines the structural foundation of the Telapsi application.

> **CRITICAL GUIDELINE:** A detailed guideline/specification must be created and approved before @code makes any changes to the codebase. @code can only follow strict instructions to code without needing to think too much.

## 1. Architectural Review & Logic Audit Findings
- **Authentication Bypass:** Currently, authentication uses Google Auth (`AuthContext.jsx`), but the `Login.jsx` flow is skipped. Routing directly exposes the `/professor` route.
- **Roles & Permissions:** Forms currently save data with a hardcoded `ownerId: "admin-default"`. The app lacks a mechanism to strictly differentiate between "Administrators" (allowed to create/edit) and "Students" (view-only), matching Firebase records.
- **State Management & Heavy Load Points:** 
  - `PlanejadorAulas.jsx` fetches all movies unconditionally when first loaded. While simple, as the database grows, this could become a heavy-load point. 
  - Iterating over batched writes in `CadastroFilme.jsx` merges state data arrays synchronously before writing. It should maintain simpler, linear data streams.
- **UX Inconsistencies:** Complex forms do not consistently offer visual feedback (e.g., loading spinners, error states, and clear success validations) making the user experience feeling disconnected on slower connections. Also, English views are missing, meaning `react-i18next` (or similar) logic must be injected natively across all components.

## 2. Optimized Component Tree Hierarchy
- `main.jsx` (Router provider)
  - `App` (Root Outlet)
    - `/` -> `Landpage.jsx` (Public presentation)
    - `/login` -> `Login.jsx` (Authentication Gateway)
    - `/professor` -> **Protected Route Wrapper** -> `Professor.jsx` (Main Educational Area)
      - `Menu.jsx` (Sidebar navigation, User info, Logout)
      - `Content.jsx` (Tabs container)
        - `TabAulas` -> `AulasLista`, `PlanejadorAulas` (Admin only)
        - `TabFilmes` -> `CatalogoFilmes`, `CadastroFilme` (Admin only), `SceneForm` (Admin only)

## 3. Interface Hierarchy Diagram
- Users hit the Landpage -> click "Área Didática" -> sent to Login -> sent to Professor view.
- Within Professor view, the user status (Admin vs Student) determines whether "Create" views are rendered inside `TabAulas` and `TabFilmes`.
- The interface separates viewing content (`AulasLista`, `CatalogoFilmes`) from managing content (`PlanejadorAulas`, `CadastroFilme`).

## 4. UI/UX Layout Constraints
- **Responsiveness (Mobile/Tablet Views):** Forms and grids must use Tailwind utility classes or custom CSS Media Queries (e.g., flex-wrap, 100% widths on mobile) to support smaller screens.
- **Component Modularity:** Large input forms must be split further so individual form blocks (like `MidiaSelector` or `SceneForm`) are strictly independent, enforcing code reusability.
- **Styling Standards:** Minimal and elegant layouts keeping the current React and unified CSS approach. No extensive third-party UI framework dependencies unless specified.
