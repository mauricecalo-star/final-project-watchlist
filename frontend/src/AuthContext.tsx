import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import { api } from "./api";

interface AuthContextValue {
  token: string | null;
  email: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
  const [email, setEmail] = useState<string | null>(localStorage.getItem("email"));

  function persist(token: string, email: string) {
    localStorage.setItem("token", token);
    localStorage.setItem("email", email);
    setToken(token);
    setEmail(email);
  }

  async function login(email: string, password: string) {
    const data = await api.login(email, password);
    persist(data.token, data.user.email);
  }

  async function signup(email: string, password: string) {
    const data = await api.signup(email, password);
    persist(data.token, data.user.email);
  }

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    setToken(null);
    setEmail(null);
  }

  return (
    <AuthContext.Provider value={{ token, email, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
