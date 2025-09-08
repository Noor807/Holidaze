// src/components/BookingForm.tsx
import { useState, useEffect } from "react";
import { useAuth } from "../context/authContext";
import { createBooking } from "../api/bookings";
import { toast } from "react-toastify";
import { FaChevronDown } from "react-icons/fa";

interface Guests {
  adults: number;
  children: number;
  infants: number;
  pets: number;
}

interface Props {
  venueId: string;
  initialDate?: Date | null;
}

const BookingForm = ({ venueId, initialDate }: Props) => {
  const { user } = useAuth();
  const [dateFrom, setDateFrom] = useState(initialDate ? initialDate.toISOString().split("T")[0] : "");
  const [dateTo, setDateTo] = useState(initialDate ? initialDate.toISOString().split("T")[0] : "");
  const [guests, setGuests] = useState<Guests>({ adults: 1, children: 0, infants: 0, pets: 0 });
  const [showGuests, setShowGuests] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialDate) {
      const iso = initialDate.toISOString().split("T")[0];
      setDateFrom(iso);
      setDateTo(iso);
    }
  }, [initialDate]);

  const handleIncrement = (type: keyof Guests) => setGuests(prev => ({ ...prev, [type]: prev[type] + 1 }));
  const handleDecrement = (type: keyof Guests) => setGuests(prev => ({ ...prev, [type]: Math.max(0, prev[type] - 1) }));

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return toast.error("Please log in to book");
  
    setLoading(true);
    try {
      await createBooking(
        {
          venueId,
          dateFrom: new Date(dateFrom).toISOString(),
          dateTo: new Date(dateTo).toISOString(),
          guests: Object.values(guests).reduce((a, b) => a + b, 0),
        },
        user.accessToken
      );
  
      toast.success("Booking successful!");
      setDateFrom("");
      setDateTo("");
      setGuests({ adults: 1, children: 0, infants: 0, pets: 0 });
      setShowGuests(false);
    } catch (err: any) {
      console.error("Booking error:", err);
      toast.error(err.message || "Booking failed");
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <form onSubmit={handleBooking} className="bg-white p-4 rounded shadow-md space-y-4 mt-6">
      <div>
        <label>From:</label>
        <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} required className="border p-2 rounded w-full"/>
      </div>
      <div>
        <label>To:</label>
        <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} required className="border p-2 rounded w-full"/>
      </div>

      <div className="relative">
        <button type="button" onClick={() => setShowGuests(!showGuests)} className="w-full border px-4 py-2 rounded bg-white text-left flex justify-between items-center">
          Guests: {Object.values(guests).reduce((a,b)=>a+b,0)}
          <FaChevronDown className={`ml-2 transition-transform ${showGuests ? "rotate-180" : ""}`} />
        </button>
        {showGuests && (
          <div className="absolute z-10 mt-2 w-full bg-white border rounded shadow p-3 space-y-2">
            {(Object.keys(guests) as (keyof Guests)[]).map(type => (
              <div key={type} className="flex justify-between items-center">
                <span className="capitalize">{type}</span>
                <div className="flex items-center space-x-2">
                  <button type="button" onClick={() => handleDecrement(type)} className="px-2 py-1 bg-gray-300 rounded">-</button>
                  <span>{guests[type]}</span>
                  <button type="button" onClick={() => handleIncrement(type)} className="px-2 py-1 bg-gray-300 rounded">+</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <button type="submit" disabled={loading} className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 transition">
        {loading ? "Booking..." : "Book Now"}
      </button>
    </form>
  );
};

export default BookingForm;
