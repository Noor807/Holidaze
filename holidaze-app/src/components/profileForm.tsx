import { useState } from "react";
import {
  updateUserProfile,
  type Media,
  type UserProfileUpdate,
} from "../api/profiles";
import { toast } from "react-toastify";

/**
 * Props for the ProfileForm component.
 */
interface ProfileFormProps {
  /** The username of the profile being updated */
  userName: string;
  /** Authentication token for API requests */
  token: string;
  /** Initial biography text (optional) */
  initialBio?: string;
  /** Initial avatar image (optional) */
  initialAvatar?: Media;
  /** Initial banner image (optional) */
  initialBanner?: Media;
  /**
   * Callback fired when the profile is successfully updated.
   * @param updatedProfile - Updated profile data (bio, avatar, banner).
   */
  onUpdate: (updatedProfile: UserProfileUpdate) => void;
  /** Callback fired when the form is closed without saving */
  onClose: () => void;
}

/**
 * A form that allows users to update their profile details,
 * including bio, avatar, and banner.
 *
 * @component
 * @param {ProfileFormProps} props - Props for the ProfileForm component
 * @returns {JSX.Element} The rendered form for updating the user profile
 */
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
  const [avatar, setAvatar] = useState<Media | undefined>(initialAvatar);
  const [banner, setBanner] = useState<Media | undefined>(initialBanner);
  const [loading, setLoading] = useState(false);

  /**
   * Handles form submission to update the user's profile.
   *
   * @param e - Form submission event
   */
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

      onUpdate({
        bio: updatedProfile.bio ?? undefined,
        avatar: updatedProfile.avatar ?? undefined,
        banner: updatedProfile.banner ?? undefined,
      });

      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Bio Field */}
      <div>
        <label htmlFor="bio" className="block mb-1 font-medium">
          Bio
        </label>
        <textarea
          id="bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          className="w-full px-3 py-2 border rounded"
          rows={4}
        />
      </div>

      {/* Avatar Field */}
      <div>
        <label htmlFor="avatar" className="block mb-1 font-medium">
          Avatar URL
        </label>
        <input
          id="avatar"
          type="text"
          value={avatar?.url ?? ""}
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

      {/* Banner Field */}
      <div>
        <label htmlFor="banner" className="block mb-1 font-medium">
          Banner URL
        </label>
        <input
          id="banner"
          type="text"
          value={banner?.url ?? ""}
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
