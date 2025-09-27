import { Link } from "react-router-dom";
import { FaLinkedin, FaGithub } from "react-icons/fa";

/**
 * Footer component for the website.
 * Displays site info, navigation links, support links, and social media.
 */
const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-8 px-4 md:px-12 mt-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        <div>
          <h3 className="font-semibold text-lg mb-3">About Holidaze</h3>
          <p className="text-gray-400 text-sm">
            Holidaze helps travelers find and book amazing venues around the
            world.
          </p>
        </div>

        <nav aria-label="Quick links">
          <h3 className="font-semibold text-lg mb-3">Quick Links</h3>
          <ul className="space-y-2 text-gray-400 text-sm">
            {[
              { label: "Home", to: "/" },
              { label: "Venues", to: "/venues" },
              { label: "My Bookings", to: "/my-bookings" },
              { label: "My Venues", to: "/my-venues" },
            ].map(({ label, to }) => (
              <li key={to}>
                <Link to={to} className="hover:text-white transition">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Support links">
          <h3 className="font-semibold text-lg mb-3">Support</h3>
          <ul className="space-y-2 text-gray-400 text-sm">
            {[
              { label: "Contact Us", to: "/contact" },
              { label: "FAQ", to: "/faq" },
              { label: "Privacy Policy", to: "/privacy" },
            ].map(({ label, to }) => (
              <li key={to}>
                <Link to={to} className="hover:text-white transition">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h3 className="font-semibold text-lg mb-3">Follow Us</h3>
          <div className="flex space-x-6">
            <a
              href="https://www.linkedin.com/in/noor-irfan-03b2202a2/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn profile"
              className="text-gray-400 hover:text-blue-500 transition"
            >
              <FaLinkedin size={24} />
            </a>
            <a
              href="https://github.com/Noor807"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub profile"
              className="text-gray-400 hover:text-gray-200 transition"
            >
              <FaGithub size={24} />
            </a>
          </div>
        </div>
      </div>

      <div className="mt-8 border-t border-gray-700 pt-4 text-center text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} Holidaze. Made by Noor Irfan.
      </div>
    </footer>
  );
};

export default Footer;
