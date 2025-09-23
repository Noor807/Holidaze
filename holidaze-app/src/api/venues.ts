import type { Venue, VenuePayload } from "../types/venue";
import { API_VENUES, API_PROFILES } from "../constants/apiEndpoints";

/** Generic API request helper */
async function apiRequest<T>(url: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(url, options);

  if (!res.ok) {
    throw new Error(`API Error ${res.status}: ${res.statusText}`);
  }

  const json = await res.json().catch(() => ({}));
  return json.data as T;
}

/** Headers for authenticated requests */
const withAuthHeaders = (token: string): HeadersInit => ({
  Authorization: `Bearer ${token}`,
  "Content-Type": "application/json",
  "X-Noroff-API-Key": import.meta.env.VITE_API_KEY,
});

// -----------------------
// API Functions
// -----------------------

/** Public: Get all venues */
export const getVenues = async (): Promise<Venue[]> =>
  apiRequest<Venue[]>(API_VENUES);

/** Protected: Get my venues */
export const getMyVenues = async (username: string, token: string): Promise<Venue[]> =>
  apiRequest<Venue[]>(`${API_PROFILES}/${username}/venues`, {
    headers: withAuthHeaders(token),
  });

/** Protected: Create venue */
export const createVenue = async (payload: VenuePayload, token: string): Promise<Venue> =>
  apiRequest<Venue>(API_VENUES, {
    method: "POST",
    headers: withAuthHeaders(token),
    body: JSON.stringify(payload),
  });

/** Protected: Update venue */
export const updateVenue = async (id: string, payload: VenuePayload, token: string): Promise<Venue> =>
  apiRequest<Venue>(`${API_VENUES}/${id}`, {
    method: "PUT",
    headers: withAuthHeaders(token),
    body: JSON.stringify(payload),
  });

/** Protected: Delete venue */
export const deleteVenue = async (id: string, token: string): Promise<void> =>
  apiRequest<void>(`${API_VENUES}/${id}`, {
    method: "DELETE",
    headers: withAuthHeaders(token),
  });

/** Public: Get venue by ID */
export const getVenueById = async (id: string, token?: string): Promise<Venue> => {
  const headers: HeadersInit = token ? withAuthHeaders(token) : {};
  return apiRequest<Venue>(`${API_VENUES}/${id}`, { headers });
};
