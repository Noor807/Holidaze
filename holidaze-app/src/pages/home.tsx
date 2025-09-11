import { useState, useEffect } from "react";
import VenueCarousel from "../components/venueCarousel";
import { fetchVenues } from "../api/fetchVenues";
import type { Venue } from "../types/venue";


interface HomeProps {
  searchTerm: string;
}

const Home = ({ searchTerm }: HomeProps) => {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
console.log(searchTerm);

  useEffect(() => {
    const loadVenues = async () => {
      try {
        const { venues } = await fetchVenues(1, 12); // only first 12 for homepage carousel
        setVenues(venues);
      } catch (err: any) {
        setError(err.message || "Error fetching venues");
      } finally {
        setLoading(false);
      }
    };
    loadVenues();
  }, []);
  

  const filteredVenues = venues.filter((venue) =>
    venue.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <section className="max-w-7xl px-1 py-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-700">Explore Our New Venues</h2>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && filteredVenues.length === 0 && (
        <p>No venues found for "{searchTerm}"</p>
      )}

      {!loading && !error && filteredVenues.length > 0 && (
        <VenueCarousel venues={filteredVenues} />
      )}
    </section>
  );
};

export default Home;
