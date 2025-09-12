// src/pages/createEditVenuepage.tsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import VenueForm from "../components/venueForm";
import { getVenueById } from "../api/venues";
import type { Venue } from "../types/venue";
import { toast } from "react-toastify";

const CreateEditVenuePage = () => {
  const { id } = useParams<{ id: string }>(); // id exists if editing
  const navigate = useNavigate();

  const [venue, setVenue] = useState<Venue | null>(null); // prefill for edit
  const [loading, setLoading] = useState(!!id); // only loading if editing

  // Fetch existing venue data if editing
  useEffect(() => {
    if (!id) return; // skip if creating

    const fetchVenue = async () => {
      setLoading(true);
      try {
        const data = await getVenueById(id);
        setVenue(data);
      } catch (err: any) {
        toast.error(err.message || "Failed to fetch venue");
      } finally {
        setLoading(false);
      }
    };

    fetchVenue();
  }, [id]);

  // Called after form submission
  const handleFormSubmit = (createdOrUpdatedVenue: Venue) => {
    toast.success(`Venue ${id ? "updated" : "created"} successfully!`);

    // Pass the updated venue data back to MyVenues page via state (optional)
    navigate("/my-venues", { state: { updatedVenue: createdOrUpdatedVenue } });
  };

  if (loading) return <p>Loading venue...</p>;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">
        {id ? "Edit Venue" : "Create Venue"}
      </h1>

      <VenueForm
        initialData={venue || undefined} // prefill for edit, empty for create
        onClose={() => navigate("/my-venues")} // cancel redirects back
        onSubmit={handleFormSubmit} // after success
      />
    </div>
  );
};

export default CreateEditVenuePage;
