// src/components/venueForm.tsx
import { useState } from "react";
import type { VenuePayload } from "../api/venues";
import { toast } from "react-toastify";

interface Props {
  initialData?: VenuePayload;
  onSubmit: (data: VenuePayload) => Promise<void>;
  submitLabel?: string;
}

const VenueForm = ({ initialData, onSubmit, submitLabel = "Save" }: Props) => {
  const [formData, setFormData] = useState<VenuePayload>({
    name: initialData?.name || "",
    description: initialData?.description || "",
    media: initialData?.media || [],
    price: initialData?.price || 0,
    maxGuests: initialData?.maxGuests || 1,
    rating: initialData?.rating || 0,
    meta: initialData?.meta || { wifi: false, parking: false, breakfast: false, pets: false },
    location: initialData?.location || {
      address: "",
      city: "",
      zip: "",
      country: "",
      continent: "",
      lat: 0,
      lng: 0,
    },
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (field: keyof VenuePayload, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleMetaChange = (key: keyof NonNullable<VenuePayload["meta"]>, value: boolean) => {
    setFormData((prev) => ({
      ...prev,
      meta: { ...prev.meta, [key]: value },
    }));
  };

  const handleLocationChange = (
    key: keyof NonNullable<VenuePayload["location"]>,
    value: any
  ) => {
    setFormData((prev) => ({
      ...prev,
      location: { ...prev.location!, [key]: value },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit(formData);
      toast.success("Venue saved successfully!");
    } catch (err: any) {
      toast.error(err.message || "Failed to save venue");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Name */}
      <input
        type="text"
        placeholder="Venue Name"
        value={formData.name}
        onChange={(e) => handleChange("name", e.target.value)}
        required
        className="w-full px-3 py-2 border rounded"
      />

      {/* Description */}
      <textarea
        placeholder="Description"
        value={formData.description}
        onChange={(e) => handleChange("description", e.target.value)}
        required
        className="w-full px-3 py-2 border rounded"
      />

      {/* Price */}
      <input
        type="number"
        placeholder="Price per night"
        value={formData.price}
        onChange={(e) => handleChange("price", parseFloat(e.target.value))}
        required
        className="w-full px-3 py-2 border rounded"
      />

      {/* Max Guests */}
      <input
        type="number"
        placeholder="Max Guests"
        value={formData.maxGuests}
        onChange={(e) => handleChange("maxGuests", parseInt(e.target.value))}
        required
        className="w-full px-3 py-2 border rounded"
      />

      {/* Media URL */}
      <input
        type="text"
        placeholder="Image URL (first image will be main)"
        value={formData.media?.[0]?.url || ""}
        onChange={(e) =>
          handleChange("media", [{ url: e.target.value, alt: formData.name }])
        }
        className="w-full px-3 py-2 border rounded"
      />

      {/* Meta */}
      <div className="flex gap-4">
        <label>
          <input
            type="checkbox"
            checked={formData.meta?.wifi || false}
            onChange={(e) => handleMetaChange("wifi", e.target.checked)}
          />{" "}
          WiFi
        </label>
        <label>
          <input
            type="checkbox"
            checked={formData.meta?.parking || false}
            onChange={(e) => handleMetaChange("parking", e.target.checked)}
          />{" "}
          Parking
        </label>
        <label>
          <input
            type="checkbox"
            checked={formData.meta?.breakfast || false}
            onChange={(e) => handleMetaChange("breakfast", e.target.checked)}
          />{" "}
          Breakfast
        </label>
        <label>
          <input
            type="checkbox"
            checked={formData.meta?.pets || false}
            onChange={(e) => handleMetaChange("pets", e.target.checked)}
          />{" "}
          Pets
        </label>
      </div>

      {/* Location */}
      <input
        type="text"
        placeholder="City"
        value={formData.location?.city || ""}
        onChange={(e) => handleLocationChange("city", e.target.value)}
        className="w-full px-3 py-2 border rounded"
      />
      <input
        type="text"
        placeholder="Country"
        value={formData.location?.country || ""}
        onChange={(e) => handleLocationChange("country", e.target.value)}
        className="w-full px-3 py-2 border rounded"
      />

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
      >
        {submitLabel}
      </button>
    </form>
  );
};

export default VenueForm;
