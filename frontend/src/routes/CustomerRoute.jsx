// src/routes/CustomerRoute.jsx

import { Navigate, useLocation } from "react-router-dom";

export default function CustomerRoute({ children }) {
  const location = useLocation();

  // ambil token dari localStorage
  const token = localStorage.getItem("token");

  // kalau tidak ada token -> paksa ke login
  if (!token) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // // cek role
  // if (role !== "customer") {
  //   return <Navigate to="/login" replace />;
  // }

  // kalau ada token -> boleh akses halaman customer (dashboard, wishlist, dll)
  return children;
}
