import type { Venue } from "../types/venue";
import {
  FaWifi,
  FaParking,
  FaCoffee,
  FaPaw,
  FaStar,
  FaRegStar,
} from "react-icons/fa";
import { Link } from "react-router-dom";

interface Props {
  venue: Venue;
}

const VenueCard = ({ venue }: Props) => {
  const defaultImage = "https://via.placeholder.com/300?text=No+Image";
  const imageUrl =
    venue.media?.length && venue.media[0]?.url
      ? venue.media[0].url
      : defaultImage;
  const imageAlt =
    venue.media?.length && venue.media[0]?.alt
      ? venue.media[0].alt
      : venue.name;

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
      className="block w-[260px] h-[330px] bg-white text-gray-800 border rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden"
      aria-label={`View details for ${venue.name}`}
    >
      <img
        src={imageUrl}
        alt={imageAlt}
        className="w-full h-[170px] object-cover"
        onError={(e) => {
          (e.target as HTMLImageElement).src = defaultImage;
        }}
      />

      <div className="p-2 flex flex-col mt-6 justify-between h-[calc(100%-130px)]">
        <div>
          <h3 className="text-sm font-semibold truncate">{venue.name}</h3>
          <p className="text-xs text-gray-600 truncate">
            {venue.location?.city || "Unknown city"},{" "}
            {venue.location?.country || "Unknown country"}
          </p>

          <p className="text-xs text-gray-700 mt-2 line-clamp-2">
            {venue.description || "No description available."}
          </p>

          {venue.rating > 0 ? (
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
            {venue.meta?.parking && (
              <FaParking className="w-4 h-4" title="Parking" />
            )}
            {venue.meta?.breakfast && (
              <FaCoffee className="w-4 h-4" title="Breakfast" />
            )}
            {venue.meta?.pets && (
              <FaPaw className="w-4 h-4" title="Pets allowed" />
            )}
          </div>
        </div>

        <p className="text-sm font-semibold mt-2">
          ${venue.price ?? "N/A"} / night
        </p>
      </div>
    </Link>
  );
};

export default VenueCard;
