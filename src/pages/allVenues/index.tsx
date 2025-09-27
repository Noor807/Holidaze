import { useState, useEffect, useCallback, useMemo } from "react";
import VenueCard from "../../components/venueCard";
import VenueCardSkeleton from "../../components/venueCardSkeleton";
import { fetchVenues } from "../../api/fetchVenues";
import type { Venue } from "../../types/venue";
import Pagination from "../../components/pagination";

interface AllVenuesProps {
  /** Optional search term to filter venues */
  searchTerm?: string;
}

interface FetchVenuesResponse {
  venues: Venue[];
  pageCount: number;
}

const ITEMS_PER_PAGE = 12;

/**
 * Component to display all venues with pagination, loading skeletons, and search filtering.
 */
const AllVenues: React.FC<AllVenuesProps> = ({ searchTerm = "" }) => {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  /**
   * Fetch venues whenever current page or search term changes.
   */
  useEffect(() => {
    const loadVenues = async () => {
      try {
        setLoading(true);
        const data: FetchVenuesResponse = await fetchVenues(
          currentPage,
          ITEMS_PER_PAGE,
          searchTerm
        );
        setVenues(data.venues);
        setTotalPages(data.pageCount);
        setError("");
      } catch (err: any) {
        setError(err?.message ?? "Error fetching venues");
      } finally {
        setLoading(false);
      }
    };

    loadVenues();
  }, [currentPage, searchTerm]);

  /**
   * Handles pagination page changes.
   * @param page - The new page number
   */
  const handlePageChange = useCallback(
    (page: number) => {
      if (page >= 1 && page <= totalPages) {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    },
    [totalPages]
  );

  /**
   * Determine if pagination should be shown.
   */
  const showPagination = useMemo(
    () => !loading && !error && totalPages > 1,
    [loading, error, totalPages]
  );

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-6 ">
      <h1 className="text-4xl font-bold mb-4 flex justify-center">All Venues</h1>

      {/* Pagination Top */}
      {showPagination && (
        <div className="flex justify-center mb-6">
          <Pagination
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        </div>
      )}

      {/* Error message */}
      {error && <p className="text-red-500 mb-4">{error}</p>}

      {/* No results */}
      {!loading && !error && venues.length === 0 && (
        <p className="text-gray-700">No venues found for "{searchTerm}"</p>
      )}

      {/* Venue cards or skeletons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 place-content-center">
        {loading
          ? Array.from({ length: ITEMS_PER_PAGE }).map((_, idx) => (
              <VenueCardSkeleton key={idx} />
            ))
          : venues.map((venue) => <VenueCard key={venue.id} venue={venue} />)}
      </div>

      {/* Pagination Bottom */}
      {showPagination && (
        <div className="flex justify-end mt-6">
          <Pagination
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
};

export default AllVenues;
