import { useEffect, useState, useCallback } from "react";
import { getMyVenues } from "../../api/venues";
import type { Venue } from "../../types/venue";
import { useAuth } from "../../context/authContext";
import { toast } from "react-toastify";
import { useNavigate, useLocation } from "react-router-dom";
import DeleteVenueButton from "../../components/deleteVenueModal";
import VenueCardSkeleton from "../../components/venueCardSkeleton";

const MyVenuesPage: React.FC = () => {
  const { user } = useAuth();
  const token = user?.accessToken;
  const navigate = useNavigate();
  const location = useLocation();
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loadingVenues, setLoadingVenues] = useState<boolean>(true);

  const defaultImage = "https://via.placeholder.com/300?text=No+Image";

  // Handle updated venue from Create/Edit page
  useEffect(() => {
    const updatedVenue = (location.state as { updatedVenue?: Venue })?.updatedVenue;
    if (updatedVenue) {
      setVenues((prev) => {
        const exists = prev.find((v) => v.id === updatedVenue.id);
        return exists
          ? prev.map((v) => (v.id === updatedVenue.id ? updatedVenue : v))
          : [updatedVenue, ...prev];
      });
      navigate("/my-venues", { replace: true });
    }
  }, [location.state, navigate]);

  // Fetch venues
  const fetchVenues = useCallback(async () => {
    if (!token || !user) return;
    setLoadingVenues(true);
    try {
      const data = await getMyVenues(user.name, token);
      setVenues(data);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to fetch venues";
      toast.error(message);
    } finally {
      setLoadingVenues(false);
    }
  }, [token, user]);

  useEffect(() => {
    fetchVenues();
  }, [fetchVenues]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Venues</h1>
        <button
          onClick={() => navigate("/my-venues/new")}
          className="px-4 py-2  font-semibold border-2 bg-white text-gray-600 rounded hover:bg-gray-300 transition"
        >
          + Venue
        </button>
      </div>

      {/* Loading Skeletons */}
      {loadingVenues ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, idx) => (
            <VenueCardSkeleton key={idx} />
          ))}
        </div>
      ) : venues.length === 0 ? (
        <div className="text-center mt-10">You have no venues yet.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {venues.map((venue) => {
            const imageUrl = venue.media?.[0]?.url || defaultImage;
            const imageAlt = venue.media?.[0]?.alt || venue.name || "Venue";

            return (
              <div
                key={venue.id}
                className="bg-white rounded shadow-md overflow-hidden flex flex-col"
              >
                {/* Image */}
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

                {/* Content */}
                <div className="p-4 flex flex-col flex-1 gap-2">
                  <h2 className="text-xl font-semibold mb-1">{venue.name}</h2>
                  <p className="text-gray-600 mb-2 line-clamp-3">
                    {venue.description}
                  </p>
                  <p className="font-bold mb-2">
                    ${venue.price.toLocaleString()} / night
                  </p>

                  {/* Footer buttons matching skeleton */}
                  <div className="flex justify-end gap-2 p-2 border-t mt-auto">
                    <button
                      onClick={() => navigate(`/my-venues/${venue.id}/edit`)}
                      className="h-9 w-18 px-3 py-1 bg-green-600
                       text-white border-1 text-sm font-semibold rounded hover:bg-green-400 transition"
                    >
                      Edit
                    </button>
                    <DeleteVenueButton
                      id={venue.id}
                      onDeleted={() =>
                        setVenues((prev) => prev.filter((v) => v.id !== venue.id))
                      }
                      className="h-6 w-16 bg-gray-300 text-white text-sm rounded hover:bg-gray-600 transition"
                    />
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
