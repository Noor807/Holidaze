// src/context/authContext.tsx
import { createContext, useContext, useState, type ReactNode } from "react";

export interface Media { url: string; alt?: string }

export interface AuthData {
  accessToken: string;
  name: string;
  email: string;
  venueManager: boolean;
  id: string;
  bio?: string;
  avatar?: Media | null;
  banner?: Media | null;
}

interface AuthContextProps {
  user: AuthData | null;
  login: (data: AuthData) => void;
  logout: () => void;
  setUser: (data: AuthData) => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUserState] = useState<AuthData | null>(() => {
    const stored = localStorage.getItem("auth");
    if (!stored) return null;
    try {
      return JSON.parse(stored);
    } catch {
      return null;
    }
  });

  const login = (data: AuthData) => {
    setUserState(data);
    localStorage.setItem("auth", JSON.stringify(data));
  };

  const logout = () => {
    setUserState(null);
    localStorage.removeItem("auth");
  };

  const setUser = (data: AuthData) => {
    setUserState(data);
    localStorage.setItem("auth", JSON.stringify(data));
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
