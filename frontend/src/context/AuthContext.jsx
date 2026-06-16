// @ts-nocheck
import React, { createContext, useState, useContext, useEffect } from "react";
import api from "../utils/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [authChecked, setAuthChecked] = useState(false); // Add this state
  const [authError, setAuthError] = useState(null); // Add this state

  const checkUserAuth = async () => {
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
      // Map common errors
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

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setIsAuthenticated(false);
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoadingAuth,
        authChecked, // Export this
        authError, // Export this
        checkUserAuth, // Export this
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
