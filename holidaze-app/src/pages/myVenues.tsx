import { useEffect, useState } from "react";
import { getMyVenues, deleteVenue } from "../api/venues";
import type { Venue, VenuePayload } from "../types/venue";
import { useAuth } from "../context/authContext";
import VenueCard from "../components/venueCard";
import CreateVenueModal from "../components/createVenueModal";
import { toast } from "react-toastify";

const MyVenuesPage = () => {
  const { user } = useAuth();
  const token = user?.accessToken;

  const [venues, setVenues] = useState<Venue[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingVenue, setEditingVenue] = useState<Venue | null>(null);

  const fetchVenues = async () => {
    if (!token || !user) return;
    try {
      const data = await getMyVenues(user.name, token);
      setVenues(data);
    } catch (err: any) {
      toast.error(err.message || "Failed to fetch your venues");
    }
  };

  useEffect(() => {
    fetchVenues();
  }, [user?.name, token]);

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingVenue(null);
  };

  const handleCreate = () => setShowModal(true);

  const handleEdit = (venue: Venue) => {
    setEditingVenue(venue);
    setShowModal(true);
  };

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

  const handleSubmit = (venue: Venue) => {
    if (editingVenue) {
      setVenues((prev) => prev.map((v) => (v.id === venue.id ? venue : v)));
    } else {
      setVenues((prev) => (prev.find((v) => v.id === venue.id) ? prev : [venue, ...prev]));
    }
    handleCloseModal();
  };

  if (!user) return <p className="text-center mt-6">Please log in to manage your venues.</p>;

  return (
    <div className="max-w-7xl mx-auto px-4 pt-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Venues</h1>
        <button
          onClick={handleCreate}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          + Add Venue
        </button>
      </div>

      {showModal && (
        <CreateVenueModal
          onClose={handleCloseModal}
          initialData={editingVenue || undefined}
          onSubmit={handleSubmit}
        />
      )}

      {venues.length === 0 ? (
        <p className="text-center text-gray-500">You have no venues yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {venues.map((venue) => (
            <VenueCard
              key={venue.id}
              venue={venue}
              onEdit={() => handleEdit(venue)}
              onDelete={() => handleDelete(venue.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyVenuesPage;
