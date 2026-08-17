import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = async (email, password) => {
    setError(null);

    if (!email.trim() || !password.trim()) {
      setError("Email et mot de passe requis.");
      return false;
    }
    if (password.length < 4) {
      setError("Mot de passe trop court (4 caractères min).");
      return false;
    }

    setLoading(true);
    // Simule un appel réseau — à remplacer par un vrai POST /login plus tard
    await new Promise((resolve) => setTimeout(resolve, 700));
    setLoading(false);

    setUser({ email, name: email.split("@")[0] });
    return true;
  };

  const signup = async (name, email, password) => {
    setError(null);

    if (!name.trim() || !email.trim() || !password.trim()) {
      setError("Tous les champs sont requis.");
      return false;
    }
    if (password.length < 4) {
      setError("Mot de passe trop court (4 caractères min).");
      return false;
    }

    setLoading(true);
    // Simule un appel réseau — à remplacer par un vrai POST /signup plus tard
    await new Promise((resolve) => setTimeout(resolve, 700));
    setLoading(false);

    setUser({ email, name });
    return true;
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: !!user, loading, error, login, signup, logout, setError }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth doit être utilisé à l'intérieur de <AuthProvider>");
  return ctx;
}