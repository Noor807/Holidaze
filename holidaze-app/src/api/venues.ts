// src/api/venues.ts
import { API_VENUES } from "../constants/apiEndpoints";
import { getAuthHeaders } from "./api";

export interface VenuePayload {
  name: string;
  description: string;
  media?: { url: string; alt?: string }[];
  price: number;
  maxGuests: number;
  rating?: number;
  meta?: { wifi?: boolean; parking?: boolean; breakfast?: boolean; pets?: boolean };
  location?: { address?: string; city?: string; zip?: string; country?: string; continent?: string; lat?: number; lng?: number };
}

export const createVenue = async (data: VenuePayload, token: string) => {
  const res = await fetch(API_VENUES, {
    method: "POST",
    headers: getAuthHeaders(token),
    body: JSON.stringify(data),
  });

  const json = await res.json();
  if (!res.ok) throw new Error(json.errors?.[0]?.message || "Failed to create venue");
  return json.data;
};
