import axios, { AxiosError } from "axios";
import { API_BASE } from "../constants/apiEndpoints";
import type { Venue } from "../types/venue";

// -------------------------
// Types
// -------------------------

/**
 * Response structure for fetching venues.
 */
interface FetchVenuesResponse {
  venues: Venue[];
  pageCount: number;
}

// -------------------------
// Fetch venues with pagination + optional search
// -------------------------

/**
 * Fetches venues from the API with pagination and optional search.
 *
 * @param page - Current page number
 * @param limit - Number of venues per page
 * @param searchTerm - Optional search term to filter venues by name
 * @returns An object containing the array of venues and total page count
 * @throws Error if the API request fails
 */
export const fetchVenues = async (
  page: number,
  limit: number,
  searchTerm: string = ""
): Promise<FetchVenuesResponse> => {
  try {
    const params: Record<string, string | number> = {
      page,
      limit,
      sort: "created",
      sortOrder: "desc",
    };

    if (searchTerm) {
      params.name = searchTerm;
    }

    const response = await axios.get(`${API_BASE}/holidaze/venues`, { params });

    return {
      venues: response.data.data as Venue[],
      pageCount: response.data.meta?.pageCount ?? 1,
    };
  } catch (error) {
    const err = error as AxiosError<{ errors?: { message: string }[] }>;
    const message =
      err.response?.data?.errors?.[0]?.message ||
      err.message ||
      "Failed to fetch venues";
    throw new Error(message);
  }
};
