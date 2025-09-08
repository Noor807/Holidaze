// src/api/venues.ts
import { API_VENUES, API_BASE } from "../constants/apiEndpoints";
import { getAuthHeaders } from "./api";

// Media type
export interface Media {
  url: string;
  alt?: string;
}

// Booking type
export interface Booking {
  id: string;
  dateFrom: string;
  dateTo: string;
  guests: number;
  created: string;
  updated: string;
  customer: {
    name: string;
    email: string;
    bio?: string;
    avatar?: Media;
    banner?: Media;
  };
}

// Venue payload for create/update
export interface VenuePayload {
  name: string;
  description: string;
  media?: Media[];
  price: number;
  maxGuests: number;
  rating?: number;
  meta?: {
    wifi?: boolean;
    parking?: boolean;
    breakfast?: boolean;
    pets?: boolean;
  };
  location?: {
    address?: string;
    city?: string;
    zip?: string;
    country?: string;
    continent?: string;
    lat?: number;
    lng?: number;
  };
}

// Venue type
export interface Venue extends VenuePayload {
  id: string;
  owner: { name: string };
  created: string;
  updated: string;
  bookings: Booking[]; // always present, can be empty
}

// ✅ Create a venue
export const createVenue = async (data: VenuePayload, token: string): Promise<Venue> => {
  const res = await fetch(API_VENUES, {
    method: "POST",
    headers: getAuthHeaders(token),
    body: JSON.stringify(data),
  });

  const json = await res.json();
  if (!res.ok) throw new Error(json.errors?.[0]?.message || "Failed to create venue");
  return { ...json.data, bookings: json.data.bookings ?? [] };
};

// ✅ Get all venues owned by logged-in manager
export const getMyVenues = async (userName: string, token: string): Promise<Venue[]> => {
  const res = await fetch(`${API_BASE}/holidaze/profiles/${userName}/venues`, {
    headers: getAuthHeaders(token),
  });

  const json = await res.json();
  if (!res.ok) throw new Error(json.errors?.[0]?.message || "Failed to fetch venues");

  return json.data.map((venue: any) => ({ ...venue, bookings: venue.bookings ?? [] }));
};

// ✅ Get a single venue with bookings
export const getVenueWithBookings = async (venueId: string, token: string): Promise<Venue> => {
  const res = await fetch(`${API_VENUES}/${venueId}?_bookings=true`, {
    headers: getAuthHeaders(token),
  });

  const json = await res.json();
  if (!res.ok) throw new Error(json.errors?.[0]?.message || "Failed to fetch venue with bookings");

  return { ...json.data, bookings: json.data.bookings ?? [] };
};

// ✅ Update a venue
export const updateVenue = async (id: string, data: VenuePayload, token: string): Promise<Venue> => {
  const res = await fetch(`${API_VENUES}/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(token),
    body: JSON.stringify(data),
  });

  const json = await res.json();
  if (!res.ok) throw new Error(json.errors?.[0]?.message || "Failed to update venue");

  return { ...json.data, bookings: json.data.bookings ?? [] };
};

// ✅ Delete a venue
export const deleteVenue = async (id: string, token: string): Promise<void> => {
  const res = await fetch(`${API_VENUES}/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(token),
  });

  if (!res.ok) {
    const json = await res.json();
    throw new Error(json.errors?.[0]?.message || "Failed to delete venue");
  }
};

// ✅ Search venues
export const searchVenues = async (query: string): Promise<Venue[]> => {
  const res = await fetch(`${API_VENUES}/search?q=${encodeURIComponent(query)}`);
  const json = await res.json();
  if (!res.ok) throw new Error(json.errors?.[0]?.message || "Failed to search venues");
  return json.data.map((venue: any) => ({ ...venue, bookings: venue.bookings ?? [] }));
};
