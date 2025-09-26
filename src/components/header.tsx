import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SearchBar from "./searchBar";

/** Array of rotating header background images */
const images = [
  "https://media.cntraveller.com/photos/611befdb69410e829d87e766/16:9/w_3200,h_1800,c_limit/rome.jpg",
  "https://cdn.pixabay.com/photo/2015/03/19/14/30/las-vegas-680953_1280.jpg",
  "https://cdn.pixabay.com/photo/2020/06/14/10/58/london-5297395_1280.jpg",
];

/**
 * Header component displaying a rotating background image, search bar, and CTA button.
 * Rotates images every 5 seconds and provides navigation to the "All Venues" page.
 */
const Header: React.FC = () => {
  const [currentImage, setCurrentImage] = useState(0);
  const navigate = useNavigate();

  // Rotate header images every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  /** Navigate to the "All Venues" page */
  const handleShowAll = () => navigate("/venues");

  return (
    <header
      className="relative bg-cover bg-center h-[450px] transition-all duration-1000 ease-in-out"
      style={{ backgroundImage: `url(${images[currentImage]})` }}
      role="banner"
    >
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 bg-black/40">
        <h1 className="text-4xl font-bold mb-6 drop-shadow-lg text-white">
          Where do you want to go?
        </h1>

        {/* Search bar */}
        <div className="w-full text-white max-w-md bg-black/30">
          <SearchBar />
        </div>

        {/* Call-to-action */}
        <button
          onClick={handleShowAll}
          className="mt-6 px-6 py-3 bg-green-600 rounded-lg hover:bg-green-500 transition font-semibold text-white focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2"
        >
          All Venues
        </button>
      </div>
    </header>
  );
};

export default Header;
