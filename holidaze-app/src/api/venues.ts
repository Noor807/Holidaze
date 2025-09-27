import type { Venue, VenuePayload } from "../types/venue";
import { API_VENUES, API_PROFILES } from "../constants/apiEndpoints";

/**
 * Generic helper for API requests.
 *
 * @template T - Type of the expected response data
 * @param url - API endpoint
 * @param options - Fetch options
 * @returns The data returned from the API
 * @throws Error if the response is not ok
 */
async function apiRequest<T>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(url, options);

  if (!res.ok) {
    throw new Error(`API Error ${res.status}: ${res.statusText}`);
  }

  const json = await res.json().catch(() => ({}));
  return json.data as T;
}

/**
 * Builds headers for authenticated requests.
 *
 * @param token - User authentication token
 * @returns Headers object
 */
const withAuthHeaders = (token: string): HeadersInit => ({
  Authorization: `Bearer ${token}`,
  "Content-Type": "application/json",
  "X-Noroff-API-Key": import.meta.env.VITE_API_KEY,
});

/**
 * Fetch all public venues.
 *
 * @returns Array of venues
 */
export const getVenues = async (): Promise<Venue[]> =>
  apiRequest<Venue[]>(API_VENUES);

/**
 * Fetch venues belonging to the authenticated user.
 *
 * @param username - Username of the user
 * @param token - Authentication token
 * @returns Array of venues
 */
export const getMyVenues = async (
  username: string,
  token: string
): Promise<Venue[]> =>
  apiRequest<Venue[]>(`${API_PROFILES}/${username}/venues`, {
    headers: withAuthHeaders(token),
  });

/**
 * Create a new venue.
 *
 * @param payload - Venue data to create
 * @param token - Authentication token
 * @returns Created venue
 */
export const createVenue = async (
  payload: VenuePayload,
  token: string
): Promise<Venue> =>
  apiRequest<Venue>(API_VENUES, {
    method: "POST",
    headers: withAuthHeaders(token),
    body: JSON.stringify(payload),
  });

/**
 * Update an existing venue.
 *
 * @param id - Venue ID
 * @param payload - Updated venue data
 * @param token - Authentication token
 * @returns Updated venue
 */
export const updateVenue = async (
  id: string,
  payload: VenuePayload,
  token: string
): Promise<Venue> =>
  apiRequest<Venue>(`${API_VENUES}/${id}`, {
    method: "PUT",
    headers: withAuthHeaders(token),
    body: JSON.stringify(payload),
  });

/**
 * Delete a venue by ID.
 *
 * @param id - Venue ID
 * @param token - Authentication token
 */
export const deleteVenue = async (id: string, token: string): Promise<void> =>
  apiRequest<void>(`${API_VENUES}/${id}`, {
    method: "DELETE",
    headers: withAuthHeaders(token),
  });

/**
 * Fetch a single venue by ID.
 *
 * @param id - Venue ID
 * @param token - Optional authentication token
 * @returns Venue data
 */
export const getVenueById = async (
  id: string,
  token?: string
): Promise<Venue> => {
  const headers: HeadersInit = token ? withAuthHeaders(token) : {};
  return apiRequest<Venue>(`${API_VENUES}/${id}`, { headers });
};
