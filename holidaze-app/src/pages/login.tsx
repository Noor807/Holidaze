// src/pages/LoginPage.tsx
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { loginUser } from "../api/auth";
import { API_PROFILES } from "../constants/apiEndpoints";
import { useAuth } from "../context/authContext";

// Define type for location state
interface LocationState {
  from?: string;
  selectedDate?: string;
}

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation() as { state?: LocationState }; // ✅ Type-safe
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const user = await loginUser({ email, password });

      // Fetch avatar safely
      let avatar = "";
      try {
        const profileRes = await fetch(`${API_PROFILES}/${user.name}`, {
          headers: { Authorization: `Bearer ${user.accessToken}` },
        });
        if (profileRes.ok) {
          const profileJson = await profileRes.json();
          avatar = profileJson?.data?.avatar?.url || "";
        }
      } catch (err) {
        console.warn("Could not fetch avatar", err);
      }

      // Store user in context
      login({
        accessToken: user.accessToken,
        name: user.name,
        email: user.email,
        avatar,
        venueManager: user.venueManager,
        id: user.id,
      });

      toast.success(`Welcome back, ${user.name}!`);

      // Redirect to previous page (if any) or home
      const redirectTo = location.state?.from || "/";
      navigate(redirectTo, {
        state: { selectedDate: location.state?.selectedDate || undefined },
        replace: true,
      });
    } catch (err: any) {
      setError(err.message || "Login failed");
      toast.error(err.message || "Login failed");
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
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 transition"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 transition"
          />

          <button
            type="submit"
            className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition text-lg font-semibold"
          >
            Login
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
