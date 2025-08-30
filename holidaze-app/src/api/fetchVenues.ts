// src/api/fetchVenues.ts

import axios from "axios";
import { API_BASE } from "../constants/apiEndpoints";
import type { Venue } from "../types/venue";

interface FetchVenuesResponse {
  venues: Venue[];
  pageCount: number;
}

export const fetchVenues = async (
  page: number,
  limit: number,
  searchTerm: string = ""
): Promise<FetchVenuesResponse> => {
  const params: any = {
    page,
    limit,
    sort: "created",
    sortOrder: "desc", // newest first
  };

  if (searchTerm) {
    params.name = searchTerm; // or name_like if API supports fuzzy search
  }

  const response = await axios.get(`${API_BASE}/holidaze/venues`, { params });

  // The API response includes pagination information in the 'meta' field
  const venues = response.data.data;
  const pageCount = response.data.meta?.pageCount || 1;

  return {
    venues,
    pageCount,
  };
};
