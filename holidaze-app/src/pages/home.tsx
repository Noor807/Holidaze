import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import VenueCarousel from "../components/venueCarousel";
import VenueCardSkeleton from "../components/venueCardSkeleton";
import { fetchVenues } from "../api/fetchVenues";
import type { Venue } from "../types/venue";

const Home = () => {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const loadVenues = async () => {
      try {
        const { venues } = await fetchVenues(1, 12); 
        setVenues(venues);
      } catch (err: any) {
        setError(err.message || "Error fetching venues");
      } finally {
        setLoading(false);
      }
    };
    loadVenues();
  }, []);

  const categories = [
    { name: "Hotels", image: "https://www.universalorlando.com/webdata/k2/en/us/files/Images/gds/hgh-daylight-wide-angle-exterior-rounded-b.png" },
    { name: "Cabins", image: "https://www.vrbo.com/vacation-ideas/wp-content/uploads/2mAxXcPfyn0vZ0Jhbgc8d3/37ae243da39f56f877673c9db48844fa/57755155-3154-4e02-a5b6-22fa0814bdad.lg1.jpg" },
    { name: "Apartments", image: "https://res.cloudinary.com/sentral/image/upload/w_1000,h_1000,q_auto:eco,c_fill/f_auto/v1684782440/miro_hero_building_exterior_2000x1125.jpg" },
    { name: "Villas", image: "https://eu-central-1.graphassets.com/Aoe93msPoSHm8LneEiGVgz/kcqbCpucTbmzbM5yqelI" },
  ];

  const destinations = [
    { name: "Norway", image: "https://cdn.pixabay.com/photo/2018/01/21/22/17/house-3097664_1280.jpg" },
    { name: "France", image: "https://res.klook.com/image/upload/q_85/c_fill,w_750/v1718112298/klyzxawxgytpixrvsgem.jpg" },
    { name: "Italy", image: "https://c8.alamy.com/comp/2C1W2W9/italy-tourism-attractions-travel-photo-collage-with-rome-venice-florence-milan-pisa-sicily-and-italian-alps-2C1W2W9.jpg" },
    { name: "Spain", image: "https://barcelonayellow.com/images/stories/topten/sagrada_familia_church_barcelona.jpg" },
  ];

  return (
    <section className="max-w-7xl px-4 py-6 mx-auto ">
      {/* New Venues */}
      <h2 className="text-4xl font-bold text-center mb-14 text-gray-700">Explore Our New Venues</h2>
      {loading && <VenueCardSkeleton />}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && !error && venues.length > 0 && <VenueCarousel venues={venues} />}

      {/* Categories */}
      <h2 className="text-2xl font-bold mt-10 mb-4 text-gray-700">Explore by Category</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {categories.map((cat) => (
          <div
            key={cat.name}
            onClick={() => navigate("/venues")}
            className="relative cursor-pointer rounded-lg overflow-hidden shadow-md transform transition duration-300 hover:shadow-xl hover:-translate-y-1"
          >
            <img src={cat.image} alt={cat.name} className="w-full h-32 object-cover" />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <p className="text-white font-semibold text-lg">{cat.name}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Destinations */}
      <h2 className="text-2xl font-bold mt-10 mb-4 text-gray-700">Popular Destinations</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {destinations.map((dest) => (
          <div
            key={dest.name}
            onClick={() => navigate("/venues")}
            className="relative cursor-pointer rounded-lg overflow-hidden shadow-md transform transition duration-300 hover:shadow-xl hover:-translate-y-1"
          >
            <img
              src={dest.image}
              alt={dest.name}
              className="w-full h-40 sm:h-48 md:h-56 lg:h-64 object-cover rounded-lg"
            />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <p className="text-white font-semibold text-lg">{dest.name}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Home;
