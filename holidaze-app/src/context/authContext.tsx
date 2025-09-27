import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { API_BASE } from "../constants/apiEndpoints";

/**
 * Represents media assets like avatar or banner.
 */
export interface Media {
  url: string;
  alt?: string;
}

/**
 * Authenticated user data structure.
 */
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

/**
 * Context properties for authentication.
 */
interface AuthContextProps {
  /** Current authenticated user or null */
  user: AuthData | null;
  /** Login function, accepts AuthData and fetches full profile */
  login: (data: AuthData) => Promise<void>;
  /** Logout function clears user state and localStorage */
  logout: () => void;
  /** Set user state manually */
  setUser: (data: AuthData) => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

/**
 * Retrieves stored user from localStorage.
 * @returns {AuthData | null}
 */
const getStoredUser = (): AuthData | null => {
  try {
    const stored = localStorage.getItem("auth");
    return stored ? (JSON.parse(stored) as AuthData) : null;
  } catch {
    return null;
  }
};

/**
 * Provides authentication context to child components.
 * @param {ReactNode} children
 */
export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUserState] = useState<AuthData | null>(getStoredUser);

  /**
   * Set user state and persist to localStorage.
   * @param {AuthData} data
   */
  const setUser = useCallback((data: AuthData) => {
    setUserState(data);
    localStorage.setItem("auth", JSON.stringify(data));
  }, []);

  /**
   * Logout user and remove from localStorage.
   */
  const logout = useCallback(() => {
    setUserState(null);
    localStorage.removeItem("auth");
  }, []);

  /**
   * Login function sets initial user data and fetches full profile.
   * @param {AuthData} data
   */
  const login = useCallback(
    async (data: AuthData) => {
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
        console.warn(
          "Could not fetch full profile, using basic login info",
          err
        );
      }
    },
    [setUser]
  );

  return (
    <AuthContext.Provider value={{ user, login, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Hook to access authentication context.
 * @returns {AuthContextProps}
 * @throws Will throw an error if used outside AuthProvider.
 */
export const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
