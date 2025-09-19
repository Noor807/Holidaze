// src/components/VenueForm.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Venue, VenuePayload, Media } from "../types/venue";
import { createVenue, updateVenue } from "../api/venues";
import { useAuth } from "../context/authContext";
import { toast } from "react-toastify";

interface Props {
  initialData?: Venue;
  onClose: () => void;
  onSubmit?: (venue: Venue) => void;
}

interface FormState {
  name: string;
  description: string;
  price: number;
  maxGuests: number;
  rating: number;
  media: Media[];
  meta: {
    wifi: boolean;
    parking: boolean;
    breakfast: boolean;
    pets: boolean;
  };
  location: {
    address: string;
    city: string;
    zip: string;
    country: string;
    continent: string;
    lat: number;
    lng: number;
  };
}

const VenueForm = ({ initialData, onClose, onSubmit }: Props) => {
  const { user } = useAuth();
  const token = user?.accessToken;
  const navigate = useNavigate();

  if (!token) return <p>Please login to manage venues.</p>;

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState<FormState>({
    name: initialData?.name || "",
    description: initialData?.description || "",
    price: initialData?.price ?? 0,
    maxGuests: initialData?.maxGuests ?? 0,
    rating: initialData?.rating ?? 0,
    media: initialData?.media?.length
      ? initialData.media.map((m) => ({ url: m.url, alt: m.alt || "" }))
      : [],
    meta: {
      wifi: initialData?.meta?.wifi ?? false,
      parking: initialData?.meta?.parking ?? false,
      breakfast: initialData?.meta?.breakfast ?? false,
      pets: initialData?.meta?.pets ?? false,
    },
    location: {
      address: initialData?.location?.address ?? "",
      city: initialData?.location?.city ?? "",
      zip: initialData?.location?.zip ?? "",
      country: initialData?.location?.country ?? "",
      continent: initialData?.location?.continent ?? "",
      lat: initialData?.location?.lat ?? 0,
      lng: initialData?.location?.lng ?? 0,
    },
  });

  const handleChange = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const payload: VenuePayload = {
      name: form.name,
      description: form.description,
      price: form.price,
      maxGuests: form.maxGuests,
      rating: form.rating ?? 0,
      media: form.media.length > 0 ? form.media : undefined,
      meta: {
        wifi: form.meta.wifi ?? false,
        parking: form.meta.parking ?? false,
        breakfast: form.meta.breakfast ?? false,
        pets: form.meta.pets ?? false,
      },
      location: {
        address: form.location.address || undefined,
        city: form.location.city || undefined,
        zip: form.location.zip || undefined,
        country: form.location.country || undefined,
        continent: form.location.continent || undefined,
        lat: form.location.lat ?? 0,
        lng: form.location.lng ?? 0,
      },
    };

    try {
      let venue: Venue;
      if (initialData) {
        venue = await updateVenue(initialData.id, payload, token);
        toast.success("Venue updated successfully!");
      } else {
        venue = await createVenue(payload, token);
        toast.success("Venue created successfully!");
      }
    
      onSubmit?.(venue);
      navigate(`/venues/${venue.id}`);
    } catch (err: any) {
      if (err.response?.status === 401) {
        toast.error("Unauthorized: please log in again.");
      } else if (err.response?.status === 403) {
        toast.error("Forbidden: you don’t have permission to perform this action.");
      } else {
        toast.error(err.message || "Failed to save venue");
      }
    } finally {
      setLoading(false);
    }
    
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 p-6 borderrounded shadow-md bg-gray-100 max-w-4xl mx-auto"
    >
      {/* Name & Description */}
      <input
        type="text"
        placeholder="Venue Name"
        aria-label="text input"
        value={form.name}
        onChange={(e) => handleChange("name", e.target.value)}
        required
        className="w-full bg-white p-2 border rounded"
      />
      <textarea
        placeholder="Description"
        aria-label="Description input"
        value={form.description}
        onChange={(e) => handleChange("description", e.target.value)}
        required
        className="w-full p-2 bg-white border rounded"
      />

      {/* Price, Max Guests, Rating */}
      <div className="flex flex-col sm:flex-row gap-4">
      <input
  type="number"
  placeholder="Price per night"
   aria-label="price input"
  value={form.price}
  onChange={(e) => handleChange("price", Number(e.target.value))}
  required
  className="
    w-full sm:w-1/2 md:w-1/3 lg:w-1/4
    p-1 sm:p-1 md:p-1
    text-sm sm:text-base md:text-lg
    border bg-white rounded-lg
    focus:outline-none focus:ring-2 focus:ring-blue-500
  "
/>

        <input
          type="number"
          placeholder="Max Guests"
           aria-label="guest input"
          value={form.maxGuests}
          onChange={(e) => handleChange("maxGuests", Number(e.target.value))}
          required
          className=" w-full sm:w-1/2 md:w-1/3 lg:w-1/4
    p-1 sm:p-1 md:p-1
    text-sm sm:text-base md:text-lg
    border bg-white rounded-lg
    focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="number"
          placeholder="Rating"
           aria-label="rating input"
          value={form.rating}
          onChange={(e) => handleChange("rating", Number(e.target.value))}
          className=" w-full sm:w-1/2 md:w-1/3 lg:w-1/4
    p-1 sm:p-1 md:p-1
    text-sm sm:text-base md:text-lg
    border bg-white rounded-lg
    focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Meta checkboxes */}
      <div className="flex flex-wrap gap-4">
        <h3 className="w-full font-semibold mb-2">Amenities</h3>
        {(["wifi", "parking", "breakfast", "pets"] as const).map((key) => (
          <label key={key} className="flex items-center gap-2">
            <input
              type="checkbox"
               aria-label="amenities checkboxes"
              checked={form.meta[key]}
              onChange={(e) =>
                setForm({ ...form, meta: { ...form.meta, [key]: e.target.checked } })
              }
            />
            {key.charAt(0).toUpperCase() + key.slice(1)}
          </label>
        ))}
      </div>

      {/* Media URLs */}
      <div>
        <h3 className="font-semibold mb-2">Media</h3>
        {form.media.map((m, idx) => (
          <div
            key={idx}
            className="flex flex-col sm:flex-row gap-2 mb-2 items-stretch sm:items-center"
          >
            <input
              type="url"
              placeholder="Image URL"
               aria-label="image input"
              value={m.url}
              onChange={(e) => {
                const newMedia = [...form.media];
                newMedia[idx].url = e.target.value;
                setForm({ ...form, media: newMedia });
              }}
              className="flex-1 p-2 bg-white border rounded"
            />
            <input
              type="text"
              placeholder="Alt text"
               aria-label="image text input"
              value={m.alt}
              onChange={(e) => {
                const newMedia = [...form.media];
                newMedia[idx].alt = e.target.value;
                setForm({ ...form, media: newMedia });
              }}
              className="flex-1 p-2 bg-white border rounded"
            />
            <button
              type="button"
              onClick={() => setForm({ ...form, media: form.media.filter((_, i) => i !== idx) })}
              className="px-2 py-1 bg-red-500 text-white rounded mt-2 sm:mt-0"
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => setForm({ ...form, media: [...form.media, { url: "", alt: "" }] })}
          className="px-3 py-1 bg-green-500 text-white rounded"
        >
          + Add Image
        </button>
      </div>

      {/* Location */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {(["address", "city", "zip", "country", "continent"] as const).map((key) => (
          <input
            key={key}
            type="text"
            aria-label="location input"
            placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
            value={form.location[key]}
            onChange={(e) =>
              setForm({ ...form, location: { ...form.location, [key]: e.target.value } })
            }
            className="p-2 bg-white border rounded"
          />
        ))}
        <input
          type="number"
          placeholder="Latitude"
          aria-label="latitude input"
          value={form.location.lat}
          onChange={(e) =>
            setForm({ ...form, location: { ...form.location, lat: Number(e.target.value) } })
          }
          className="p-2 bg-white border rounded"
        />
        <input
          type="number"
          placeholder="Longitude"
          aria-label="longtitude input"
          value={form.location.lng}
          onChange={(e) =>
            setForm({ ...form, location: { ...form.location, lng: Number(e.target.value) } })
          }
          className="p-2 bg-white border rounded"
        />
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-2">
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-blue-600 transition w-full sm:w-auto"
        >
          {loading ? "Saving..." : initialData ? "Update Venue" : "Create Venue"}
        </button>
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400 transition w-full sm:w-auto"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default VenueForm;
