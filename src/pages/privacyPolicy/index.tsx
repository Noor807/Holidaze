/**
 * PrivacyPolicyPage component displays the privacy policy of Holidaze.
 *
 * Features:
 * - Sections for information collection, usage, cookies, data security, third-party services, user rights, and policy updates
 * - Automatically displays the current year in the footer
 *
 * @component
 * @returns {JSX.Element} Privacy Policy Page
 */
const PrivacyPolicyPage: React.FC = () => {
  /** Current year for copyright footer */
  const currentYear = new Date().getFullYear();

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 bg-gradient-to-r from-green-100 to-blue-100">
      <h1 className="text-3xl font-bold mb-6 text-center">Privacy Policy</h1>

      <p className="mb-4 text-gray-700">
        At <strong>Holidaze</strong>, we are committed to protecting your
        privacy. This Privacy Policy explains how we collect, use, and safeguard
        your personal information when you use our website and services.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-3">
        1. Information We Collect
      </h2>
      <p className="mb-4 text-gray-700">
        We may collect personal information such as your name, email address,
        phone number, and payment details when you make bookings or register on
        our platform. We also collect non-personal information like browser type
        and usage data.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-3">
        2. How We Use Your Information
      </h2>
      <p className="mb-4 text-gray-700">
        Your information is used to process bookings, provide customer support,
        improve our website, send important updates, and personalize your
        experience. We do not sell or rent your information to third parties.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-3">
        3. Cookies and Tracking
      </h2>
      <p className="mb-4 text-gray-700">
        Holidaze uses cookies and similar technologies to enhance your browsing
        experience, track usage, and deliver personalized content. You can
        manage cookies through your browser settings.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-3">4. Data Security</h2>
      <p className="mb-4 text-gray-700">
        We implement appropriate technical and organizational measures to
        protect your data against unauthorized access, alteration, or
        disclosure. However, no online transmission can be 100% secure.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-3">
        5. Third-Party Services
      </h2>
      <p className="mb-4 text-gray-700">
        Some services used on Holidaze may involve third-party providers (e.g.,
        payment processors, analytics). These providers adhere to their own
        privacy policies and we encourage you to review them.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-3">6. Your Rights</h2>
      <p className="mb-4 text-gray-700">
        You have the right to access, update, or delete your personal
        information. You can contact us anytime to manage your data.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-3">
        7. Changes to This Policy
      </h2>
      <p className="mb-4 text-gray-700">
        We may update this Privacy Policy periodically. Any changes will be
        posted on this page with the effective date.
      </p>

      <p className="mt-8 text-gray-600 text-sm text-center">
        &copy; {currentYear} Holidaze. Find and book amazing venues
      </p>
    </div>
  );
};

export default PrivacyPolicyPage;
