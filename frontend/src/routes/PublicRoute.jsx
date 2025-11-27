import { Navigate, useLocation } from "react-router-dom";

export default function PublicRoute({ children }) {
  const location = useLocation();

  // ambil token dari localStorage
  const token = localStorage.getItem("token");

  // kalau sudah login, tidak boleh ke halaman login/register
  if (token) {
    return <Navigate to="/dashboard" replace state={{ from: location }} />;
  }

  return children;
}
