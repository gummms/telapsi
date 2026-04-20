# UX Audit & Final Polish Guidelines

This document provides instructions for `@code` to execute steps 6.2 and 6.3 of `PLAN.md` for the Telapsi platform. 

The goal of this phase is to ensure the application provides robust feedback to the user during asynchronous actions, handles errors gracefully without relying on native browser alerts, and that the codebase is clean and optimized.

## 1. Implement Feedback Indicators (Step 6.2)

Async Firebase read/writes currently lack polished UX feedback.

### 1.1 Loading States
*   **Actionable**: Replace plain text "Carregando..." / "Loading..." with a polished CSS spinner or Skeleton loaders. 
*   **Where**: 
    *   `src/sections/Catalogo.jsx`
    *   `src/sections/Planejamento.jsx`
    *   `src/tools/aulas/AulasLista.jsx`
    *   `src/tools/filmes/CatalogoFilmes.jsx`
*   **Button States**: Ensure all form submission buttons explicitly enter a disabled state while waiting for Firebase. Use the translated strings like "Saving..." / "Salvando..." but add a visual spinner inside the button if possible.

### 1.2 Error & Success Handling (Remove Native Alerts)
*   **Actionable**: The app currently uses `window.alert()` in `PlanejadorAulas.jsx` and `CadastroFilme.jsx`. This provides a poor user experience.
*   **Implementation**: Create a reusable `Toast` or `Alert` component (or use a lightweight library if authorized, or build a simple CSS-based absolute positioned notification) to handle success and error messages contextually.
*   **Integration**: Replace all `alert(...)` calls in the `handleSalvar` and `handleSalvarFilmeCompleto` functions with this new polished notification system. Ensure the text passed uses `useTranslation` (`t(...)`).

## 2. Final Testing & Code Cleanup (Step 6.3)

*   **Actionable**: Audit the components for architectural bottlenecks and dead code.
*   **Console Logs**: Remove any stray `console.log()` statements left over from debugging (especially around Firebase data fetching). Keep `console.error()` for catch blocks.
*   **Unused Imports**: Ensure there are no unused imports causing linter warnings.
*   **Memoization Assessment**: We added `memo` to avoid re-renders in `PlanejadorAulas` subcomponents. Confirm that no other heavily re-rendered forms or complex lists suffer from performance issues. `useCallback` and `useMemo` should be used where object references are passed as props.

## Final Review Criteria
Before considering Phase 6 complete, verify:
1. Triggering a form save displays an in-app visual notification (Success/Error), not a browser alert.
2. Navigating to the catalog or lesson lists shows a visual loader, not plain text.
3. Code is clean of unnecessary debug logs.
