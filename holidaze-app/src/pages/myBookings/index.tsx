// src/pages/MyBookingsPage.tsx
import { useEffect, useState } from "react";
import { useAuth } from "../context/authContext";
import {
  getUserBookingsWithVenue,
  type BookingWithVenue,
} from "../api/bookings";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import VenueCardSkeleton from "../components/venueCardSkeleton";

const MyBookingsPage = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<BookingWithVenue[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortLatest, setSortLatest] = useState(true);

  const defaultImage = "https://via.placeholder.com/300?text=No+Image";

  // Fetch bookings when user is available
  useEffect(() => {
    if (!user) return;

    const fetchBookings = async () => {
      setLoading(true);
      try {
        const data = await getUserBookingsWithVenue(user.name, user.accessToken);
        const sorted = [...data].sort(
          (a, b) =>
            new Date(b.dateFrom).getTime() - new Date(a.dateFrom).getTime()
        );
        setBookings(sorted);
      } catch (err: any) {
        console.error(err);
        toast.error(err.message || "Failed to fetch bookings");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [user]);

  // Sorting function
  const sortBookings = (latest: boolean) => {
    setSortLatest(latest);
    setBookings((prev) =>
      [...prev].sort(
        (a, b) =>
          latest
            ? new Date(b.dateFrom).getTime() - new Date(a.dateFrom).getTime()
            : new Date(a.dateFrom).getTime() - new Date(b.dateFrom).getTime()
      )
    );
  };

  if (!user) {
    return (
      <div className="text-center mt-20">
        <p>Please log in to view your bookings.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Bookings</h1>

        <div className="flex gap-3">
          <button
            onClick={() => sortBookings(true)}
            className={`px-4 py-2 rounded transition ${
              sortLatest ? "bg-gray-600 text-white" : "bg-gray-200 text-gray-700"
            }`}
          >
            Latest
          </button>
          <button
            onClick={() => sortBookings(false)}
            className={`px-4 py-2 rounded transition ${
              !sortLatest ? "bg-gray-600 text-white" : "bg-gray-200 text-gray-700"
            }`}
          >
            Previous
          </button>
        </div>
      </div>

      {/* Bookings */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, idx) => (
            <VenueCardSkeleton key={idx} />
          ))}
        </div>
      ) : bookings.length === 0 ? (
        <div className="text-center mt-20">You have no bookings yet.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookings.map((booking) => {
            const imageUrl = booking.venue?.media?.[0]?.url || defaultImage;
            const imageAlt = booking.venue?.media?.[0]?.alt || booking.venue?.name || "Venue";

            return (
              <Link
                key={booking.id}
                to={`/venues/${booking.venue?.id}`}
                className="bg-white rounded shadow-md overflow-hidden block"
              >
                {/* Image */}
                <div className="relative h-48">
                  <img
                    src={imageUrl}
                    alt={imageAlt}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = defaultImage;
                    }}
                  />
                </div>

                {/* Price badge */}
                <div className="px-4 pt-2">
                  <p className="text-sm font-bold text-white bg-black/70 px-3 py-1 rounded-lg inline-block">
                    {booking.venue?.price
                      ? `$${parseFloat(booking.venue.price).toLocaleString()} / night`
                      : "N/A"}
                  </p>
                </div>

                {/* Booking details */}
                <div className="p-4">
                  <h2 className="text-xl font-semibold mb-1">
                    {booking.venue?.name || "Unknown Venue"}
                  </h2>
                  <p className="text-gray-600">
                    <span className="font-medium">Check In:</span>{" "}
                    {new Date(booking.dateFrom).toLocaleDateString()}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">Check out:</span>{" "}
                    {new Date(booking.dateTo).toLocaleDateString()}
                  </p>
                  <p className="text-gray-600">Guests: {booking.guests}</p>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyBookingsPage;
