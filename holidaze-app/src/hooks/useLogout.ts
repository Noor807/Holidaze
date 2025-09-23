import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";

const useLogout = (): (() => void) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = useCallback(() => {
    logout();             
    navigate("/login");   
  }, [logout, navigate]);

  return handleLogout;
};

export default useLogout;
