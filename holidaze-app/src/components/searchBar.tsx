import { useState, useEffect, useRef, type ChangeEvent, type KeyboardEvent } from "react";

interface Venue {
  id: string;
  name: string;
  description?: string;
}

interface SearchBarProps {
  onSelect: (venue: Venue) => void;
}

const SearchBar = ({ onSelect }: SearchBarProps) => {
  const [value, setValue] = useState("");
  const [results, setResults] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const resultsRef = useRef<HTMLUListElement>(null);

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
        const res = await fetch(`/holidaze/venues/search?q=${encodeURIComponent(value)}`);
        if (!res.ok) throw new Error("Failed to fetch venues");
        const data = await res.json();
        setResults(data);
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
    setValue(venue.name);
    setResults([]);
    onSelect(venue);
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
      <div className="relative">
        <input
          type="text"
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Search venues..."
          className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {value && (
          <button
            onClick={clearInput}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
            aria-label="Clear search"
          >
            ✕
          </button>
        )}
      </div>

      {loading && <p className="mt-2 text-gray-500">Loading...</p>}

      {results.length > 0 && (
        <ul
          ref={resultsRef}
          className="absolute w-full bg-white border rounded-lg mt-1 shadow-lg z-10 max-h-60 overflow-auto"
        >
          {results.map((venue, index) => (
            <li
              key={venue.id}
              className={`p-2 cursor-pointer ${
                index === highlightedIndex ? "bg-blue-500 text-white" : "hover:bg-gray-100"
              }`}
              onMouseEnter={() => setHighlightedIndex(index)}
              onMouseLeave={() => setHighlightedIndex(-1)}
              onMouseDown={() => handleSelect(venue)}
            >
              <p className="font-semibold">{venue.name}</p>
              {venue.description && <p className="text-sm text-gray-600">{venue.description}</p>}
            </li>
          ))}
        </ul>
      )}

      {!loading && value && results.length === 0 && (
        <p className="mt-2 text-gray-500">No venues found.</p>
      )}
    </div>
  );
};

export default SearchBar;
