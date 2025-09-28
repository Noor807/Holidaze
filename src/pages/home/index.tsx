import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import VenueCarousel from "../../components/venueCarousel";
import VenueCardSkeleton from "../../components/venueCardSkeleton";
import { fetchVenues } from "../../api/fetchVenues";
import type { Venue } from "../../types/venue";

/**
 * Home component renders the landing page with the following sections:
 * - New venues carousel
 * - Venue categories
 * - Popular destinations
 *
 * Handles fetching venues, loading states, and navigation for categories/destinations.
 *
 * @component
 * @returns {JSX.Element} Home page component
 */
const Home: React.FC = () => {
  /** Array of fetched venue objects */
  const [venues, setVenues] = useState<Venue[]>([]);

  /** Loading state for fetching venues */
  const [loading, setLoading] = useState<boolean>(true);

  /** Error message if fetching fails */
  const [error, setError] = useState<string>("");

  /** Navigation hook from react-router */
  const navigate = useNavigate();

  /**
   * Fetch venues from the API on component mount.
   * Updates loading, error, and venues state accordingly.
   */
  useEffect(() => {
    const loadVenues = async () => {
      try {
        setLoading(true);
        const { venues: fetchedVenues } = await fetchVenues(1, 12);
        setVenues(fetchedVenues);
        setError("");
      } catch (err: any) {
        setError(err?.message || "Error fetching venues");
      } finally {
        setLoading(false);
      }
    };
    loadVenues();
  }, []);

  /** Static venue categories for homepage display */
  const categories = [
    {
      name: "Hotels",
      image:
        "https://www.universalorlando.com/webdata/k2/en/us/files/Images/gds/hgh-daylight-wide-angle-exterior-rounded-b.png",
    },
    {
      name: "Cabins",
      image:
        "https://www.vrbo.com/vacation-ideas/wp-content/uploads/2mAxXcPfyn0vZ0Jhbgc8d3/37ae243da39f56f877673c9db48844fa/57755155-3154-4e02-a5b6-22fa0814bdad.lg1.jpg",
    },
    {
      name: "Apartments",
      image:
        "https://res.cloudinary.com/sentral/image/upload/w_1000,h_1000,q_auto:eco,c_fill/f_auto/v1684782440/miro_hero_building_exterior_2000x1125.jpg",
    },
    {
      name: "Villas",
      image:
        "https://eu-central-1.graphassets.com/Aoe93msPoSHm8LneEiGVgz/kcqbCpucTbmzbM5yqelI",
    },
  ];

  /** Static popular destinations for homepage display */
  const destinations = [
    {
      name: "Norway",
      image:
        "https://cdn.pixabay.com/photo/2018/01/21/22/17/house-3097664_1280.jpg",
    },
    {
      name: "France",
      image:
        "https://res.klook.com/image/upload/q_85/c_fill,w_750/v1718112298/klyzxawxgytpixrvsgem.jpg",
    },
    {
      name: "Italy",
      image:
        "https://c8.alamy.com/comp/2C1W2W9/italy-tourism-attractions-travel-photo-collage-with-rome-venice-florence-milan-pisa-sicily-and-italian-alps-2C1W2W9.jpg",
    },
    {
      name: "Spain",
      image:
        "https://barcelonayellow.com/images/stories/topten/sagrada_familia_church_barcelona.jpg",
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 lg:py-14">
      {/* New Venues Section */}
      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center mb-4 sm:mb-6 lg:mb-6 text-gray-700">
        Explore Our New Venues
      </h2>
      {loading && <VenueCardSkeleton />}
      {error && <p className="text-red-500 text-center">{error}</p>}
      {!loading && !error && venues.length > 0 && (
        <VenueCarousel venues={venues} />
      )}

      {/* Categories Section */}
      <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mt-8 sm:mt-12 mb-4 text-gray-700">
        Explore by Category
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
        {categories.map((cat) => (
          <button
            key={cat.name}
            onClick={() => navigate("/venues")}
            aria-label={`Explore ${cat.name}`}
            className="relative cursor-pointer rounded-lg overflow-hidden shadow-md transform transition duration-300 hover:shadow-xl hover:-translate-y-1"
          >
            <img
              src={cat.image}
              alt={cat.name}
              className="w-full h-28 sm:h-32 md:h-40 lg:h-48 object-cover"
            />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <p className="text-white font-semibold text-sm sm:text-base lg:text-lg">
                {cat.name}
              </p>
            </div>
          </button>
        ))}
      </div>

      {/* Destinations Section */}
      <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mt-8 sm:mt-12 mb-4 text-gray-700">
        Popular Destinations
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
        {destinations.map((dest) => (
          <button
            key={dest.name}
            onClick={() => navigate("/venues")}
            aria-label={`Explore ${dest.name}`}
            className="relative cursor-pointer rounded-lg overflow-hidden shadow-md transform transition duration-300 hover:shadow-xl hover:-translate-y-1"
          >
            <img
              src={dest.image}
              alt={dest.name}
              className="w-full h-32 sm:h-40 md:h-52 lg:h-64 object-cover rounded-lg"
            />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <p className="text-white font-semibold text-sm sm:text-base lg:text-lg">
                {dest.name}
              </p>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
};

export default Home;
