// src/pages/myVenues.tsx
import { useEffect, useState } from "react";
import { getMyVenues, deleteVenue } from "../api/venues";
import type { Venue } from "../types/venue";
import { useAuth } from "../context/authContext";
import { toast } from "react-toastify";
import { useNavigate, useLocation } from "react-router-dom";

const MyVenuesPage = () => {
  const { user } = useAuth();
  const token = user?.accessToken;
  const navigate = useNavigate();
  const location = useLocation();
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loadingVenues, setLoadingVenues] = useState(true);

  const defaultImage = "https://via.placeholder.com/300?text=No+Image";

  // Handle updated venue from Create/Edit page
  useEffect(() => {
    const updatedVenue = (location.state as any)?.updatedVenue as Venue;
    if (updatedVenue) {
      setVenues((prev) => {
        const exists = prev.find((v) => v.id === updatedVenue.id);
        if (exists) {
          // Replace existing
          return prev.map((v) => (v.id === updatedVenue.id ? updatedVenue : v));
        } else {
          // Add new
          return [updatedVenue, ...prev];
        }
      });
      // Clean the state so it doesn't apply again on re-render
      navigate("/my-venues", { replace: true });
    }
  }, [location.state, navigate]);

  const fetchVenues = async () => {
    if (!token || !user) return;
    setLoadingVenues(true);
    try {
      const data = await getMyVenues(user.name, token);
      setVenues(data);
    } catch (err: any) {
      toast.error(err.message || "Failed to fetch venues");
    } finally {
      setLoadingVenues(false);
    }
  };

  useEffect(() => {
    fetchVenues();
  }, [user?.name, token]);

  const handleDelete = async (id: string) => {
    if (!token) return;
    if (!window.confirm("Are you sure you want to delete this venue?")) return;

    try {
      await deleteVenue(id, token);
      setVenues((prev) => prev.filter((v) => v.id !== id));
      toast.success("Venue deleted successfully!");
    } catch (err: any) {
      toast.error(err.message || "Failed to delete venue");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Venues</h1>
        <button
          onClick={() => navigate("/my-venues/new")}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        >
          + Add Venue
        </button>
      </div>

      {loadingVenues ? (
        <div className="text-center mt-10">Loading venues...</div>
      ) : venues.length === 0 ? (
        <div className="text-center mt-10">You have no venues yet.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {venues.map((venue) => {
            const imageUrl = venue.media?.[0]?.url || defaultImage;
            const imageAlt = venue.media?.[0]?.alt || venue.name || "Venue";

            return (
              <div key={venue.id} className="bg-white rounded shadow-md overflow-hidden">
                <div
                  className="relative h-48 cursor-pointer"
                  onClick={() => navigate(`/venues/${venue.id}`)}
                >
                  <img
                    src={imageUrl}
                    alt={imageAlt}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = defaultImage;
                    }}
                  />
                </div>
                <div className="p-4">
                  <h2 className="text-xl font-semibold mb-1">{venue.name}</h2>
                  <p className="text-gray-600 mb-2">{venue.description}</p>
                  <p className="font-bold mb-2">${venue.price.toLocaleString()} / night</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => navigate(`/my-venues/${venue.id}/edit`)}
                      className="px-3 py-1 bg-yellow-400 text-black rounded hover:bg-yellow-500 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(venue.id)}
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyVenuesPage;
