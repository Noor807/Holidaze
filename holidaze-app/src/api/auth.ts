import { api } from "../utils/axios"; 
import { API_REGISTER, API_LOGIN, API_PROFILES } from "../constants/apiEndpoints";
import type { AuthData } from "../context/authContext";

// -------------------------
// Types
// -------------------------
export interface RegisterData {
  name: string;
  email: string;
  password: string;
  venueManager: boolean;
  bio?: string;
  avatar?: string;
  banner?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

// -------------------------
// Helpers
// -------------------------
const normalizeAuthData = (payload: any): AuthData => ({
  accessToken: payload.accessToken ?? "",
  name: payload.name ?? "",
  email: payload.email ?? "",
  venueManager: payload.venueManager ?? false,
  id: payload.id ?? "",
  avatar: payload.avatar ? { url: payload.avatar, alt: "Avatar" } : null,
  banner: payload.banner ? { url: payload.banner, alt: "Banner" } : null,
  bio: payload.bio ?? "",
  role: payload.role ?? "user",
});

// Extracted profile update
const updateUserProfile = async (
  name: string,
  token: string,
  updates: { bio?: string; avatar?: string; banner?: string }
): Promise<Partial<AuthData>> => {
  try {
    const response = await api.put(
      `${API_PROFILES}/${name}`,
      {
        bio: updates.bio,
        avatar: updates.avatar ? { url: updates.avatar, alt: "Avatar" } : undefined,
        banner: updates.banner ? { url: updates.banner, alt: "Banner" } : undefined,
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const data = response.data;
    return {
      bio: data.bio,
      avatar: data.avatar,
      banner: data.banner,
    };
  } catch (err: any) {
    console.warn("Profile update failed:", err.response?.data?.message || err.message);
    return {};
  }
};

// -------------------------
// Register
// -------------------------
export const registerUser = async (data: RegisterData): Promise<AuthData> => {
  try {
    const { bio, avatar, banner, ...registerPayload } = data;

    const response = await api.post(API_REGISTER, registerPayload);
    let user = normalizeAuthData(response.data);

    if (bio || avatar || banner) {
      const updatedProfile = await updateUserProfile(user.name, user.accessToken, {
        bio,
        avatar,
        banner,
      });
      user = { ...user, ...updatedProfile };
    }

    return user;
  } catch (err: any) {
    throw new Error(err.response?.data?.message || "Registration failed");
  }
};

// -------------------------
// Login
// -------------------------
export const loginUser = async (data: LoginData): Promise<AuthData> => {
  try {
    const response = await api.post(API_LOGIN, data);
    const payload = response.data?.data ?? response.data;
    return normalizeAuthData(payload);
  } catch (err: any) {
    throw new Error(err.response?.data?.message || "Login failed");
  }
};
