// src/components/CreateVenueModal.tsx
import { useState } from "react";
import { createVenue } from "../api/venues";
import { useAuth } from "../context/authContext";
import { toast } from "react-toastify";

interface Props {
  onClose: () => void;
}

const CreateVenueModal = ({ onClose }: Props) => {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Step 1: Basic Info
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<number | "">("");
  const [maxGuests, setMaxGuests] = useState<number | "">("");
  const [rating, setRating] = useState<number | "">("");

  // Step 2: Location
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");

  // Step 3: Facilities & Media
  const [mediaUrl, setMediaUrl] = useState("");
  const [wifi, setWifi] = useState(false);
  const [parking, setParking] = useState(false);
  const [breakfast, setBreakfast] = useState(false);
  const [pets, setPets] = useState(false);

  if (!user) return null;

  // Step Circle Component
  const StepCircle = ({ num }: { num: number }) => (
    <div
      className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-white z-10 ${
        step >= num ? "bg-green-500" : "bg-gray-400"
      }`}
    >
      {num}
    </div>
  );

  const handleNext = () => {
    // Validate current step
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
    // Ensure at least one facility is selected
    if (!wifi && !parking && !breakfast && !pets) {
      toast.error("Please select at least one facility");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        name,
        description,
        price: Number(price),
        maxGuests: Number(maxGuests),
        rating: rating ? Number(rating) : 0,
        media: mediaUrl ? [{ url: mediaUrl, alt: name }] : [],
        meta: { wifi, parking, breakfast, pets },
        location: {
          address: "",
          city,
          country,
          continent: "",
          lat: 0,
          lng: 0,
        },
      };
      await createVenue(payload, user.accessToken);
      toast.success("Venue created successfully!");
      onClose();
    } catch (err: any) {
      toast.error(err.message || "Failed to create venue");
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
  aria-label="Close modal"
>
  ✕
</button>

        <h2 className="text-2xl font-bold mb-4">Create New Venue</h2>

        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-4 mb-6 relative">
          {/* Gray background line */}
          <div className="absolute top-4 left-8 right-8 h-1 bg-gray-300 z-0 rounded"></div>
          {/* Progress line */}
          <div
            className="absolute top-4 h-1 bg-green-500 z-10 rounded transition-all duration-300"
            style={{
              width: step === 1 ? "0%" : step === 2 ? "50%" : "100%",
              left: "8px",
            }}
          ></div>
          <StepCircle num={1} />
          <StepCircle num={2} />
          <StepCircle num={3} />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Step 1 */}
          {step === 1 && (
            <div className="space-y-3">
              <div>
                <label className="block font-medium">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border p-2 rounded"
                />
              </div>
              <div>
                <label className="block font-medium">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full border p-2 rounded"
                />
              </div>
              <div className="flex space-x-4">
                <div>
                  <label className="block font-medium">Price</label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full border p-2 rounded"
                  />
                </div>
                <div>
                  <label className="block font-medium">Max Guests</label>
                  <input
                    type="number"
                    value={maxGuests}
                    onChange={(e) => setMaxGuests(Number(e.target.value))}
                    className="w-full border p-2 rounded"
                  />
                </div>
                <div>
                  <label className="block font-medium">Rating</label>
                  <input
                    type="number"
                    value={rating}
                    onChange={(e) => setRating(Number(e.target.value))}
                    min={0}
                    max={5}
                    className="w-full border p-2 rounded"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <div className="space-y-3">
              <div>
                <label className="block font-medium">City</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full border p-2 rounded"
                />
              </div>
              <div>
                <label className="block font-medium">Country</label>
                <input
                  type="text"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full border p-2 rounded"
                />
              </div>
            </div>
          )}

          {/* Step 3 */}
          {step === 3 && (
            <div className="space-y-3">
              <div>
                <label className="block font-medium">Media URL</label>
                <input
                  type="url"
                  value={mediaUrl}
                  onChange={(e) => setMediaUrl(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="w-full border p-2 rounded"
                />
              </div>
              <div className="flex space-x-4">
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
                {loading ? "Creating..." : "Create Venue"}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateVenueModal;
