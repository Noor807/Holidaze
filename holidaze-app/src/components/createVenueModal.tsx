import { useState } from "react";
import type { Venue, VenuePayload } from "../types/venue";
import { createVenue, updateVenue } from "../api/venues";
import { useAuth } from "../context/authContext";
import { toast } from "react-toastify";

interface Props {
  onClose: () => void;
  initialData?: Venue;
  onSubmit?: (venue: Venue) => void;
}

const CreateVenueModal = ({ onClose, initialData, onSubmit }: Props) => {
  const { user } = useAuth();
  const token = user?.accessToken;

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Step 1: Basic Info
  const [name, setName] = useState(initialData?.name || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [price, setPrice] = useState<number | "">(initialData?.price || "");
  const [maxGuests, setMaxGuests] = useState<number | "">(initialData?.maxGuests || "");
  const [rating, setRating] = useState<number | "">(initialData?.rating || "");

  // Step 2: Location
  const [city, setCity] = useState(initialData?.location?.city || "");
  const [country, setCountry] = useState(initialData?.location?.country || "");

  // Step 3: Media & Facilities
  const [mediaUrl, setMediaUrl] = useState(initialData?.media?.[0]?.url || "");
  const [wifi, setWifi] = useState(initialData?.meta?.wifi || false);
  const [parking, setParking] = useState(initialData?.meta?.parking || false);
  const [breakfast, setBreakfast] = useState(initialData?.meta?.breakfast || false);
  const [pets, setPets] = useState(initialData?.meta?.pets || false);

  if (!token) return null;

  const handleNext = () => {
    if (step === 1 && (!name || !description || !price || !maxGuests)) {
      toast.error("Please fill all required fields in Step 1");
      return;
    }
    if (step === 2 && (!city || !country)) {
      toast.error("Please fill all required fields in Step 2");
      return;
    }
    setStep((prev) => Math.min(prev + 1, 3));
  };

  const handlePrev = () => setStep((prev) => Math.max(prev - 1, 1));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Enforce Step 3 completion
    if (step < 3) {
      toast.error("Please complete all steps before submitting");
      return;
    }

    if (!mediaUrl && !wifi && !parking && !breakfast && !pets) {
      toast.error("Please fill at least one field or select a facility in Step 3");
      return;
    }

    const payload: VenuePayload = {
      name,
      description,
      price: Number(price),
      maxGuests: Number(maxGuests),
      rating: rating ? Number(rating) : 0,
      media: mediaUrl ? [{ url: mediaUrl, alt: name }] : [],
      meta: { wifi, parking, breakfast, pets },
      location: { address: "", city, country, continent: "", lat: 0, lng: 0 },
    };

    setLoading(true);
    try {
      let venue: Venue;
      if (initialData) {
        venue = await updateVenue(initialData.id, payload, token);
        toast.success("Venue updated successfully!");
      } else {
        venue = await createVenue(payload, token);
        toast.success("Venue created successfully!");
      }

      if (onSubmit) onSubmit(venue);
      onClose();
    } catch (err: any) {
      toast.error(err.message || "Failed to save venue");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-red-600 hover:text-red-500 font-extrabold text-2xl leading-none select-none"
        >
          ✕
        </button>

        <h2 className="text-2xl font-bold mb-4">
          {initialData ? "Edit Venue" : "Create New Venue"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Step 1: Basic Info */}
          {step === 1 && (
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Venue Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-3 py-2 border rounded"
              />
              <textarea
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                className="w-full px-3 py-2 border rounded"
              />
              <div className="flex gap-4">
                <input
                  type="number"
                  placeholder="Price per night"
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  required
                  className="w-full px-3 py-2 border rounded"
                />
                <input
                  type="number"
                  placeholder="Max Guests"
                  value={maxGuests}
                  onChange={(e) => setMaxGuests(Number(e.target.value))}
                  required
                  className="w-full px-3 py-2 border rounded"
                />
                <input
                  type="number"
                  placeholder="Rating"
                  value={rating}
                  min={0}
                  max={5}
                  onChange={(e) => setRating(Number(e.target.value))}
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
            </div>
          )}

          {/* Step 2: Location */}
          {step === 2 && (
            <div className="space-y-3">
              <input
                type="text"
                placeholder="City"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
                className="w-full px-3 py-2 border rounded"
              />
              <input
                type="text"
                placeholder="Country"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                required
                className="w-full px-3 py-2 border rounded"
              />
            </div>
          )}

          {/* Step 3: Media & Facilities */}
          {step === 3 && (
            <div className="space-y-3">
              <input
                type="url"
                placeholder="Media URL"
                value={mediaUrl}
                onChange={(e) => setMediaUrl(e.target.value)}
                className="w-full px-3 py-2 border rounded"
              />
              <div className="flex gap-4">
                <label>
                  <input type="checkbox" checked={wifi} onChange={() => setWifi(!wifi)} /> Wifi
                </label>
                <label>
                  <input type="checkbox" checked={parking} onChange={() => setParking(!parking)} /> Parking
                </label>
                <label>
                  <input type="checkbox" checked={breakfast} onChange={() => setBreakfast(!breakfast)} /> Breakfast
                </label>
                <label>
                  <input type="checkbox" checked={pets} onChange={() => setPets(!pets)} /> Pets
                </label>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-4">
            {step > 1 && (
              <button type="button" onClick={handlePrev} className="px-4 py-2 bg-gray-300 rounded">
                Previous
              </button>
            )}
            {step < 3 ? (
              <button type="button" onClick={handleNext} className="ml-auto px-4 py-2 bg-green-500 text-white rounded">
                Next
              </button>
            ) : (
              <button type="submit" disabled={loading} className="ml-auto px-4 py-2 bg-green-500 text-white rounded">
                {loading ? "Saving..." : initialData ? "Update Venue" : "Create Venue"}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateVenueModal;
