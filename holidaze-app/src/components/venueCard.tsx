// src/components/venueCard.tsx
import { type Venue } from "../types/venue";
import { useNavigate } from "react-router-dom";
import {
  FaStar,
  FaStarHalfAlt,
  FaRegStar,
  FaUserFriends,
} from "react-icons/fa";

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
      if (i <= rating)
        stars.push(<FaStar key={i} className="text-yellow-400" />);
      else if (i - 0.5 === rating)
        stars.push(<FaStarHalfAlt key={i} className="text-yellow-400" />);
      else stars.push(<FaRegStar key={i} className="text-yellow-400" />);
    }
    return stars;
  };

  return (
    <div className="rounded-lg bg-white my-1 w-full max-w-80 shadow hover:shadow-lg overflow-hidden flex flex-col cursor-pointer">
      <div className="relative w-full h-48">
        {/* Image */}
        {venue.media.length > 0 && (
          <img
            src={venue.media[0].url}
            alt={venue.media[0].alt || venue.name}
            className="h-full w-full object-cover"
            onClick={handleClick}
          />
        )}
        <div className="absolute top-0 left-0 right-0 bottom-0 z-10 bg-linear-to-b from-black/1 from-80% to to-black" />
        <div className="absolute px-2 items-center  bottom-0 left-0 right-0 z-50 flex justify-between gap-1">
          {/* Rating */}
          <div className="flex items-center">{renderStars()}</div>
          <p className="text-white bg-black/30 font-bold">
            ${venue.price}/ night
          </p>
        </div>
      </div>

      {/* Content */}
      <div
        className="p-4 items-start relative flex-1 flex flex-col min-h-[185px]"
        onClick={handleClick}
      >
        <p className="text-green-700 absolute top-4 right-4 flex justify-end gap-1 items-center font-semi-bold">
          {venue.maxGuests}
          <FaUserFriends />{" "}
        </p>
        <div className="flex gap-2 items-start">
          <h2 className="text-lg font-semibold mt-5 mb-1 flex flex-nowrap w-full">
            {venue.name}
          </h2>
        </div>

        <div className="h-[72px]">
          <p className="text-gray-600 flex-1 mb-2 line-clamp-3 ">
            {venue.description}
          </p>
        </div>
      </div>

      {/* Footer buttons */}
      {(onEdit || onDelete) && (
        <div className="flex justify-end gap-2 p-2 border-t bg-gray-100">
          {onEdit && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
              className="h-6 w-16 bg-gray-300 text-black text-sm rounded hover:bg-gray-400 transition"
            >
              Edit
            </button>
          )}
          {onDelete && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
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
