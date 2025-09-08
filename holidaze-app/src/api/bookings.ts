// src/api/bookings.ts
import { API_BOOKINGS, API_PROFILES, } from "../constants/apiEndpoints";
import { getAuthHeaders } from "./api";

// -------------------------
// Types
// -------------------------
export interface BookingPayload {
  dateFrom: string;
  dateTo: string;
  venueId: string;
  guests: number;
}

export interface Venue {
  price: string;
  id: string;
  name: string;
  media: { url: string; alt?: string }[];
}

export interface BookingWithVenue {
  id: string;
  dateFrom: string;
  dateTo: string;
  guests: number;
  created: string;
  updated: string;
  venue: Venue;
  userAvatar?: string;
}

// -------------------------
// Create a new booking
// -------------------------
export const createBooking = async (data: BookingPayload, token: string) => {
  if (!token) throw new Error("No API token provided");

  const response = await fetch(API_BOOKINGS, {
    method: "POST",
    headers: getAuthHeaders(token),
    body: JSON.stringify(data),
  });

  const json = await response.json();

  if (!response.ok) throw new Error(json.errors?.[0]?.message || "Booking failed");

  return json;
};

// -------------------------
// Get all bookings of a user WITH venue info
// -------------------------
// src/api/bookings.ts
export const getUserBookingsWithVenue = async (
  username: string,
  token: string
): Promise<BookingWithVenue[]> => {
  const res = await fetch(`${API_PROFILES}/${username}?_bookings=true`, {
    headers: getAuthHeaders(token),
  });

  const json = await res.json();

  if (!res.ok) throw new Error(json.errors?.[0]?.message || "Failed to fetch bookings");

  return json.data.bookings.map((b: any) => ({
    id: b.id,
    dateFrom: b.dateFrom,
    dateTo: b.dateTo,
    guests: b.guests,
    created: b.created,
    updated: b.updated,
    venue: b.venue
      ? {
          id: b.venue.id,
          name: b.venue.name,
          media: b.venue.media || [],
          price: b.venue.price ?? "0", // <-- include price
        }
      : { id: "", name: "Unknown Venue", media: [], price: "0" },
    userAvatar: json.data.avatar?.url || "",
  }));
};

