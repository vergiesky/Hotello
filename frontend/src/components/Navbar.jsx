import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom"; 
import {
  ChevronDown,
  User,
  LogOut,
  Settings,
  Menu,
  X,
} from "lucide-react";

import { BASE_URL } from "../api";

export default function Navbar() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // ambil user dari localStorage
  const user = JSON.parse(localStorage.getItem("user") || "null");

  // foto profil user dari storage Laravel
  const avatarSrc = user?.user_profile
  ? `${BASE_URL}/storage/${user.user_profile}`
  : null;
  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const navButtonClass = (active) =>
    active
      ? "px-5 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-all shadow-sm"
      : "px-5 py-2 rounded-lg text-sm text-gray-700 font-medium hover:bg-blue-50 hover:text-blue-600 transition-all";

  return (
    <header className="w-full bg-white shadow-md relative z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo kiri */}
          <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => navigate("/dashboard")}
        >
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center shadow-md">
            <img src="/images/logo.png" alt="Hotello" className="w-8 h-8" />
          </div>
          <span className="font-bold text-xl bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
            Hotello
          </span>
        </div>

          {/* Menu tengah - Desktop */}
          <nav className="hidden md:flex items-center gap-1">
            <button
              onClick={() => navigate("/dashboard")}
              className={navButtonClass(pathname.startsWith("/dashboard"))}
            >
              Home
            </button>

            {/* Wishlist hanya muncul jika user sudah login */}
            {user && (
              <button
                onClick={() => navigate("/wishlist")}
                className={navButtonClass(pathname.startsWith("/wishlist"))}
              >
                Wishlist
              </button>
            )}

            {/* <button className="px-5 py-2 rounded-lg text-sm text-gray-700 font-medium hover:bg-blue-50 hover:text-blue-600 transition-all">
              Deals
            </button> */}
            <button onClick={() => navigate("/about")} className={navButtonClass(pathname.startsWith("/about"))}>
              About
            </button>
          </nav>

          {/* Kanan: profil atau login/register */}
          <div className="flex items-center gap-3">
            {user ? (
              // sudah login
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition-all"
                >
                  <div className="w-9 h-9 rounded-full overflow-hidden bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold shadow-md ring-2 ring-white">
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
                  <div className="hidden sm:block text-left">
                    <p className="text-sm font-semibold text-gray-800">
                      {user.nama}
                    </p>
                    <p className="text-xs text-gray-500">Customer</p>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-gray-500 transition-transform ${
                      isProfileOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Dropdown Menu */}
                {isProfileOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setIsProfileOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border border-gray-100 py-2 z-20">
                      {/* <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-semibold text-gray-800"> {user.nama}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div> */}

                      <button
                        onClick={() => {
                          setIsProfileOpen(false);
                          navigate("/profile");
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all"
                      >
                        <User className="w-4 h-4" />
                        Profil Saya
                      </button>

                      <button
                        onClick={() => {
                          setIsProfileOpen(false);
                          navigate("/settings");
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all"
                      >
                        <Settings className="w-4 h-4" />
                        Pengaturan
                      </button>
                      {/* garis abu */}
                      <div className="border-t border-gray-100 my-1" />

                      <button
                        onClick={() => {
                          setIsProfileOpen(false);
                          handleLogout();
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-all"
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              // belum login
              <div className="flex items-center gap-2">
                <button
                  onClick={() => navigate("/register")}
                  className="px-4 py-2 text-blue-600 text-sm font-medium hover:bg-blue-50 rounded-lg transition-all"
                >
                  Daftar
                </button>
                <button
                  onClick={() => navigate("/login")}
                  className="px-4 py-2 bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 rounded-lg transition-all shadow-sm"
                >
                  Masuk
                </button>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-all"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-100 py-4 space-y-1">
            <button
              onClick={() => {
                navigate("/dashboard");
                setIsMobileMenuOpen(false);
              }}
              className="w-full text-left px-4 py-2.5 rounded-lg bg-blue-50 text-blue-600 text-sm font-medium"
            >
              Home
            </button>

            {/* Wishlist mobile juga hanya kalau sudah login */}
            {user && (
              <button
                onClick={() => {
                  navigate("/wishlist");
                  setIsMobileMenuOpen(false);
                }}
                className="w-full text-left px-4 py-2.5 rounded-lg text-gray-700 text-sm font-medium hover:bg-gray-50"
              >
                Wishlist
              </button>
            )}

            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-full text-left px-4 py-2.5 rounded-lg text-gray-700 text-sm font-medium hover:bg-gray-50"
            >
              Deals
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-full text-left px-4 py-2.5 rounded-lg text-gray-700 text-sm font-medium hover:bg-gray-50"
            >
              About
            </button>
          </div>
        )}
      </div>
    </header>
  );
}