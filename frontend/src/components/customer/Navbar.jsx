import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ChevronDown, User, LogOut, Settings, Menu, X } from "lucide-react";

import { BASE_URL } from "../../api";

export default function Navbar() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const [isProfileOpen, setIsProfileOpen] = useState(false); // buka/tutup dropdown profil (desktop)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // buka/tutup menu mobile

  // ambil user dari localStorage
  const user = JSON.parse(localStorage.getItem("user") || "null");

  // foto profil user dari storage laravel
  const avatarSrc = user?.user_profile
    ? `${BASE_URL}/storage/${user.user_profile}`
    : null;

  // hapus semua data di localStorage (termasuk user + token)
  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  // style waktu menu aktif (dekstop)
  const navButtonClass = (active) =>
    active
      ? "px-5 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-all shadow-sm"
      : "px-5 py-2 rounded-lg text-sm text-gray-700 font-medium hover:bg-blue-50 hover:text-blue-600 transition-all";

  // style waktu menu aktif (mobile)
  const navMobileClass = (active) =>
    active
      ? "w-full text-left px-4 py-2.5 rounded-lg bg-blue-50 text-blue-600 text-sm font-medium"
      : "w-full text-left px-4 py-2.5 rounded-lg text-gray-700 text-sm font-medium hover:bg-gray-50";

  const isActive = (path) => pathname.startsWith(path);

  return (
    <header className="w-full bg-white/95 backdrop-blur border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* baris atas */}
        <div className="flex items-center justify-between h-16 gap-3">
          {/* logo kiri */}
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => navigate("/dashboard")}
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center">
              <img
                src="/images/logo.png"
                alt="Hotello"
                className="w-7 h-7 sm:w-8 sm:h-8"
              />
            </div>
            <span className="sm:inline font-bold text-xl text-blue-600">
              Hotello
            </span>
          </div>

          {/* menu tengah desktop */}
          <nav className="hidden md:flex items-center gap-1">
            <button
              onClick={() => navigate("/dashboard")}
              className={navButtonClass(isActive("/dashboard"))}
            >
              Home
            </button>

            {/* Wishlist */}
            {user && (
              <button
                onClick={() => navigate("/wishlist")}
                className={navButtonClass(isActive("/wishlist"))}
              >
                Wishlist
              </button>
            )}

            {/* history reservasi */}
            {user && (
              <button
                onClick={() => navigate("/reservations/history")}
                className={navButtonClass(isActive("/reservations/history"))}
              >
                History
              </button>
            )}

            {/* about */}
            <button
              onClick={() => navigate("/about")}
              className={navButtonClass(isActive("/about"))}
            >
              About
            </button>
          </nav>

          {/* kanan: profil + tombol menu mobile */}
          <div className="flex items-center gap-2">
            {/* desktop: tombol login / profil */}
            {user ? (
              <div className="relative hidden sm:block">
                <button
                  onClick={() => setIsProfileOpen((prev) => !prev)}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition-all"
                >
                  {/* foto profile */}
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
                  {/* nama dan role */}
                  <div className="hidden md:block text-left">
                    <p className="text-sm font-semibold text-gray-800">
                      {user.nama}
                    </p>
                    <p className="text-xs text-gray-500">Customer</p>
                  </div>
                  {/* panah dropdown */}
                  <ChevronDown
                    className={`w-4 h-4 text-gray-500 transition-transform ${
                      isProfileOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* dropdown menu desktop profile */}
                {isProfileOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setIsProfileOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border border-gray-100 py-2 z-20">
                      {/* profile saya */}
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

                      {/* settings */}
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

                      {/* logout */}
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
              <div className="hidden sm:flex items-center gap-2">
                {/* daftar */}
                <button
                  onClick={() => navigate("/register")}
                  className="px-4 py-2 text-blue-600 text-sm font-medium hover:bg-blue-50 rounded-lg transition-all"
                >
                  Daftar
                </button>

                {/* masuk */}
                <button
                  onClick={() => navigate("/login")}
                  className="px-4 py-2 bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 rounded-lg transition-all shadow-sm"
                >
                  Masuk
                </button>
              </div>
            )}

            {/* tombol menu mobile (garis tiga) */}
            <button
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-all"
            >
              {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* menu mobile */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-100 py-4 space-y-3">
            {user && (
              <div className="flex items-center gap-3 px-1 pb-2">
                <div className="w-9 h-9 rounded-full overflow-hidden bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold shadow-md">
                  {avatarSrc ? (
                    <img
                      src={avatarSrc}
                      alt="Profil"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    user.nama?.charAt(0).toUpperCase()
                  )}
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-gray-800">
                    {user.nama}
                  </span>
                  <span className="text-xs text-gray-500">Customer</span>
                </div>
              </div>
            )}

            {/* link utama */}
            <div className="space-y-1">
              <button
                onClick={() => {
                  navigate("/dashboard");
                  setIsMobileMenuOpen(false);
                }}
                className={navMobileClass(isActive("/dashboard"))}
              >
                Home
              </button>

              {user && (
                <button
                  onClick={() => {
                    navigate("/wishlist");
                    setIsMobileMenuOpen(false);
                  }}
                  className={navMobileClass(isActive("/wishlist"))}
                >
                  Wishlist
                </button>
              )}

              {user && (
                <button
                  onClick={() => {
                    navigate("/reservations/history");
                    setIsMobileMenuOpen(false);
                  }}
                  className={navMobileClass(isActive("/reservations/history"))}
                >
                  History
                </button>
              )}

              <button
                onClick={() => {
                  navigate("/about");
                  setIsMobileMenuOpen(false);
                }}
                className={navMobileClass(isActive("/about"))}
              >
                About
              </button>
            </div>

            <div className="pt-3 border-t border-gray-100 space-y-1">
              {user ? (
                <>
                  <button
                    onClick={() => {
                      navigate("/profile");
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    <User className="w-4 h-4" />
                    Profil Saya
                  </button>
                  <button
                    onClick={() => {
                      navigate("/settings");
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    <Settings className="w-4 h-4" />
                    Pengaturan
                  </button>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 rounded-lg hover:bg-red-50"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </>
              ) : (
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => {
                      navigate("/register");
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full px-4 py-2.5 text-blue-600 text-sm font-medium border border-blue-100 rounded-lg hover:bg-blue-50"
                  >
                    Daftar
                  </button>
                  <button
                    onClick={() => {
                      navigate("/login");
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full px-4 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700"
                  >
                    Masuk
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
