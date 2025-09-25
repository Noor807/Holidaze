import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Venue, VenuePayload, Media } from "../types/venue";
import { createVenue, updateVenue } from "../api/venues";
import { useAuth } from "../context/authContext";
import { toast } from "react-toastify";

interface Props {
  initialData?: Venue;
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

const VenueForm = ({ initialData, onSubmit }: Props) => {
  const { user } = useAuth();
  const token = user?.accessToken;
  const navigate = useNavigate();

  if (!token) return <p className="text-red-500">Please login to manage venues.</p>;

  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<FormState>({
    name: initialData?.name ?? "",
    description: initialData?.description ?? "",
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
      rating: form.rating,
      media: form.media.length > 0 ? form.media : undefined,
      meta: { ...form.meta },
      location: {
        ...form.location,
        address: form.location.address || undefined,
        city: form.location.city || undefined,
        zip: form.location.zip || undefined,
        country: form.location.country || undefined,
        continent: form.location.continent || undefined,
      },
    };

    try {
      const venue = initialData
        ? await updateVenue(initialData.id, payload, token)
        : await createVenue(payload, token);

      toast.success(initialData ? "Venue updated successfully!" : "Venue created successfully!");
      onSubmit?.(venue);
      navigate(`/venues/${venue.id}`);
    } catch (err: any) {
      const msg =
        err.response?.status === 401
          ? "Unauthorized: please log in again."
          : err.response?.status === 403
          ? "Forbidden: you don’t have permission to perform this action."
          : err.message || "Failed to save venue";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative max-w-4xl mx-auto p-4 sm:p-6 bg-white rounded shadow-md">

      {/* Header with back button always on left */}
      <div className="relative mb-6 ">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="absolute left-0 top-1/9 -translate-y-1/2 py-1 text-gray-700 rounded hover:text-red-500 transition"
        >
          ←Back
        </button>

        <h1 className="text-2xl text-gray-600 font-bold text-center">
          {initialData ? "Edit Venue" : "New Venue"}
        </h1>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Name */}
        <input
          type="text"
          placeholder="Venue Name"
          aria-label="Venue name"
          value={form.name}
          onChange={(e) => handleChange("name", e.target.value)}
          required
          className="w-full text-gray-500 bg-white p-2 border border-gray-400 rounded"
        />

        {/* Description */}
        <textarea
          placeholder="Description"
          aria-label="Venue description"
          value={form.description}
          onChange={(e) => handleChange("description", e.target.value)}
          required
          rows={4}
          className="w-full text-gray-500 p-2 bg-white border border-gray-400 rounded"
        />

        {/* Price, Max Guests, Rating */}
        <div className="flex flex-col sm:flex-row gap-4">
          {[
            { key: "price", label: "Price per night", required: true },
            { key: "maxGuests", label: "Max Guests", required: true },
            { key: "rating", label: "Rating", required: false },
          ].map(({ key, label, required }) => (
            <input
              key={key}
              type="number"
              placeholder={label}
              aria-label={label}
              value={form[key as keyof FormState] as number}
              onChange={(e) => handleChange(key as keyof FormState, Number(e.target.value))}
              required={required}
              className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 p-2 text-sm border border-gray-400 bg-white rounded-lg 
                         focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          ))}
        </div>

        {/* Amenities */}
        <div className="flex flex-wrap gap-4">
          <h3 className="w-full text-gray-600 font-semibold mb-2">Amenities</h3>
          {(Object.keys(form.meta) as (keyof typeof form.meta)[]).map((key) => (
            <label key={key} className="flex text-gray-600 items-center gap-2">
              <input
                type="checkbox"
                checked={form.meta[key]}
                onChange={(e) =>
                  setForm({ ...form, meta: { ...form.meta, [key]: e.target.checked } })
                }
              />
              {key.charAt(0).toUpperCase() + key.slice(1)}
            </label>
          ))}
        </div>

        {/* Media */}
        <div>
          <h3 className="font-semibold text-gray-600 mb-2">Media</h3>
          {form.media.map((m, idx) => (
            <div key={idx} className="flex flex-col sm:flex-row gap-2 mb-2 items-stretch sm:items-center">
              <input
                type="url"
                placeholder="Image URL"
                aria-label={`Image URL ${idx + 1}`}
                value={m.url}
                onChange={(e) => {
                  const newMedia = [...form.media];
                  newMedia[idx].url = e.target.value;
                  setForm({ ...form, media: newMedia });
                }}
                className="flex-1 text-gray-500 p-2 bg-white border border-gray-400 rounded"
              />
              <input
                type="text"
                placeholder="Alt text"
                aria-label={`Alt text ${idx + 1}`}
                value={m.alt}
                onChange={(e) => {
                  const newMedia = [...form.media];
                  newMedia[idx].alt = e.target.value;
                  setForm({ ...form, media: newMedia });
                }}
                className="flex-1 p-2 text-gray-500 bg-white border border-gray-400 rounded"
              />
              <button
                type="button"
                onClick={() =>
                  setForm({ ...form, media: form.media.filter((_, i) => i !== idx) })
                }
                className="px-2 py-1 bg-red-500 text-white rounded"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => setForm({ ...form, media: [...form.media, { url: "", alt: "" }] })}
            className="px-3 font-semibold py-1 bg-green-500 text-white rounded"
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
              placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
              aria-label={key}
              value={form.location[key]}
              onChange={(e) =>
                setForm({ ...form, location: { ...form.location, [key]: e.target.value } })
              }
              className="p-2 text-gray-500 bg-white border border-gray-400 rounded"
            />
          ))}
          <input
            type="number"
            placeholder="Latitude"
            aria-label="Latitude"
            value={form.location.lat}
            onChange={(e) =>
              setForm({ ...form, location: { ...form.location, lat: Number(e.target.value) } })
            }
            className="p-2 text-gray-500 bg-white border border-gray-400 rounded"
          />
          <input
            type="number"
            placeholder="Longitude"
            aria-label="Longitude"
            value={form.location.lng}
            onChange={(e) =>
              setForm({ ...form, location: { ...form.location, lng: Number(e.target.value) } })
            }
            className="p-2 text-gray-500 bg-white border border-gray-400 rounded"
          />
        </div>

        {/* Submit */}
        <div className="flex flex-col sm:flex-row gap-2 mt-4">
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 font-semibold bg-green-500 text-white rounded hover:bg-green-600 transition w-full sm:w-auto"
          >
            {loading ? "Saving..." : initialData ? "Update Venue" : "Create Venue"}
          </button>
        </div>

      </form>
    </div>
  );
};

export default VenueForm;
