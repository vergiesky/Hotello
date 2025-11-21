// src/main.jsx
import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";

import Login from "./pages/auth/Login.jsx";
import Register from "./pages/auth/Register.jsx";

import CustomerDashboard from "./pages/customer/CustomerDashboard.jsx";
import Wishlist from "./pages/customer/Wishlist.jsx";

import CustomerRoute from "./routes/CustomerRoute.jsx";
import AdminRoute from "./routes/AdminRoute.jsx";

function AdminDashboard() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
    </div>
  );
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        {/* AUTH */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* CUSTOMER - DASHBOARD (masih pakai proteksi) */}
        <Route
          path="/dashboard"
          element={
            <CustomerRoute>
              <CustomerDashboard />
            </CustomerRoute>
          }
        />

        {/* CUSTOMER - WISHLIST (TANPA CustomerRoute DULU) */}
        <Route path="/wishlist" element={<Wishlist />} />

        {/* ADMIN */}
        <Route
          path="/admin/dashboard"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />

        {/* DEFAULT */}
        <Route path="*" element={<Login />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
