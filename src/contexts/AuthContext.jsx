import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { auth, db } from "../lib/firebase";

export const OWNER_EMAIL = "nawafoly0@gmail.com";

const AuthContext = createContext(null);

function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

function baseRoleForEmail(email) {
  return normalizeEmail(email) === OWNER_EMAIL ? "admin" : "customer";
}

async function ensureUserDocument(user, defaults = {}) {
  if (!user) return null;

  const userRef = doc(db, "users", user.uid);
  const snapshot = await getDoc(userRef);
  const fallbackRole = baseRoleForEmail(user.email);

  if (!snapshot.exists()) {
    const profile = {
      uid: user.uid,
      email: normalizeEmail(user.email),
      displayName: defaults.displayName || user.displayName || "",
      phone: defaults.phone || "",
      role: defaults.role || fallbackRole,
      accountDisabled: false,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    await setDoc(userRef, profile);
    return profile;
  }

  const data = snapshot.data();
  const patch = {
    uid: user.uid,
    email: data.email || normalizeEmail(user.email),
    updatedAt: serverTimestamp(),
  };

  if (!data.role && fallbackRole === "admin") {
    patch.role = "admin";
  }

  await setDoc(userRef, patch, { merge: true });
  return { ...data, ...patch };
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (nextUser) => {
      setUser(nextUser);
      setAuthError("");

      if (!nextUser) {
        setProfile(null);
        setLoading(false);
        return;
      }

      try {
        const nextProfile = await ensureUserDocument(nextUser);
        setProfile(nextProfile);
      } catch (error) {
        setAuthError(error.message);
      } finally {
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  const value = useMemo(() => {
    const role = profile?.role || baseRoleForEmail(user?.email);
    const isAdmin = role === "admin" || role === "owner";
    const isOwner = role === "owner" || normalizeEmail(user?.email) === OWNER_EMAIL;

    return {
      user,
      profile,
      role,
      loading,
      authError,
      isAdmin,
      isOwner,
      async login(email, password) {
        setAuthError("");
        try {
          const credential = await signInWithEmailAndPassword(auth, normalizeEmail(email), password);
          const nextProfile = await ensureUserDocument(credential.user);
          setProfile(nextProfile);
          return {
            user: credential.user,
            profile: nextProfile,
            role: nextProfile?.role || "customer",
          };
        } catch (error) {
          if (import.meta.env.DEV) {
            console.error("Firebase signInWithEmailAndPassword error:", error);
          }
          throw error;
        }
      },
      async register({ email, password, displayName, phone }) {
        setAuthError("");
        const credential = await createUserWithEmailAndPassword(auth, normalizeEmail(email), password);
        if (displayName) {
          await updateProfile(credential.user, { displayName });
        }
        const nextProfile = await ensureUserDocument(credential.user, {
          displayName,
          phone,
          role: baseRoleForEmail(email),
        });
        setProfile(nextProfile);
        return credential.user;
      },
      logout() {
        return signOut(auth);
      },
      refreshProfile() {
        return ensureUserDocument(auth.currentUser).then(setProfile);
      },
    };
  }, [authError, loading, profile, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}
