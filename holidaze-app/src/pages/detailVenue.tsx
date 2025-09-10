// DetailedVenuePage.tsx
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { toast } from "react-toastify";
import {
  FaWifi,
  FaParking,
  FaCoffee,
  FaPaw,
  FaStar,
  FaRegStar,
  FaUserFriends,
} from "react-icons/fa";
import BookingForm from "../components/bookingForm";
import VenueMap from "../components/venueMap";
import { useAuth } from "../context/authContext";
import type { Venue } from "../types/venue";

const DEFAULT_MAP_COORDS = { lat: 51.505, lng: -0.09 }; // Default location if venue missing

const DetailedVenuePage = () => {
  const { id } = useParams<{ id: string }>();
  const [venue, setVenue] = useState<Venue | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user } = useAuth();
  const isLoggedIn = Boolean(user);
  const [unavailableDates, setUnavailableDates] = useState<Date[]>([]);
  

  // Fetch venue details
  useEffect(() => {
    async function fetchVenue() {
      try {
        const res = await fetch(
          `https://v2.api.noroff.dev/holidaze/venues/${id}?_bookings=true&_owner=true`
        );
        const json = await res.json();
        setVenue(json.data);

        // Calculate unavailable dates from bookings
        if (json.data.bookings) {
          const dates: Date[] = [];
          json.data.bookings.forEach((b: any) => {
            let current = new Date(b.dateFrom);
            const end = new Date(b.dateTo);
            while (current <= end) {
              dates.push(new Date(current));
              current.setDate(current.getDate() + 1);
            }
          });
          setUnavailableDates(dates);
        }
      } catch (err) {
        setError("Failed to load venue details");
        toast.error("Failed to load venue details");
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchVenue();
  }, [id]);

  if (loading) return <p className="text-center">Loading venue...</p>;
  if (error || !venue) return <p className="text-center text-red-600">{error || "Venue not found"}</p>;

  const isOwner = user?.name === venue?.owner?.name;

  const renderStars = (rating: number) => (
    <div className="flex space-x-1 mt-1">
      {Array.from({ length: 5 }, (_, i) =>
        i < Math.round(rating) ? (
          <FaStar key={i} className="text-yellow-400" />
        ) : (
          <FaRegStar key={i} className="text-gray-300" />
        )
      )}
    </div>
  );

  const mapLat = venue.location?.lat || DEFAULT_MAP_COORDS.lat;
  const mapLng = venue.location?.lng || DEFAULT_MAP_COORDS.lng;

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      {/* Venue image */}
      <img
        src={venue.media?.[0]?.url || "https://via.placeholder.com/600x400"}
        alt={venue.media?.[0]?.alt || "Venue image"}
        className="w-full h-96 object-cover rounded-lg"
      />

      {/* Title, rating, price, host */}
      <div className="mt-4 space-y-2">
        <h1 className="text-3xl font-bold">{venue.name}</h1>
        {renderStars(venue.rating)}
        <p className="text-xl font-semibold">${venue.price} / night</p>

        {/* Host Card */}
        {venue.owner && (
          <div className="flex items-center space-x-4 mt-4 p-2 border rounded-lg shadow-sm bg-white hover:shadow-lg transition-shadow duration-200 max-w-xs">
            <img
              src={venue.owner.avatar?.url || "https://via.placeholder.com/60"}
              alt={venue.owner.avatar?.alt || "Host avatar"}
              className="w-12 h-12 rounded-full object-cover border"
            />
            <div className="flex flex-col justify-center">
              <p className="font-semibold text-gray-800 text-sm">
                {venue.owner.name || "Unknown Host"}
              </p>
              <p className="text-xs text-gray-500">Hosting</p>
            </div>
            <div className="ml-auto flex items-center space-x-1 text-gray-600 text-sm">
              <FaUserFriends className="text-gray-500" />
              <span>{venue.bookings?.length || 0}</span>
            </div>
          </div>
        )}
      </div>

      {/* Description */}
      <section className="mt-6">
        <h2 className="text-xl text-gray-500 font-semibold mb-2">About This Venue</h2>
        <p>{venue.description}</p>
      </section>

      {/* Booking Section */}
      <section className="mt-6">
        {isLoggedIn ? (
          isOwner ? (
            <p className="text-red-600 font-semibold">You cannot book your own venue.</p>
          ) : (
            <BookingForm
              venueId={venue.id}
              venueOwner={venue.owner?.name || ""}
              unavailableDates={unavailableDates}
            />
          )
        ) : (
          <div className="space-y-4">
            <p className="text-gray-600">Log in or register to book this venue</p>
            <div className="flex space-x-4">
              <Link
                to="/login"
                className="flex-1 px-4 py-2 border border-black text-black rounded hover:bg-gray-400 text-center"
              >
                Log in
              </Link>
              <Link
                to="/register"
                className="flex-1 px-4 py-2 bg-black text-white rounded hover:bg-gray-700 text-center"
              >
                Register
              </Link>
            </div>
          </div>
        )}
      </section>

      {/* Facilities */}
      <section className="mt-8">
        <h3 className="text-xl font-semibold mb-4">What this place offers</h3>
        <ul className="space-y-2 text-gray-600 text-lg">
          {venue.meta?.wifi && <li className="flex items-center space-x-2"><FaWifi /><span>WiFi</span></li>}
          {venue.meta?.parking && <li className="flex items-center space-x-2"><FaParking /><span>Parking</span></li>}
          {venue.meta?.breakfast && <li className="flex items-center space-x-2"><FaCoffee /><span>Breakfast</span></li>}
          {venue.meta?.pets && <li className="flex items-center space-x-2"><FaPaw /><span>Pets allowed</span></li>}
        </ul>
      </section>

      {/* Map */}
      <section className="mt-6">
        <VenueMap lat={mapLat} lng={mapLng} venueName={venue.name} />
      </section>
    </div>
  );
};

export default DetailedVenuePage;
