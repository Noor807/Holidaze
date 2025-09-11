import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../assets/logo.png";
import { toast } from "react-toastify";
import { useAuth } from "../context/authContext";
import SearchBar from "./searchBar";

interface NavbarProps {
  onSearch?: (query: string) => void;
  onCreateVenue?: () => void; // Prop to trigger CreateVenueModal
}

const Navbar = ({ onCreateVenue }: NavbarProps) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const isHomePage = location.pathname === '/';
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
    : `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user?.name ?? "user")}`;

  return (
    <nav className="w-full flex flex-col sm:flex-row items-center justify-between px-6 py-4 bg-black/90 backdrop-blur-md shadow-md gap-4 sm:gap-0 sticky top-0 z-50">
      {/* Logo */}
      <Link to="/" className="flex items-center space-x-2">
        <img src={Logo} alt="Holidaze Logo" className="h-10 w-auto" />
        <span className="text-white text-lg font-semibold hidden sm:inline">Holidaze</span>
      </Link>

     {/* Search */}
<div className="w-full max-w-md flex-grow sm:mx-4">
  {!isHomePage && (
    <div className="w-full max-w-sm">
      <SearchBar />
    </div>
  )}
</div>


      {/* Right side */}
      <div className="relative flex items-center space-x-3 text-white">
        {!user ? (
          <>
            <Link
              to="/login"
              className="px-4 py-2 rounded-lg bg-green-500 text-white hover:bg-green-600 transition font-medium"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="px-4 py-2 rounded-lg bg-green-500 text-white hover:bg-green-600 transition font-medium"
            >
              Host
            </Link>
          </>
        ) : (
          <>
            {/* User Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen((prev) => !prev)}
                className="flex items-center space-x-2 focus:outline-none"
                aria-haspopup="true"
                aria-expanded={dropdownOpen}
              >
                <img
                  src={avatarUrl}
                  alt="Avatar"
                  className="w-10 h-10 rounded-full border-2 border-green-400 object-cover"
                />
                <span className="hidden sm:inline">{user.name}</span>
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-white text-black rounded-md shadow-lg z-50">
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

                      {/* Create Venue inside dropdown */}
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
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
