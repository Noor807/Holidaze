import { useState, useEffect, type ChangeEvent } from "react";

interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

const SearchBar = ({ searchTerm, onSearchChange }: SearchBarProps) => {
  const [value, setValue] = useState(searchTerm);

  useEffect(() => {
    const timeout = setTimeout(() => {
      onSearchChange(value);
    }, 400); // debounce 400ms

    return () => clearTimeout(timeout);
  }, [value, onSearchChange]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  return (
    <div className="w-full max-w-md">
      <input
        type="text"
        value={value}
        onChange={handleChange}
        placeholder="Search venues..."
        className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
};

export default SearchBar;
