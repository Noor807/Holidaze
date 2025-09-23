import { useState, useRef, useEffect, useCallback, useMemo, type JSX } from "react";
import { useAuth } from "../context/authContext";
import { createBooking } from "../api/bookings";
import { toast } from "react-toastify";
import { FaChevronDown, FaUser, FaChild, FaBaby, FaPaw } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

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

interface GuestOption {
  type: keyof Guests;
  label: string;
  icon: JSX.Element;
}

const guestOptions: GuestOption[] = [
  { type: "adults", label: "Adults", icon: <FaUser /> },
  { type: "children", label: "Children", icon: <FaChild /> },
  { type: "infants", label: "Infants", icon: <FaBaby /> },
  { type: "pets", label: "Pets", icon: <FaPaw /> },
];

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
    <span className="flex items-center gap-1">{icon}{label}</span>
    <div className="flex gap-2">
      <button
        type="button"
        onClick={onDecrement}
        className="px-2 py-1 bg-gray-800 text-white rounded"
        aria-label={`Decrease ${label}`}
      >
        -
      </button>
      <span aria-live="polite">{value}</span>
      <button
        type="button"
        onClick={onIncrement}
        className="px-2 py-1 bg-gray-800 text-white rounded"
        aria-label={`Increase ${label}`}
      >
        +
      </button>
    </div>
  </div>
);

const BookingForm = ({
  venueId,
  venueOwner,
  pricePerNight,
  unavailableDates = [],
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
  const [showModal, setShowModal] = useState(false);
  const [monthsToShow, setMonthsToShow] = useState(
    typeof window !== "undefined" && window.innerWidth >= 768 ? 2 : 1
  );

  const modalRef = useRef<HTMLDivElement | null>(null);
  const lastFocused = useRef<HTMLElement | null>(null);

  // Responsive months
  useEffect(() => {
    const handleResize = () => setMonthsToShow(window.innerWidth >= 768 ? 2 : 1);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const nights = useMemo(() => {
    if (startDate && endDate) {
      return Math.max(
        (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24) + 1,
        1
      );
    }
    return 1;
  }, [startDate, endDate]);

  const totalGuests = useMemo(() => Object.values(guests).reduce((a, b) => a + b, 0), [guests]);
  const basePrice = useMemo(() => nights * pricePerNight, [nights, pricePerNight]);
  const guestFee = useMemo(() => (totalGuests > 1 ? (totalGuests - 1) * 20 : 0), [totalGuests]);
  const totalPrice = basePrice + guestFee;

  const handleIncrement = useCallback((type: keyof Guests) => {
    setGuests(prev => ({ ...prev, [type]: prev[type] + 1 }));
  }, []);

  const handleDecrement = useCallback((type: keyof Guests) => {
    setGuests(prev => ({ ...prev, [type]: Math.max(0, prev[type] - 1) }));
  }, []);

  const handleConfirmBooking = useCallback(async () => {
    if (!user) return toast.error("Please log in to book.");
    if (user.name && user.name === venueOwner) return toast.error("You cannot book your own venue.");
    if (!startDate || !endDate) return toast.error("Please select a valid date range.");

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
      setGuests({ adults: 1, children: 0, infants: 0, pets: 0 });
      setStartDate(new Date());
      setEndDate(new Date());
      setShowGuests(false);
      closeModal();
    } catch (err: any) {
      toast.error(err.message || "Booking failed");
    } finally {
      setLoading(false);
    }
  }, [user, venueOwner, startDate, endDate, totalGuests, totalPrice, venueId]);

  const openModal = useCallback(() => {
    lastFocused.current = document.activeElement as HTMLElement;
    setShowModal(true);
  }, []);

  const closeModal = useCallback(() => {
    setShowModal(false);
    lastFocused.current?.focus();
  }, []);

  // Trap focus in modal
  useEffect(() => {
    if (!showModal || !modalRef.current) return;
    const focusable = modalRef.current.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
      if (e.key === "Tab") {
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    first?.focus();
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [showModal, closeModal]);

  return (
    <main className="max-w-5xl mx-auto px-4 py-8 bg-gradient-to-r from-green-200 to-blue-200">
      <form className="grid grid-cols-1 md:grid-cols-[2fr,1fr] gap-8">
        {/* Dates & Guests */}
        <section className="space-y-6 w-full">
          {/* Calendar */}
          <div className="bg-white p-4 gap-0 flex flex-col rounded-2xl shadow-md custom-datepicker">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">Select Dates</h2>
            <DatePicker
              className="w-full"
              inline
              monthsShown={monthsToShow}
              calendarClassName="custom-datepicker"
              selectsRange
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
          <div className="bg-white p-4 rounded-2xl shadow-md">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">Guests</h2>
            <button
              type="button"
              onClick={() => setShowGuests(!showGuests)}
              className="w-full border px-4 py-2 rounded-lg bg-white text-left flex justify-between items-center shadow-sm text-gray-900"
            >
              Guests: {totalGuests} ({guests.adults} adults, {guests.children} children)
              <FaChevronDown
                className={`ml-2 transition-transform ${showGuests ? "rotate-180" : ""}`}
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
        <aside className="bg-white p-4 rounded-2xl shadow-md sticky top-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Booking Summary</h2>
          <div className="space-y-2">
            <div className="flex justify-between"><span>Adults</span><span>{guests.adults}</span></div>
            <div className="flex justify-between"><span>Children</span><span>{guests.children}</span></div>
            <div className="flex justify-between"><span>Nights</span><span>{nights}</span></div>
            <div className="flex justify-between font-bold text-lg border-t pt-2 mt-2">
              <span>Total</span><span>${totalPrice}</span>
            </div>
          </div>
          <button
            type="button"
            onClick={openModal}
            className="w-full bg-green-700 text-white py-3 rounded-xl font-semibold hover:bg-green-800 transition"
          >
            Book Now
          </button>
        </aside>
      </form>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div
            ref={modalRef}
            className="bg-gradient-to-r from-green-200 to-blue-200 p-6 rounded-2xl shadow-md w-full max-w-md space-y-4"
            role="dialog"
            aria-modal="true"
            tabIndex={-1}
          >
            <h2 className="text-2xl font-bold text-green-600">Confirm Booking</h2>
            <div className="space-y-1">
              <p>Adults: {guests.adults}</p>
              <p>Children: {guests.children}</p>
              <p>Nights: {nights}</p>
              <p className="font-bold">Total: ${totalPrice}</p>
            </div>
            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={closeModal}
                className="px-4 py-2 rounded-lg bg-white border border-black-300 hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
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
    </main>
  );
};

export default BookingForm;
