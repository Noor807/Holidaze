import { useState } from "react";
import { registerUser } from "../api/auth";
import { useNavigate } from "react-router-dom";

export const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [venueManager, setVenueManager] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await registerUser({ name, email, password, venueManager });
      alert("Registration successful!");
      navigate("/login");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-green-200 to-blue-200 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-xl w-full max-w-md p-6 sm:p-8 md:p-10"
      >
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
          Create Account
        </h2>

        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full mb-4 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 transition"
          required
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-4 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 transition"
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-4 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 transition"
          required
        />

        <div className="mb-6 flex justify-around text-gray-700">
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              checked={!venueManager}
              onChange={() => setVenueManager(false)}
              className="accent-green-500"
            />
            <span>Customer</span>
          </label>

          <label className="flex items-center space-x-2">
            <input
              type="radio"
              checked={venueManager}
              onChange={() => setVenueManager(true)}
              className="accent-green-500"
            />
            <span>Venue Manager</span>
          </label>
        </div>

        <button
          type="submit"
          className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition text-lg font-semibold"
        >
          Register
        </button>

        <p className="text-sm text-center mt-4 text-gray-600">
          Already have an account?{" "}
          <a href="/login" className="text-green-500 hover:underline">
            Login
          </a>
        </p>
      </form>
    </div>
  );
};
