import { Routes, Route, Navigate } from "react-router-dom";
import { Register } from "./pages/register";
import { Login } from "./pages/login";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  );
}

export default App;
