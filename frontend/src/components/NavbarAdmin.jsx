import React, { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Building2,
  Shield,
  Image,
  BedDouble,
  Tag,
  DollarSign,
  User,
  Settings,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { BASE_URL } from "../api";

const defaultItems = [
  { label: "Hotel", icon: Building2, path: "/admin/dashboard" },
  { label: "Fasilitas Hotel", icon: Shield, path: "/admin/fasilitas-hotel" },
  { label: "Gambar Hotel", icon: Image, path: "/admin/gambar-hotel" },
  { label: "Kamar", icon: BedDouble, path: "/admin/kamar" },
  { label: "Fasilitas Kamar", icon: Shield, path: "/admin/fasilitas-kamar" },
  { label: "Gambar Kamar", icon: Image, path: "/admin/gambar-kamar" },
  { label: "Icon", icon: Tag, path: "/admin/icons" },
  { label: "Pembayaran", icon: DollarSign, path: "/admin/payments" },
];

export default function NavbarAdmin({ items }) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const menu = items && items.length ? items : defaultItems;
  const user = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "null");
    } catch (e) {
      return null;
    }
  }, []);

  const avatarSrc = useMemo(() => {
    if (!user?.user_profile) return null;
    return `${BASE_URL}/storage/${user.user_profile}`;
  }, [user]);

  return (
    <aside className="w-64 bg-[#0f172a] text-white flex flex-col">
      <div className="px-5 py-5 border-b border-white/10 relative">
        <h1 className="text-xl font-semibold">Hotel Admin Panel</h1>
        <div className="mt-4">
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
                <p className="text-sm font-semibold">
                  {user?.nama || "Admin"}
                </p>
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
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setIsProfileOpen(false)}
              />
              <div className="absolute left-5 right-5 mt-2 bg-white text-slate-800 rounded-xl shadow-2xl border border-slate-100 py-2 z-20">
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
            </>
          )}
        </div>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1">
        {menu.map((item) => (
          <a
            key={item.label}
            href={item.path}
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
  );
}
