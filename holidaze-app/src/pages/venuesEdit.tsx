// src/pages/editVenuePage.tsx
import { useAuth } from "../context/authContext";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import VenueForm from "../components/venueForm";
import { getVenueWithBookings, updateVenue, type Venue } from "../api/venues";
import { toast } from "react-toastify";

const EditVenuePage = () => {
  const { user } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const [venue, setVenue] = useState<Venue | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !id) return;

    const fetchVenue = async () => {
      try {
        const data = await getVenueWithBookings(id, user.accessToken);
        setVenue(data);
      } catch (err: any) {
        toast.error(`Failed to load venue: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchVenue();
  }, [user, id]);

  if (!user) return <p className="text-center mt-20">Please log in to edit a venue.</p>;
  if (loading) return <p className="text-center mt-20">Loading venue...</p>;
  if (!venue) return <p className="text-center mt-20">Venue not found.</p>;

  const handleUpdate = async (data: any) => {
    await updateVenue(venue.id, data, user.accessToken);
    navigate("/my-venues");
  };

  return (
    <div className="max-w-md mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4">Edit Venue</h2>
      <VenueForm initialData={venue} onSubmit={handleUpdate} submitLabel="Update Venue" />
    </div>
  );
};

export default EditVenuePage;
