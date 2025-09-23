import { useState, useEffect, useRef, type ChangeEvent, type KeyboardEvent } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE } from "../constants/apiEndpoints";

interface Venue {
  id?: string;
  _id?: string;
  name: string;
  media?: { url: string }[];
}

interface SearchBarProps {
  onSearch?: (query: string) => void; 
}

const SearchBar = ({ onSearch }: SearchBarProps) => {
  const [value, setValue] = useState("");
  const [results, setResults] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const resultsRef = useRef<HTMLUListElement>(null);
  const navigate = useNavigate();

  // Debounced search effect
  useEffect(() => {
    if (!value) {
      setResults([]);
      setHighlightedIndex(-1);
      onSearch?.("");
      return;
    }

    const timeout = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE}/holidaze/venues/search?q=${encodeURIComponent(value)}`);
        if (!res.ok) throw new Error("Failed to fetch venues");

        const json = await res.json();
        const venues: Venue[] = json.data ?? [];
        setResults(venues);
        setHighlightedIndex(-1);
        onSearch?.(value); 
      } catch (err) {
        console.error(err);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => clearTimeout(timeout);
  }, [value, onSearch]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => setValue(e.target.value);

  const handleSelect = (venue: Venue) => {
    setValue("");
    setResults([]);
    navigate(`/venues/${venue.id ?? venue._id}`);
    onSearch?.(""); 
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
      setHighlightedIndex(-1);
    }
  };

  const clearInput = () => {
    setValue("");
    setResults([]);
    setHighlightedIndex(-1);
    onSearch?.("");
  };

  return (
    <div className="w-full relative">
      <input
        type="text"
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder="Search venues..."
        aria-autocomplete="list"
        aria-controls="search-results"
        aria-activedescendant={highlightedIndex >= 0 ? `search-result-${highlightedIndex}` : undefined}
        className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-600"
      />

      {/* Clear button */}
      {value && (
        <button
          type="button"
          onClick={clearInput}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-green-600"
          aria-label="Clear search"
        >
          ✕
        </button>
      )}

      {/* Loading */}
      {loading && <p className="mt-2 text-gray-500">Loading...</p>}

      {/* Results */}
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
                  index === highlightedIndex ? "bg-green-600 text-white" : "hover:bg-gray-100"
                }`}
              >
                <img
                  src={venue.media?.[0]?.url ?? "/default-venue.png"}
                  alt={venue.name}
                  className="w-12 h-12 object-cover rounded"
                />
                <span className="font-semibold text-gray-900">{venue.name}</span>
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
