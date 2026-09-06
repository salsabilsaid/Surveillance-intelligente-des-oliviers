import React, { createContext, useContext, useState } from "react";
import { loginRequest, signupRequest } from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = async (email, motDePasse) => {
    setError(null);

    if (!email.trim() || !motDePasse.trim()) {
      setError("Email et mot de passe requis.");
      return false;
    }

    setLoading(true);
    try {
      const response = await loginRequest(email.trim(), motDePasse);
      const userData = response?.data?.user ?? null;
      const tokenData = response?.data?.token ?? null;

      setToken(tokenData);
      setUser(userData);
      return true;
    } catch (err) {
      console.error("Erreur login :", err);
      setError(err.response?.data?.erreur || "Connexion impossible.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (nom, email, motDePasse) => {
    setError(null);

    if (!nom.trim() || !email.trim() || !motDePasse.trim()) {
      setError("Tous les champs sont requis.");
      return false;
    }

    if (motDePasse.length < 6) {
      setError("Mot de passe trop court (6 caractères min.");
      return false;
    }

    setLoading(true);
    try {
      const response = await signupRequest(email.trim(), motDePasse, nom.trim());
      const userData = response?.data?.user ?? null;
      const tokenData = response?.data?.token ?? null;

      setToken(tokenData);
      setUser(userData);
      return true;
    } catch (err) {
      console.error("Erreur signup :", err);
      setError(err.response?.data?.erreur || "Inscription impossible.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setError(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        loading,
        error,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);

  if (!ctx) {
    throw new Error("useAuth doit être utilisé à l'intérieur de <AuthProvider>");
  }

  return ctx;
}