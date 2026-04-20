# GUIDELINES: AUTHENTICATION & ROUTING REINSTATEMENT

**Task for @code:**
You are to execute phases [2.2] and [2.3] of `PLAN.md`.
Please strictly follow the instructions below without deviating from the application's minimalist architecture constraints. Do not attempt to refactor components outside of this scope.

## 1. Implement Role-Based Logic in Context
**File:** `src/context/AuthContext.jsx`
- Modify the existing Google Sign-In logic to determine if a user is an administrator.
- Since admins are specified manually in Firebase console, assume the `usuarios` document in Firestore will eventually have a `role: "admin"` property.
- When fetching `userSnap`, inject the `isAdmin` boolean directly into the `currentUser` object (e.g. `currentUser = { ...user, isAdmin: userData.role === 'admin' }`).
- Ensure the `currentUser` exposed by `AuthContext` contains this boolean.

## 2. Re-enable Login
**File:** `src/routes/Login.jsx`
- The `Login.jsx` UI is already built, but ensure `navigate("/professor")` triggers only once `currentUser` is fully resolved and populated in the context.

## 3. Update Router & Protected Routes (Step 2.3 objective)
**File:** `src/routes/ProtectedRoute.jsx` (New file)
- Create a strict `ProtectedRoute` wrapper component. 
- It should use `useAuth()`. If `loading` is true, return a simple loading indicator or spinner.
- If `!currentUser`, navigate to `/login`.
- If a user is present, render `children`.

**File:** `src/main.jsx`
- Add `/login` as a route pointing to `Login.jsx`.
- Wrap the `/professor` route element with `<ProtectedRoute>`.

**File:** `src/sections/NavBar.jsx`
- Update the "ÁREA DIDÁTICA" button. It should navigate to `/professor`. (The `ProtectedRoute` will handle bouncing unauthenticated users to `/login` automatically.)

## 4. Enforce Administrator-Only Sections (Step 2.3 objective)
**File:** `src/tools/tabs/TabAulas.jsx`
- Wrap the creation logic (`PlanejadorAulas.jsx` access) so that only users with `currentUser.isAdmin === true` can trigger or view it. Regular standard users should only be able to view `AulasLista`.

**File:** `src/tools/tabs/TabFilmes.jsx`
- The TabFilmes should only display `CatalogoFilmes`. If there is a component to add films (`CadastroFilme`), it must be strictly gated behind `currentUser.isAdmin === true`.

**Note:** Ensure all code additions use existing CSS files. Do not add arbitrary inline styles unless absolutely necessary.
