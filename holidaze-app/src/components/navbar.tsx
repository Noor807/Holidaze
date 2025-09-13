import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Logo from "../assets/logo.png";
import { toast } from "react-toastify";
import { useAuth } from "../context/authContext";
import SearchBar from "./searchBar";
import { Search } from "lucide-react";

interface NavbarProps {
  onSearch?: (query: string) => void;
  onCreateVenue?: () => void;
}

const Navbar = ({ onCreateVenue }: NavbarProps) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const isHomePage = location.pathname === "/";

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully!");
    navigate("/login");
  };

  const avatarUrl = user?.avatar?.url
    ? `${user.avatar.url}?t=${Date.now()}`
    : `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
        user?.name ?? "user"
      )}`;

  return (
    <nav className="w-full flex items-center justify-between px-6 py-4 bg-black/90 shadow-md sticky top-0 z-50">
      {/* Left: Logo */}
      <Link to="/" className="flex items-center space-x-2">
        <img src={Logo} alt="Holidaze Logo" className="h-8 w-auto" />
        <span className="text-white text-lg font-semibold hidden sm:inline">
          Holidaze
        </span>
      </Link>

      {/* Middle: SearchBar */}
      {!isHomePage && (
        <div className="flex-grow flex justify-center">
          {/* Desktop/Large screens */}
          <div className="hidden md:block w-full max-w-md text-white">
            <SearchBar />
          </div>

          {/* Mobile/Tablet: Search Icon */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setShowSearch((prev) => !prev)}
              className="p-2 rounded-full bg-white hover:bg-gray-300"
            >
              <Search size={22} className="text-black" />
            </button>

            {showSearch && (
              <div className="absolute top-12 left-0 w-full px-4 sm:px-6">
                <div className="bg-white p-3 rounded-xl shadow-lg border border-gray-200">
                  <SearchBar />
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Right: User actions */}
      <div className="relative flex items-center space-x-3">
        {!user ? (
          <>
            <Link
              to="/login"
              className="px-4 py-2 rounded-full border border-gray-300 text-black hover:shadow-md transition font-medium"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="px-4 py-2 rounded-full bg-gradient-to-r from-pink-500 to-red-500 text-white hover:opacity-90 transition font-medium"
            >
              Host
            </Link>
          </>
        ) : (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen((prev) => !prev)}
              className="flex items-center space-x-2 focus:outline-none"
            >
              <img
                src={avatarUrl}
                alt="Avatar"
                className="w-10 h-10 rounded-full border border-gray-300 object-cover"
              />
              <span className="hidden sm:inline text-white">{user.name}</span>
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-52 bg-white text-black rounded-xl shadow-lg border border-gray-200 z-50">
                <Link
                  to={`/profile`}
                  className="block px-4 py-2 hover:bg-gray-100"
                  onClick={() => setDropdownOpen(false)}
                >
                  My Profile
                </Link>

                {user.venueManager && (
                  <>
                    <Link
                      to={`/my-venues`}
                      className="block px-4 py-2 hover:bg-gray-100"
                      onClick={() => setDropdownOpen(false)}
                    >
                      My Venues
                    </Link>
                    {onCreateVenue && (
                      <button
                        onClick={() => {
                          onCreateVenue();
                          setDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-gray-100 text-blue-600"
                      >
                        Create Venue
                      </button>
                    )}
                  </>
                )}

                <Link
                  to={`/my-bookings`}
                  className="block px-4 py-2 hover:bg-gray-100"
                  onClick={() => setDropdownOpen(false)}
                >
                  My Bookings
                </Link>

                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-500"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
