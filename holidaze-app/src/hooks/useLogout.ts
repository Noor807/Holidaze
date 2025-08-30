import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";

const useLogout = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();               // Clear auth
    navigate("/login");     // Redirect to login page
  };

  return handleLogout;
};

export default useLogout;
