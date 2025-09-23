import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

interface PaginationProps {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  totalPages,
  currentPage,
  onPageChange,
}) => {
  if (totalPages <= 1) return null; // hide pagination if only 1 page

  const handlePrev = () => onPageChange(Math.max(currentPage - 1, 1));
  const handleNext = () => onPageChange(Math.min(currentPage + 1, totalPages));

  return (
    <nav
      className="flex justify-center mt-6 space-x-4 items-center"
      aria-label="Pagination Navigation"
    >
      {/* Previous Button */}
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

      {/* Page Indicator */}
      <span className="px-3 py-1 rounded bg-gray-200 text-gray-700 text-sm font-medium">
        Page {currentPage} of {totalPages}
      </span>

      {/* Next Button */}
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
