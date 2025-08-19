import axios from "axios";

const API_URL = "https://api.noroff.dev/api/v2";

// -------------------------
// Interfaces
// -------------------------
export interface RegisterData {
  name: string;
  email: string;
  password: string;
  venueManager: boolean; // true for Venue Manager, false for Customer
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
}

// -------------------------
// Register User
// -------------------------
export const registerUser = async (data: RegisterData): Promise<AuthResponse> => {
  try {
    const response = await axios.post(`${API_URL}/auth/register`, data, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
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
    const response = await axios.post(`${API_URL}/auth/login`, data, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  } catch (error: any) {
    console.error("Axios error:", error.response || error.message);
    throw new Error(error.response?.data?.message || "Login failed");
  }
};
