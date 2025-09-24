import { useState, useEffect, useRef, useCallback } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Logo from "../assets/logo-1.png";
import { toast } from "react-toastify";
import { useAuth } from "../context/authContext";
import SearchBar from "./searchBar";
import { Search } from "lucide-react";

interface NavbarProps {
  /** Optional callback for handling search queries */
  onSearch?: (query: string) => void;
}

/**
 * Navbar component displaying the logo, search bar, and user menu.
 * - Shows search differently on homepage vs other pages.
 * - Displays login/register buttons for unauthenticated users.
 * - Shows user avatar and dropdown menu for authenticated users.
 * - Mobile-friendly with a toggleable search overlay.
 */
const Navbar = ({ onSearch }: NavbarProps) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const isHomePage = location.pathname === "/";

  /** Close user dropdown if clicking outside */
  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setDropdownOpen(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [handleClickOutside]);

  /** Logs out the user and redirects to login page */
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
      <nav
        className="w-full flex items-center justify-between px-4 md:px-6 py-3 bg-gray-900 shadow-md sticky top-0 z-[999]"
        role="navigation"
      >
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <img src={Logo} alt="Holidaze Logo" className="h-8 w-auto" />
          <span className="text-white text-lg font-semibold hidden sm:inline">
          Holidaze
          </span>
        </Link>

        {/* Desktop Search */}
        {!isHomePage && (
          <div className="hidden md:flex flex-1 justify-center px-4">
            <div className="w-full max-w-xl text-white bg-black/70">
              <SearchBar onSearch={onSearch} />
            </div>
          </div>
        )}

        {/* User / Mobile Search */}
        <div className="flex items-center space-x-2">
          {!isHomePage && (
            <div className="md:hidden">
              <button
                type="button"
                onClick={() => setShowSearch(true)}
                className="p-2 rounded-full bg-white hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                aria-label="Search for venue"
              >
                <Search size={22} className="text-black" />
              </button>
            </div>
          )}

          {!user ? (
            <>
              <Link
                to="/login"
                className="px-4 py-2 text-white hover:shadow-md transition font-medium"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 rounded-full border text-white hover:opacity-90 transition font-medium"
              >
                Host
              </Link>
            </>
          ) : (
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setDropdownOpen((prev) => !prev)}
                className="flex items-center space-x-2 focus:outline-none"
                aria-haspopup="true"
                aria-expanded={dropdownOpen}
              >
                <img
                  src={avatarUrl}
                  alt={`${user.name} avatar`}
                  className="w-10 h-10 rounded-full border border-gray-300 object-cover cursor-pointer"
                />
                <span className="hidden sm:inline text-white cursor-pointer">
                  {user.name}
                </span>
              </button>

              {dropdownOpen && (
                <div
                  role="menu"
                  aria-label="User menu"
                  className="absolute right-0 mt-2 w-52 bg-white text-black rounded-xl shadow-lg border border-gray-200 z-50"
                >
                  <Link
                    to="/profile"
                    role="menuitem"
                    className="block px-4 py-2 hover:bg-gray-100"
                    onClick={() => setDropdownOpen(false)}
                  >
                    My Profile
                  </Link>

                  {user.venueManager && (
                    <>
                      <Link
                        to="/my-venues"
                        role="menuitem"
                        className="block px-4 py-2 hover:bg-gray-100"
                        onClick={() => setDropdownOpen(false)}
                      >
                        My Venues
                      </Link>
                      <Link
                        to="/my-venues/new"
                        role="menuitem"
                        className="block text-green-600 font-semibold hover:bg-green-200 px-4 py-2rounded"
                        onClick={() => setDropdownOpen(false)}
                      >
                        + Venue
                      </Link>
                    </>
                  )}

                  <Link
                    to="/my-bookings"
                    role="menuitem"
                    className="block px-4 py-2 hover:bg-gray-100"
                    onClick={() => setDropdownOpen(false)}
                  >
                    My Bookings
                  </Link>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-500"
                    role="menuitem"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </nav>

      {/* Mobile Search Overlay */}
      {showSearch && (
        <div className="fixed inset-0 bg-black/50 z-[1000] flex justify-center items-start">
          <div className="w-full bg-black/70 text-white rounded-none shadow-lg p-4 pt-6 max-w-md">
            <SearchBar onSearch={onSearch} />
            <button
              type="button"
              className="mt-2 text-sm text-white"
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
