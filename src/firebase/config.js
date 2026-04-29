import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCdk_aSCVXRCeZLNyvFM76Ki-GMip5GRkI",
  authDomain: "goal-tracker-1e63a.firebaseapp.com",
  projectId: "goal-tracker-1e63a",
  storageBucket: "goal-tracker-1e63a.firebasestorage.app",
  messagingSenderId: "456965670762",
  appId: "1:456965670762:web:70ee4c0fffed5861488713"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// ✅ EXPORT AUTH
export const auth = getAuth(app);

// ✅ EXPORT FIRESTORE
export const db = getFirestore(app);