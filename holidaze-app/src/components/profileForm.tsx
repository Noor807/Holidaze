// src/components/profileForm.tsx
import { useState, type FormEvent } from "react";
import { toast } from "react-toastify";
import { updateUserProfile, type UserProfileUpdate, type ProfileResponse } from "../api/profiles";

interface Media { url: string }

interface ProfileFormProps {
  userName: string;
  token: string;
  initialBio?: string;
  initialAvatar?: Media;
  initialBanner?: Media;
  onUpdate: (updatedProfile: ProfileResponse) => void;
  onClose?: () => void;
}

const ProfileForm = ({
  userName,
  token,
  initialBio = "",
  initialAvatar,
  initialBanner,
  onUpdate,
  onClose,
}: ProfileFormProps) => {
  const [bio, setBio] = useState(initialBio);
  const [avatarUrl, setAvatarUrl] = useState(initialAvatar?.url || "");
  const [bannerUrl, setBannerUrl] = useState(initialBanner?.url || "");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const updateData: UserProfileUpdate = {
        bio,
        avatar: avatarUrl ? { url: avatarUrl } : undefined,
        banner: bannerUrl ? { url: bannerUrl } : undefined,
      };

      const updatedProfile = await updateUserProfile(userName, token, updateData);
      onUpdate(updatedProfile);
      toast.success("Profile updated successfully!");
      if (onClose) onClose();
    } catch (err: any) {
      console.error("Profile update error:", err);
      toast.error(err.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Bio */}
      <div>
        <label className="block font-semibold mb-1">Bio</label>
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          className="w-full p-2 border rounded"
          rows={3}
        />
      </div>

      {/* Avatar URL */}
      <div>
        <label className="block font-semibold mb-1">Avatar URL</label>
        <input
          type="url"
          value={avatarUrl}
          onChange={(e) => setAvatarUrl(e.target.value)}
          placeholder="https://example.com/avatar.jpg"
          className="w-full p-2 border rounded"
        />
        {avatarUrl && (
          <img
            src={avatarUrl}
            alt="Avatar Preview"
            className="w-20 h-20 rounded-full object-cover mt-2"
          />
        )}
      </div>

      {/* Banner URL */}
      <div>
        <label className="block font-semibold mb-1">Banner URL</label>
        <input
          type="url"
          value={bannerUrl}
          onChange={(e) => setBannerUrl(e.target.value)}
          placeholder="https://example.com/banner.jpg"
          className="w-full p-2 border rounded"
        />
        {bannerUrl && (
          <img
            src={bannerUrl}
            alt="Banner Preview"
            className="w-full h-40 object-cover rounded mt-2"
          />
        )}
      </div>

      {/* Buttons */}
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
        >
          {loading ? "Updating..." : "Update Profile"}
        </button>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default ProfileForm;
