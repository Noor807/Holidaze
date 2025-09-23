import React from "react";
import { Link } from "react-router-dom";
import GuestSelector from "../components/guestSelector";
import { type Guests, useGuests } from "../hooks/useGuests";

interface BookingSummaryProps {
  selectedDates: { from: Date | null; to: Date | null };
  maxGuests: number;
  pricePerNight: number;
  isLoggedIn: boolean;
  onBooking: (guests: Guests) => void;
}

const BookingSummary: React.FC<BookingSummaryProps> = ({
  selectedDates,
  maxGuests,
  pricePerNight,
  isLoggedIn,
  onBooking,
}) => {
  // --- Guests hook ---
  const { guests, totalAdultsChildren, setGuests } = useGuests(maxGuests);

  // --- Total price calculation ---
  const calculateTotal = (): number => {
    const { from, to } = selectedDates;
    if (!from || !to) return 0;
    const diffTime = to.getTime() - from.getTime();
    const diffDays = Math.max(Math.ceil(diffTime / (1000 * 60 * 60 * 24)), 1);
    return diffDays * pricePerNight * totalAdultsChildren;
  };

  const canBook = selectedDates.from && selectedDates.to;

  return (
    <div className="w-full max-w-sm bg-gray-100 p-4 rounded-lg shadow space-y-4">
      {/* Dates */}
      <div>
        <p>
          <strong>CHECK-IN:</strong>{" "}
          {selectedDates.from ? selectedDates.from.toLocaleDateString() : "---"}
        </p>
        <p>
          <strong>CHECKOUT:</strong>{" "}
          {selectedDates.to ? selectedDates.to.toLocaleDateString() : "---"}
        </p>
      </div>

      {/* Guest selector */}
      <GuestSelector
        guests={guests}
        maxGuests={maxGuests}
        onChange={setGuests}
      />

      {/* Total */}
      <p className="text-lg font-semibold">Total: ${calculateTotal()}</p>

      {/* Action */}
      {!isLoggedIn ? (
        <div className="space-x-4 mb-7">
          <p className="text-gray-600 mb-4">
            Log in or register to make a booking
          </p>
          <div className="flex gap-2">
            <Link
              to="/login"
              className="px-4 py-2 border border-black text-black rounded hover:bg-green-700"
            >
              Log in
            </Link>
            <Link
              to="/register"
              className="px-4 py-2 bg-black text-white rounded hover:bg-blue-700"
            >
              Register
            </Link>
          </div>
        </div>
      ) : (
        <button
          type="button"
          className={`w-full py-2 rounded font-semibold text-white ${
            canBook ? "bg-green-600 hover:bg-green-700" : "bg-gray-400 cursor-not-allowed"
          }`}
          onClick={() => onBooking(guests)}
          disabled={!canBook}
        >
          Book Now
        </button>
      )}
    </div>
  );
};

export default BookingSummary;
