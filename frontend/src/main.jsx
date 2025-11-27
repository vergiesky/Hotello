// src/main.jsx
import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import "./index.css";

import AppRouter from "./routes/index.jsx";

function AdminDashboard() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
    </div>
  );
}


createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AppRouter />
  </StrictMode>
);
