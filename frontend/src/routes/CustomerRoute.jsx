// src/routes/CustomerRoute.jsx

import React from "react";
import { Navigate, useLocation } from "react-router-dom";

export default function CustomerRoute({ children }) {
  const location = useLocation();

  // ambil token dari localStorage
  const token = localStorage.getItem("token");

  // kalau tidak ada token -> paksa ke login
  if (!token) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // kalau ada token -> boleh akses halaman customer (dashboard, wishlist, dll)
  return children;
}
