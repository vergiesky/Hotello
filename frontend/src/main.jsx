// src/main.jsx
import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./index.css";

import Login from "./pages/auth/Login.jsx";
import Register from "./pages/auth/Register.jsx";

import CustomerDashboard from "./pages/customer/CustomerDashboard.jsx";
import Wishlist from "./pages/customer/Wishlist.jsx";
import Profile from "./pages/customer/Profile.jsx";  
import Settings from "./pages/customer/Settings.jsx";
import About from "./pages/customer/About.jsx";
import HotelDetail from "./pages/customer/HotelDetail.jsx";
import Reservation from "./pages/customer/Reservation.jsx";
import HotelCreate from "./pages/admin/hotel/HotelCreate.jsx";
import HotelEdit from "./pages/admin/hotel/HotelEdit.jsx";
import Hotel from "./pages/admin/hotel/Hotel.jsx";
import FasilitasHotel from "./pages/admin/fasilitas-hotel/FasilitasHotel.jsx";
import FasilitasHotelCreate from "./pages/admin/fasilitas-hotel/FasilitasHotelCreate.jsx";
import FasilitasHotelEdit from "./pages/admin/fasilitas-hotel/FasilitasHotelEdit.jsx";
import IconList from "./pages/admin/icon/IconList.jsx";
import IconCreate from "./pages/admin/icon/IconCreate.jsx";
import IconEdit from "./pages/admin/icon/IconEdit.jsx";
import GambarHotelList from "./pages/admin/gambar-hotel/GambarHotelList.jsx";
import GambarHotelCreate from "./pages/admin/gambar-hotel/GambarHotelCreate.jsx";
import GambarHotelEdit from "./pages/admin/gambar-hotel/GambarHotelEdit.jsx";
import KamarList from "./pages/admin/kamar/KamarList.jsx";
import KamarCreate from "./pages/admin/kamar/KamarCreate.jsx";
import KamarEdit from "./pages/admin/kamar/KamarEdit.jsx";
import FasilitasKamar from "./pages/admin/fasilitas-kamar/FasilitasKamar.jsx";
import FasilitasKamarCreate from "./pages/admin/fasilitas-kamar/FasilitasKamarCreate.jsx";
import FasilitasKamarEdit from "./pages/admin/fasilitas-kamar/FasilitasKamarEdit.jsx";
import GambarKamarList from "./pages/admin/gambar-kamar/GambarKamarList.jsx";
import GambarKamarCreate from "./pages/admin/gambar-kamar/GambarKamarCreate.jsx";
import GambarKamarEdit from "./pages/admin/gambar-kamar/GambarKamarEdit.jsx";

import CustomerRoute from "./routes/CustomerRoute.jsx";
import AdminRoute from "./routes/AdminRoute.jsx";

import { ToastProvider } from "./lib/Toast.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Home */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* AUTH */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Customer dashboard */}
        <Route
          path="/dashboard"
          element={<CustomerDashboard />}
        />

        {/* Customer profil */}
        <Route
          path="/profile"
          element={
            <CustomerRoute>
              <Profile />
            </CustomerRoute>
          }
        />

        {/* Customer wishlist */}
        <Route
          path="/wishlist"
          element={
            <CustomerRoute>
              <Wishlist />
            </CustomerRoute>
          }
        />

        {/* Customer settings */}
        <Route
          path="/settings"
          element={
            <CustomerRoute>
              <Settings />
            </CustomerRoute>
          }
        />

        {/* Detail hotel (publik) */}
        <Route path="/hotel/:id" element={<HotelDetail />} />

        {/* Customer reservasi */}
        <Route
          path="/reservation/:hotelId"
          element={
            <CustomerRoute>
              <Reservation />
            </CustomerRoute>
          }
        />

         <Route
          path="/about"
          element={<About />}
        />

        {/* ADMIN */}
        <Route
          path="/admin/dashboard"
          element={
            <AdminRoute>
              <Hotel />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/hotels/create"
          element={
            <AdminRoute>
              <HotelCreate />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/hotels/edit/:id"
          element={
            <AdminRoute>
              <HotelEdit />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/fasilitas-hotel"
          element={
            <AdminRoute>
              <FasilitasHotel />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/gambar-hotel"
          element={
            <AdminRoute>
              <GambarHotelList />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/gambar-hotel/create"
          element={
            <AdminRoute>
              <GambarHotelCreate />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/gambar-hotel/edit/:id"
          element={
            <AdminRoute>
              <GambarHotelEdit />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/fasilitas-hotel/create"
          element={
            <AdminRoute>
              <FasilitasHotelCreate />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/fasilitas-hotel/edit/:id"
          element={
            <AdminRoute>
              <FasilitasHotelEdit />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/icons"
          element={
            <AdminRoute>
              <IconList />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/icons/create"
          element={
            <AdminRoute>
              <IconCreate />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/icons/edit/:id"
          element={
            <AdminRoute>
              <IconEdit />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/kamar"
          element={
            <AdminRoute>
              <KamarList />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/kamar/create"
          element={
            <AdminRoute>
              <KamarCreate />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/kamar/edit/:id"
          element={
            <AdminRoute>
              <KamarEdit />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/fasilitas-kamar"
          element={
            <AdminRoute>
              <FasilitasKamar />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/fasilitas-kamar/create"
          element={
            <AdminRoute>
              <FasilitasKamarCreate />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/fasilitas-kamar/edit/:id"
          element={
            <AdminRoute>
              <FasilitasKamarEdit />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/gambar-kamar"
          element={
            <AdminRoute>
              <GambarKamarList />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/gambar-kamar/create"
          element={
            <AdminRoute>
              <GambarKamarCreate />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/gambar-kamar/edit/:id"
          element={
            <AdminRoute>
              <GambarKamarEdit />
            </AdminRoute>
          }
        />

        {/* Admin dan default, dll */}
      </Routes>
      <ToastProvider />
    </BrowserRouter>
  </StrictMode>
);