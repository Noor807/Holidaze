import { useState, useEffect, useCallback, useMemo, type JSX } from "react";
import { useAuth } from "../context/authContext";
import { createBooking } from "../api/bookings";
import { toast } from "react-toastify";
import { FaChevronDown, FaUser, FaChild, FaBaby, FaPaw } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

/** Guests object type */
interface Guests {
  adults: number;
  children: number;
  infants: number;
  pets: number;
}

/** Props for BookingForm */
interface Props {
  venueId: string;
  venueOwner: string;
  pricePerNight: number;
  unavailableDates?: Date[];
  isDisabled?: boolean;
  onBookingSuccess?: (bookedDates: Date[]) => void;
  onRequireLogin?: () => void;
}

/** Guest option metadata */
interface GuestOption {
  type: keyof Guests;
  label: string;
  icon: JSX.Element;
}

/** Options for guest selection */
const guestOptions: GuestOption[] = [
  { type: "adults", label: "Adults", icon: <FaUser /> },
  { type: "children", label: "Children", icon: <FaChild /> },
  { type: "infants", label: "Infants", icon: <FaBaby /> },
  { type: "pets", label: "Pets", icon: <FaPaw /> },
];

/**
 * GuestControl component for incrementing/decrementing guest counts
 */
const GuestControl = ({
  label,
  value,
  icon,
  onIncrement,
  onDecrement,
}: {
  label: string;
  value: number;
  icon: JSX.Element;
  onIncrement: () => void;
  onDecrement: () => void;
}) => (
  <div className="flex justify-between items-center">
    <span className="flex items-center gap-2">
      {icon} {label}
    </span>
    <div className="flex gap-2">
      <button
        type="button"
        onClick={onDecrement}
        disabled={value <= 0}
        className="bg-gray-200 text-gray-800 rounded px-3 py-1 hover:bg-gray-300 disabled:opacity-50"
      >
        -
      </button>
      <span>{value}</span>
      <button
        type="button"
        onClick={onIncrement}
        className="bg-gray-200 text-gray-800 rounded px-3 py-1 hover:bg-gray-300"
      >
        +
      </button>
    </div>
  </div>
);

/**
 * BookingForm component with date selection, guest management, and booking summary
 */
const BookingForm = ({
  venueId,
  venueOwner,
  pricePerNight,
  unavailableDates = [],
  isDisabled = false,
  onBookingSuccess,
  onRequireLogin,
}: Props) => {
  const { user } = useAuth();

  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(new Date());
  const [guests, setGuests] = useState<Guests>({
    adults: 1,
    children: 0,
    infants: 0,
    pets: 0,
  });
  const [showGuests, setShowGuests] = useState(false);
  const [loading, setLoading] = useState(false);
  const [monthsToShow, setMonthsToShow] = useState(
    typeof window !== "undefined" && window.innerWidth >= 1024 ? 2 : 1
  );

  /** Update months to show on resize */
  useEffect(() => {
    const handleResize = () =>
      setMonthsToShow(window.innerWidth >= 1024 ? 2 : 1);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  /** Calculate number of nights */
  const nights = useMemo(() => {
    if (!startDate || !endDate) return 1;
    return Math.max(
      (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24) + 1,
      1
    );
  }, [startDate, endDate]);

  /** Calculate total number of guests */
  const totalGuests = useMemo(
    () => Object.values(guests).reduce((a, b) => a + b, 0),
    [guests]
  );

  /** Calculate base price based on nights */
  const basePrice = useMemo(
    () => nights * pricePerNight,
    [nights, pricePerNight]
  );

  /** Guest fee: $20 for each guest above 1 */
  const guestFee = useMemo(
    () => (totalGuests > 1 ? (totalGuests - 1) * 20 : 0),
    [totalGuests]
  );

  /** Total booking price */
  const totalPrice = basePrice + guestFee;

  const handleIncrement = useCallback((type: keyof Guests) => {
    setGuests((prev) => ({ ...prev, [type]: prev[type] + 1 }));
  }, []);

  const handleDecrement = useCallback((type: keyof Guests) => {
    setGuests((prev) => {
      const newValue = Math.max(0, prev[type] - 1); // Prevent negative values
      return { ...prev, [type]: newValue };
    });
  }, []);

  /**
   * Handle booking submission
   */
  const handleBookNow = async () => {
    if (isDisabled) {
      toast.info("Booking not allowed for this user");
      return;
    }

    if (!user) {
      toast.error("You must be logged in to book.");
      onRequireLogin?.();
      return;
    }

    if (!startDate || !endDate) {
      toast.error("Please select valid dates.");
      return;
    }

    if (user.name === venueOwner) {
      toast.error("You cannot book your own venue.");
      return;
    }

    setLoading(true);

    try {
      await createBooking(
        {
          venueId,
          dateFrom: startDate.toISOString(),
          dateTo: endDate.toISOString(),
          guests: totalGuests,
        },
        user.accessToken
      );

      toast.success(`Booking successful! Total: $${totalPrice}`);

      // Generate booked dates array
      const bookedDates: Date[] = [];
      for (
        let d = new Date(startDate);
        d <= endDate;
        d.setDate(d.getDate() + 1)
      ) {
        bookedDates.push(new Date(d));
      }

      onBookingSuccess?.(bookedDates);

      // Reset form
      setStartDate(new Date());
      setEndDate(new Date());
      setGuests({ adults: 1, children: 0, infants: 0, pets: 0 });
      setShowGuests(false);
    } catch (err: any) {
      toast.error(err?.message || "Booking failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="grid grid-cols-1 md:grid-cols-[2fr,1fr] gap-8 ">
      {/* Date & Guests section */}
      <section className="w-full sm:space-y-6 lg:space-y-6 md:space-y-6 ">
        {/* Date Picker */}
        <div className="bg-gradient-to-r from-green-200 to-blue-200 rounded-2xl shadow-md custom-datepicker !gap-2 mb-4 flex flex-col p-4">
          <h2 className="text-xl font-semibold text-gray-700 mb-2 text-center">
            Select Dates
          </h2>
          <DatePicker
            className="w-full"
            inline
            selectsRange
            monthsShown={monthsToShow}
            startDate={startDate}
            endDate={endDate}
            onChange={(dates: [Date | null, Date | null]) => {
              const [start, end] = dates;
              setStartDate(start);
              setEndDate(end);
            }}
            minDate={new Date()}
            excludeDates={unavailableDates}
          />
        </div>

        {/* Guests */}
        <div className="bg-gradient-to-r from-green-200 to-blue-200 sm:mt-4  p-4 rounded-2xl shadow-md">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Guests</h2>
          <button
            type="button"
            onClick={() => setShowGuests(!showGuests)}
            className="w-full border px-4 py-2 rounded-lg bg-white text-left flex justify-between items-center shadow-sm text-gray-900"
          >
            Guests: {totalGuests} ({guests.adults} adults, {guests.children}{" "}
            children)
            <FaChevronDown
              className={`ml-2 transition-transform ${
                showGuests ? "rotate-180" : ""
              }`}
            />
          </button>
          {showGuests && (
            <div className="mt-3 space-y-2">
              {guestOptions.map(({ type, label, icon }) => (
                <GuestControl
                  key={type}
                  label={label}
                  value={guests[type]}
                  icon={icon}
                  onIncrement={() => handleIncrement(type)}
                  onDecrement={() => handleDecrement(type)}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Booking Summary */}
      <aside className="bg-gradient-to-r from-green-200 to-blue-200  p-4 rounded-2xl shadow-md sticky top-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">Booking Summary</h2>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Adults</span>
            <span>{guests.adults}</span>
          </div>
          <div className="flex justify-between">
            <span>Children</span>
            <span>{guests.children}</span>
          </div>
          <div className="flex justify-between">
            <span>Nights</span>
            <span>{nights}</span>
          </div>
          <div className="flex justify-between font-bold text-lg border-t pt-2 mt-2">
            <span>Total</span>
            <span>${totalPrice}</span>
          </div>
        </div>
        <button
          type="button"
          onClick={handleBookNow}
          disabled={isDisabled || loading}
          className={`w-full py-3 rounded-xl font-semibold transition ${
            isDisabled
              ? "bg-gray-400 cursor-not-allowed text-white"
              : "bg-green-700 text-white hover:bg-green-800"
          }`}
        >
          {loading ? "Booking..." : "Book Now"}
        </button>
      </aside>
    </form>
  );
};

export default BookingForm;
