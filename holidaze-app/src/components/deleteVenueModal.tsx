import { useState, useCallback } from "react";
import { deleteVenue } from "../api/venues";
import { useAuth } from "../context/authContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

interface Props {
  id: string;
  redirectAfterDelete?: boolean; 
  onDeleted?: () => void; 
  className?: string;       
}

const DeleteVenueButton: React.FC<Props> = ({
  id,
  redirectAfterDelete = false,
  onDeleted,
  className = "",
}) => {
  const { user } = useAuth();
  const token = user?.accessToken;
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // --- Delete handler ---
  const handleDelete = useCallback(async () => {
    if (!token) {
      toast.error("Please log in to delete venues.");
      return;
    }

    try {
      setLoading(true);
      await deleteVenue(id, token);
      toast.success("Venue deleted successfully!");
      setOpen(false);

      if (redirectAfterDelete) {
        navigate("/venues");
      } else {
        onDeleted?.();
      }
    } catch (err: any) {
      toast.error(err?.message || "Failed to delete venue");
    } finally {
      setLoading(false);
    }
  }, [id, token, redirectAfterDelete, navigate, onDeleted]);

  return (
    <>
      {/* Delete button */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`px-3 py-1 h-9 w-18 font-semibold bg-gray-400 text-white rounded hover:bg-red-500 transition ${className}`}
      >
        Delete
      </button>

      {/* Confirmation Modal */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-venue-title"
          aria-describedby="delete-venue-desc"
        >
          <div className="bg-black/70 p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h2 id="delete-venue-title" className="text-lg text-gray-300 font-semibold mb-3">
              Delete Venue
            </h2>
            <p id="delete-venue-desc" className="text-gray-300 mb-6">
              Are you sure you want to delete this venue? This action cannot be undone.
            </p>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition"
              >
                No
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={loading}
                className="px-4 py-2 bg-red-400 text-black rounded hover:bg-gray-600 transition disabled:opacity-50"
              >
                {loading ? "Deleting..." : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DeleteVenueButton;
