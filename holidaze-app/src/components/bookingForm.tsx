// src/components/BookingForm.tsx
import { useState } from "react";
import { useAuth } from "../context/authContext";
import { createBooking } from "../api/bookings";
import { toast } from "react-toastify";
import { FaChevronDown } from "react-icons/fa";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css"; // main style
import "react-date-range/dist/theme/default.css"; // theme

interface Guests {
  adults: number;
  children: number;
  infants: number;
  pets: number;
}

interface Props {
  venueId: string;
  venueOwner: string;
  unavailableDates?: Date[]; // dates that cannot be booked
}

interface Range {
  startDate: Date;
  endDate: Date;
  key: string;
}

const BookingForm = ({ venueId, venueOwner, unavailableDates = [] }: Props) => {
  const { user } = useAuth();

  // Guests state
  const [guests, setGuests] = useState<Guests>({
    adults: 1,
    children: 0,
    infants: 0,
    pets: 0,
  });
  const [showGuests, setShowGuests] = useState(false);
  const [loading, setLoading] = useState(false);

  // Date range state
  const [range, setRange] = useState<Range[]>([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);

  // Guest increment/decrement
  const handleIncrement = (type: keyof Guests) =>
    setGuests((prev) => ({ ...prev, [type]: prev[type] + 1 }));
  const handleDecrement = (type: keyof Guests) =>
    setGuests((prev) => ({ ...prev, [type]: Math.max(0, prev[type] - 1) }));

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return toast.error("Please log in to book.");

    if (user.name === venueOwner) {
      return toast.error("You cannot book your own venue.");
    }

    setLoading(true);
    try {
      await createBooking(
        {
          venueId,
          dateFrom: range[0].startDate.toISOString(),
          dateTo: range[0].endDate.toISOString(),
          guests: Object.values(guests).reduce((a, b) => a + b, 0),
        },
        user.accessToken
      );
      toast.success("Booking successful!");
      // Reset form
      setGuests({ adults: 1, children: 0, infants: 0, pets: 0 });
      setRange([{ startDate: new Date(), endDate: new Date(), key: "selection" }]);
      setShowGuests(false);
    } catch (err: any) {
      toast.error(err.message || "Booking failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleBooking}
      className="bg-gray-100 p-4 rounded shadow-md space-y-4 mt-6"
    >
      {/* Date Range Picker */}
      <div>
        <label className="font-semibold mb-2 block">Select Dates:</label>
        <DateRange
          ranges={range}
          onChange={(ranges: any) => setRange([ranges.selection])}
          minDate={new Date()}
          disabledDates={unavailableDates} // disables booked dates
        />
      </div>

      {/* Guests */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setShowGuests(!showGuests)}
          className="w-full border px-4 py-2 rounded bg-white text-left flex justify-between items-center"
        >
          Guests: {Object.values(guests).reduce((a, b) => a + b, 0)}
          <FaChevronDown
            className={`ml-2 transition-transform ${showGuests ? "rotate-180" : ""}`}
          />
        </button>
        {showGuests && (
          <div className="absolute z-10 mt-2 w-full bg-white border rounded shadow p-3 space-y-2">
            {(Object.keys(guests) as (keyof Guests)[]).map((type) => (
              <div key={type} className="flex justify-between items-center">
                <span className="capitalize">{type}</span>
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => handleDecrement(type)}
                    className="px-2 py-1 bg-gray-300 rounded"
                  >
                    -
                  </button>
                  <span>{guests[type]}</span>
                  <button
                    type="button"
                    onClick={() => handleIncrement(type)}
                    className="px-2 py-1 bg-gray-300 rounded"
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 transition"
      >
        {loading ? "Booking..." : "Book Now"}
      </button>
    </form>
  );
};

export default BookingForm;
