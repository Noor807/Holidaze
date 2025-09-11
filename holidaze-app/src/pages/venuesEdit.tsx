import { useState } from "react";
import type { Venue, VenuePayload, Media } from "../types/venue";
import { updateVenue } from "../api/venues";
import { useAuth } from "../context/authContext";
import { toast } from "react-toastify";

interface Props {
  onClose: () => void;
  initialData: Venue;
  onSubmit?: (venue: Venue) => void;
}

interface MediaWithId extends Media {
  id: string;
}

const EditVenueModal = ({ onClose, initialData, onSubmit }: Props) => {
  const { user } = useAuth();
  const token = user?.accessToken;
  if (!token) return null;

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Step 1: store numbers as strings
  const [name, setName] = useState(initialData.name);
  const [description, setDescription] = useState(initialData.description);
  const [price, setPrice] = useState(initialData.price.toString());
  const [maxGuests, setMaxGuests] = useState(initialData.maxGuests.toString());
  const [rating, setRating] = useState((initialData.rating || 0).toString());

  // Step 2
  const [city, setCity] = useState(initialData.location?.city || "");
  const [country, setCountry] = useState(initialData.location?.country || "");

  // Step 3: media with stable ids
  const [media, setMedia] = useState<MediaWithId[]>(
    initialData.media.length
      ? initialData.media.map((m, i) => ({
          ...m,
          url: m.url || "",
          alt: m.alt || `Venue image ${i + 1}`,
          id: `${i}_${Date.now()}`,
        }))
      : [{ url: "", alt: "Venue image 1", id: `0_${Date.now()}` }]
  );

  const [wifi, setWifi] = useState(initialData.meta?.wifi || false);
  const [parking, setParking] = useState(initialData.meta?.parking || false);
  const [breakfast, setBreakfast] = useState(initialData.meta?.breakfast || false);
  const [pets, setPets] = useState(initialData.meta?.pets || false);

  // Media handlers
  const handleMediaChange = (id: string, url: string) => {
    setMedia(prev => prev.map(m => (m.id === id ? { ...m, url } : m)));
  };

  const addMediaField = () =>
    setMedia(prev => [
      ...prev,
      { url: "", alt: `Venue image ${prev.length + 1}`, id: `${prev.length}_${Date.now()}` },
    ]);

  const removeMediaField = (id: string) => setMedia(prev => prev.filter(m => m.id !== id));

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
  const handleSubmit = async () => {
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
      rating: Number(rating) || 0,
      media: media.filter(m => m.url.trim() !== ""),
      meta: { wifi, parking, breakfast, pets },
      location: { address: "", city, country, continent: "", lat: 0, lng: 0 },
    };

    setLoading(true);
    try {
      const updatedVenue = await updateVenue(initialData.id, payload, token);
      toast.success("Venue updated successfully!");
      if (onSubmit) onSubmit(updatedVenue);
      onClose();
    } catch (err: any) {
      toast.error(err.message || "Failed to update venue");
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

        <h2 className="text-2xl font-bold mb-4">Edit Venue</h2>

        {/* Step 1 */}
        {step === 1 && (
          <form
            onSubmit={e => {
              e.preventDefault();
              handleNext();
            }}
            className="space-y-3"
          >
            <input
              type="text"
              placeholder="Venue Name"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full px-3 py-2 border rounded"
            />
            <textarea
              placeholder="Description"
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full px-3 py-2 border rounded"
            />
            <div className="flex gap-4">
              <input
                type="number"
                placeholder="Price per night"
                value={price}
                onChange={e => setPrice(e.target.value)}
                className="w-full px-3 py-2 border rounded"
              />
              <input
                type="number"
                placeholder="Max Guests"
                value={maxGuests}
                onChange={e => setMaxGuests(e.target.value)}
                className="w-full px-3 py-2 border rounded"
              />
              <input
                type="number"
                placeholder="Rating"
                value={rating}
                min={0}
                max={5}
                onChange={e => setRating(e.target.value)}
                className="w-full px-3 py-2 border rounded"
              />
            </div>
            <div className="flex justify-end mt-4">
              <button type="submit" className="px-4 py-2 bg-green-500 text-white rounded">
                Next
              </button>
            </div>
          </form>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <form
            onSubmit={e => {
              e.preventDefault();
              handleNext();
            }}
            className="space-y-3"
          >
            <input
              type="text"
              placeholder="City"
              value={city}
              onChange={e => setCity(e.target.value)}
              className="w-full px-3 py-2 border rounded"
            />
            <input
              type="text"
              placeholder="Country"
              value={country}
              onChange={e => setCountry(e.target.value)}
              className="w-full px-3 py-2 border rounded"
            />
            <div className="flex justify-between mt-4">
              <button type="button" onClick={handlePrev} className="px-4 py-2 bg-gray-300 rounded">
                Previous
              </button>
              <button type="submit" className="px-4 py-2 bg-green-500 text-white rounded">
                Next
              </button>
            </div>
          </form>
        )}

        {/* Step 3 */}
        {step === 3 && (
          <form
            onSubmit={e => {
              e.preventDefault();
              handleSubmit();
            }}
            className="space-y-3"
          >
            <h3 className="font-semibold mb-2">Venue Images</h3>
            {media.map(img => (
              <div key={img.id} className="flex items-center space-x-2 mb-2">
                <input
                  type="text"
                  placeholder={`Image URL`}
                  value={img.url}
                  onChange={e => handleMediaChange(img.id, e.target.value)}
                  className="flex-1 px-3 py-2 border rounded"
                />
                {img.url && <img src={img.url} alt={img.alt} className="w-16 h-16 object-cover rounded border" />}
                {media.length > 1 && (
                  <button type="button" onClick={() => removeMediaField(img.id)} className="px-2 py-1 bg-red-500 text-white rounded">
                    ✕
                  </button>
                )}
              </div>
            ))}
            <button type="button" onClick={addMediaField} className="px-4 py-2 bg-blue-500 text-white rounded">
              + Add Image
            </button>

            <div className="flex gap-4 mt-4">
              <label><input type="checkbox" checked={wifi} onChange={() => setWifi(!wifi)} /> Wifi</label>
              <label><input type="checkbox" checked={parking} onChange={() => setParking(!parking)} /> Parking</label>
              <label><input type="checkbox" checked={breakfast} onChange={() => setBreakfast(!breakfast)} /> Breakfast</label>
              <label><input type="checkbox" checked={pets} onChange={() => setPets(!pets)} /> Pets</label>
            </div>

            <div className="flex justify-between mt-4">
              <button type="button" onClick={handlePrev} className="px-4 py-2 bg-gray-300 rounded">
                Previous
              </button>
              <button type="submit" disabled={loading} className="px-4 py-2 bg-green-500 text-white rounded">
                {loading ? "Saving..." : "Update Venue"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default EditVenueModal;
