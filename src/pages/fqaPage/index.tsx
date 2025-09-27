import { useState, useCallback, useMemo } from "react";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";

/**
 * Interface representing a single FAQ item.
 */
interface FaqItem {
  /** The FAQ question */
  question: string;
  /** The FAQ answer */
  answer: string;
}

/**
 * Static FAQ data array
 */
const faqData: FaqItem[] = [
  {
    question: "How do I book a venue?",
    answer:
      "Simply browse venues, select your preferred dates, and complete your booking online.",
  },
  {
    question: "Can I cancel a booking?",
    answer:
      "Yes, you can cancel before the venue's cancellation deadline. Check the venue’s cancellation policy for details.",
  },
  {
    question: "How do I become a venue host?",
    answer:
      "Register as a user, then go to 'My Venues' and click 'Create Venue' to start listing your property.",
  },
  {
    question: "Is my payment secure?",
    answer:
      "Absolutely. We use industry-standard encryption and secure payment gateways for all transactions.",
  },
  {
    question: "Can I modify my profile?",
    answer:
      "Yes, you can edit your profile info, update your avatar, or banner anytime from the profile page.",
  },
];

/**
 * FaqPage component renders a searchable FAQ accordion.
 * Users can expand/collapse questions and filter them via the search bar.
 */
const FaqPage: React.FC = () => {
  /** Index of the currently open FAQ item (null if none open) */
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  /** Current value of the search input for filtering FAQ items */
  const [searchTerm, setSearchTerm] = useState<string>("");

  /**
   * Toggle the expansion of a FAQ item.
   * If the clicked item is already open, close it; otherwise, open it.
   * @param index - Index of the clicked FAQ item
   */
  const toggleIndex = useCallback((index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  }, []);

  /**
   * Filter the FAQ items based on the search term.
   * Matches against question or answer (case-insensitive).
   */
  const filteredFaq = useMemo(
    () =>
      faqData.filter(
        (item) =>
          item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.answer.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [searchTerm]
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 bg-gradient-to-r from-green-100 to-blue-100">
      <h1 className="text-4xl font-bold text-center mb-6 text-gray-800">
        Frequently Asked Questions
      </h1>

      {/* Search Bar */}
      <div className="mb-8 flex justify-center">
        <input
          type="text"
          placeholder="Search FAQs..."
          aria-label="search bar"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:w-2/3 px-4 py-3 bg-white border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* FAQ Accordion */}
      <div className="space-y-4">
        {filteredFaq.length === 0 ? (
          <p className="text-center text-gray-500">
            No matching questions found.
          </p>
        ) : (
          filteredFaq.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden"
            >
              <button
                onClick={() => toggleIndex(index)}
                className="w-full flex justify-between items-center px-6 py-4 focus:outline-none"
              >
                <span className="text-lg font-medium text-gray-700">
                  {item.question}
                </span>
                {openIndex === index ? (
                  <ChevronUpIcon className="w-5 h-5 text-gray-500" />
                ) : (
                  <ChevronDownIcon className="w-5 h-5 text-gray-500" />
                )}
              </button>

              <div
                className={`px-6 pb-4 text-gray-600 text-sm transition-all duration-300 ${
                  openIndex === index
                    ? "max-h-96 opacity-100"
                    : "max-h-0 opacity-0"
                }`}
              >
                <p>{item.answer}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default FaqPage;
