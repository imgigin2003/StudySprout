// @ts-nocheck
import React, { createContext, useState, useContext, useEffect } from "react";
import api from "@/utils/api";

const AuthContext = createContext(null);

const GUEST_KEY = "studysprout_guest";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isGuest, setIsGuest] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);
  const [authError, setAuthError] = useState(null);

  const checkUserAuth = async () => {
    // If the user chose "Continue as Guest" in a previous session, restore that.
    if (sessionStorage.getItem(GUEST_KEY) === "true") {
      setIsGuest(true);
      setIsAuthenticated(false);
      setIsLoadingAuth(false);
      setAuthChecked(true);
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setIsLoadingAuth(false);
      setAuthChecked(true);
      return;
    }
    try {
      setIsLoadingAuth(true);
      const response = await api.get("/auth/profile");
      setUser(response.data.user);
      setIsAuthenticated(true);
      setAuthError(null);
    } catch (error) {
      localStorage.removeItem("token");
      setIsAuthenticated(false);
      if (error.response?.status === 401) {
        setAuthError({ type: "unauthorized", message: "Session expired" });
      }
    } finally {
      setIsLoadingAuth(false);
      setAuthChecked(true);
    }
  };

  useEffect(() => {
    checkUserAuth();
  }, []);

  /** Allow the user to browse the app without an account. */
  const loginAsGuest = () => {
    sessionStorage.setItem(GUEST_KEY, "true");
    setIsGuest(true);
    setIsAuthenticated(false);
    setUser(null);
    setAuthChecked(true);
    setIsLoadingAuth(false);
  };

  const logout = () => {
    localStorage.removeItem("token");
    sessionStorage.removeItem(GUEST_KEY);
    setUser(null);
    setIsAuthenticated(false);
    setIsGuest(false);
    window.location.href = "/";
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isGuest,
        isLoadingAuth,
        authChecked,
        authError,
        checkUserAuth,
        loginAsGuest,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
