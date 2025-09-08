// src/api/profiles.ts
import { API_BASE } from "../constants/apiEndpoints";

export interface Media {
  url: string;
  alt?: string;
}

export interface ProfileData {
  bio?: string;
  avatar?: Media;
  banner?: Media;
  venueManager?: boolean;
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

export interface UserProfileUpdate {
  bio?: string;
  avatar?: Media;
  banner?: Media;
  venueManager?: boolean;
}

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
        "Authorization": `Bearer ${token}`,
        "X-Noroff-API-Key": import.meta.env.VITE_API_KEY, 
      },
      
      body: JSON.stringify(data),
    });

    const json = await res.json().catch(() => null);

    if (!res.ok) {
      console.error("Update failed:", json || res.statusText);
      throw new Error(
        (json?.errors?.[0]?.message as string) || `Failed to update profile: ${res.status}`
      );
    }

    return json.data; // API returns updated profile in `data` object
  } catch (err) {
    console.error("Network error:", err);
    throw new Error(err instanceof Error ? err.message : "Unknown error");
  }
};

// Alias to keep importing UserProfile if needed
export type UserProfile = ProfileResponse;
