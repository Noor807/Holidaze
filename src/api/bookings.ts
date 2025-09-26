import { API_BOOKINGS, API_PROFILES } from "../constants/apiEndpoints";
import { getAuthHeaders } from "../api/api";

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
  id: string;
  name: string;
  price: string;
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
// Helpers
// -------------------------

/**
 * Handles fetch API responses and throws an error if the response is not ok.
 *
 * @param res - The fetch Response object
 * @returns The parsed JSON object
 * @throws Error if response is not ok
 */
const handleResponse = async (res: Response) => {
  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.errors?.[0]?.message || "API request failed");
  }
  return json;
};

// -------------------------
// Create a new booking
// -------------------------

/**
 * Creates a new booking for a venue.
 *
 * @param data - Booking information
 * @param token - User authentication token
 * @returns The created booking object
 * @throws Error if no token is provided or API request fails
 */
export const createBooking = async (data: BookingPayload, token: string) => {
  if (!token) throw new Error("No API token provided");

  const res = await fetch(API_BOOKINGS, {
    method: "POST",
    headers: getAuthHeaders(token),
    body: JSON.stringify(data),
  });

  return handleResponse(res);
};

// -------------------------
// Get all bookings of a user WITH venue info
// -------------------------

/**
 * Fetches all bookings of a user including venue details.
 *
 * @param username - Username of the user
 * @param token - User authentication token
 * @returns Array of BookingWithVenue objects
 * @throws Error if no token is provided or API request fails
 */
export const getUserBookingsWithVenue = async (
  username: string,
  token: string
): Promise<BookingWithVenue[]> => {
  if (!token) throw new Error("No API token provided");

  const res = await fetch(`${API_PROFILES}/${username}?_bookings=true`, {
    headers: getAuthHeaders(token),
  });

  const json = await handleResponse(res);

  return (json.data.bookings ?? []).map((b: any) => ({
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
          price: b.venue.price?.toString() ?? "0",
        }
      : { id: "", name: "Unknown Venue", media: [], price: "0" },
    userAvatar: json.data.avatar?.url || "",
  }));
};
