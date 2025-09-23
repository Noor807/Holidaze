// src/pages/register.tsx
import { useState } from "react";
import { registerUser } from "../../api/auth";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const RegisterPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [bio, setBio] = useState("");
  const [avatar, setAvatar] = useState("");
  const [banner, setBanner] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent, isVenueManager: boolean) => {
    e.preventDefault();
    setError("");

    // Email validation
    if (!email.endsWith("@stud.noroff.no")) {
      setError("Email must be a @stud.noroff.no address");
      return;
    }

    // Password validation
    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    // Warn if password lacks special character
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      toast.warn("Consider adding special characters (!@#$ etc.) to your password");
    }

    // URL validation
    if (avatar && !isValidUrl(avatar)) {
      setError("Invalid Avatar URL");
      return;
    }
    if (banner && !isValidUrl(banner)) {
      setError("Invalid Banner URL");
      return;
    }

    try {
      // 1️⃣ Register user
      await registerUser({
        name,
        email,
        password,
        venueManager: isVenueManager,
        bio: bio || undefined,
        avatar: avatar || undefined,
        banner: banner || undefined,
      });

      // 2️⃣ Success toast
      toast.success("Registration successful! Please log in.");

      // 3️⃣ Redirect to login page
      navigate("/login");
    } catch (err: any) {
      console.error("Registration failed:", err.response || err.message);
      setError(err.message || "Registration failed");
    }
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-r from-green-200 to-blue-200 px-4 py-8 flex justify-center">
      <div className="w-full max-w-md">
        <form className="bg-white shadow-lg rounded-xl p-6 sm:p-8 md:p-10">
          <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
            Create Account
          </h2>

          {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

          <input
            type="text"
            placeholder="Full Name"
            aria-label="name input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full mb-4 p-3 border border-gray-300 rounded-lg"
            required
          />

          <input
            type="email"
            placeholder="Email (@stud.noroff.no)"
            aria-label="email input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full mb-4 p-3 border border-gray-300 rounded-lg"
            required
          />

          <input
            type="password"
            placeholder="Password (min 8 chars)"
            aria-label="password input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full mb-4 p-3 border border-gray-300 rounded-lg"
            required
          />

          <textarea
            placeholder="Tell us about yourself..."
            aria-label="bio input"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full mb-4 p-3 border border-gray-300 rounded-lg"
            rows={3}
          />

          <input
            type="url"
            placeholder="Avatar image URL"
            aria-label="image input"
            value={avatar}
            onChange={(e) => setAvatar(e.target.value)}
            className="w-full mb-4 p-3 border border-gray-300 rounded-lg"
          />

          <input
            type="url"
            placeholder="Banner image URL"
            aria-label="banner input"
            value={banner}
            onChange={(e) => setBanner(e.target.value)}
            className="w-full mb-6 p-3 border border-gray-300 rounded-lg"
          />

          <div className="flex gap-4">
            <button
              type="submit"
              className="flex-1 bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition text-lg font-semibold"
              onClick={(e) => handleSubmit(e, false)}
            >
              Register as Customer
            </button>

            <button
              type="submit"
              className="flex-1 bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition text-lg font-semibold"
              onClick={(e) => handleSubmit(e, true)}
            >
              Register as Venue Manager
            </button>
          </div>

          <p className="text-sm text-center mt-4 text-gray-600">
            Already have an account?{" "}
            <a href="/login" className="text-green-500 hover:underline">
              Login
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
