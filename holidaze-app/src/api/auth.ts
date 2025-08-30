import axios from "axios";
import {
  API_REGISTER,
  API_LOGIN,
  API_PROFILES,
} from "../constants/apiEndpoints";

// -------------------------
// Interfaces
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

export interface AuthResponse {
  accessToken: string;
  name: string;
  email: string;
  venueManager: boolean;
  id: string;
  avatar?: string; // ✅ add this
}


// -------------------------
// Register User
// -------------------------
export const registerUser = async (
  data: RegisterData
): Promise<AuthResponse> => {
  try {
    // Step 1: Register
    const { bio, avatar, banner, ...registerPayload } = data;
    const response = await axios.post(API_REGISTER, registerPayload, {
      headers: { "Content-Type": "application/json" },
    });

    const user = response.data as AuthResponse;

    if (bio || avatar || banner) {
      try {
        await axios.put(
          `${API_PROFILES}/${user.name}`,
          { bio, avatar, banner },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${user.accessToken}`,
            },
          }
        );
      } catch (err) {
        console.warn("Profile update failed:", err);
      }
    }

    return user;
  } catch (error: any) {
    console.error("Axios error:", error.response || error.message);
    throw new Error(error.response?.data?.message || "Registration failed");
  }
};

// -------------------------
// Login User
// -------------------------
export const loginUser = async (data: LoginData): Promise<AuthResponse> => {
  try {
    const response = await axios.post(API_LOGIN, data, {
      headers: { "Content-Type": "application/json" },
    });

    // Some APIs wrap the user in "data", so check both
    const user = response.data.data || response.data;

    if (!user.accessToken) {
      throw new Error("Login failed: No access token returned");
    }

    return {
      accessToken: user.accessToken,
      name: user.name,
      email: user.email,
      venueManager: user.venueManager,
      id: user.id,
      avatar: user.avatar || "",
    };
  } catch (error: any) {
    console.error("Login API error:", error.response || error.message);
    throw new Error(error.response?.data?.message || "Login failed");
  }
};


