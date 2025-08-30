// src/components/Header.tsx
import { useEffect, useState, type ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
  onSearch: (query: string) => void;
}

const Header = ({ onSearch }: HeaderProps) => {
  const images = [
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80",
    "https://cdn.pixabay.com/photo/2015/03/19/14/30/las-vegas-680953_1280.jpg",
    "https://cdn.pixabay.com/photo/2020/06/14/10/58/london-5297395_1280.jpg",
  ];

  const [currentImage, setCurrentImage] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    onSearch(e.target.value);
  };

  const handleShowAll = () => {
    navigate("/venues");
  };

  return (
    <header
      className="relative bg-cover bg-center h-[600px] transition-all duration-1000 ease-in-out"
      style={{ backgroundImage: `url(${images[currentImage]})` }}
    >
      {/* Center heading + search */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-4 bg-black/30">
        <h1 className="text-4xl font-bold mb-6 drop-shadow-lg">
          Where do you want to go?
        </h1>

        <input
          type="text"
          placeholder="Search venues..."
          onChange={handleSearch}
          className="w-full max-w-md px-4 py-3 bg-black/50 rounded-full shadow-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 text-white"
        />

        <button
          onClick={handleShowAll}
          className="mt-6 px-6 py-3 bg-green-500 rounded-lg hover:bg-green-600 transition font-semibold"
        >
          All Venues
        </button>
      </div>
    </header>
  );
};

export default Header;
