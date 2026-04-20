# TELAPSI_PRODUCTION_PLAN

## SYSTEM_STATE
- **Phase**: Post-production / Feature reinstatement and UX polish

> **CRITICAL GUIDELINE:** A detailed execution guideline/specification must be created and approved before @code makes any changes to the codebase. @code can only follow strict instructions to code without needing to think too much.

## EXECUTION_QUEUE

### [1] DISCOVERY & ANALYSIS
- [x] [1.1] Read `SPECS.md` and document application architecture.
- [x] [1.2] Audit application for inconsistencies, bad UX practices, and heavy-load points.
- [x] [1.3] Update `ARCHITECTURE.md` with logic flow, hierarchy, and audit findings.
- [x] [1.4] State our mission steps within this `PLAN.md`.

### [2] AUTHENTICATION & ROUTING REINSTATEMENT
- [x] [2.1] **Create Guideline:** Detail how @code should reinstate `Login.jsx` and handle Firebase admin/user roles.
- [x] [2.2] Re-enable `Login.jsx` flow and link it correctly to `main.jsx` and `NavBar.jsx`.
- [x] [2.3] Implement protected routing (`<ProtectedRoute>`) to enforce Administrator-only access to specific sections.

### [3] CONTENT FORMS REINSTATEMENT
- [x] [3.1] **Create Guideline:** Detail how @code should modularize and reinstate `CadastroFilme.jsx`, `SceneForm.jsx`, and `PlanejadorAulas.jsx`.
- [x] [3.2] Connect forms to correct owner IDs and Administrator validation, removing hardcoded `ownerId: "admin-default"`.
- [x] [3.3] Simplify state management within complex forms.

### [4] INTERNATIONALIZATION (i18n)
- [x] [4.1] **Create Guideline:** Detail how @code should implement `react-i18next` (or similar) across the entire application interface.
- [x] [4.2] Map and extract all hardcoded Portuguese strings.
- [x] [4.3] Generate English translation locale files and integrate toggle functionality.

### [5] MOBILE REFACTOR & RESPONSIVENESS
- [x] [5.1] **Create Guideline:** Provide CSS/Tailwind rules for @code to build fluid and responsive views.
- [x] [5.2] Refactor `Landpage.jsx` sections for mobile readiness.
- [x] [5.3] Refactor `Professor.jsx`, `Menu.jsx`, and `Content.jsx` layouts for mobile & tablet compatibility.

### [6] UX AUDIT SOLUTIONS & FINAL POLISH
- [x] [6.1] **Create Guideline:** Detail how @code should apply error handling, loading states, and UX feedback.
- [x] [6.2] Implement feedback indicators across all async Firebase read/writes.
- [x] [6.3] Conduct final testing and code cleanup of architectural bottlenecks.