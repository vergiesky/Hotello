import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Building2,
  BarChart3,
  Shield,
  Image,
  BedDouble,
  Tag,
  DollarSign,
  User,
  Settings,
  LogOut,
  ChevronDown,
  Menu,
  X,
} from "lucide-react";
import { BASE_URL } from "../../api";

// path
const defaultItems = [
  { label: "Dashboard", icon: BarChart3, path: "/admin/dashboard" },
  { label: "Hotel", icon: Building2, path: "/admin/hotels" },
  { label: "Fasilitas Hotel", icon: Shield, path: "/admin/fasilitas-hotel" },
  { label: "Gambar Hotel", icon: Image, path: "/admin/gambar-hotel" },
  { label: "Kamar", icon: BedDouble, path: "/admin/kamar" },
  { label: "Fasilitas Kamar", icon: Shield, path: "/admin/fasilitas-kamar" },
  { label: "Gambar Kamar", icon: Image, path: "/admin/gambar-kamar" },
  { label: "Icon", icon: Tag, path: "/admin/icons" },
  { label: "Pembayaran", icon: DollarSign, path: "/admin/pembayaran" },
];

export default function NavbarAdmin() {
  const { pathname } = useLocation(); // URL aktif untuk menandai menu
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false); // dropdown profil (desktop & mobile)
  const [isMenuOpen, setIsMenuOpen] = useState(false); // slide sidebar di mobile
  const menu = defaultItems;

  // Ambil user dari localStorage; jika parse gagal, fallback null
  const user = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "null");
    } catch {
      return null;
    }
  }, []);

  // path foto profil admin dari storage laravel
  const avatarSrc = useMemo(() => {
    if (!user?.user_profile) return null;
    return `${BASE_URL}/storage/${user.user_profile}`;
  }, [user]);

  // tutup menu/profile saat navigasi halaman
  useEffect(() => {
    setIsMenuOpen(false);
    setIsProfileOpen(false);
  }, [pathname]);

  return (
    <>
      {isProfileOpen && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => setIsProfileOpen(false)}
        />
      )}
      <div className="md:hidden sticky top-0 z-30 w-full bg-white/90 backdrop-blur border-b border-slate-200 shadow-sm">
        <div className="flex items-center justify-between px-4 py-3">
          <button
            type="button"
            onClick={() => setIsMenuOpen(true)}
            className="inline-flex items-center justify-center w-10 h-10 rounded-full border border-slate-200 text-slate-800 hover:bg-slate-50"
            aria-label="Buka menu admin"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="text-center">
            <p className="text-sm font-semibold text-slate-800">Hotel Admin</p>
            <p className="text-xs text-slate-500">Panel Kontrol</p>
          </div>
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsProfileOpen((prev) => !prev)}
              className="group inline-flex items-center gap-2 px-2.5 py-1.5 rounded-xl hover:bg-slate-100 transition-colors"
              aria-label="Menu profil"
            >
              <span className="w-10 h-10 rounded-full overflow-hidden bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold shadow-sm ring-2 ring-blue-100">
                {avatarSrc ? (
                  <img
                    src={avatarSrc}
                    alt="Admin"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                ) : (
                  (user?.nama || "A").charAt(0).toUpperCase()
                )}
              </span>
              <ChevronDown
                className={`w-4 h-4 text-slate-500 transition-transform ${
                  isProfileOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            {isProfileOpen && (
              <div className="absolute right-0 mt-3 w-56 bg-white text-slate-800 rounded-xl shadow-2xl border border-slate-100 py-2 z-40">
                <button
                  onClick={() => {
                    setIsProfileOpen(false);
                    navigate("/profile?admin=1");
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-blue-50 hover:text-blue-600 transition"
                >
                  <User className="w-4 h-4" />
                  Profil Saya
                </button>
                <button
                  onClick={() => {
                    setIsProfileOpen(false);
                    navigate("/settings?admin=1");
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-blue-50 hover:text-blue-600 transition"
                >
                  <Settings className="w-4 h-4" />
                  Pengaturan
                </button>
                <div className="border-t border-slate-100 my-1" />
                <button
                  onClick={() => {
                    setIsProfileOpen(false);
                    localStorage.clear();
                    navigate("/");
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      <aside
        className={`fixed md:sticky inset-y-0 left-0 w-72 md:w-64 lg:w-72 bg-[#0f172a] text-white flex flex-col transform transition-transform duration-300 z-40 md:translate-x-0 md:top-0 md:h-screen md:flex-shrink-0 ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="px-5 pt-5 pb-4 border-b border-white/10 flex items-start justify-between gap-3">
          <div>
            <h1 className="text-xl font-semibold leading-tight">
              Hotel Admin Panel
            </h1>
            <p className="text-xs text-white/60 mt-1">
              Kelola data dan konten hotel
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsMenuOpen(false)}
            className="md:hidden text-white/70 hover:text-white"
            aria-label="Tutup menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="px-5 py-4 border-b border-white/10 relative hidden md:block">
          <button
            type="button"
            onClick={() => setIsProfileOpen((prev) => !prev)}
            className="w-full flex items-center justify-between gap-3 px-3 py-2 rounded-lg hover:bg-white/10 transition"
          >
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full overflow-hidden bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold ring-2 ring-white/20">
                {avatarSrc ? (
                  <img
                    src={avatarSrc}
                    alt="Admin"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                ) : (
                  (user?.nama || "A").charAt(0).toUpperCase()
                )}
              </div>
              <div className="leading-tight text-left">
                <p className="text-sm font-semibold">{user?.nama || "Admin"}</p>
                <p className="text-[11px] text-white/70">
                  {user?.email || "admin@example.com"}
                </p>
              </div>
            </div>
            <ChevronDown
              className={`w-4 h-4 text-white/70 transition-transform ${
                isProfileOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {isProfileOpen && (
            <div className="absolute left-0 right-0 mt-2 bg-white text-slate-800 rounded-xl shadow-2xl border border-slate-100 py-2 z-40">
              <button
                onClick={() => {
                  setIsProfileOpen(false);
                  navigate("/profile?admin=1");
                }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-blue-50 hover:text-blue-600 transition"
              >
                <User className="w-4 h-4" />
                Profil Saya
              </button>
              <button
                onClick={() => {
                  setIsProfileOpen(false);
                  navigate("/settings?admin=1");
                }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-blue-50 hover:text-blue-600 transition"
              >
                <Settings className="w-4 h-4" />
                Pengaturan
              </button>
              <div className="border-t border-slate-100 my-1" />
              <button
                onClick={() => {
                  setIsProfileOpen(false);
                  localStorage.clear();
                  navigate("/");
                }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          )}
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto md:overflow-y-auto">
          {menu.map((item) => (
            <a
              key={item.label}
              href={item.path}
              onClick={() => setIsMenuOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition ${
                item.path && item.path !== "#" && pathname.startsWith(item.path)
                  ? "bg-blue-600 text-white"
                  : "text-slate-200 hover:bg-white/10"
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </a>
          ))}
        </nav>
      </aside>
    </>
  );
}
