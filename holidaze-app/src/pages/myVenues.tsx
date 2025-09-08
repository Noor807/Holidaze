// src/pages/myVenues.tsx
import { useEffect, useState } from "react";
import { getMyVenues, deleteVenue, type Venue, updateVenue, createVenue } from "../api/venues";
import { useAuth } from "../context/authContext";
import VenueCard from "../components/venueCard";
import CreateVenueModal from "../components/createVenueModal";
import { toast } from "react-toastify";

const MyVenuesPage = () => {
  const { user } = useAuth();
  const [venues, setVenues] = useState<Venue[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingVenue, setEditingVenue] = useState<Venue | null>(null);

  const fetchVenues = async () => {
    if (!user) return;
    try {
      const data = await getMyVenues(user.name, user.accessToken);
      setVenues(data);
    } catch (err: any) {
      toast.error(err.message || "Failed to fetch your venues");
    }
  };

  useEffect(() => {
    fetchVenues();
  }, [user]);

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
    if (!user) return;
    if (!window.confirm("Are you sure you want to delete this venue?")) return;

    try {
      await deleteVenue(id, user.accessToken);
      toast.success("Venue deleted successfully!");
      setVenues((prev) => prev.filter((v) => v.id !== id));
    } catch (err: any) {
      toast.error(err.message || "Failed to delete venue");
    }
  };

  const handleSubmit = async (formData: any) => {
    if (!user) return;
    try {
      if (editingVenue) {
        // Update
        const updated = await updateVenue(editingVenue.id, formData, user.accessToken);
        setVenues((prev) =>
          prev.map((v) => (v.id === editingVenue.id ? updated : v))
        );
        toast.success("Venue updated successfully!");
      } else {
        // Create
        const created = await createVenue(formData, user.accessToken);
        setVenues((prev) => [created, ...prev]);
      }
      handleCloseModal();
    } catch (err: any) {
      toast.error(err.message || "Failed to save venue");
    }
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
          // Pass editing venue data for edit functionality
          initialData={editingVenue || undefined}
          onSubmit={handleSubmit}
        />
      )}

      {venues.length === 0 ? (
        <p className="text-center text-gray-500">You have no venues yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {venues.map((venue) => (
            <div key={venue.id} className="relative">
              <VenueCard venue={venue} />
              <div className="absolute top-2 right-2 flex gap-2">
                <button
                  onClick={() => handleEdit(venue)}
                  className="px-2 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(venue.id)}
                  className="px-2 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyVenuesPage;
