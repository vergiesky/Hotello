// src/pages/customer/CustomerDashboard.jsx

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  MapPin,
  Star,
  Search,
  Calendar,
  Minus,
  Plus,
  Heart,
} from "lucide-react";

import useAxios, { BASE_URL } from "../../api";
import { alertError } from "../../lib/Alert";
import Navbar from "../../components/Navbar";
import { toastSuccess, toastInfo } from "../../lib/Toast";

/* ==== HELPER IMAGE HOTEL (DARI DB) ==== */
function getHotelImageUrl(hotel) {
  const firstImage = hotel.gambar_hotels?.[0];

  // Kalau tidak ada gambar di DB -> fallback ke lokal
  if (!firstImage || !firstImage.file_path_gambar_hotel) {
    return "/images/hotel1_main.jpg";
  }

  let path = (firstImage.file_path_gambar_hotel || "").trim();

  const isAbsolute = path.startsWith("http://") || path.startsWith("https://");
  if (isAbsolute) {
    return path;
  }

  // pastikan path relatif storage (gambar_hotels atau lainnya) tidak ditimpa prefix salah
  return `${BASE_URL}/storage/${path}`;
}

/* ==== KOMPONEN DASHBOARD ==== */
export default function CustomerDashboard() {
  const navigate = useNavigate();
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);

  // state search
  const [searchCity, setSearchCity] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [rooms, setRooms] = useState(1);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);

  // wishlist map: { [id_hotel]: id_wishlist }
  const [wishlistMap, setWishlistMap] = useState({});
  const [page, setPage] = useState(1);
  const pageSize = 9;

  const isInWishlist = (hotelId) => !!wishlistMap[hotelId];

  const fetchWishlist = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const res = await useAxios.get("/wishlists");
      const data = res.data.data || [];
      const map = {};
      data.forEach((item) => {
        const hid = item.id_hotel || item.hotel?.id_hotel;
        if (hid) map[hid] = item.id_wishlist;
      });
      setWishlistMap(map);
    } catch (err) {
      console.error(err);
    }
  };

  const toggleWishlist = async (hotelId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alertError("Harus login", "Masuk dulu untuk menyimpan wishlist.");
      navigate("/login");
      return;
    }

    const existingId = wishlistMap[hotelId];
    if (existingId) {
      try {
        await useAxios.delete(`/wishlists/delete/${existingId}`);
        setWishlistMap((prev) => {
          const next = { ...prev };
          delete next[hotelId];
          return next;
        });
        toastInfo("Hotel dihapus dari wishlist");
      } catch (err) {
        console.error(err);
        alertError("Gagal", "Tidak bisa menghapus wishlist.");
      }
    } else {
      try {
        const res = await useAxios.post("/wishlists/create", {
          id_hotel: hotelId,
        });
        const newId = res.data?.data?.id_wishlist;
        setWishlistMap((prev) => ({ ...prev, [hotelId]: newId || true }));
        toastSuccess("Hotel ditambahkan ke wishlist");
      } catch (err) {
        console.error(err);
        alertError("Gagal", "Tidak bisa menambahkan wishlist.");
      }
    }
  };

  // Ambil hotel (sudah include gambarHotels dari backend)
  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const res = await useAxios.get("/hotels");
        const data = res.data.data || [];
        setHotels(Array.isArray(data) ? data : []);
        console.log(res.data);
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
    fetchWishlist();
  }, []);

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

  const totalPages = Math.max(1, Math.ceil(filteredHotels.length / pageSize));

  useEffect(() => {
    setPage(1);
  }, [searchCity]);

  useEffect(() => {
    setPage((prev) => Math.min(prev, totalPages));
  }, [totalPages]);

  const start = (page - 1) * pageSize;
  const displayedHotels = filteredHotels.slice(start, start + pageSize);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* NAVBAR */}
      <Navbar />

      {/* HERO + SEARCH */}
      <section className="relative w-full h-[500px] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/images/Hotel.jpg"
            alt="Hero Hotel"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/50 to-blue-600/50" />
        </div>

        <div className="absolute inset-0 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 md:p-10 w-full max-w-5xl">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-blue-600 text-center mb-6 sm:mb-8">
              Hai, mau nginep di mana?
            </h1>

            <div className="space-y-5">
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

              <div className="flex flex-col lg:flex-row gap-4">
                {/* Check-in & Check-out */}
                <div className="flex flex-col sm:flex-row gap-4 flex-1">
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
                  {/* Rooms */}
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

                  {/* Adults */}
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

                  {/* Children */}
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-xs text-gray-500 font-medium">
                      Anak
                    </span>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() =>
                          children > 0 && setChildren(children - 1)
                        }
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
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayedHotels.map((hotel) => {
                  const imageUrl = getHotelImageUrl(hotel);
                  const inWishlist = isInWishlist(hotel.id_hotel);
                  // console.log(hotel.nama_hotel, getHotelImageUrl(hotel), hotel.gambar_hotels); buat cek gambar


                  const harga = hotel.harga_mulai;
                  const jumlahUlasan = hotel.jumlah_ulasan ?? 0;

                  return (
                    <div
                      key={hotel.id_hotel}
                      className="bg-white rounded-3xl shadow-[0_12px_35px_rgba(15,23,42,0.08)] border border-slate-100 overflow-hidden hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(15,23,42,0.12)] transition h-full flex flex-col"
                    >
                      {/* FOTO HOTEL + HEART */}
                      <div className="relative h-48 bg-gray-100">
                        <img
                          src={imageUrl}
                          alt={hotel.nama_hotel}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = "/images/hotel1_main.jpg";
                          }}
                        />

                        <button
                          type="button"
                          onClick={() => toggleWishlist(hotel.id_hotel)}
                          className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 flex items-center justify-center shadow-md hover:scale-105 transition"
                        >
                          <Heart
                            className={`w-5 h-5 ${
                              inWishlist
                                ? "text-blue-600 fill-blue-600"
                                : "text-slate-500"
                            }`}
                          />
                        </button>
                      </div>

                      <div className="p-6 flex flex-col h-full">
                        <h3 className="font-semibold text-[17px] text-slate-900 mb-1">
                          {hotel.nama_hotel}
                        </h3>

                      <div className="flex items-center text-slate-600 text-sm mb-2">
                          <MapPin className="w-4 h-4 mr-1 text-slate-500" />
                          <span>
                            {(hotel.alamat || "") +
                              (hotel.kota ? `, ${hotel.kota}` : "")}
                          </span>
                        </div>

                        <div className="flex items-center gap-1 mb-2">
                          <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                          <span className="text-sm font-medium text-slate-900">
                            {hotel.rating_hotel ?? "-"}
                          </span>
                          <span className="text-xs text-slate-500 ml-1">
                            ({jumlahUlasan} ulasan)
                          </span>
                        </div>

                        <p className="text-slate-600 text-sm mb-4 line-clamp-2">
                          {hotel.deskripsi}
                        </p>

                        <div className="mb-4">
                          <p className="text-xs text-slate-500 mb-1">
                            Mulai dari
                          </p>
                          <p className="text-sm font-semibold text-blue-600">
                            {harga ? `Rp ${harga}` : "Rp -"}
                          </p>
                        </div>

                        <div className="mt-auto flex gap-3 pt-2">
                          <button
                            onClick={() => navigate(`/hotel/${hotel.id_hotel}`)}
                            className="flex-1 py-2.5 bg-slate-100 text-slate-700 rounded-xl text-sm font-medium hover:bg-slate-200 transition"
                          >
                            Lihat Detail
                          </button>

                          <button className="flex-1 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition">
                            Pesan
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {totalPages > 1 && (
                <div className="flex flex-wrap items-center justify-center gap-2 mt-8">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="w-9 h-9 rounded-[12px] border border-slate-200 text-slate-500 text-sm disabled:opacity-50 hover:bg-slate-50 transition"
                  >
                    &lt;
                  </button>

                  {(() => {
                    const pages = [];
                    const addPage = (p) =>
                      pages.push(
                        <button
                          key={p}
                          onClick={() => setPage(p)}
                          className={`w-9 h-9 rounded-[12px] text-sm font-semibold transition ${
                            p === page
                              ? "bg-blue-600 text-white"
                              : "border border-slate-200 text-slate-600 hover:bg-slate-50"
                          }`}
                        >
                          {p}
                        </button>
                      );

                    // jika halaman sedikit, tampilkan semua
                    if (totalPages <= 5) {
                      return Array.from({ length: totalPages }, (_, idx) =>
                        addPage(idx + 1)
                      );
                    }

                    // pola dinamis:
                    // - jika di awal (page <=2): 1 2 3 ... last
                    // - jika di tengah: (page-1) page (page+1) ... last
                    // - jika di akhir: 1 ... (last-2) (last-1) last
                    if (page <= 2) {
                      addPage(1);
                      addPage(2);
                      addPage(3);
                      pages.push(
                        <span key="dots-start" className="px-2 text-slate-400">
                          ...
                        </span>
                      );
                      addPage(totalPages);
                      return pages;
                    }

                    if (page >= totalPages - 1) {
                      addPage(1);
                      pages.push(
                        <span key="dots-end" className="px-2 text-slate-400">
                          ...
                        </span>
                      );
                      addPage(totalPages - 2);
                      addPage(totalPages - 1);
                      addPage(totalPages);
                      return pages;
                    }

                    // posisi tengah
                    addPage(page - 1);
                    addPage(page);
                    addPage(page + 1);
                    pages.push(
                      <span key="dots-mid" className="px-2 text-slate-400">
                        ...
                      </span>
                    );
                    addPage(totalPages);
                    return pages;
                  })()}

                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="w-9 h-9 rounded-[12px] border border-slate-200 text-slate-500 text-sm disabled:opacity-50 hover:bg-slate-50 transition"
                  >
                    &gt;
                  </button>
                </div>
              )}
            </>
          )}
        </section>
      </main>

      <footer className="w-full bg-gradient-to-r from-blue-700 via-blue-600 to-blue-700 text-white mt-16 border-t border-blue-500/30">
        <div className="max-w-7xl mx-auto px-4 py-12">
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            {/* Brand Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-lg">
                  <img src="images/logo.png"></img>
                </div>
                <span className="font-bold text-xl text-white">Hotello</span>
              </div>
              <p className="text-sm text-blue-100 leading-relaxed">
                Platform pemesanan hotel terpercaya untuk pengalaman menginap
                yang tak terlupakan di seluruh Indonesia.
              </p>
              {/* Social Media */}
              <div className="flex gap-3">
                <a
                  href="#"
                  className="w-9 h-9 rounded-lg bg-blue-500/50 hover:bg-white hover:text-blue-600 flex items-center justify-center transition-all hover:scale-110"
                >
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="w-9 h-9 rounded-lg bg-blue-500/50 hover:bg-white hover:text-blue-600 flex items-center justify-center transition-all hover:scale-110"
                >
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="w-9 h-9 rounded-lg bg-blue-500/50 hover:bg-white hover:text-blue-600 flex items-center justify-center transition-all hover:scale-110"
                >
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Perusahaan */}
            <div className="space-y-4">
              <h3 className="text-base font-semibold text-white">Perusahaan</h3>
              <ul className="space-y-3">
                <li>
                  <a
                    href="/about"
                    className="text-sm text-blue-100 hover:text-white transition"
                  >
                    About Us
                  </a>
                </li>
              </ul>
            </div>

            {/* Bantuan */}
            <div className="space-y-4">
              <h3 className="text-base font-semibold text-white">Bantuan</h3>
              <ul className="space-y-3">
                <li>
                  <a
                    href="#"
                    className="text-sm text-blue-100 hover:text-white transition"
                  >
                    Pusat Bantuan
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-sm text-blue-100 hover:text-white transition"
                  >
                    Kebijakan Privasi
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-sm text-blue-100 hover:text-white transition"
                  >
                    Syarat & Ketentuan
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-sm text-blue-100 hover:text-white transition"
                  >
                    FAQ
                  </a>
                </li>
              </ul>
            </div>

            {/* Hubungi Kami */}
            <div className="space-y-4">
              <h3 className="text-base font-semibold text-white">
                Hubungi Kami
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3 text-sm text-blue-100">
                  <svg
                    className="w-5 h-5 text-white mt-0.5 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                  <span>+62 812-3456-7890</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-blue-100">
                  <svg
                    className="w-5 h-5 text-white mt-0.5 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  <span>support@hotello.com</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-blue-100">
                  <svg
                    className="w-5 h-5 text-white mt-0.5 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <span>Yogyakarta, Indonesia</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Footer */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-blue-100">
              ©️ {new Date().getFullYear()} Hotello. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}