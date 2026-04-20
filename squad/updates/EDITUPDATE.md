# Admin Edit and Delete Functionalities

## Objective
Add "Edit" and "Delete" capabilities for the Movies ("Guias Didáticos") and Lessons ("Planos de Aula") list items. These features must only be visible and accessible to Admin users.

## Instructions for @code

### 1. View Permissions
*   Inside `AulasLista.jsx` and `CatalogoFilmes.jsx`, import and access the `currentUser` from the `useAuth()` hook.
*   Only proceed to render the following Edit/Delete UI triggers if `currentUser && currentUser.role === 'admin'` (verify exact admin role property name used in the codebase, such as `.isAdmin` or `.role === 'admin'`).

### 2. UI Modification: The 3-Dots Menu
*   For each rendered item (`.filme-card` in `CatalogoFilmes.jsx` and `.aula-card` in `AulasLista.jsx`), add a 3-dots menu icon at the top-right corner.
*   Use `<i><Icones icone="fa-ellipsis-v" /></i>` for the icon.
*   Add `position: relative;` to the cards if not present, and `position: absolute; top: 1rem; right: 1rem;` for the menu button.
*   Clicking the 3-dots icon should open a small context menu or dropdown with two options:
    1.  **Edit** (Editar)
    2.  **Delete** (Excluir)

### 3. Implementation: Edit
*   **Triggering:** When "Edit" is clicked, switch the view or navigate to the respective form (`CadastroFilme.jsx` for movies, `PlanejadorAulas.jsx` for lessons).
*   **Data Population:** Pass the selected item's data (or ID) to the form. Ensure the form's `useEffect` or state initialization loads this data so all inputs are pre-filled with the current information.
*   **UI Context:** Add a prop (e.g., `isEditing` or checking if `id` exists) to the form components. When editing, change the main submit button text from "Add/Salvar" to "EDITAR" (PT) and "EDIT" (EN), using the correct translation keys where possible.
*   **Firebase Update:** Modify the `salvarAula` and `salvarFilme` logic in `services/formsService.js` (or inline) to perform an `updateDoc` (or `setDoc` with `{ merge: true }`) targeting the existing document ID, replacing the old info instead of duplicating it.

### 4. Implementation: Delete
*   **Triggering:** When "Delete" is clicked, prevent immediate deletion. You must present a clear confirmation popup/modal.
*   **Confirmation Modal (Movies):**
    *   Message: *"Você realmente quer excluír o guia didático de [MOVIE_TITLE]? Esta ação é permanente."*
    *   Actions: **VOLTAR** (Secondary style) and **EXCLUIR** (Highlighted/Primary button in Red).
*   **Confirmation Modal (Lessons):**
    *   Message: *"Você realmente quer excluír o plano de aula [LESSON_TITLE]? This action can't be changed later."*
    *   Actions: **CANCEL** (Secondary style) and **DELETE** (Highlighted/Primary button in Red).
*   **Firebase Delete:** If the user confirms the action, use `deleteDoc(doc(db, "collection", id))` to permanently delete the content from Firebase.
*   **Feedback & Refresh:** Ensure a toast notification is fired on success/error, and the local list state is updated to remove the deleted item from the screen without a hard reload.
