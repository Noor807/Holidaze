import type { Venue,  VenuePayload } from "../types/venue";
import { API_VENUES, API_PROFILES } from "../constants/apiEndpoints";

const normalizeVenue = (venue: any): Venue => ({
  ...venue,
  media: venue.media ?? [],
  meta: {
    wifi: venue.meta?.wifi ?? false,
    parking: venue.meta?.parking ?? false,
    breakfast: venue.meta?.breakfast ?? false,
    pets: venue.meta?.pets ?? false,
  },
  location: {
    address: venue.location?.address ?? "",
    city: venue.location?.city ?? "",
    zip: venue.location?.zip ?? "",
    country: venue.location?.country ?? "",
    continent: venue.location?.continent ?? "",
    lat: venue.location?.lat ?? 0,
    lng: venue.location?.lng ?? 0,
  },
  bookings: venue.bookings ?? [],
});

// Public: Get all venues
export const getVenues = async (): Promise<Venue[]> => {
  const res = await fetch(API_VENUES);
  if (!res.ok) throw new Error("Failed to fetch venues");
  const json = await res.json();
  return json.data.map(normalizeVenue);
};

// Protected: Get my venues
export const getMyVenues = async (username: string, token: string): Promise<Venue[]> => {
  const res = await fetch(`${API_PROFILES}/${username}/venues`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "X-Noroff-API-Key": import.meta.env.VITE_API_KEY,
    },
  });
  if (!res.ok) throw new Error("Failed to fetch your venues");
  const json = await res.json();
  return json.data.map(normalizeVenue);
};

// Protected: Create venue
export const createVenue = async (payload: VenuePayload, token: string): Promise<Venue> => {
  const res = await fetch(API_VENUES, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      "X-Noroff-API-Key": import.meta.env.VITE_API_KEY,
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to create venue");
  const json = await res.json();
  return normalizeVenue(json.data);
};

// Protected: Update venue
export const updateVenue = async (id: string, payload: VenuePayload, token: string): Promise<Venue> => {
  const res = await fetch(`${API_VENUES}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      "X-Noroff-API-Key": import.meta.env.VITE_API_KEY,
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to update venue");
  const json = await res.json();
  return normalizeVenue(json.data);
};

// Protected: Delete venue
export const deleteVenue = async (id: string, token: string): Promise<void> => {
  const res = await fetch(`${API_VENUES}/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      "X-Noroff-API-Key": import.meta.env.VITE_API_KEY,
    },
  });
  if (!res.ok) throw new Error("Failed to delete venue");
};
