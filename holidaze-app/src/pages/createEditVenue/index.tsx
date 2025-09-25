import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import VenueForm from "../../components/createVenueForm";
import { getVenueById } from "../../api/venues";
import type { Venue } from "../../types/venue";
import { toast } from "react-toastify";

/**
 * Page for creating a new venue or editing an existing venue.
 * If an `id` param exists, the page fetches the existing venue for editing.
 */
const CreateEditVenuePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [venue, setVenue] = useState<Venue | null>(null);
  const [loading, setLoading] = useState<boolean>(!!id);

  /**
   * Fetches the venue data if editing an existing venue.
   */
  useEffect(() => {
    if (!id) return;

    const fetchVenue = async () => {
      setLoading(true);
      try {
        const data: Venue = await getVenueById(id);
        setVenue(data);
      } catch (err: any) {
        toast.error(err?.message ?? "Failed to fetch venue");
      } finally {
        setLoading(false);
      }
    };

    fetchVenue();
  }, [id]);

  /**
   * Handles successful form submission.
   * Navigates back to "/my-venues" and passes the created/updated venue via state.
   * @param createdOrUpdatedVenue - Venue returned from the form submission
   */
  const handleFormSubmit = useCallback(
    (createdOrUpdatedVenue: Venue) => {
      navigate("/my-venues", {
        state: { updatedVenue: createdOrUpdatedVenue },
      });
    },
    [navigate]
  );

  if (loading) return <p>Loading venue...</p>;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <VenueForm initialData={venue || undefined} onSubmit={handleFormSubmit} />
    </div>
  );
};

export default CreateEditVenuePage;
