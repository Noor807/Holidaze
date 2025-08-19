import { useState } from "react";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Login attempt for ${email}`);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="w-full max-w-sm bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Login
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-400 transition"
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-400 transition"
            required
          />

          <button
            type="submit"
            className="w-full bg-green-500 text-white py-3 rounded hover:bg-green-600 transition font-medium text-lg"
          >
            Login
          </button>
        </form>

        <p className="text-sm mt-4 text-center text-gray-600">
          Don't have an account?{" "}
          <a href="/register" className="text-green-500 hover:underline">
            Register
          </a>
        </p>
      </div>
    </div>
  );
};
