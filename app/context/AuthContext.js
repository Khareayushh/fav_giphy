import { useContext, createContext, useState, useEffect } from "react";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";

import { auth } from "../firebase";

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Initialize user as null

  useEffect(() => {
    // Listen for auth state changes and update user state
    onAuthStateChanged(auth, (currentUser) => setUser(currentUser));
  }, []);

  const signup = async (email, password) => {
    // Sign up user with Firebase and update user state
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error(error);
    }
  };

  const login = async (email, password) => {
    // Sign in user with Firebase and update user state
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error(error);
    }
  };

  const logout = async () => {
    // Sign out user with Firebase and reset user state
    await auth.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const UserAuth = () => {
  return useContext(AuthContext);
};
