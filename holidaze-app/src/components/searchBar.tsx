import { useState, useEffect, useRef, type ChangeEvent, type KeyboardEvent } from "react";
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
        const res = await fetch(`${API_BASE}/holidaze/venues/search?q=${encodeURIComponent(value)}`);
        if (!res.ok) throw new Error("Failed to fetch venues");

        const response = await res.json();
        console.log("API search response:", response);

        // Extract venues from response.data array
        const venues: Venue[] = response.data ?? [];
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

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

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
      <div className="relative ">
        <input
          type="text"
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Search venues..."
          className="w-full px-4 py-2 border text-white rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-700 bg-black/50"
        />
        {value && (
          <button
            onClick={clearInput}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500 focus:outline-none"
            aria-label="Clear search"
          >
            ✕
          </button>
        )}
      </div>

      {loading && <p className="mt-2 text-gray-400">Loading...</p>}

      {results.length > 0 && (
        <ul
          ref={resultsRef}
          className="absolute w-full bg-white border rounded-lg mt-1 shadow-lg z-50 max-h-60 overflow-auto"
        >
          {results.map((venue, index) => (
           <li
  key={venue.id ?? venue._id}
  className={`p-2 cursor-pointer flex items-center gap-2 ${
    index === highlightedIndex ? "bg-blue-500 text-white" : "hover:bg-gray-100"
  }`}
  onMouseEnter={() => setHighlightedIndex(index)}
  onMouseLeave={() => setHighlightedIndex(-1)}
  onMouseDown={() => handleSelect(venue)}
>
  <img
    src={
      venue.media && venue.media.length > 0
        ? venue.media[0].url
        : "/default-venue.png" // <-- path to your default image
    }
    alt={venue.name}
    className="w-12 h-12 object-cover rounded"
  />
  <div className="flex flex-col">
    <p className="font-semibold">{venue.name}</p>
  </div>
</li>

          ))}
        </ul>
      )}

      {!loading && value && results.length === 0 && (
        <p className="mt-2 text-gray-400">No venues found.</p>
      )}
    </div>
  );
};

export default SearchBar;
