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
  const { guests, totalAdultsChildren } = useGuests(maxGuests);

  const calculateTotal = () => {
    if (!selectedDates.from || !selectedDates.to) return 0;
    const diffTime = selectedDates.to.getTime() - selectedDates.from.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays * pricePerNight * totalAdultsChildren;
  };

  return (
    <div className="w-full max-w-sm bg-gray-100 p-4 rounded-lg shadow space-y-4">
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

      <GuestSelector guests={guests} maxGuests={maxGuests} onChange={setGuests => {
        // We manually sync the guests in hook with this setGuests handler
        // For this example, we'll just update the guests state in the hook
        // so we need to add a setter to useGuests hook (or lift state)
      }} />

      <p className="text-lg font-semibold">Total: ${calculateTotal()}</p>

      {!isLoggedIn ? (
        <div className="space-x-4 mb-7">
          <p className="text-gray-600 mb-6 mt-6">Log in or register for booking</p>
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
      ) : (
        <button
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
          onClick={() => onBooking(guests)}
          disabled={!selectedDates.from || !selectedDates.to}
        >
          Book Now
        </button>
      )}
    </div>
  );
};

export default BookingSummary;
