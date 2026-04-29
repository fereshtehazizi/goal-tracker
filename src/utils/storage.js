import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";

import { auth, db } from "../firebase/config";

const DEFAULT_CATEGORIES = [
  "health",
  "study",
  "work",
  "personal",
  "fitness",
  "finance",
];

// ================= GOALS =================

export const getGoals = async () => {
  const user = auth.currentUser;
  if (!user) return [];

  const snap = await getDocs(
    collection(db, "users", user.uid, "goals")
  );

  return snap.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

export const addGoal = async (goal) => {
  const user = auth.currentUser;
  if (!user) return;

  await addDoc(
    collection(db, "users", user.uid, "goals"),
    goal
  );
};

export const updateGoal = async (id, updatedData) => {
  const user = auth.currentUser;
  if (!user) return;

  const ref = doc(db, "users", user.uid, "goals", id);
  await updateDoc(ref, updatedData);
};

export const deleteGoal = async (id) => {
  const user = auth.currentUser;
  if (!user) return;

  const ref = doc(db, "users", user.uid, "goals", id);
  await deleteDoc(ref);
};

export const getCategories = async () => {
  const user = auth.currentUser;
  if (!user) return DEFAULT_CATEGORIES;

  const snap = await getDocs(
    collection(db, "users", user.uid, "categories")
  );

  const custom = snap.docs.map((doc) => doc.data().name);

  return [...new Set([...DEFAULT_CATEGORIES, ...custom])];
};

export const addCategory = async (category) => {
  const user = auth.currentUser;
  if (!user) return;

  await addDoc(
    collection(db, "users", user.uid, "categories"),
    { name: category }
  );
};