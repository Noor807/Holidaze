import { useState } from "react";
import type { Venue, VenuePayload, Media } from "../types/venue";
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
  if (!token) return null;

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
  const [media, setMedia] = useState<Media[]>(
    initialData?.media?.length
      ? initialData.media
      : [{ url: "", alt: "Venue image 1" }]
  );
  const [wifi, setWifi] = useState(initialData?.meta?.wifi || false);
  const [parking, setParking] = useState(initialData?.meta?.parking || false);
  const [breakfast, setBreakfast] = useState(initialData?.meta?.breakfast || false);
  const [pets, setPets] = useState(initialData?.meta?.pets || false);

  // Media handlers
  const handleMediaChange = (index: number, url: string) => {
    const updated = [...media];
    updated[index] = { url, alt: name || `Venue image ${index + 1}` };
    setMedia(updated);
  };

  const addMediaField = () => {
    setMedia(prev => [...prev, { url: "", alt: name || `Venue image ${prev.length + 1}` }]);
  };

  const removeMediaField = (index: number) => {
    setMedia(prev => prev.filter((_, i) => i !== index));
  };

  // Navigation
  const handleNext = () => {
    if (step === 1 && (!name || !description || !price || !maxGuests)) {
      toast.error("Please fill all required fields in Step 1");
      return;
    }
    if (step === 2 && (!city || !country)) {
      toast.error("Please fill all required fields in Step 2");
      return;
    }
    setStep(prev => Math.min(prev + 1, 3));
  };

  const handlePrev = () => setStep(prev => Math.max(prev - 1, 1));

  // Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate step 3: at least one image or one facility
    const hasMedia = media.some(m => m.url.trim() !== "");
    const hasFacility = wifi || parking || breakfast || pets;

    if (!hasMedia && !hasFacility) {
      toast.error("Please add at least one image or select a facility in Step 3");
      return;
    }

    const payload: VenuePayload = {
      name,
      description,
      price: Number(price),
      maxGuests: Number(maxGuests),
      rating: rating ? Number(rating) : 0,
      media: media.filter(m => m.url.trim() !== ""),
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
              <h3 className="font-semibold mb-2">Venue Images</h3>
              {media.map((img, index) => (
                <div key={index} className="flex items-center space-x-2 mb-2">
                  <input
                    type="text"
                    placeholder={`Image URL ${index + 1}`}
                    value={img.url}
                    onChange={(e) => handleMediaChange(index, e.target.value)}
                    className="flex-1 px-3 py-2 border rounded"
                  />
                  {img.url && (
                    <img
                      src={img.url}
                      alt={img.alt || `Venue image ${index + 1}`}
                      className="w-16 h-16 object-cover rounded border"
                    />
                  )}
                  {media.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeMediaField(index)}
                      className="px-2 py-1 bg-red-500 text-white rounded"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addMediaField}
                className="px-4 py-2 bg-blue-500 text-white rounded"
              >
                + Add Image
              </button>

              <div className="flex gap-4 mt-4">
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
