import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

interface PaginationProps {
  /** Total number of pages available */
  totalPages: number;
  /** Current active page (1-based index) */
  currentPage: number;
  /** Callback invoked when the user selects a different page */
  onPageChange: (page: number) => void;
}

/**
 * Pagination component to navigate through pages.
 * - Displays previous/next buttons with proper disabled states.
 * - Shows current page out of total pages.
 * - Hides itself if there is only one page.
 */
const Pagination: React.FC<PaginationProps> = ({
  totalPages,
  currentPage,
  onPageChange,
}) => {
  if (totalPages <= 1) return null; // Hide pagination if only 1 page

  const handlePrev = () => onPageChange(Math.max(currentPage - 1, 1));
  const handleNext = () => onPageChange(Math.min(currentPage + 1, totalPages));

  return (
    <nav
      className="flex justify-center mt-6 space-x-4 items-center"
      aria-label="Pagination Navigation"
    >
      <button
        onClick={handlePrev}
        disabled={currentPage === 1}
        className={`p-2 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 ${
          currentPage === 1
            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
            : "bg-black text-white hover:bg-gray-700"
        }`}
        aria-label="Previous Page"
      >
        <FaArrowLeft />
      </button>

      <span className="px-3 py-1 rounded bg-gray-200 text-gray-700 text-sm font-medium">
        Page {currentPage} of {totalPages}
      </span>

      <button
        onClick={handleNext}
        disabled={currentPage === totalPages}
        className={`p-2 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 ${
          currentPage === totalPages
            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
            : "bg-black text-white hover:bg-gray-700"
        }`}
        aria-label="Next Page"
      >
        <FaArrowRight />
      </button>
    </nav>
  );
};

export default Pagination;
