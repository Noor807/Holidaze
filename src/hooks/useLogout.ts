import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";

/**
 * Custom hook to log out the current user and redirect to the login page.
 *
 * @returns A callback function that logs out the user and navigates to "/login"
 */
const useLogout = (): (() => void) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = useCallback(() => {
    logout(); // Clear user state and localStorage
    navigate("/login"); // Redirect to login page
  }, [logout, navigate]);

  return handleLogout;
};

export default useLogout;
