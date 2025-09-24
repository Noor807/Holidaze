import { useEffect, useState } from "react";
import { useAuth } from "../../context/authContext";
import {
  getUserBookingsWithVenue,
  type BookingWithVenue,
} from "../../api/bookings";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import ProfileForm from "../../components/profileForm";
import { PencilIcon } from "lucide-react";

/**
 * ProfilePage component displays user profile information including:
 * - Banner and avatar
 * - Name and bio
 * - Edit profile modal
 * - Upcoming bookings
 */
const ProfilePage: React.FC = () => {
  const { user, setUser } = useAuth();

  /** User's upcoming bookings */
  const [bookings, setBookings] = useState<BookingWithVenue[]>([]);

  /** Loading state for fetching bookings */
  const [loadingBookings, setLoadingBookings] = useState(true);

  /** Modal state for editing profile */
  const [isEditing, setIsEditing] = useState(false);

  /** Default placeholder images */
  const defaultBanner = "https://via.placeholder.com/1200x300?text=Banner";
  const defaultAvatar = "https://via.placeholder.com/150?text=Avatar";

  /**
   * Fetch user's bookings when user is available
   */
  useEffect(() => {
    if (!user) return;

    const fetchBookings = async () => {
      setLoadingBookings(true);
      try {
        const data = await getUserBookingsWithVenue(
          user.name,
          user.accessToken
        );
        setBookings(data);
      } catch (err: unknown) {
        console.error(err);
        toast.error("Failed to load bookings");
      } finally {
        setLoadingBookings(false);
      }
    };

    fetchBookings();
  }, [user]);

  if (!user) {
    return (
      <p className="text-center mt-20">Please log in to view your profile</p>
    );
  }

  return (
    <div className="max-w-6xl mx-auto mt-8">
      {/* Banner */}
      <div className="relative w-full h-72 bg-gray-200">
        <img
          src={user.banner?.url ?? defaultBanner}
          alt="Banner"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Avatar & Info */}
      <div className="relative -mt-14 flex flex-col sm:flex-row sm:items-end px-4 sm:px-6 gap-4">
        <img
          src={user.avatar?.url ?? defaultAvatar}
          alt="Avatar"
          className="w-28 h-28 sm:w-32 sm:h-32 rounded-full border-4 border-white shadow object-cover mx-auto sm:mx-0"
        />
        <div className="flex-1 text-center mt-3 sm:text-left">
          <h1 className="text-2xl sm:text-3xl font-bold">{user.name}</h1>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">
            {user.bio ?? "No bio yet..."}
          </p>
        </div>
        <button
          className="self-center border-1 sm:self-end px-4 py-2 bg-gray-200 text-black font-semibold rounded shadow hover:bg-green-600 hover:text-white flex items-center gap-2 transition"
          onClick={() => setIsEditing(true)}
        >
          <PencilIcon className="w-4 h-4" /> Edit
        </button>
      </div>

      {/* ProfileForm Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
              onClick={() => setIsEditing(false)}
            >
              ✖
            </button>
            <h3 className="text-xl font-bold mb-4 text-center">Edit Profile</h3>
            <ProfileForm
              userName={user.name}
              token={user.accessToken}
              initialBio={user.bio ?? ""}
              initialAvatar={user.avatar ?? undefined}
              initialBanner={user.banner ?? undefined}
              onUpdate={(updatedProfile) => {
                const cleanedProfile = {
                  bio: updatedProfile.bio ?? undefined,
                  avatar: updatedProfile.avatar ?? undefined,
                  banner: updatedProfile.banner ?? undefined,
                };
                setUser({ ...user, ...cleanedProfile });
                toast.success("Profile updated successfully!");
                setIsEditing(false);
              }}
              onClose={() => setIsEditing(false)}
            />
          </div>
        </div>
      )}

      {/* Bookings Section */}
      <div className="px-4 sm:px-6 mt-16 space-y-6">
        <h2 className="text-xl sm:text-2xl font-bold mb-4 text-center sm:text-left">
          Upcoming Bookings
        </h2>
        {loadingBookings ? (
          <p className="text-center">Loading bookings...</p>
        ) : bookings.length === 0 ? (
          <p className="text-center">No upcoming bookings.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {bookings.map((booking) => {
              const venueImage =
                booking.venue?.media?.[0]?.url ?? defaultBanner;
              const venueName = booking.venue?.name ?? "Venue";

              return (
                <Link
                  key={booking.id}
                  to={`/venues/${booking.venue?.id}`}
                  className="bg-white rounded-lg shadow hover:shadow-md transition p-4 flex flex-col"
                >
                  <img
                    src={venueImage}
                    alt={venueName}
                    className="w-full h-40 object-cover rounded mb-2"
                  />
                  <h4 className="font-semibold truncate">{venueName}</h4>
                  <p className="text-gray-500 text-sm">
                    {new Date(booking.dateFrom).toLocaleDateString()} -{" "}
                    {new Date(booking.dateTo).toLocaleDateString()}
                  </p>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
