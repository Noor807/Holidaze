// src/pages/ProfilePage.tsx
import { useEffect, useState } from "react";
import { useAuth } from "../context/authContext";
import { getUserBookingsWithVenue, type BookingWithVenue } from "../api/bookings";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import ProfileForm from "../components/profileForm";
import { PencilIcon } from "lucide-react";

const ProfilePage = () => {
  const { user, setUser } = useAuth();
  const [bookings, setBookings] = useState<BookingWithVenue[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  const defaultBanner = "https://via.placeholder.com/1200x300?text=Banner";
  const defaultAvatar = "https://via.placeholder.com/150?text=Avatar";

  useEffect(() => {
    if (!user) return;

    const fetchBookings = async () => {
      try {
        setLoadingBookings(true);
        const data = await getUserBookingsWithVenue(user.name, user.accessToken);
        setBookings(data);
      } catch {
        toast.error("Failed to load bookings");
      } finally {
        setLoadingBookings(false);
      }
    };

    fetchBookings();
  }, [user]);

  if (!user) return <p className="text-center mt-20">Please log in to view your profile</p>;

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
      <div className="relative -mt-20 flex items-center px-6">
        <img
          src={user.avatar?.url ?? defaultAvatar}
          alt="Avatar"
          className="w-32 h-32 rounded-full border-4 border-white shadow object-cover"
        />
        <div className="ml-6 flex flex-col mt-24 justify-center">
          <h1 className="text-3xl font-bold">{user.name}</h1>
          <p className="text-gray-600 mt-1">{user.bio ?? "No bio yet..."}</p>
        </div>
        <button
          className="ml-auto px-4 py-2 border-1 bg-gray-200 text-black font-bold rounded shadow hover:bg-blue-700 flex items-center gap-2"
          onClick={() => setIsEditing(true)}
        >
          <PencilIcon className="w-4 h-4" /> Edit 
        </button>
      </div>

      {/* ProfileForm Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
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
  initialAvatar={user.avatar ?? undefined}  // ✅ null -> undefined
  initialBanner={user.banner ?? undefined}  // ✅ null -> undefined
  onUpdate={(updatedProfile) => {
    // Convert null values to undefined
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
      <div className="px-6 mt-24 space-y-6">
        <h2 className="text-2xl font-bold mb-4">Upcoming Bookings</h2>
        {loadingBookings ? (
          <p>Loading bookings...</p>
        ) : bookings.length === 0 ? (
          <p>No upcoming bookings.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {bookings.map((b) => (
              <Link
                key={b.id}
                to={`/venues/${b.venue?.id}`}
                className="bg-white rounded-lg shadow hover:shadow-md transition p-4 flex flex-col"
              >
                <img
                  src={b.venue?.media?.[0]?.url ?? defaultBanner}
                  alt={b.venue?.name ?? ""}
                  className="w-full h-40 object-cover rounded mb-2"
                />
                <h4 className="font-semibold">{b.venue?.name}</h4>
                <p className="text-gray-500 text-sm">
                  {new Date(b.dateFrom).toLocaleDateString()} -{" "}
                  {new Date(b.dateTo).toLocaleDateString()}
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
