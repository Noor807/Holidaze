import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import VenueForm from "../../components/venueForm";
import { getVenueById } from "../../api/venues";
import type { Venue } from "../../types/venue";
import { toast } from "react-toastify";

const CreateEditVenuePage = () => {
  const { id } = useParams<{ id: string }>(); 
  const navigate = useNavigate();

  const [venue, setVenue] = useState<Venue | null>(null); 
  const [loading, setLoading] = useState(!!id); 

  
  useEffect(() => {
    if (!id) return; 

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

  
  const handleFormSubmit = (createdOrUpdatedVenue: Venue) => {
    
    navigate("/my-venues", { state: { updatedVenue: createdOrUpdatedVenue } });
  };
  

  if (loading) return <p>Loading venue...</p>;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">
        {id ? "Edit Venue" : "Create Venue"}
      </h1>

      <VenueForm
        initialData={venue || undefined} 
        onClose={() => navigate("/my-venues")} 
        onSubmit={handleFormSubmit} 
       
      />
    </div>
  );
};

export default CreateEditVenuePage;
