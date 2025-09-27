import axios, {
  AxiosError,
  type AxiosInstance,
  type AxiosResponse,
} from "axios";

/**
 * Axios instance preconfigured with base URL and JSON headers.
 */
export const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL, 
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Interceptor to handle API responses and errors globally.
 */
api.interceptors.response.use(
  /**
   * Passes successful responses through.
   * @param response Axios response
   * @returns AxiosResponse
   */
  (response: AxiosResponse) => response,

  /**
   * Handles errors globally for all API calls.
   * @param error AxiosError
   * @returns Promise rejection
   */
  (error: AxiosError) => {
    console.error("API error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);
