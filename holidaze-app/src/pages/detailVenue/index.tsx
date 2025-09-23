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
import BookingForm from "../../components/bookingForm";
import VenueMap from "../../components/venueMap";
import { useAuth } from "../../context/authContext";
import type { Venue } from "../../types/venue";

const DEFAULT_MAP_COORDS = { lat: 51.505, lng: -0.09 };

const DetailedVenuePage = () => {
  const { id } = useParams<{ id: string }>();
  const [venue, setVenue] = useState<Venue | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user } = useAuth();
  const isLoggedIn = Boolean(user);
  const [unavailableDates, setUnavailableDates] = useState<Date[]>([]);

  useEffect(() => {
    async function fetchVenue() {
      try {
        const res = await fetch(
          `https://v2.api.noroff.dev/holidaze/venues/${id}?_bookings=true&_owner=true`
        );
        const json = await res.json();
        setVenue(json.data);

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

  if (loading) return <p className="text-center mt-10">Loading venue...</p>;
  if (error || !venue)
    return (
      <p className="text-center text-red-600 mt-10">
        {error || "Venue not found"}
      </p>
    );

  const isOwner = user?.name === venue?.owner?.name;

  const renderStars = (rating: number) => (
    <div className="flex space-x-1 mt-1 text-sm" aria-label={`Rating: ${rating} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) =>
        i < Math.round(rating) ? (
          <FaStar key={i} className="text-yellow-400" aria-hidden="true" />
        ) : (
          <FaRegStar key={i} className="text-gray-700" aria-hidden="true" />
        )
      )}
    </div>
  );

  const mapLat = venue.location?.lat || DEFAULT_MAP_COORDS.lat;
  const mapLng = venue.location?.lng || DEFAULT_MAP_COORDS.lng;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Venue Images */}
      <div className="space-y-4">
        {venue.media && venue.media.length > 0 ? (
          <>
            <img
              src={venue.media[0].url}
              alt={venue.media[0].alt || "Venue image"}
              className="w-full h-64 sm:h-96 object-cover rounded-lg"
            />
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {venue.media.slice(1, 5).map((img, idx) => (
                <img
                  key={idx}
                  src={img.url}
                  alt={img.alt || `Venue image ${idx + 2}`}
                  className="w-full h-32 sm:h-48 object-cover rounded-lg"
                />
              ))}
            </div>
          </>
        ) : (
          <img
            src="https://via.placeholder.com/600x400"
            alt="Placeholder venue image"
            className="w-full h-64 sm:h-96 object-cover rounded-lg"
          />
        )}
      </div>

      {/* Venue Title, Rating, Price */}
      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold">{venue.name}</h1>
        {renderStars(venue.rating)}
        <p className="text-lg sm:text-xl font-semibold">${venue.price} / night</p>

        {venue.owner && (
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 mt-4 p-3 border rounded-lg shadow-sm bg-white">
            <img
              src={venue.owner.avatar?.url || "https://via.placeholder.com/60"}
              alt={venue.owner.avatar?.alt || "Host avatar"}
              className="w-12 h-12 rounded-full object-cover border"
            />
            <div className="flex flex-col justify-center">
              <p className="font-semibold text-gray-800 text-sm sm:text-base">
                {venue.owner.name || "Unknown Host"}
              </p>
              <p className="text-xs sm:text-sm text-gray-700">Hosting</p>
            </div>
            <div className="ml-auto flex items-center space-x-1 text-gray-800 text-sm">
              <FaUserFriends className="text-gray-700" aria-hidden="true" />
              <span>{venue.bookings?.length || 0}</span>
            </div>
          </div>
        )}
      </div>

      {/* Description */}
      <section className="space-y-2">
        <h2 className="text-lg sm:text-xl text-gray-700 font-semibold">
          About This Venue
        </h2>
        <p className="text-sm sm:text-base text-gray-800">{venue.description}</p>
      </section>

      {/* Booking Form */}
      <section aria-label="Booking Form" className="space-y-4">
        {isLoggedIn ? (
          isOwner ? (
            <p className="text-red-600 font-semibold">
              You cannot book your own venue.
            </p>
          ) : (
            <BookingForm
              venueId={venue.id}
              venueOwner={venue.owner?.name || ""}
              pricePerNight={venue.price}
              unavailableDates={unavailableDates}
            />
          )
        ) : (
          <div className="p-6 bg-emerald-100 rounded-lg shadow space-y-4">
            <h3 className="text-gray-800 text-xl font-semibold">Log in or register to book this venue</h3>
            <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-2 sm:space-y-0">
              <Link
                to="/login"
                aria-label="Log in to book this venue"
                className="flex-1 px-4 py-2 border border-black bg-white text-black rounded hover:bg-gray-300 text-center"
              >
                Log in
              </Link>
              <Link
                to="/register"
                aria-label="Register to book this venue"
                className="flex-1 px-4 py-2 bg-black text-white rounded hover:bg-gray-700 text-center"
              >
                Register
              </Link>
            </div>
          </div>
        )}
      </section>

      {/* Amenities */}
      <section aria-label="Amenities" className="space-y-2">
        <h3 className="text-lg sm:text-xl font-semibold text-gray-700">
          Amenities
        </h3>
        <p className="text-base text-gray-600">
          This venue offers the following amenities for a comfortable stay:
        </p>
        <ul className="space-y-2 text-gray-800 text-base sm:text-base">
          {venue.meta?.wifi && (
            <li className="flex items-center space-x-2">
              <FaWifi aria-hidden="true" />
              <span>WiFi</span>
            </li>
          )}
          {venue.meta?.parking && (
            <li className="flex items-center space-x-2">
              <FaParking aria-hidden="true" />
              <span>Parking</span>
            </li>
          )}
          {venue.meta?.breakfast && (
            <li className="flex items-center space-x-2">
              <FaCoffee aria-hidden="true" />
              <span>Breakfast</span>
            </li>
          )}
          {venue.meta?.pets && (
            <li className="flex items-center space-x-2">
              <FaPaw aria-hidden="true" />
              <span>Pets allowed</span>
            </li>
          )}
        </ul>
      </section>

      {/* Map */}
      <section aria-label="Venue Location" className="space-y-2">
        <h3 className="text-lg sm:text-xl font-semibold text-gray-700">Location</h3>
        <div className="w-full h-96 sm:h-[32rem] lg:h-[36rem] rounded-lg overflow-hidden">
          <VenueMap lat={mapLat} lng={mapLng} venueName={venue.name} />
        </div>
      </section>
    </div>
  );
};

export default DetailedVenuePage;
