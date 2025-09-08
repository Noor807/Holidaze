// src/components/profileForm.tsx
import { useState } from "react";
import { updateUserProfile, type Media, type UserProfileUpdate } from "../api/profiles";
import { toast } from "react-toastify";

interface ProfileFormProps {
  userName: string;
  token: string;
  initialBio?: string;
  initialAvatar?: Media;
  initialBanner?: Media;
  onUpdate: (updatedProfile: UserProfileUpdate) => void;
  onClose: () => void;
}

const ProfileForm = ({
  userName,
  token,
  initialBio,
  initialAvatar,
  initialBanner,
  onUpdate,
  onClose,
}: ProfileFormProps) => {
  const [bio, setBio] = useState(initialBio || "");
  const [avatar, setAvatar] = useState<Media | undefined>(initialAvatar);
  const [banner, setBanner] = useState<Media | undefined>(initialBanner);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData: UserProfileUpdate = {
      bio: bio || undefined,
      avatar: avatar || undefined,
      banner: banner || undefined,
    };

    try {
      setLoading(true);
      const updatedProfile = await updateUserProfile(userName, token, formData);

      // Map null to undefined for TypeScript safety
      onUpdate({
        bio: updatedProfile.bio ?? undefined,
        avatar: updatedProfile.avatar ?? undefined,
        banner: updatedProfile.banner ?? undefined,
      });

      toast.success("Profile updated!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Bio */}
      <div>
        <label className="block mb-1 font-medium">Bio</label>
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          className="w-full px-3 py-2 border rounded"
          rows={4}
        />
      </div>

      {/* Avatar URL */}
      <div>
        <label className="block mb-1 font-medium">Avatar URL</label>
        <input
          type="text"
          value={avatar?.url || ""}
          onChange={(e) => setAvatar({ url: e.target.value })}
          placeholder="Paste avatar image URL"
          className="w-full px-3 py-2 border rounded"
        />
        {avatar?.url && (
          <img
            src={avatar.url}
            alt="Avatar preview"
            className="w-20 h-20 rounded-full mt-2 object-cover"
          />
        )}
      </div>

      {/* Banner URL */}
      <div>
        <label className="block mb-1 font-medium">Banner URL</label>
        <input
          type="text"
          value={banner?.url || ""}
          onChange={(e) => setBanner({ url: e.target.value })}
          placeholder="Paste banner image URL"
          className="w-full px-3 py-2 border rounded"
        />
        {banner?.url && (
          <img
            src={banner.url}
            alt="Banner preview"
            className="w-full h-32 mt-2 object-cover rounded"
          />
        )}
      </div>

      {/* Buttons */}
      <div className="flex justify-end gap-2 mt-4">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 border rounded hover:bg-gray-100"
          disabled={loading}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? "Saving..." : "Save"}
        </button>
      </div>
    </form>
  );
};

export default ProfileForm;
