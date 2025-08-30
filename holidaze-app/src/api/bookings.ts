import { API_BOOKINGS } from "../constants/apiEndpoints";

export interface BookingPayload {
  dateFrom: string;
  dateTo: string;
  venueId: string;
  guests: number;
}

export const createBooking = async (data: BookingPayload, token: string) => {
  if (!token) throw new Error("No API token provided");

  const response = await fetch(API_BOOKINGS, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`, // ✅ must include Bearer token
    },
    body: JSON.stringify(data),
  });

  const json = await response.json();

  if (!response.ok) {
    throw new Error(json.errors?.[0]?.message || "Booking failed");
  }

  return json;
};
