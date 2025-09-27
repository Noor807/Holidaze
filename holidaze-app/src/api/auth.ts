import { api } from "../utils/axios";
import {
  API_REGISTER,
  API_LOGIN,
  API_PROFILES,
} from "../constants/apiEndpoints";
import type { AuthData } from "../context/authContext";

// -------------------------
// Types
// -------------------------

/**
 * Data required to register a new user.
 */
export interface RegisterData {
  /** Full name of the user */
  name: string;
  /** Email address */
  email: string;
  /** Password */
  password: string;
  /** Whether the user is a venue manager */
  venueManager: boolean;
  /** Optional bio for the user */
  bio?: string;
  /** Optional avatar URL */
  avatar?: string;
  /** Optional banner URL */
  banner?: string;
}

/**
 * Data required to log in a user.
 */
export interface LoginData {
  /** Email address */
  email: string;
  /** Password */
  password: string;
}

// -------------------------
// Helpers
// -------------------------

/**
 * Normalizes the API response into the AuthData structure.
 *
 * @param payload - Raw API response for user data
 * @returns AuthData object
 */
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

/**
 * Updates the user profile with bio, avatar, or banner.
 *
 * @param name - Username of the profile to update
 * @param token - Authorization token
 * @param updates - Partial updates containing bio, avatar, or banner
 * @returns Partial AuthData object containing the updated fields
 */
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
        avatar: updates.avatar
          ? { url: updates.avatar, alt: "Avatar" }
          : undefined,
        banner: updates.banner
          ? { url: updates.banner, alt: "Banner" }
          : undefined,
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
    console.warn(
      "Profile update failed:",
      err.response?.data?.message || err.message
    );
    return {};
  }
};

// -------------------------
// Register
// -------------------------

/**
 * Registers a new user and optionally updates profile with bio, avatar, or banner.
 *
 * @param data - Registration data
 * @returns AuthData object for the newly created user
 * @throws Error if registration fails
 */
export const registerUser = async (data: RegisterData): Promise<AuthData> => {
  try {
    const { bio, avatar, banner, ...registerPayload } = data;

    const response = await api.post(API_REGISTER, registerPayload);
    let user = normalizeAuthData(response.data);

    if (bio || avatar || banner) {
      const updatedProfile = await updateUserProfile(
        user.name,
        user.accessToken,
        {
          bio,
          avatar,
          banner,
        }
      );
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

/**
 * Logs in a user using email and password.
 *
 * @param data - Login data containing email and password
 * @returns AuthData object for the authenticated user
 * @throws Error if login fails
 */
export const loginUser = async (data: LoginData): Promise<AuthData> => {
  try {
    const response = await api.post(API_LOGIN, data);
    const payload = response.data?.data ?? response.data;
    return normalizeAuthData(payload);
  } catch (err: any) {
    throw new Error(err.response?.data?.message || "Login failed");
  }
};
