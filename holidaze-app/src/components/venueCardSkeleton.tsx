// src/components/VenueCardSkeleton.tsx
const VenueCardSkeleton = () => (
    <div className="rounded-lg bg-gray-100 shadow animate-pulse flex flex-col">
      <div className="w-full h-48 bg-gray-300" />
      <div className="p-4 flex-1 flex flex-col gap-2">
        <div className="h-6 bg-gray-300 rounded w-3/4"></div>
        <div className="h-4 bg-gray-300 rounded w-1/2"></div>
        <div className="h-4 bg-gray-300 rounded w-full"></div>
        <div className="h-4 bg-gray-300 rounded w-5/6"></div>
      </div>
      <div className="flex justify-end gap-2 p-2 border-t bg-gray-100">
        <div className="h-6 w-16 bg-gray-300 rounded"></div>
        <div className="h-6 w-16 bg-gray-300 rounded"></div>
      </div>
    </div>
  );
  
  export default VenueCardSkeleton;
  