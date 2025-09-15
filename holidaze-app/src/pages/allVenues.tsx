// src/pages/allVenues.tsx
import { useState, useEffect } from "react";
import VenueCard from "../components/venueCard";
import VenueCardSkeleton from "../components/venueCardSkeleton";
import { fetchVenues } from "../api/fetchVenues";
import type { Venue } from "../types/venue";
import Pagination from "../components/pagination";

interface AllVenuesProps {
  searchTerm?: string;
}

const ITEMS_PER_PAGE = 12;

const AllVenues = ({ searchTerm = "" }: AllVenuesProps) => {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch venues whenever page or searchTerm changes
  useEffect(() => {
    const loadVenues = async () => {
      try {
        setLoading(true);
        const { venues, pageCount } = await fetchVenues(currentPage, ITEMS_PER_PAGE, searchTerm);
        setVenues(venues);
        setTotalPages(pageCount);
        setError("");
      } catch (err: any) {
        setError(err.message || "Error fetching venues");
      } finally {
        setLoading(false);
      }
    };
    loadVenues();
  }, [currentPage, searchTerm]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-6">All Venues</h1>

      {/* Pagination Top */}
      {!loading && !error && totalPages > 1 && (
        <div className="flex justify-end mb-6">
          <Pagination totalPages={totalPages} currentPage={currentPage} onPageChange={handlePageChange} />
        </div>
      )}

      {/* Error message */}
      {error && <p className="text-red-500 mb-4">{error}</p>}

      {/* No results */}
      {!loading && !error && venues.length === 0 && (
        <p className="text-gray-700">No venues found for "{searchTerm}"</p>
      )}

      {/* Venue cards or skeletons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {loading
          ? Array.from({ length: ITEMS_PER_PAGE }).map((_, idx) => <VenueCardSkeleton key={idx} />)
          : venues.map((venue) => <VenueCard key={venue.id} venue={venue} />)}
      </div>

      {/* Pagination Bottom */}
      {!loading && !error && totalPages > 1 && (
        <div className="flex justify-end mt-6">
          <Pagination totalPages={totalPages} currentPage={currentPage} onPageChange={handlePageChange} />
        </div>
      )}
    </div>
  );
};

export default AllVenues;
