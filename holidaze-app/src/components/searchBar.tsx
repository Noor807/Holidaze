import {
  useState,
  useEffect,
  useRef,
  type ChangeEvent,
  type KeyboardEvent,
} from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE } from "../constants/apiEndpoints";

interface Venue {
  id?: string;
  _id?: string;
  name: string;
  description?: string;
  media?: { url: string }[];
}

const SearchBar = () => {
  const [value, setValue] = useState("");
  const [results, setResults] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const resultsRef = useRef<HTMLUListElement>(null);
  const navigate = useNavigate();

  // Fetch venues with debounce
  useEffect(() => {
    if (!value) {
      setResults([]);
      setHighlightedIndex(-1);
      return;
    }

    const timeout = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `${API_BASE}/holidaze/venues/search?q=${encodeURIComponent(value)}`
        );
        if (!res.ok) throw new Error("Failed to fetch venues");

        const json = await res.json();
        const venues: Venue[] = json.data ?? [];
        setResults(venues);
        setHighlightedIndex(-1);
      } catch (err) {
        console.error(err);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => clearTimeout(timeout);
  }, [value]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) =>
    setValue(e.target.value);

  const handleSelect = (venue: Venue) => {
    setValue("");
    setResults([]);
    navigate(`/venues/${venue.id ?? venue._id}`);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (results.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev + 1) % results.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev - 1 + results.length) % results.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (highlightedIndex >= 0) handleSelect(results[highlightedIndex]);
    } else if (e.key === "Escape") {
      setResults([]);
    }
  };

  const clearInput = () => {
    setValue("");
    setResults([]);
    setHighlightedIndex(-1);
  };

  return (
    <div className="w-full max-w-md relative">
      <label htmlFor="venue-search" className="sr-only">
        Search Venues
      </label>

      <input
        id="venue-search"
        type="text"
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder="Search venues..."
        aria-autocomplete="list"
        aria-controls="search-results"
        aria-activedescendant={
          highlightedIndex >= 0 ? `search-result-${highlightedIndex}` : undefined
        }
        className="w-full px-4 py-2 border text-black rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-600 bg-white"
      />

      {/* Clear Button */}
      {value && (
        <button
          type="button"
          onClick={clearInput}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-green-600"
          aria-label="Clear search input"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={22}
            height={22}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-black"
            aria-hidden="true"
          >
            <path d="M21 21l-4.34-4.34"></path>
            <circle cx={11} cy={11} r={8}></circle>
          </svg>
        </button>
      )}

      {/* Loading */}
      {loading && <p className="mt-2 text-gray-500">Loading...</p>}

      {/* Search Results */}
      {results.length > 0 && (
        <ul
          id="search-results"
          role="listbox"
          ref={resultsRef}
          className="absolute w-full bg-white border rounded-lg mt-1 shadow-lg z-50 max-h-60 overflow-auto"
        >
          {results.map((venue, index) => (
            <li key={venue.id ?? venue._id} role="none">
              <button
                id={`search-result-${index}`}
                role="option"
                aria-selected={index === highlightedIndex}
                onMouseEnter={() => setHighlightedIndex(index)}
                onMouseLeave={() => setHighlightedIndex(-1)}
                onClick={() => handleSelect(venue)}
                className={`w-full text-left p-2 flex items-center gap-2 ${
                  index === highlightedIndex
                    ? "bg-green-600 text-white"
                    : "hover:bg-gray-100"
                }`}
              >
                <img
                  src={venue.media?.[0]?.url ?? "/default-venue.png"}
                  alt={venue.name}
                  className="w-12 h-12 object-cover rounded"
                />
                <div className="flex flex-col">
                  <p className="font-semibold text-gray-900">{venue.name}</p>
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* No results */}
      {!loading && value && results.length === 0 && (
        <p className="mt-2 text-gray-500">No venues found.</p>
      )}
    </div>
  );
};

export default SearchBar;
