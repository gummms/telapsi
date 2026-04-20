import { useEffect, useState, useCallback } from "react";
import {
  onAuthStateChanged,
  signInWithPopup,
  signOut as firebaseSignOut,
} from "firebase/auth";
import { auth, googleProvider, db } from "../services/firebaseConfig.jsx";
import { doc, setDoc, serverTimestamp, getDoc } from "firebase/firestore";
import { AuthContext } from "./useAuth.js";

export default function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Fetch role from Firestore to determine admin status
        const userRef = doc(db, "usuarios", user.uid);
        const userSnap = await getDoc(userRef);
        const userData = userSnap.exists() ? userSnap.data() : {};
        const isAdmin = userData.role === "admin";
        setCurrentUser({ ...user, isAdmin });
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const signInWithGoogle = useCallback(async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      const userRef = doc(db, "usuarios", user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        await setDoc(userRef, {
          nome: user.displayName,
          email: user.email,
          dataCriacao: serverTimestamp(),
          ownerId: user.uid,
          role: "user",
        });
      }

      // Re-read the document to get the role (including newly created docs)
      const freshSnap = await getDoc(userRef);
      const userData = freshSnap.exists() ? freshSnap.data() : {};
      const isAdmin = userData.role === "admin";

      setCurrentUser({ ...user, isAdmin });
      setLoading(false);
    } catch (error) {
      console.error("Erro ao fazer login com Google:", error);
      setLoading(false);
    }
  }, []);

  const signOut = useCallback(async () => {
    setLoading(true);
    try {
      await firebaseSignOut(auth);
      setCurrentUser(null);
      setLoading(false);
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
      setLoading(false);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{ currentUser, loading, signInWithGoogle, signOut }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
}
