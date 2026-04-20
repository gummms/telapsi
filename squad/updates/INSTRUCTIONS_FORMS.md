# GUIDELINES: CONTENT FORMS REINSTATEMENT

**Task for @code:**
You are to execute phases [3.2] and [3.3] of `PLAN.md`.
Please strictly follow the instructions below to reinstate the forms, attach logic securely to the current user, and modularize the codebase.

## 1. Owner IDs and Administrator Validation (Step 3.2 objective)
Currently, forms save data with a hardcoded `ownerId`. This must be updated to use the actual logged-in administrator's ID.

**File:** `src/tools/filmes/CadastroFilme.jsx`
- Import the `useAuth` hook from `../../context/useAuth`.
- Destructure `currentUser` from `useAuth()`.
- Inside the `handleSalvarFilmeCompleto` function, replace `ownerId: "admin-default"` with `ownerId: currentUser.uid`.

**File:** `src/tools/aulas/PlanejadorAulas.jsx`
- Import the `useAuth` hook.
- Destructure `currentUser` from `useAuth()`.
- Inside the `handleSalvar` function, replace `ownerId: "admin-default"` with `ownerId: currentUser.uid`.

## 2. Simplify State Management & Modularize (Step 3.3 objective)
The application audit identified that monolithic forms and synchronous data merges are points of technical debt.

**File:** `src/tools/aulas/PlanejadorAulas.jsx`
- This file is too large as it contains multiple inline sub-components (`ObjetivosForm`, `InfoGeraisForm`, `MidiaSelector`, `MetodologiaForm`, `AtividadesExtrasForm`).
- **Action:** Extract these sub-components into their own separate files within a new folder: `src/tools/aulas/components/`.
- Import them back into `PlanejadorAulas.jsx` to keep the main component focused solely on assembling the form and handling the global state.
- Ensure that the initial `useEffect` that fetches movies sets a loading state so the user isn't looking at an empty interface before data arrives.

**File:** `src/tools/filmes/CadastroFilme.jsx` & `src/tools/filmes/SceneForm.jsx`
- Ensure that the batch write logic in `handleSalvarFilmeCompleto` is robust. Wrap it in proper try/catch blocks with clear `alert()` or toast feedbacks for both success and failure.
- Ensure that the `loading` state correctly disables the submit button to prevent double-submissions.
- Consider extracting the Firebase submission logic (`addDoc`, `writeBatch`) into a separate service function (e.g., inside `src/services/` or a helper file) to separate UI from database transactions.

**Note:** Always preserve the existing UI aesthetic (CSS classes, HTML structure). The goal here is logic optimization and security, not redesign.
