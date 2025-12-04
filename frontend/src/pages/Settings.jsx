import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  SlidersHorizontal,
  Bell,
  Globe,
  Moon,
  Sun,
  ShieldCheck,
  Smartphone,
  Save,
} from "lucide-react";

import Navbar from "../components/customer/Navbar";
import NavbarAdmin from "../components/admin/NavbarAdmin";
import { alertSuccess } from "../lib/Alert";

export default function Settings() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const isAdminView = searchParams.get("admin") === "1";

  // state untu semua pengaturan
  const [theme, setTheme] = useState("light");
  const [language, setLanguage] = useState("id");
  const [notifPromo, setNotifPromo] = useState(true);
  const [notifTransaksi, setNotifTransaksi] = useState(true);
  const [notifUpdate, setNotifUpdate] = useState(true);
  const [saving, setSaving] = useState(false);

  // load preferensi dari localStorage
  useEffect(() => {
    const raw = localStorage.getItem("user_settings");
    if (raw) {
      try {
        const s = JSON.parse(raw);
        if (s.theme) setTheme(s.theme);
        if (s.language) setLanguage(s.language);
        if (typeof s.notifPromo === "boolean") setNotifPromo(s.notifPromo);
        if (typeof s.notifTransaksi === "boolean")
          setNotifTransaksi(s.notifTransaksi);
        if (typeof s.notifUpdate === "boolean") setNotifUpdate(s.notifUpdate);
      } catch (e) {
        console.error("Failed to parse user_settings", e);
      }
    }
  }, []);

  // buat nyimpen pengaturan
  const handleSave = (e) => {
    e.preventDefault();
    setSaving(true);

    const settings = {
      theme,
      language,
      notifPromo,
      notifTransaksi,
      notifUpdate,
    };

    localStorage.setItem("user_settings", JSON.stringify(settings));

    setTimeout(() => {
      setSaving(false);
      alertSuccess("Pengaturan tersimpan", "Preferensi Anda telah disimpan.");
    }, 400); // delay 400ms
  };

  const containerClass =
    "max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-10 py-8 space-y-6";

  const content = (
    <main className="flex-1">
      <div className={containerClass}>
        {/* Header */}
        <div className="flex items-start sm:items-center gap-3 mb-6 flex-wrap">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white flex-shrink-0">
            <SlidersHorizontal className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-3xl font-semibold text-gray-900">Pengaturan</h1>
            <p className="text-sm text-gray-500 mt-1">
              Atur preferensi tampilan, notifikasi, dan keamanan akun Hotello
              Anda.
            </p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          {/* Card: Tampilan & Bahasa */}
          <div className="bg-white rounded-2xl shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Globe className="w-5 h-5 text-blue-600" />
              Tampilan & Bahasa
            </h2>

            <div className="grid md:grid-cols-2 gap-6 text-sm">
              {/* Tema */}
              <div>
                <p className="text-gray-600 mb-2">Tema Aplikasi</p>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setTheme("light")}
                    className={`flex-1 flex items-center gap-2 px-4 py-2 rounded-lg border text-sm ${
                      theme === "light"
                        ? "border-blue-500 bg-blue-50 text-blue-600"
                        : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <Sun className="w-4 h-4" />
                    Terang
                  </button>
                  <button
                    type="button"
                    onClick={() => setTheme("dark")}
                    className={`flex-1 flex items-center gap-2 px-4 py-2 rounded-lg border text-sm ${
                      theme === "dark"
                        ? "border-blue-500 bg-blue-50 text-blue-600"
                        : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <Moon className="w-4 h-4" />
                    Gelap
                  </button>
                </div>
                <p className="text-xs text-gray-400 mt-2">
                  * Tema hanya disimpan di perangkat ini.
                </p>
              </div>

              {/* Bahasa */}
              <div>
                <p className="text-gray-600 mb-2">Bahasa</p>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="id">Bahasa Indonesia</option>
                  <option value="en">English</option>
                </select>
                <p className="text-xs text-gray-400 mt-2">
                  Bahasa digunakan untuk tampilan teks di aplikasi.
                </p>
              </div>
            </div>
          </div>

          {/* card notifikasi */}
          <div className="bg-white rounded-2xl shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Bell className="w-5 h-5 text-blue-600" />
              Notifikasi & Email
            </h2>

            <div className="space-y-3 text-sm">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifTransaksi}
                  onChange={(e) => setNotifTransaksi(e.target.checked)}
                  className="mt-1 w-4 h-4"
                />
                <div>
                  <p className="font-medium text-gray-800">
                    Notifikasi transaksi
                  </p>
                  <p className="text-gray-500 text-xs">
                    Kirim email setiap ada pemesanan, pembatalan, atau perubahan
                    reservasi.
                  </p>
                </div>
              </label>

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifPromo}
                  onChange={(e) => setNotifPromo(e.target.checked)}
                  className="mt-1 w-4 h-4"
                />
                <div>
                  <p className="font-medium text-gray-800">
                    Promo & rekomendasi
                  </p>
                  <p className="text-gray-500 text-xs">
                    Terima penawaran spesial, diskon hotel, dan rekomendasi
                    berdasarkan aktivitas Anda.
                  </p>
                </div>
              </label>

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifUpdate}
                  onChange={(e) => setNotifUpdate(e.target.checked)}
                  className="mt-1 w-4 h-4"
                />
                <div>
                  <p className="font-medium text-gray-800">
                    Update fitur & informasi penting
                  </p>
                  <p className="text-gray-500 text-xs">
                    Beri tahu saya jika ada perubahan kebijakan atau fitur baru
                    di Hotello.
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* card keamanan dan perangkat */}
          <div className="bg-white rounded-2xl shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-blue-600" />
              Keamanan & Perangkat
            </h2>

            <div className="space-y-4 text-sm">
              <div className="flex items-start gap-3">
                <Smartphone className="w-5 h-5 text-gray-400 mt-1" />
                <div>
                  <p className="font-medium text-gray-800">
                    Perangkat yang terhubung
                  </p>
                  <p className="text-gray-500 text-xs mb-2">
                    Untuk saat ini, pengaturan perangkat hanya berupa informasi
                    umum. Di versi berikutnya, Anda bisa melihat daftar
                    perangkat yang login dan mengeluarkan sesi tertentu.
                  </p>
                  <button
                    type="button"
                    onClick={() =>
                      alertSuccess(
                        "Fitur segera hadir",
                        "Logout semua perangkat akan tersedia di update berikutnya."
                      )
                    }
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-200 text-xs text-gray-700 hover:bg-gray-50"
                  >
                    Keluar dari semua perangkat
                  </button>
                </div>
              </div>

              <p className="text-xs text-gray-400">
                Untuk mengubah password, silakan gunakan menu{" "}
                <span className="font-semibold">Update Password</span> di
                halaman Profil Saya.
              </p>
            </div>
          </div>

          {/* tombol simpan di bawah semua card */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 disabled:opacity-60"
            >
              <Save className="w-4 h-4" />
              {saving ? "Menyimpan..." : "Simpan Pengaturan"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );

  if (isAdminView) {
    return (
      <div className="min-h-screen bg-[#f4f6fb] text-slate-800 flex flex-col md:flex-row">
        <NavbarAdmin />
        <div className="flex-1 w-full">{content}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {!isAdminView && <Navbar />}
      {content}
    </div>
  );
}
