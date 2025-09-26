import { useNavigate } from "react-router-dom";
import {
  FaStar,
  FaStarHalfAlt,
  FaRegStar,
  FaUserFriends,
} from "react-icons/fa";
import { type Venue } from "../types/venue";

/**
 * Props for the VenueCard component.
 */
interface VenueCardProps {
  /** Venue data to display */
  venue: Venue;
  /** Optional callback triggered when the edit button is clicked */
  onEdit?: () => void;
  /** Optional callback triggered when the delete button is clicked */
  onDelete?: () => void;
}

/**
 * A card component for displaying venue details such as image, rating, price,
 * description, and optional edit/delete controls.
 *
 * @component
 * @param {VenueCardProps} props - Props for the VenueCard
 * @returns {JSX.Element} The rendered venue card
 */
const VenueCard = ({ venue, onEdit, onDelete }: VenueCardProps) => {
  const navigate = useNavigate();

  /**
   * Navigate to the venue detail page when the card is clicked.
   */
  const handleClick = () => {
    navigate(`/venues/${venue.id}`);
  };

  /**
   * Render star rating icons based on the venue's rating.
   *
   * - Full star for each whole rating point
   * - Half star for .5 rating
   * - Empty star for remaining slots up to 5
   *
   * @returns {JSX.Element[]} Array of star icons
   */
  const renderStars = () => {
    const stars = [];
    const rating = Math.round((venue.rating ?? 0) * 2) / 2; // Round to nearest half
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(<FaStar key={i} className="text-yellow-400" />);
      } else if (i - 0.5 === rating) {
        stars.push(<FaStarHalfAlt key={i} className="text-yellow-400" />);
      } else {
        stars.push(<FaRegStar key={i} className="text-yellow-400" />);
      }
    }
    return stars;
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={(e) => e.key === "Enter" && handleClick()}
      className="rounded-lg bg-white my-1 w-full max-w-80 shadow hover:shadow-lg overflow-hidden flex flex-col cursor-pointer transition mx-auto"
      aria-label={`View details for ${venue.name}`}
    >
      {/* Image */}
      <div className="relative w-full h-48 flex items-center justify-center bg-gray-100">
        {venue.media?.[0] ? (
          <img
            src={venue.media[0].url}
            alt={venue.media[0].alt || venue.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <svg
            className="w-12 h-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 3v18h18V3H3zm2 2h14v14H5V5zm3 3l2.5 3 3-4 3.5 5H8l2-2-2-2z"
            />
          </svg>
        )}

        {/* Bottom-only gradient */}
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/40 to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 px-2 z-10 flex justify-between items-center">
          {/* Rating */}
          <div className="flex items-center">{renderStars()}</div>
          <p className="text-white bg-black/40 px-2 py-1 rounded text-sm font-semibold">
            ${venue.price} / night
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col relative min-h-[185px]">
        <p className="text-green-700 absolute top-4 right-4 flex items-center gap-1 font-semibold">
          {venue.maxGuests} <FaUserFriends />
        </p>
        <h2 className="text-lg font-semibold mt-5 mb-1 truncate">
          {venue.name}
        </h2>
        <p className="text-gray-600 line-clamp-3">{venue.description}</p>
      </div>

      {/* Footer buttons */}
      {(onEdit || onDelete) && (
        <div className="flex justify-end gap-2 p-2 border-t bg-gray-100">
          {onEdit && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
              className="px-3 py-1 bg-gray-200 text-sm rounded hover:bg-gray-300 transition"
            >
              Edit
            </button>
          )}
          {onDelete && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition"
            >
              Delete
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default VenueCard;
