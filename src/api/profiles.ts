import { API_BASE } from "../constants/apiEndpoints";

/**
 * Represents media content such as an avatar or banner.
 */
export interface Media {
  url: string;

  alt?: string;
}

/**
 * Response returned when fetching or updating a user profile.
 */
export interface ProfileResponse {
  id: string;
  name: string;
  email: string;
  avatar?: Media | null;
  banner?: Media | null;
  bio?: string;
  venueManager: boolean;
}

/**
 * Data that can be used to update a user profile.
 */
export interface UserProfileUpdate {
  bio?: string;
  avatar?: Media;
  banner?: Media;
  venueManager?: boolean;
}

/**
 * Updates the profile of a given user.
 *
 * @param username - The username of the profile to update
 * @param token - User's authentication token
 * @param data - Fields to update in the profile
 * @returns The updated ProfileResponse
 * @throws Error if the API request fails or network error occurs
 */
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
        Authorization: `Bearer ${token}`,
        "X-Noroff-API-Key": import.meta.env.VITE_API_KEY,
      },
      body: JSON.stringify(data),
    });

    const json = await res.json().catch(() => null);

    if (!res.ok) {
      const message =
        json?.errors?.[0]?.message ||
        res.statusText ||
        "Failed to update profile";
      throw new Error(message);
    }

    return json?.data as ProfileResponse;
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown network error";
    throw new Error(message);
  }
};

/** Alias for consistency */
export type UserProfile = ProfileResponse;
