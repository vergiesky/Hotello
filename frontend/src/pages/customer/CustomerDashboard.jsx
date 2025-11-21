// src/pages/customer/CustomerDashboard.jsx

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Star, Search, Calendar, Minus, Plus, Heart } from "lucide-react";

import useAxios from "../../api";
import { alertError } from "../../lib/Alert";

// base URL backend (Laravel)
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

/* IMAGE HOTEL DB */
function getHotelImageUrl(hotel) {
  const firstImage = hotel.gambarHotels?.[0];

  // Kalo ga ada gambar di DB -> fallback ke lokal
  if (!firstImage || !firstImage.file_path_gambar_hotel) {
    return "/images/hotel1_main.jpg";
  }

  let path = (firstImage.file_path_gambar_hotel || "").trim();

  // Kalau path belum ada prefix folder, tambah sesuai db
  if (
    !path.startsWith("hotel_pictures/") &&
    !path.startsWith("http://") &&
    !path.startsWith("https://")
  ) {
    path = `hotel_pictures/${path}`;
  }

  // Kalau di DB udah ada URL
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  // Normal case: file di storage/app/public/...
  return `${API_BASE_URL}/storage/${path}`;
}

/* DASHBOARD */
export default function CustomerDashboard() {
  const navigate = useNavigate();

  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);

  // form search
  const [searchCity, setSearchCity] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [rooms, setRooms] = useState(1);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);

  // ambil user dari localStorage
  const user = JSON.parse(localStorage.getItem("user") || "null");

  // foto profil user dari storage Laravel
  const avatarSrc = user?.user_profile
    ? `${API_BASE_URL}/storage/${user.user_profile}`
    : null;

  // jumlah wishlist (untuk badge di navbar)
  const [wishlistCount, setWishlistCount] = useState(0);

  // Ambil hotel, include gambarHotels dari backend
  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const res = await useAxios.get("/hotels");
        const data = res.data.data || [];
        setHotels(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
        alertError(
          "Gagal memuat hotel",
          "Terjadi kesalahan saat mengambil data hotel."
        );
      } finally {
        setLoading(false);
      }
    };
    fetchHotels();
  }, []);

  // Ambil wishlist untuk hitung jumlahnya (badge)
  useEffect(() => {
    if (!user) return;

    const fetchWishlist = async () => {
      try {
        const res = await useAxios.get("/wishlists");
        const data = res.data.data || [];
        setWishlistCount(Array.isArray(data) ? data.length : 0);
      } catch (err) {
        console.error(err);
        // gak perlu alertError biar navbar gak spam
      }
    };

    fetchWishlist();
  }, [user]);

  // filter search
  const filteredHotels = hotels.filter((hotel) => {
    const q = searchCity.toLowerCase();
    if (!q) return true;
    return (
      (hotel.nama_hotel || "").toLowerCase().includes(q) ||
      (hotel.kota || "").toLowerCase().includes(q) ||
      (hotel.deskripsi || "").toLowerCase().includes(q)
    );
  });

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* NAVBAR */}
      <header className="w-full bg-white shadow-sm relative z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            {/* Logo kiri */}
            <div className="flex items-center gap-2">
              <img src="/images/logo.png" className="w-10 h-10" alt="Logo" />
              <span className="font-semibold text-xl text-blue-600">
                Hotello
              </span>
            </div>

            {/* Menu tengah */}
            <nav className="hidden md:flex items-center gap-2">
              <button
                onClick={() => navigate("/dashboard")}
                className="px-5 py-2 rounded-full bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition"
              >
                Home
              </button>
              <button
                onClick={() => navigate("/wishlist")}
                className="px-5 py-2 text-sm text-gray-700 font-medium hover:text-blue-600 transition"
              >
                Wishlist
              </button>
              <button className="px-5 py-2 text-sm text-gray-700 font-medium hover:text-blue-600 transition">
                Deals
              </button>
              <button className="px-5 py-2 text-sm text-gray-700 font-medium hover:text-blue-600 transition">
                About
              </button>
            </nav>

            {/* Kanan: wishlist + profil atau login */}
            <div className="flex items-center gap-4">
              {/* Tombol wishlist di kanan (dengan icon & badge) */}
              

              {user ? (
                <div className="flex items-center gap-3">
                  <div className="hidden sm:block text-right">
                    <p className="text-sm font-semibold text-gray-800">
                      {user.nama}
                    </p>
                    <button
                      onClick={handleLogout}
                      className="text-xs text-red-500 hover:text-red-600 mt-0.5"
                    >
                      Logout
                    </button>
                  </div>
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-blue-100 flex items-center justify-center text-blue-700 font-semibold shadow-sm">
                    {avatarSrc ? (
                      <img
                        src={avatarSrc}
                        alt="Profil"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    ) : (
                      user.nama?.charAt(0).toUpperCase()
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => navigate("/register")}
                    className="text-blue-600 text-sm font-medium hover:opacity-70 transition"
                  >
                    Sign Up
                  </button>
                  <span className="text-gray-300">|</span>
                  <button
                    onClick={() => navigate("/login")}
                    className="text-blue-600 text-sm font-medium hover:opacity-70 transition"
                  >
                    Login
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* BG utama gambar hotel + search, pakai search box floating */}
      <section className="relative w-full h-[500px] overflow-hidden">
        {/* Background hero image */}
        <div className="absolute inset-0">
          <img
            src="/images/Hotel.jpg"
            alt="Hero Hotel"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/50 to-blue-600/50" />
        </div>

        {/* SEARCH BOX - Floating di tengah */}
        <div className="absolute inset-0 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 md:p-10 w-full max-w-5xl">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-blue-600 text-center mb-6 sm:mb-8">
              Hai, mau nginep di mana?
            </h1>

            <div className="space-y-5">
              {/* Search Input */}
              <div className="relative">
                <Search
                  className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Cari kota tujuan"
                  value={searchCity}
                  onChange={(e) => setSearchCity(e.target.value)}
                  className="w-full pl-14 pr-5 py-4 border-2 border-gray-200 rounded-full text-sm focus:outline-none focus:border-blue-600 transition"
                />
              </div>

              {/* Date dan Guest Controls */}
              <div className="flex flex-col lg:flex-row gap-4">
                {/* Check-in & Check-out */}
                <div className="flex flex-col sm:flex-row gap-4 flex-1">
                  {/* Check-in */}
                  <div className="flex-1 flex flex-col items-start p-4 border-2 border-gray-200 rounded-xl hover:border-blue-600 transition">
                    <div className="flex items-center gap-2 text-gray-500 text-xs mb-1">
                      <Calendar size={14} />
                      <span>Check-in</span>
                    </div>
                    <input
                      type="date"
                      value={checkIn}
                      onChange={(e) => setCheckIn(e.target.value)}
                      className="w-full text-sm font-medium text-gray-800 outline-none"
                    />
                  </div>

                  {/* Check-out */}
                  <div className="flex-1 flex flex-col items-start p-4 border-2 border-gray-200 rounded-xl hover:border-blue-600 transition">
                    <div className="flex items-center gap-2 text-gray-500 text-xs mb-1">
                      <Calendar size={14} />
                      <span>Check-out</span>
                    </div>
                    <input
                      type="date"
                      value={checkOut}
                      onChange={(e) => setCheckOut(e.target.value)}
                      className="w-full text-sm font-medium text-gray-800 outline-none"
                    />
                  </div>
                </div>

                {/* Guest Section */}
                <div className="flex-1 flex flex-wrap sm:flex-nowrap items-center justify-between gap-4 p-4 border-2 border-gray-200 rounded-xl">
                  {/* Kamar */}
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-xs text-gray-500 font-medium">
                      Kamar
                    </span>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => rooms > 1 && setRooms(rooms - 1)}
                        className="w-8 h-8 border border-gray-300 rounded-md hover:bg-blue-600 hover:text-white hover:border-blue-600 transition flex items-center justify-center"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="text-base font-medium w-6 text-center">
                        {rooms}
                      </span>
                      <button
                        type="button"
                        onClick={() => setRooms(rooms + 1)}
                        className="w-8 h-8 border border-gray-300 rounded-md hover:bg-blue-600 hover:text-white hover:border-blue-600 transition flex items-center justify-center"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Dewasa */}
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-xs text-gray-500 font-medium">
                      Dewasa
                    </span>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => adults > 1 && setAdults(adults - 1)}
                        className="w-8 h-8 border border-gray-300 rounded-md hover:bg-blue-600 hover:text-white hover:border-blue-600 transition flex items-center justify-center"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="text-base font-medium w-6 text-center">
                        {adults}
                      </span>
                      <button
                        type="button"
                        onClick={() => setAdults(adults + 1)}
                        className="w-8 h-8 border border-gray-300 rounded-md hover:bg-blue-600 hover:text-white hover:border-blue-600 transition flex items-center justify-center"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Anak */}
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-xs text-gray-500 font-medium">
                      Anak
                    </span>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => children > 0 && setChildren(children - 1)}
                        className="w-8 h-8 border border-gray-300 rounded-md hover:bg-blue-600 hover:text-white hover:border-blue-600 transition flex items-center justify-center"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="text-base font-medium w-6 text-center">
                        {children}
                      </span>
                      <button
                        type="button"
                        onClick={() => setChildren(children + 1)}
                        className="w-8 h-8 border border-gray-300 rounded-md hover:bg-blue-600 hover:text-white hover:border-blue-600 transition flex items-center justify-center"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Search Button */}
              <button className="w-full py-4 bg-blue-600 text-white rounded-full text-base font-semibold hover:bg-blue-700 hover:shadow-lg hover:-translate-y-0.5 transition-all">
                Cari
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* LIST HOTEL */}
      <main className="flex-1">
        <section className="max-w-6xl mx-auto px-4 pt-10 pb-12">
          <p className="text-gray-600 mb-4">
            {loading
              ? "Memuat data hotel..."
              : `Menampilkan ${filteredHotels.length} hotel${
                  searchCity ? ` di sekitar "${searchCity}"` : ""
                }`}
          </p>

          {!loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
              {filteredHotels.map((hotel) => {
                const imageUrl = getHotelImageUrl(hotel);

                return (
                  <div
                    key={hotel.id_hotel}
                    className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col h-full"
                  >
                    {/* FOTO HOTEL */}
                    <div className="h-40 bg-gray-100">
                      <img
                        src={imageUrl}
                        alt={hotel.nama_hotel}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = "/images/hotel1_main.jpg";
                        }}
                      />
                    </div>

                    {/* DETAIL HOTEL */}
                    <div className="p-6 flex flex-col flex-1">
                      <h3 className="font-semibold text-lg mb-1">
                        {hotel.nama_hotel}
                      </h3>

                      <div className="flex items-center text-gray-600 text-sm mb-2">
                        <MapPin className="w-4 h-4 mr-1" />
                        {(hotel.kota || "") +
                          (hotel.alamat ? ` • ${hotel.alamat}` : "")}
                      </div>

                      <div className="flex items-center gap-1 mb-2">
                        <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                        <span>{hotel.rating_hotel ?? "-"}</span>
                      </div>

                      <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-grow">
                        {hotel.deskripsi}
                      </p>

                      <div className="flex gap-2 mt-auto">
                        <button className="flex-1 h-11 bg-blue-100 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-200 transition">
                          Lihat Detail
                        </button>

                        <button className="flex-1 h-11 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition">
                          Pesan
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
