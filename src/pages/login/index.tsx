import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { loginUser } from "../../api/auth";
import { API_PROFILES } from "../../constants/apiEndpoints";
import { useAuth } from "../../context/authContext";
import { getAuthHeaders } from "../../api/api";

/** Type for location state passed via react-router */
interface LocationState {
  from?: string;
  selectedDate?: string;
}

/** Type for avatar response in user profile */
interface ProfileResponse {
  data?: {
    avatar?: {
      url?: string;
      alt?: string;
    };
  };
}

/**
 * LoginPage component allows users to log in with email and password.
 *
 * - Handles API login and fetches user avatar
 * - Shows loading state with a spinner
 * - Displays error messages via toast and inline
 * - Redirects user after login based on location state
 *
 * @component
 * @returns {JSX.Element} Login page
 */
const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation() as { state?: LocationState };

  /** Email input state */
  const [email, setEmail] = useState<string>("");

  /** Password input state */
  const [password, setPassword] = useState<string>("");

  /** Error message state */
  const [error, setError] = useState<string>("");

  /** Loading state for form submission */
  const [loading, setLoading] = useState<boolean>(false);

  /**
   * Handles form submission for login.
   * Calls API to authenticate, fetches avatar if available, updates auth context, and redirects user.
   *
   * @param {React.FormEvent} e - Form submission event
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Attempt login
      const user = await loginUser({ email, password });

      // Fetch avatar
      try {
        const profileRes = await fetch(`${API_PROFILES}/${user.name}`, {
          headers: getAuthHeaders(user.accessToken),
        });

        if (profileRes.ok) {
          const profileJson = (await profileRes.json()) as ProfileResponse;
          const avatarUrl = profileJson?.data?.avatar?.url;
          if (avatarUrl) {
            user.avatar = { url: avatarUrl, alt: "Avatar" };
          }
        }
      } catch (err) {
        console.warn("Could not fetch avatar", err);
      }

      // Save login state
      login(user);
      toast.success(`Welcome back, ${user.name}!`);

      // Redirect after login
      const redirectTo = location.state?.from || "/";
      navigate(redirectTo, {
        state: { selectedDate: location.state?.selectedDate || undefined },
        replace: true,
      });
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Login failed";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-r from-green-200 to-blue-200 px-4 py-8 flex justify-center items-center">
      <div className="w-full max-w-md">
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-lg rounded-xl p-6 sm:p-8 md:p-10 flex flex-col space-y-4"
        >
          <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
            Login
          </h2>

          {error && <p className="text-red-500 text-center">{error}</p>}

          <input
            type="email"
            placeholder="Email"
            aria-label="email input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 transition"
            disabled={loading}
          />

          <input
            type="password"
            placeholder="Password"
            aria-label="password input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 transition"
            disabled={loading}
          />

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition text-lg font-semibold flex justify-center items-center ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {loading && (
              <svg
                className="animate-spin h-5 w-5 mr-2 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                ></path>
              </svg>
            )}
            {loading ? "Logging in..." : "Login"}
          </button>

          <p className="text-sm text-center mt-4 text-gray-600">
            Don’t have an account?{" "}
            <a href="/register" className="text-green-500 hover:underline">
              Register
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
