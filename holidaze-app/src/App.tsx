// src/App.tsx
import { useState } from "react";
import { Routes, Route } from "react-router-dom";

import Navbar from "./components/navbar"; 
import Header from "./components/header";

import Home from "./pages/home";
import AllVenues from "./pages/allVenues";
import DetailedVenuePage from "./pages/detailVenue";

import LoginPage from "./pages/login";
import RegisterPage from "./pages/register";
import MyBookings from "./pages/myBookings";
import ProfilePage from "./pages/profilePage"; 

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Import the modal form
import CreateVenueModal from "./components/createVenueModal";

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateVenue, setShowCreateVenue] = useState(false);

  const handleCloseCreateVenue = () => setShowCreateVenue(false);

  return (
    <>
      {/* Navbar */}
      <Navbar onSearch={setSearchTerm} />

      {/* Create Venue Modal */}
      {showCreateVenue && <CreateVenueModal onClose={handleCloseCreateVenue} />}

      <Routes>
        {/* Homepage */}
        <Route
          path="/"
          element={
            <>
              <Header onSearch={setSearchTerm} />
              <main className="pt-6 max-w-7xl mx-auto px-4">
                <Home searchTerm={searchTerm} />
                <p className="text-center mt-4 text-pink-500 text-lg">
                  🌸 Welcome to Holidaze! Your cozy adventure awaits! 🌸
                </p>
              </main>
            </>
          }
        />

        {/* All Venues */}
        <Route
          path="/venues"
          element={
            <main className="pt-6 max-w-7xl mx-auto px-4">
              <AllVenues searchTerm={searchTerm} />
              <p className="text-center mt-4 text-purple-500 text-sm">
                ✨ Browse all our lovely venues! ✨
              </p>
            </main>
          }
        />

        {/* My Bookings */}
        <Route
          path="/my-bookings"
          element={
            <main className="pt-6 max-w-7xl mx-auto px-4">
              <MyBookings />
            </main>
          }
        />

        {/* Detailed Venue */}
        <Route
          path="/venues/:id"
          element={
            <main className="pt-6 max-w-7xl mx-auto px-4">
              <DetailedVenuePage />
            </main>
          }
        />

        {/* Profile Page */}
        <Route
          path="/profile"
          element={
            <main className="pt-6 max-w-7xl mx-auto px-4">
              <ProfilePage />
              <p className="text-center mt-4 text-green-400 text-sm">
                🌟 Keep your profile cute and cozy! 🌟
              </p>
            </main>
          }
        />

        {/* Login Page */}
        <Route path="/login" element={<LoginPage />} />

        {/* Register Page */}
        <Route path="/register" element={<RegisterPage />} />
      </Routes>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </>
  );
}

export default App;
