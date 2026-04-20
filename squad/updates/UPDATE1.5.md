# UPDATE 1.5: Guide - Configuring Admin Privileges in Firebase

## Objective
The application uses Firebase Authentication and Firestore to manage users and roles. Since we do not rely on standard Email/Password authentication for security (using Google Auth instead), we handle the "Admin" authorization role directly inside the Firestore Database. 

Here is the operational guide on how to elevate a user to Admin:

### 1. How the Architecture Works
1. When a user logs in via Google Auth for the very first time, a new document is automatically created in the Firestore collection named `usuarios`. 
2. The Document ID is the user's Firebase UID.
3. By default, the `AuthContext.jsx` file creates this document with the property `role: "user"`.
4. Our React application reads this document during login. If `role === "admin"`, it unlocks the application's edit features and displays the `(+)` buttons.

### 2. Steps to Elevate a User to Admin
1. Open your **Firebase Console** (firebase.google.com).
2. Navigate to your project, then click on **Firestore Database** in the left menu.
3. In the database, find the collection named `usuarios`.
4. You will see a list of documents (these are the user UIDs). Click on the document corresponding to the account you want to become an admin (you can verify it by checking the `email` field inside it).
5. Edit the `role` field:
   * **Change** the value from `"user"` to `"admin"`.
   * Save the document.
6. Have the user access the application and refresh or log out and log back in. They will now see the system as an Administrator.

*(Note: @code does not need to execute anything for this update. This is an operational procedure for the system administrator).*
