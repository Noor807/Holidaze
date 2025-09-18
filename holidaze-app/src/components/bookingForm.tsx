import { useState } from "react";
import { useAuth } from "../context/authContext";
import { createBooking } from "../api/bookings";
import { toast } from "react-toastify";
import { FaChevronDown } from "react-icons/fa";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";


interface Guests {
  adults: number;
  children: number;
  infants: number;
  pets: number;
}

interface Props {
  venueId: string;
  venueOwner: string;
  pricePerNight: number;
  unavailableDates?: Date[];
}

interface Range {
  startDate: Date;
  endDate: Date;
  key: string;
}

const BookingForm = ({
  venueId,
  venueOwner,
  pricePerNight,
  unavailableDates = [],
}: Props) => {
  const { user } = useAuth();

  const [guests, setGuests] = useState<Guests>({
    adults: 1,
    children: 0,
    infants: 0,
    pets: 0,
  });
  const [showGuests, setShowGuests] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [range, setRange] = useState<Range[]>([
    { startDate: new Date(), endDate: new Date(), key: "selection" },
  ]);

  const handleIncrement = (type: keyof Guests) =>
    setGuests((prev) => ({ ...prev, [type]: prev[type] + 1 }));
  const handleDecrement = (type: keyof Guests) =>
    setGuests((prev) => ({ ...prev, [type]: Math.max(0, prev[type] - 1) }));

  const nights =
    (range[0].endDate.getTime() - range[0].startDate.getTime()) /
      (1000 * 60 * 60 * 24) +
    1;

  const totalGuests = Object.values(guests).reduce((a, b) => a + b, 0);
  const basePrice = nights * pricePerNight;
  const guestFee = totalGuests > 1 ? (totalGuests - 1) * 20 : 0;
  const totalPrice = basePrice + guestFee;

  const handleConfirmBooking = async () => {
    if (!user) return toast.error("Please log in to book.");
    if (user.name === venueOwner)
      return toast.error("You cannot book your own venue.");

    setLoading(true);
    try {
      await createBooking(
        {
          venueId,
          dateFrom: range[0].startDate.toISOString(),
          dateTo: range[0].endDate.toISOString(),
          guests: totalGuests,
        },
        user.accessToken
      );
      toast.success(`Booking successful! Total: $${totalPrice}`);
      setGuests({ adults: 1, children: 0, infants: 0, pets: 0 });
      setRange([{ startDate: new Date(), endDate: new Date(), key: "selection" }]);
      setShowGuests(false);
      setShowModal(false);
    } catch (err: any) {
      toast.error(err.message || "Booking failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Main Form */}
      <form className="grid md:grid-cols-3 gap-8 w-full">
        {/* Left Side */}
        <div className="md:col-span-2 space-y-6">
          <div>
            <label className="font-semibold mb-2 block text-gray-900">
              Select Dates
            </label>
            <DateRange
              ranges={range}
              onChange={(ranges: any) => setRange([ranges.selection])}
              minDate={new Date()}
              disabledDates={unavailableDates}
              rangeColors={["#16a34a"]}
            />
          </div>

          {/* Guests */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowGuests(!showGuests)}
              className="w-full border px-4 py-2 rounded-lg bg-white text-left flex justify-between items-center shadow-sm text-gray-900"
            >
              Guests: {totalGuests}
              <FaChevronDown
                className={`ml-2 transition-transform ${showGuests ? "rotate-180" : ""}`}
              />
            </button>
            {showGuests && (
              <div className="absolute z-10 mt-2 w-full bg-white border rounded-xl shadow-lg p-3 space-y-2">
                {(Object.keys(guests) as (keyof Guests)[]).map((type) => (
                  <div key={type} className="flex justify-between items-center">
                    <span className="capitalize text-gray-900">{type}</span>
                    <div className="flex items-center space-x-2">
                      <button
                        type="button"
                        onClick={() => handleDecrement(type)}
                        className="px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded"
                      >
                        -
                      </button>
                      <span>{guests[type]}</span>
                      <button
                        type="button"
                        onClick={() => handleIncrement(type)}
                        className="px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded"
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Side - Summary */}
        <div className="md:col-span-1">
          <div className="bg-white shadow-lg rounded-2xl border p-6 space-y-4 sticky top-6">
            <div className="flex justify-between items-center">
              <p className="text-lg font-semibold text-gray-900">${pricePerNight} / night</p>
              <p className="text-sm text-gray-800">{totalGuests} guests</p>
            </div>

            {/* Breakdown */}
            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between text-gray-700">
                <span>{nights} nights × ${pricePerNight}</span>
                <span>${basePrice}</span>
              </div>
              {guestFee > 0 && (
                <div className="flex justify-between text-gray-700">
                  <span>Extra guest fee</span>
                  <span>${guestFee}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-lg text-gray-900 border-t pt-2 mt-2">
                <span>Total</span>
                <span>${totalPrice || 0}</span>
              </div>
            </div>

            {/* CTA -> Open Modal */}
            <button
              type="button"
              onClick={() => setShowModal(true)}
              className="w-full bg-green-700 text-white py-3 rounded-xl font-semibold hover:bg-green-800 transition"
            >
              Book Now
            </button>
          </div>
        </div>
      </form>

      {/* Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-lg space-y-4">
            <h2 className="text-xl font-bold text-gray-900">Confirm Booking</h2>
            <div className="space-y-2 text-gray-700">
              <p>Nights: {nights}</p>
              <p>Guests: {totalGuests}</p>
              <p>Total Price: ${totalPrice}</p>
            </div>

            <div className="flex justify-end space-x-3 mt-4">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmBooking}
                disabled={loading}
                className="px-4 py-2 rounded-lg bg-green-700 text-white font-semibold hover:bg-green-800"
              >
                {loading ? "Booking..." : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BookingForm;
