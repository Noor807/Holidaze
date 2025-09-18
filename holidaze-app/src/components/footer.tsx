// src/components/Footer.tsx
import { Link } from "react-router-dom";
import { FaLinkedin, FaGithub } from "react-icons/fa";


const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-8 px-4 md:px-12 mt-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        {/* About Section */}
        <div>
          <h3 className="font-semibold text-lg mb-3">About Holidaze</h3>
          <p className="text-gray-400 text-sm">
            Holidaze helps travelers find and book amazing venues around the world.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="font-semibold text-lg mb-3">Quick Links</h3>
          <ul className="space-y-2 text-gray-400 text-sm">
            <li>
              <Link to="/" className="hover:text-white transition">
                Home
              </Link>
            </li>
            <li>
              <Link to="/venues" className="hover:text-white transition">
                Venues
              </Link>
            </li>
            <li>
              <Link to="/my-bookings" className="hover:text-white transition">
                My Bookings
              </Link>
            </li>
            <li>
              <Link to="/my-venues" className="hover:text-white transition">
                My Venues
              </Link>
            </li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h3 className="font-semibold text-lg mb-3">Support</h3>
          <ul className="space-y-2 text-gray-400 text-sm">
            <li>
              <Link to="/contact" className="hover:text-white transition">
                Contact Us
              </Link>
            </li>
            <li>
              <Link to="/faq" className="hover:text-white transition">
                FAQ
              </Link>
            </li>
            <li>
              <Link to="/privacy" className="hover:text-white transition">
                Privacy Policy
              </Link>
            </li>
          </ul>
        </div>

        {/* Social Media */}
        <div>
          <h3 className="font-semibold text-lg mb-3">Follow Us</h3>
          <div className="flex space-x-6">
            <a
              href="https://www.linkedin.com/in/noor-irfan-03b2202a2/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-blue-500 transition"
            >
              <FaLinkedin size={24} className="text-blue-500" />
            </a>
            <a
              href="https://github.com/Noor807"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-gray-200 transition"
            >
            <FaGithub size={24} className="text-gray-200" />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom row */}
      <div className="mt-8 border-t border-gray-700 pt-4 text-center text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} Holidaze. made by Noor Irfan.
      </div>
    </footer>
  );
};

export default Footer;
