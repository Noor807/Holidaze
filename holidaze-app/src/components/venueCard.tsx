// src/components/VenueCard.tsx
import type { Venue } from "../api/venues";
import {
  FaWifi,
  FaParking,
  FaCoffee,
  FaPaw,
  FaStar,
  FaRegStar,
  FaImage,
} from "react-icons/fa";
import { Link } from "react-router-dom";

interface Props {
  venue: Venue;
  showBookings?: boolean; // optional prop to display upcoming bookings
}

const VenueCard = ({ venue, showBookings = false }: Props) => {
  const imageUrl = venue.media?.length && venue.media[0]?.url ? venue.media[0].url : null;
  const imageAlt = venue.media?.length && venue.media[0]?.alt ? venue.media[0].alt : venue.name;

  const renderStars = (rating: number) => {
    const stars = [];
    const maxStars = 5;
    const filledStars = Math.round(rating);

    for (let i = 0; i < maxStars; i++) {
      stars.push(
        i < filledStars ? (
          <FaStar key={i} className="text-yellow-400 w-4 h-4" />
        ) : (
          <FaRegStar key={i} className="text-gray-300 w-4 h-4" />
        )
      );
    }
    return stars;
  };

  return (
    <Link
      to={`/venues/${venue.id}`}
      className="block w-[260px] h-auto bg-white text-gray-800 border rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden"
      aria-label={`View details for ${venue.name}`}
    >
      {/* Image / Placeholder */}
      <div className="relative h-[160px] w-full flex items-center justify-center bg-gray-200">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={imageAlt}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        ) : (
          <div className="flex flex-col items-center justify-center w-full h-full bg-gray-300 text-gray-600">
            <FaImage className="w-8 h-8 mb-1" />
            <span className="font-semibold text-center px-2">No Image Available</span>
          </div>
        )}
      </div>

      {/* Price Tag */}
      <div className="p-2">
        <p className="text-sm font-bold text-white bg-black/70 px-3 py-1 rounded-lg inline-block">
          ${venue.price?.toLocaleString() ?? "N/A"} / night
        </p>
      </div>

      {/* Venue Info */}
      <div className="p-2 flex flex-col justify-between">
        <div>
          <h3 className="text-sm font-semibold truncate">{venue.name}</h3>
          <p className="text-xs text-gray-600 truncate">
            {venue.location?.city || "Unknown city"},{" "}
            {venue.location?.country || "Unknown country"}
          </p>

          <p className="text-xs text-gray-700 mt-2 line-clamp-2">
            {venue.description || "No description available."}
          </p>

          {venue.rating && venue.rating > 0 ? (
            <div className="flex items-center space-x-1 mt-1">
              {renderStars(venue.rating)}
              <span className="text-xs text-gray-500 ml-1">
                ({venue.rating.toFixed(1)})
              </span>
            </div>
          ) : (
            <p className="text-xs text-gray-500 mt-1">No ratings yet</p>
          )}

          <div className="flex space-x-3 mt-2 text-blue-600 text-sm">
            {venue.meta?.wifi && <FaWifi className="w-4 h-4" title="WiFi" />}
            {venue.meta?.parking && <FaParking className="w-4 h-4" title="Parking" />}
            {venue.meta?.breakfast && <FaCoffee className="w-4 h-4" title="Breakfast" />}
            {venue.meta?.pets && <FaPaw className="w-4 h-4" title="Pets allowed" />}
          </div>

          {/* Show upcoming bookings if requested */}
          {showBookings && venue.bookings?.length ? (
            <div className="mt-2 text-xs text-gray-600">
              <p className="font-semibold">Upcoming Bookings:</p>
              <ul>
                {venue.bookings.map((b) => (
                  <li key={b.id}>
                    {new Date(b.dateFrom).toLocaleDateString()} -{" "}
                    {new Date(b.dateTo).toLocaleDateString()} ({b.guests} guests)
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      </div>
    </Link>
  );
};

export default VenueCard;
