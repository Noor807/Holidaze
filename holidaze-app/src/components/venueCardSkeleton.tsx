const VenueCardSkeleton = () => (
  <div
    className="rounded-lg bg-white shadow hover:shadow-lg overflow-hidden flex flex-col animate-pulse w-full max-w-80"
    role="status"
    aria-label="Loading venue card"
  >
    {/* Image placeholder */}
    <div className="w-full h-48 bg-gray-300" />

    {/* Content placeholders */}
    <div className="p-4 flex-1 flex flex-col gap-2">
      <div className="h-6 bg-gray-300 rounded w-3/4" />
      <div className="h-4 bg-gray-300 rounded w-1/2" />
      <div className="h-4 bg-gray-300 rounded w-full" />
      <div className="h-4 bg-gray-300 rounded w-5/6" />
    </div>

    {/* Footer buttons */}
    <div className="flex justify-end gap-2 p-2 border-t bg-gray-100">
      <div className="h-6 w-16 bg-gray-300 rounded" />
      <div className="h-6 w-16 bg-gray-300 rounded" />
    </div>
  </div>
);

export default VenueCardSkeleton;
