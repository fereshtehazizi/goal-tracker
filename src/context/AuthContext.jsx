import { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "../firebase/config";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);

  const [authLoading, setAuthLoading] = useState(true);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    let unsubscribeUserDoc = null;

    const cached = localStorage.getItem("userData");
    if (cached) {
      setUserData(JSON.parse(cached));
      setDataLoading(false);
    }

    const unsubscribeAuth = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setAuthLoading(false);

      if (unsubscribeUserDoc) unsubscribeUserDoc();

      if (firebaseUser) {
        setDataLoading(true);

        const ref = doc(db, "users", firebaseUser.uid);

        unsubscribeUserDoc = onSnapshot(ref, (snap) => {
          if (snap.exists()) {
            const data = snap.data();

            setUserData(data);
            localStorage.setItem("userData", JSON.stringify(data));
          } else {
            setUserData(null);
          }

          setDataLoading(false);
        });
      } else {
        setUserData(null);
        setDataLoading(false);
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeUserDoc) unsubscribeUserDoc();
    };
  }, []);

  const logout = async () => {
    localStorage.removeItem("userData");
    await signOut(auth);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userData,
        loading: authLoading || dataLoading,
        authLoading,
        dataLoading,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};