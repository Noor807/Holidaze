import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Logo from "../assets/logo-1.png";
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
    <>
      {/* Navbar */}
      <nav className="w-full flex items-center justify-between px-4 md:px-6 py-3 bg-gray-900 shadow-md sticky top-0 z-50">
        {/* Left: Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <img src={Logo} alt="Holidaze Logo" className="h-8 w-auto" />
          <span className="text-white text-lg font-semibold hidden sm:inline">
            Holidaze
          </span>
        </Link>

        {/* Center: Desktop Search */}
        {!isHomePage && (
          <div className="hidden md:flex flex-1 justify-center px-4">
            <div className="w-full max-w-xl">
              <SearchBar />
            </div>
          </div>
        )}

        {/* Right: User & Mobile Search */}
        <div className="flex items-center space-x-2">
          {!isHomePage && (
            <div className="md:hidden">
              <button
                onClick={() => setShowSearch(true)}
                className="p-2 rounded-full bg-white hover:bg-gray-300"
              >
                <Search size={22} className="text-black" />
              </button>
            </div>
          )}

          {!user ? (
            <>
              <Link
                to="/login"
                className="px-4 py-2  text-white hover:shadow-md transition font-medium"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-4 py-2  rounded-full border  text-white hover:opacity-90 transition font-medium"
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

      {/* Mobile/Tablet Search Overlay */}
      {showSearch && (
        <div className="fixed inset-0 bg-black/30 flex items-start justify-center p-4 z-50">
          <div className="bg-white w-full max-w-md rounded-xl p-4 shadow-lg">
            <SearchBar />
            <button
              className="mt-2 text-sm text-gray-500"
              onClick={() => setShowSearch(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
