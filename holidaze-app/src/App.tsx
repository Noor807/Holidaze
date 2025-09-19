import { useState } from "react";
import { Routes, Route } from "react-router-dom";

import Navbar from "./components/navbar"; 
import Header from "./components/header";
import Footer from "./components/footer"; 

import Home from "./pages/home";
import AllVenues from "./pages/allVenues";
import DetailedVenuePage from "./pages/detailVenue";

import LoginPage from "./pages/login";
import RegisterPage from "./pages/register";
import MyBookings from "./pages/myBookings";
import ProfilePage from "./pages/profilePage"; 

import MyVenuesPage from "./pages/myVenues";
import CreateEditVenuePage from "./pages/createEditVenuepage"; 

import ContactPage from "./pages/contactPage";
import PrivacyPolicyPage from "./pages/privacyPolicy";


import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [searchTerm, setSearchTerm] = useState("");

  // Wrapper components to safely pass searchTerm
  const HomeWrapper = ({ searchTerm }: { searchTerm: string }) => {
    return <Home {...({ searchTerm } as any)} />;
  };

  const AllVenuesWrapper = ({ searchTerm }: { searchTerm: string }) => {
    return <AllVenues {...({ searchTerm } as any)} />;
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <Navbar onSearch={setSearchTerm} />

      {/* Page content */}
      <div className="flex-grow">
        <Routes>
          {/* Homepage */}
          <Route
            path="/"
            element={
              <div>
                <Header />
                <main className="pt-6 max-w-7xl mx-auto px-4">
                  <HomeWrapper searchTerm={searchTerm} />
                </main>
              </div>
            }
          />

          {/* All Venues */}
          <Route
            path="/venues"
            element={
              <main className="pt-6 max-w-7xl mx-auto px-4">
                <AllVenuesWrapper searchTerm={searchTerm} />
              </main>
            }
          />

          {/* Contact Page */}
          <Route
            path="/contact"
            element={
              <main className="pt-6 max-w-7xl mx-auto px-4">
                <ContactPage />
              </main>
            }
          />
          <Route
  path="/privacy"
  element={
    <main className="pt-6 max-w-7xl mx-auto px-4">
      <PrivacyPolicyPage />
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

          {/* My Venues */}
          <Route
            path="/my-venues"
            element={
              <main className="pt-6 max-w-7xl mx-auto px-4">
                <MyVenuesPage />
              </main>
            }
          />

          {/* Create Venue */}
          <Route
            path="/my-venues/new"
            element={
              <main className="pt-6 max-w-7xl mx-auto px-4">
                <CreateEditVenuePage />
              </main>
            }
          />

          {/* Edit Venue */}
          <Route
            path="/my-venues/:id/edit"
            element={
              <main className="pt-6 max-w-7xl mx-auto px-4">
                <CreateEditVenuePage />
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
              </main>
            }
          />

          {/* Login & Register */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Routes>
      </div>

      {/* Footer */}
      <Footer />

      {/* Toasts */}
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
    </div>
  );
}

export default App;
