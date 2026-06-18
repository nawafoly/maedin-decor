import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCGpMRxa6eYVirS7CzeT0MR6mYZSTPyHME",
  authDomain: "maedin-decor.firebaseapp.com",
  projectId: "maedin-decor",
  storageBucket: "maedin-decor.firebasestorage.app",
  messagingSenderId: "35443744989",
  appId: "1:35443744989:web:fc404e453ec76b2a047b34",
  measurementId: "G-FD8DW2J182",
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export const analyticsPromise = isSupported().then((supported) =>
  supported ? getAnalytics(app) : null
);