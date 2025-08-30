// src/pages/venuesPage.tsx

import { useState, useEffect } from "react";
import VenueCard from "../components/venueCard";
import { fetchVenues } from "../api/fetchVenues";
import type { Venue } from "../types/venue";
import  Pagination  from "../components/pagination";

interface AllVenuesProps {
  searchTerm: string;
}

const ITEMS_PER_PAGE = 12;

const AllVenues = ({ searchTerm }: AllVenuesProps) => {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const load = async () => {
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
    load();
  }, [currentPage, searchTerm]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="w-full max-w-5xl p-6 mx-auto">
      <h1 className="text-3xl font-bold mb-4">All Venues</h1>

      {!loading && !error && totalPages > 1 && (
        <div className="w-full flex justify-end mb-6">
          <Pagination totalPages={totalPages} currentPage={currentPage} onPageChange={handlePageChange} />
        </div>
      )}

      {loading && <p>Loading venues...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && !error && venues.length === 0 && <p>No venues found for "{searchTerm}"</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {venues.map((venue) => (
          <VenueCard key={venue.id} venue={venue} />
        ))}
      </div>

      {!loading && !error && totalPages > 1 && (
        <Pagination totalPages={totalPages} currentPage={currentPage} onPageChange={handlePageChange} />
      )}
    </div>
  );
};

export default AllVenues;
