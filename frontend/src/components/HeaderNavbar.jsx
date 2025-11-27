import { X, Menu } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { alertSuccess } from "../lib/Alert";
import { useState } from "react";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

export default function HeaderNavbar() {
    // const { pathname } = useLocation();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const navigate = useNavigate();

    // const handleLogout = () => {
    //     localStorage.removeItem("token");
    //     setTimeout(() => {
    //         navigate("/login");
    //     }, 1000);
    // };
        
    const handleLogout = () => {
        localStorage.clear();
        alertSuccess("Logout Berhasil", "Kembali ke home");
        navigate("/login");
    };
    
    // ambil user dari localStorage
    const user = JSON.parse(localStorage.getItem("user") || "null");

    // foto profil user dari storage Laravel
    const avatarSrc = user?.user_profile
        ? `${API_BASE_URL}/storage/${user.user_profile}`
        : null;

    return (
    <div>
      <header className="w-full bg-white shadow-sm relative z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">

            {/* Logo */}
            <div className="flex items-center gap-2">
              <img src="/images/logo.png" className="w-10 h-10" alt="Logo" />
              <span className="font-semibold text-xl text-blue-600">Hotello</span>
            </div>

            {/* DESKTOP MENU (hide jika login / register) */}
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

            {/* USER / LOGIN (hide jika login / register) */}
              <div className="hidden md:flex items-center gap-4">
                {user ? (
                  <div className="flex items-center gap-3">
                    <div className="hidden sm:block text-right">
                      <p className="text-sm font-semibold text-gray-800">{user.nama}</p>
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
                          onError={(e) => (e.currentTarget.style.display = "none")}
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

            {/* MOBILE BUTTON */}
              <button
                className="md:hidden p-2"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
          </div>
        </div>

        {/* MOBILE MENU */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t shadow-sm">
            <div className="px-4 py-3 space-y-3">
              <button
                onClick={() => {
                  navigate("/dashboard");
                  setMobileMenuOpen(false);
                }}
                className="block bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium text-center"
              >
                Home
              </button>

              <button
                onClick={() => {
                  navigate("/wishlist");
                  setMobileMenuOpen(false);
                }}
                className="block text-gray-700 text-sm font-medium hover:text-blue-600"
              >
                Wishlist
              </button>

              <button className="block text-gray-700 text-sm font-medium hover:text-blue-600">
                Deals
              </button>

              <button className="block text-gray-700 text-sm font-medium hover:text-blue-600">
                About
              </button>

              {/* MOBILE USER / LOGIN */}
              <div className="pt-3 border-t">

                {user ? (
                  <div className="flex items-center gap-3">
                    <div className="text-left">
                      <p className="text-sm font-semibold text-gray-800">{user.nama}</p>
                      <button
                        onClick={() => {
                          handleLogout();
                          setMobileMenuOpen(false);
                        }}
                        className="text-xs text-red-500 hover:text-red-600 mt-1"
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
                        />
                      ) : (
                        user.nama?.charAt(0).toUpperCase()
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-center items-center gap-3">
                    <button
                      onClick={() => {
                        navigate("/register");
                        setMobileMenuOpen(false);
                      }}
                      className="text-blue-600 text-sm font-medium"
                    >
                      Sign Up
                    </button>
                    <span className="text-gray-300">|</span>
                    <button
                      onClick={() => {
                        navigate("/login");
                        setMobileMenuOpen(false);
                      }}
                      className="text-blue-600 text-sm font-medium"
                    >
                      Login
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </header>
    </div>
  );
}