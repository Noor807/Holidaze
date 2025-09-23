import React, { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { API_BASE } from "../constants/apiEndpoints";

export interface Media {
  url: string;
  alt?: string;
}

export interface AuthData {
  role: string;
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
  login: (data: AuthData) => Promise<void>;
  logout: () => void;
  setUser: (data: AuthData) => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

const getStoredUser = (): AuthData | null => {
  try {
    const stored = localStorage.getItem("auth");
    return stored ? (JSON.parse(stored) as AuthData) : null;
  } catch {
    return null;
  }
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUserState] = useState<AuthData | null>(getStoredUser);

  const setUser = useCallback((data: AuthData) => {
    setUserState(data);
    localStorage.setItem("auth", JSON.stringify(data));
  }, []);

  const logout = useCallback(() => {
    setUserState(null);
    localStorage.removeItem("auth");
  }, []);

  const login = useCallback(async (data: AuthData) => {
    // Set basic login info immediately
    setUser(data);

    try {
      const res = await fetch(`${API_BASE}/holidaze/profiles/${data.name}`, {
        headers: {
          Authorization: `Bearer ${data.accessToken}`,
          "X-Noroff-API-Key": import.meta.env.VITE_API_KEY,
        },
      });

      if (!res.ok) throw new Error("Failed to fetch full profile");

      const json = await res.json();
      const profileData = json.data;

      setUser({
        ...data,
        bio: profileData?.bio ?? data.bio,
        avatar: profileData?.avatar ?? data.avatar ?? null,
        banner: profileData?.banner ?? data.banner ?? null,
        venueManager: profileData?.venueManager ?? data.venueManager,
      });
    } catch (err) {
      console.warn("Could not fetch full profile, using basic login info", err);
    }
  }, [setUser]);

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
