// src/components/venueCard.tsx
import { type Venue } from "../types/venue";
import { useNavigate } from "react-router-dom";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

interface Props {
  venue: Venue;
  onEdit?: () => void;
  onDelete?: () => void;
}

const VenueCard = ({ venue, onEdit, onDelete }: Props) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/venues/${venue.id}`);
  };

  // Render stars for rating
  const renderStars = () => {
    const stars = [];
    const rating = Math.round((venue.rating ?? 0) * 2) / 2; // default to 0
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) stars.push(<FaStar key={i} className="text-yellow-400" />);
      else if (i - 0.5 === rating) stars.push(<FaStarHalfAlt key={i} className="text-yellow-400" />);
      else stars.push(<FaRegStar key={i} className="text-yellow-400" />);
    }
    return stars;
  };

  return (
    <div className="rounded-lg bg-gray-100 shadow hover:shadow-lg overflow-hidden flex flex-col cursor-pointer">
      {/* Image */}
      {venue.media.length > 0 && (
        <img
          src={venue.media[0].url}
          alt={venue.media[0].alt || venue.name}
          className="w-full h-48 object-cover"
          onClick={handleClick}
        />
      )}

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col" onClick={handleClick}>
        <h2 className="text-lg font-semibold mb-1">{venue.name}</h2>

        {/* Rating */}
        <div className="flex items-center mb-2">{renderStars()}</div>

        <p className="text-gray-600 flex-1 mb-2 line-clamp-3">{venue.description}</p>
        <p className="text-gray-800  font-bold">
          ${venue.price} / night 
          • Max {venue.maxGuests} guests
        </p>
      </div>

      {/* Footer buttons */}
{(onEdit || onDelete) && (
  <div className="flex justify-end gap-2 p-2 border-t bg-gray-100">
    {onEdit && (
      <button
        onClick={(e) => { e.stopPropagation(); onEdit(); }}
        className="h-6 w-16 bg-gray-300 text-black text-sm rounded hover:bg-gray-400 transition"
      >
        Edit
      </button>
    )}
    {onDelete && (
      <button
        onClick={(e) => { e.stopPropagation(); onDelete(); }}
        className="h-6 w-16  bg-gray-300 text-white text-sm rounded hover:bg-gray-600 transition"
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
