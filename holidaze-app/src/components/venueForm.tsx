// src/components/venueForm.tsx
import { useState } from "react";
import type { VenuePayload, Media } from "../types/venue";
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
    media: initialData?.media || [
      { url: "", alt: "Venue image 1" },
      { url: "", alt: "Venue image 2" },
      { url: "", alt: "Venue image 3" },
    ],
    price: initialData?.price || 0,
    maxGuests: initialData?.maxGuests || 1,
    rating: initialData?.rating || 0,
    meta: initialData?.meta || {
      wifi: false,
      parking: false,
      breakfast: false,
      pets: false,
    },
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

  // Generic field updater
  const handleChange = (field: keyof VenuePayload, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Meta (checkboxes)
  const handleMetaChange = (key: keyof NonNullable<VenuePayload["meta"]>, value: boolean) => {
    setFormData(prev => ({
      ...prev,
      meta: {
        ...prev.meta,
        [key]: value,
      },
    }));
  };

  // Location fields
  const handleLocationChange = (key: keyof NonNullable<VenuePayload["location"]>, value: any) => {
    setFormData(prev => ({
      ...prev,
      location: {
        ...prev.location,
        [key]: value,
      },
    }));
  };

  // Media handling
  const handleImageChange = (index: number, value: string) => {
    const updated: Media[] = [...(formData.media || [])];
    updated[index] = { url: value, alt: formData.name || `Venue image ${index + 1}` };
    handleChange("media", updated);
  };

  const addImageField = () => {
    const currentLength = formData.media?.length ?? 0; // safely get length
    handleChange("media", [
      ...(formData.media || []),
      { url: "", alt: formData.name || `Venue image ${currentLength + 1}` },
    ]);
  };
  

  const removeImageField = (index: number) => {
    handleChange(
      "media",
      (formData.media || []).filter((_, i) => i !== index)
    );
  };

  // Form submit
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

      {/* Media (multiple images with preview) */}
      <div>
        <h3 className="font-semibold mb-2">Venue Images</h3>
        {formData.media?.map((img, index) => (
          <div key={index} className="flex items-center space-x-2 mb-2">
            <input
              type="text"
              placeholder={`Image URL ${index + 1}`}
              value={img.url}
              onChange={(e) => handleImageChange(index, e.target.value)}
              className="flex-1 px-3 py-2 border rounded"
            />
            {img.url && (
              <img
                src={img.url}
                alt={img.alt || `Venue image ${index + 1}`}
                className="w-16 h-16 object-cover rounded border"
              />
            )}
            {index > 0 && (
              <button
                type="button"
                onClick={() => removeImageField(index)}
                className="px-2 py-1 bg-red-500 text-white rounded"
              >
                ✕
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={addImageField}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          + Add Image
        </button>
      </div>

      {/* Meta */}
      <div className="flex gap-4">
        {["wifi", "parking", "breakfast", "pets"].map((metaKey) => (
          <label key={metaKey}>
            <input
              type="checkbox"
              checked={formData.meta?.[metaKey as keyof typeof formData.meta] || false}
              onChange={(e) =>
                handleMetaChange(metaKey as keyof NonNullable<VenuePayload["meta"]>, e.target.checked)
              }
            />{" "}
            {metaKey.charAt(0).toUpperCase() + metaKey.slice(1)}
          </label>
        ))}
      </div>

      {/* Location */}
      {["address", "city", "zip", "country", "continent"].map((locKey) => (
        <input
          key={locKey}
          type="text"
          placeholder={locKey.charAt(0).toUpperCase() + locKey.slice(1)}
          value={formData.location?.[locKey as keyof typeof formData.location] || ""}
          onChange={(e) =>
            handleLocationChange(locKey as keyof NonNullable<VenuePayload["location"]>, e.target.value)
          }
          className="w-full px-3 py-2 border rounded"
        />
      ))}

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
