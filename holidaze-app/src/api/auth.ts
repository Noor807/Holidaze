// src/api/auth.ts
import axios from "axios";
import { API_REGISTER, API_LOGIN, API_PROFILES } from "../constants/apiEndpoints";
import type { AuthData } from "../context/authContext";

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  venueManager: boolean;
  bio?: string;
  avatar?: string;
  banner?: string;
}

export interface LoginData { email: string; password: string; }

// -------------------------
// Register
// -------------------------
export const registerUser = async (data: RegisterData): Promise<AuthData> => {
  const { bio, avatar, banner, ...registerPayload } = data;

  const response = await axios.post(API_REGISTER, registerPayload, {
    headers: { "Content-Type": "application/json" },
  });

  const user: AuthData = response.data;

  if (bio || avatar || banner) {
    try {
      await axios.put(
        `${API_PROFILES}/${user.name}`,
        {
          bio,
          avatar: avatar ? { url: avatar, alt: "Avatar" } : undefined,
          banner: banner ? { url: banner, alt: "Banner" } : undefined,
        },
        { headers: { Authorization: `Bearer ${user.accessToken}` } }
      );

      if (bio) user.bio = bio;
      if (avatar) user.avatar = { url: avatar, alt: "Avatar" };
      if (banner) user.banner = { url: banner, alt: "Banner" };
    } catch (err) {
      console.warn("Profile update failed:", err);
    }
  }

  return user;
};

// -------------------------
// Login
// -------------------------
export const loginUser = async (data: LoginData): Promise<AuthData> => {
  const response = await axios.post(API_LOGIN, data, {
    headers: { "Content-Type": "application/json" },
  });

  const payload = response.data?.data ?? response.data;

  return {
    accessToken: payload.accessToken ?? "",
    name: payload.name ?? "",
    email: payload.email ?? "",
    venueManager: payload.venueManager ?? false,
    id: payload.id ?? "",
    avatar: payload.avatar
      ? { url: payload.avatar, alt: "Avatar" }
      : null,
    banner: payload.banner
      ? { url: payload.banner, alt: "Banner" }
      : null,
    bio: payload.bio ?? "",
    role: payload.role ?? "user", 
  };
};


