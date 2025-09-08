// src/api/profiles.ts
import { API_BASE } from "../constants/apiEndpoints";

export interface Media {
  url: string;
  alt?: string;
}

export interface UserProfileUpdate {
  bio?: string;
  avatar?: Media;
  banner?: Media;
}

export interface ProfileResponse {
  name: string;
  email: string;
  avatar?: Media | null;
  banner?: Media | null;
  bio?: string;
  venueManager: boolean;
  id: string;
}

// Make sure your .env has: VITE_API_KEY=your_api_key_here
const API_KEY = import.meta.env.VITE_API_KEY;

export const updateUserProfile = async (
  username: string,
  token: string,
  data: UserProfileUpdate
): Promise<ProfileResponse> => {
  try {
    const res = await fetch(`${API_BASE}/holidaze/profiles/${username}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": API_KEY,          
        Authorization: `Bearer ${token}`, 
      },
      body: JSON.stringify({
        bio: data.bio,
        avatar: data.avatar ? { url: data.avatar.url } : undefined,
        banner: data.banner ? { url: data.banner.url } : undefined,
      }),
    });

    const json = await res.json().catch(() => null);

    if (!res.ok) {
      console.error("Update failed:", json || res.statusText);
      throw new Error(
        (json && json.errors?.[0]?.message) ||
        `Failed to update profile: ${res.status}`
      );
    }

    return json;
  } catch (err) {
    console.error("Network error:", err);
    throw new Error(err instanceof Error ? err.message : "Unknown error");
  }
};
