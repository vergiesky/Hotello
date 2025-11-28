import React, { useEffect, useMemo, useState } from "react";
import {
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { MapPin, Users, Plus, Minus, Calendar as CalendarIcon } from "lucide-react";

import Navbar from "../../components/Navbar";
import useAxios, { BASE_URL } from "../../api";
import { alertError, alertSuccess } from "../../lib/Alert";

function getKamarImageUrl(kamar) {
  const firstImage = kamar?.gambar_kamars?.[0];
  const fallback = "/images/hotel1_main.jpg";
  if (!firstImage || !firstImage.file_path_gambar_kamar) return fallback;

  const path = (firstImage.file_path_gambar_kamar || "").trim();
  const isAbsolute = path.startsWith("http://") || path.startsWith("https://");
  if (isAbsolute) return path;
  return `${BASE_URL}/storage/${path}`;
}

function diffNights(checkIn, checkOut) {
  if (!checkIn || !checkOut) return 0;
  const inDate = new Date(checkIn);
  const outDate = new Date(checkOut);
  const diffMs = outDate.getTime() - inDate.getTime();
  const nights = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  return nights > 0 ? nights : 0;
}

export default function Reservation() {
  const { hotelId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preselectRoom = searchParams.get("room");

  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guestCount, setGuestCount] = useState(1);
  const [selectedRooms, setSelectedRooms] = useState({});

  useEffect(() => {
    const fetchHotel = async () => {
      try {
        const res = await useAxios.get(`/hotel-detail/${hotelId}`);
        console.log("Hotel detail (reservation):", res.data);
        const hotelData = res.data?.hotel || res.data?.data || null;
        setHotel(hotelData);

        if (preselectRoom && hotelData?.kamars) {
          const exists = hotelData.kamars.some(
            (k) => `${k.id_kamar}` === `${preselectRoom}`
          );
          if (exists) {
            setSelectedRooms({ [preselectRoom]: 1 });
          }
        }
      } catch (err) {
        console.error(err);
        alertError(
          "Gagal memuat hotel",
          err.response?.data?.message || "Data hotel tidak ditemukan."
        );
        navigate("/dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchHotel();
  }, [hotelId, navigate, preselectRoom]);

  const nights = useMemo(() => diffNights(checkIn, checkOut), [checkIn, checkOut]);

  const kamarList = hotel?.kamars || [];

  const selections = useMemo(() => {
    return Object.entries(selectedRooms)
      .map(([id, qty]) => ({
        id_kamar: Number(id),
        jumlah_kamar: Number(qty) || 0,
      }))
      .filter((row) => row.jumlah_kamar > 0);
  }, [selectedRooms]);

  const totalBiaya = useMemo(() => {
    if (!nights) return 0;
    return selections.reduce((acc, row) => {
      const kamar = kamarList.find((k) => Number(k.id_kamar) === row.id_kamar);
      const harga = Number(kamar?.harga) || 0;
      return acc + harga * row.jumlah_kamar * nights;
    }, 0);
  }, [nights, selections, kamarList]);

  const handleQtyChange = (id_kamar, delta) => {
    setSelectedRooms((prev) => {
      const current = Number(prev[id_kamar] || 0);
      const next = Math.max(0, current + delta);
      const updated = { ...prev };
      if (next === 0) {
        delete updated[id_kamar];
      } else {
        updated[id_kamar] = next;
      }
      return updated;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!checkIn || !checkOut) {
      alertError("Tanggal belum lengkap", "Silakan pilih tanggal check-in dan check-out.");
      return;
    }
    if (nights <= 0) {
      alertError("Tanggal tidak valid", "Check-out harus setelah check-in.");
      return;
    }
    if (selections.length === 0) {
      alertError("Belum pilih kamar", "Tambahkan minimal 1 kamar.");
      return;
    }

    const payload = {
      check_in: checkIn,
      check_out: checkOut,
      jumlah_tamu: Number(guestCount) || 1,
      kamar: selections,
    };

    try {
      const res = await useAxios.post("/reservasis/create", payload);
      console.log("Create reservasi response:", res.data);
      alertSuccess("Berhasil", "Reservasi berhasil dibuat. Lanjut ke pembayaran.");
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || "Gagal membuat reservasi.";
      alertError("Gagal", msg);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-slate-600">Memuat data reservasi...</p>
        </div>
      </div>
    );
  }

  if (!hotel) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6">
          <div>
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 mb-4">
              <div className="flex items-start gap-3">
                <img
                  src={getKamarImageUrl(kamarList[0])}
                  alt={hotel.nama_hotel}
                  className="w-20 h-20 rounded-lg object-cover bg-slate-100"
                  onError={(e) => {
                    e.currentTarget.src = "/images/hotel1_main.jpg";
                  }}
                />
                <div className="flex-1">
                  <h1 className="text-xl font-semibold text-slate-900">
                    {hotel.nama_hotel}
                  </h1>
                  <div className="flex items-center text-slate-600 text-sm mt-1">
                    <MapPin className="w-4 h-4 mr-1" />
                    {(hotel.kota || "") + (hotel.alamat ? `, ${hotel.alamat}` : "")}
                  </div>
                  <p className="text-sm text-slate-500 mt-1">
                    Pilih tanggal, jumlah tamu, dan kamar untuk melanjutkan reservasi.
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">
                  Detail Reservasi
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <label className="flex flex-col gap-1 text-sm text-slate-700">
                    Check-in
                    <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 bg-slate-50">
                      <CalendarIcon className="w-4 h-4 text-slate-500" />
                      <input
                        type="date"
                        value={checkIn}
                        onChange={(e) => setCheckIn(e.target.value)}
                        className="flex-1 bg-transparent outline-none text-sm text-slate-800"
                      />
                    </div>
                  </label>
                  <label className="flex flex-col gap-1 text-sm text-slate-700">
                    Check-out
                    <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 bg-slate-50">
                      <CalendarIcon className="w-4 h-4 text-slate-500" />
                      <input
                        type="date"
                        value={checkOut}
                        onChange={(e) => setCheckOut(e.target.value)}
                        className="flex-1 bg-transparent outline-none text-sm text-slate-800"
                      />
                    </div>
                  </label>
                  <label className="flex flex-col gap-1 text-sm text-slate-700">
                    Jumlah Tamu
                    <div className="flex items-center gap-3 px-3 py-2 rounded-lg border border-slate-200 bg-slate-50">
                      <Users className="w-4 h-4 text-slate-500" />
                      <input
                        type="number"
                        min="1"
                        value={guestCount}
                        onChange={(e) => setGuestCount(e.target.value)}
                        className="flex-1 bg-transparent outline-none text-sm text-slate-800"
                      />
                    </div>
                  </label>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">
                  Pilih Kamar
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {kamarList.map((kamar) => {
                    const qty = Number(selectedRooms[kamar.id_kamar] || 0);
                    const harga = Number(kamar.harga) || 0;
                    return (
                      <div
                        key={kamar.id_kamar}
                        className="border border-slate-200 rounded-xl p-4 flex flex-col gap-3"
                      >
                        <div className="flex gap-3">
                          <img
                            src={getKamarImageUrl(kamar)}
                            alt={kamar.nama_kamar}
                            className="w-24 h-24 rounded-lg object-cover bg-slate-100"
                            onError={(e) => {
                              e.currentTarget.src = "/images/hotel1_main.jpg";
                            }}
                          />
                          <div className="flex-1">
                            <p className="font-semibold text-slate-900">
                              {kamar.nama_kamar}
                            </p>
                            <p className="text-sm text-slate-600 line-clamp-2">
                              {kamar.deskripsi || "Kamar nyaman dengan fasilitas standar."}
                            </p>
                            <p className="text-sm font-semibold text-blue-600 mt-2">
                              Rp {harga.toLocaleString("id-ID")} / malam
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-slate-500">
                            Kapasitas {kamar.kapasitas || "-"} | Stok {kamar.stok_kamar || "-"}
                          </span>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleQtyChange(kamar.id_kamar, -1)}
                              className="w-8 h-8 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50"
                            >
                              <Minus className="w-4 h-4 mx-auto" />
                            </button>
                            <span className="w-6 text-center text-sm font-semibold">
                              {qty}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleQtyChange(kamar.id_kamar, 1)}
                              className="w-8 h-8 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50"
                            >
                              <Plus className="w-4 h-4 mx-auto" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  {kamarList.length === 0 && (
                    <div className="col-span-full text-center text-slate-500 py-6">
                      Belum ada kamar tersedia.
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition shadow"
                >
                  Buat Reservasi
                </button>
              </div>
            </form>
          </div>

          <aside className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 h-fit">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Ringkasan</h3>
            <div className="space-y-3 text-sm text-slate-700">
              <div className="flex justify-between">
                <span>Tamu</span>
                <span>{guestCount} orang</span>
              </div>
              <div className="flex justify-between">
                <span>Malam</span>
                <span>{nights} malam</span>
              </div>
              <div className="border-t border-slate-100 pt-3">
                <p className="font-semibold text-slate-900 mb-2">Detail Kamar</p>
                {selections.length === 0 ? (
                  <p className="text-slate-500 text-sm">Belum ada kamar dipilih.</p>
                ) : (
                  <div className="space-y-2">
                    {selections.map((row) => {
                      const kamar = kamarList.find(
                        (k) => Number(k.id_kamar) === row.id_kamar
                      );
                      const harga = Number(kamar?.harga) || 0;
                      const subtotal = harga * row.jumlah_kamar * nights;
                      return (
                        <div
                          key={row.id_kamar}
                          className="flex justify-between text-slate-700"
                        >
                          <span>
                            {kamar?.nama_kamar || "Kamar"} x {row.jumlah_kamar}
                          </span>
                          <span className="font-semibold">
                            Rp {subtotal.toLocaleString("id-ID")}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
              <div className="border-t border-slate-100 pt-3 flex justify-between text-base font-semibold text-slate-900">
                <span>Total</span>
                <span>Rp {totalBiaya.toLocaleString("id-ID")}</span>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
