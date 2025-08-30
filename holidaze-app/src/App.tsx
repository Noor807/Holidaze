import { useState } from "react";
import { Routes, Route } from "react-router-dom";

import Navbar from "./components/navbar";
import Header from "./components/header";

import Home from "./pages/home";
import AllVenues from "./pages/allVenues";
import DetailedVenuePage from "./pages/detailVenue";

import LoginPage from "./pages/login";      // default import
import RegisterPage from "./pages/register";
// use curly braces
 // default import

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <>
      <Navbar onSearch={setSearchTerm} />

      <Routes>
        {/* Homepage */}
        <Route
          path="/"
          element={
            <>
              <Header onSearch={setSearchTerm} />
              <main className="pt-6 max-w-7xl mx-auto px-4">
                <Home searchTerm={searchTerm} />
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

        {/* Login Page — full page style */}
        <Route path="/login" element={<LoginPage />} />

        {/* Register Page — full page style */}
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
