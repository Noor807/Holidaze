import { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
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

/**
 * Placeholder component for venue images while loading or missing media.
 * @param size - Determines the size of the placeholder ("lg" or "sm").
 */
const ImagePlaceholder: React.FC<{ size?: "lg" | "sm" }> = ({
  size = "lg",
}) => (
  <div
    className={`flex items-center justify-center bg-gray-100 rounded-lg animate-pulse ${
      size === "lg" ? "w-full h-64 sm:h-96" : "w-full h-32 sm:h-48"
    }`}
  >
    <svg
      className={`${size === "lg" ? "w-16 h-16" : "w-12 h-12"} text-gray-500`}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 3v18h18V3H3zm2 2h14v14H5V5zm3 3l2.5 3 3-4 3.5 5H8l2-2-2-2z"
      />
    </svg>
  </div>
);

/**
 * Custom hook to fetch a venue by ID including bookings and owner info.
 * @param id - Venue ID.
 * @returns Venue data, loading state, error, and unavailable dates.
 */
const useVenue = (id: string | undefined) => {
  const [venue, setVenue] = useState<Venue | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [unavailableDates, setUnavailableDates] = useState<Date[]>([]);

  useEffect(() => {
    if (!id) return;

    const fetchVenue = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `https://v2.api.noroff.dev/holidaze/venues/${id}?_bookings=true&_owner=true`
        );
        if (!res.ok) throw new Error("Failed to fetch venue");
        const json = await res.json();
        setVenue(json.data);

        if (json.data.bookings) {
          const dates: Date[] = json.data.bookings.flatMap(
            (b: { dateFrom: string; dateTo: string }) => {
              const start = new Date(b.dateFrom);
              const end = new Date(b.dateTo);
              const days: Date[] = [];
              for (
                let d = new Date(start);
                d <= end;
                d.setDate(d.getDate() + 1)
              ) {
                days.push(new Date(d));
              }
              return days;
            }
          );
          setUnavailableDates(dates);
        }
      } catch (err) {
        setError("Failed to load venue details");
        toast.error("Failed to load venue details");
      } finally {
        setLoading(false);
      }
    };

    fetchVenue();
  }, [id]);

  return { venue, loading, error, unavailableDates };
};

/**
 * Render star rating for a venue.
 * @param rating - Rating number (0-5).
 */
const RenderStars: React.FC<{ rating: number }> = ({ rating }) => (
  <div
    className="flex space-x-1 mt-1 text-sm"
    aria-label={`Rating: ${rating} out of 5 stars`}
  >
    {Array.from({ length: 5 }, (_, i) =>
      i < Math.round(rating) ? (
        <FaStar key={i} className="text-yellow-400" aria-hidden="true" />
      ) : (
        <FaRegStar key={i} className="text-gray-700" aria-hidden="true" />
      )
    )}
  </div>
);

/**
 * Display venue images with grid for additional images.
 * @param media - Array of media objects from venue.
 */
const VenueImages: React.FC<{ media: Venue["media"] }> = ({ media }) => (
  <div className="space-y-4">
    {media && media.length > 0 ? (
      <>
        {media[0]?.url ? (
          <img
            src={media[0].url}
            alt={media[0].alt || "Venue image"}
            className="w-full h-64 sm:h-96 object-cover rounded-lg"
          />
        ) : (
          <ImagePlaceholder size="lg" />
        )}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {media
            .slice(1, 5)
            .map((img, idx) =>
              img?.url ? (
                <img
                  key={idx}
                  src={img.url}
                  alt={img.alt || `Venue image ${idx + 2}`}
                  className="w-full h-32 sm:h-48 object-cover rounded-lg"
                />
              ) : (
                <ImagePlaceholder key={idx} size="sm" />
              )
            )}
        </div>
      </>
    ) : (
      <ImagePlaceholder size="lg" />
    )}
  </div>
);

/**
 * Display detailed venue info including owner and bookings.
 * @param venue - Venue object.
 */
const VenueInfo: React.FC<{ venue: Venue }> = ({ venue }) => (
  <div className="space-y-2">
    <h1 className="text-2xl sm:text-3xl font-bold">{venue.name}</h1>
    <RenderStars rating={venue.rating} />
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
);

/**
 * Display venue amenities as a list of icons and labels.
 * @param meta - Venue meta information.
 */
const VenueAmenities: React.FC<{ meta: Venue["meta"] }> = ({ meta }) => (
  <section aria-label="Amenities" className="space-y-2">
    <h3 className="text-lg sm:text-xl font-semibold text-gray-700">
      Amenities
    </h3>
    <p className="text-base text-gray-600">
      This venue offers the following amenities for a comfortable stay:
    </p>
    <ul className="space-y-2 text-gray-800 text-base sm:text-base">
      {meta?.wifi && (
        <li className="flex items-center space-x-2">
          <FaWifi />
          WiFi
        </li>
      )}
      {meta?.parking && (
        <li className="flex items-center space-x-2">
          <FaParking />
          Parking
        </li>
      )}
      {meta?.breakfast && (
        <li className="flex items-center space-x-2">
          <FaCoffee />
          Breakfast
        </li>
      )}
      {meta?.pets && (
        <li className="flex items-center space-x-2">
          <FaPaw />
          Pets allowed
        </li>
      )}
    </ul>
  </section>
);

/**
 * Display a map of the venue's location.
 * @param venue - Venue object with location info.
 */
const VenueLocation: React.FC<{ venue: Venue }> = ({ venue }) => {
  const mapLat = venue.location?.lat || DEFAULT_MAP_COORDS.lat;
  const mapLng = venue.location?.lng || DEFAULT_MAP_COORDS.lng;

  return (
    <section aria-label="Venue Location" className="space-y-2">
      <h3 className="text-lg sm:text-xl font-semibold text-gray-700">
        Location
      </h3>
      <div className="w-full h-96 sm:h-[32rem] lg:h-[36rem] rounded-lg overflow-hidden">
        <VenueMap lat={mapLat} lng={mapLng} venueName={venue.name} />
      </div>
    </section>
  );
};

/**
 * Detailed venue page including booking form, images, amenities, and location.
 */
const DetailedVenuePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const {
    venue,
    loading,
    error,
    unavailableDates: initialUnavailableDates,
  } = useVenue(id);

  const [unavailableDates, setUnavailableDates] = useState<Date[]>([]);
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    if (initialUnavailableDates) setUnavailableDates(initialUnavailableDates);
  }, [initialUnavailableDates]);

  const isOwner = useMemo(
    () => user?.name === venue?.owner?.name,
    [user, venue]
  );

  if (loading)
    return <div className="max-w-4xl mx-auto px-4 py-8">Loading...</div>;
  if (error || !venue)
    return (
      <p className="text-center text-red-600 mt-10">
        {error || "Venue not found"}
      </p>
    );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      <VenueImages media={venue.media} />
      <VenueInfo venue={venue} />

      <section className="space-y-2">
        <h2 className="text-lg sm:text-xl text-gray-700 font-semibold">
          About This Venue
        </h2>
        <p className="text-sm sm:text-base text-gray-800">
          {venue.description}
        </p>
      </section>

      <BookingForm
        venueId={venue.id}
        venueOwner={venue.owner?.name || ""}
        pricePerNight={venue.price}
        unavailableDates={unavailableDates}
        isDisabled={isOwner}
        onBookingSuccess={(bookedDates: Date[]) =>
          setUnavailableDates((prev) => [...prev, ...bookedDates])
        }
        onRequireLogin={() => setShowAuthModal(true)}
      />

      <VenueAmenities meta={venue.meta} />
      <VenueLocation venue={venue} />

      {showAuthModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-sm text-center">
            <h2 className="text-lg font-semibold mb-4">Login or Register</h2>
            <p className="text-gray-700 mb-6">
              You need to log in or register to book this venue.
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() =>
                  navigate("/login", { state: { from: location } })
                }
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Login
              </button>
              <button
                onClick={() =>
                  navigate("/register", { state: { from: location } })
                }
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Register
              </button>
            </div>
            <button
              onClick={() => setShowAuthModal(false)}
              className="mt-6 text-gray-600 hover:text-gray-800 underline"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DetailedVenuePage;
