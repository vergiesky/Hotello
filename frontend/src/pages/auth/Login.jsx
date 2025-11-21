// src/pages/auth/Login.jsx

import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { SignIn } from "../../api/apiAuth";
import { alertError, alertSuccess } from "../../lib/Alert";

export default function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      alertError("Data belum lengkap", "Email dan password wajib diisi.");
      return;
    }

    setLoading(true);

    try {
      const data = await SignIn({
        email: formData.email,
        password: formData.password,
      });
      // data = { detail, token, abilities, message }

      if (data.token) {
        localStorage.setItem("token", data.token);
      }
      if (data.detail) {
        localStorage.setItem("user", JSON.stringify(data.detail));
      }
      if (data.abilities) {
        localStorage.setItem("abilities", JSON.stringify(data.abilities));
        const role = data.abilities.includes("admin") ? "admin" : "customer";
        localStorage.setItem("role", role);
      }

      await alertSuccess(
        "Login berhasil",
        data.message || "Selamat datang kembali di Hotello."
      );

      if (data.abilities) {
        const role = data.abilities.includes("admin") ? "admin" : "customer";
        localStorage.setItem("role", role);

        // redirect sesuai role
        if (role === "admin") {
          navigate("/admin/dashboard");
        } else {
          navigate("/dashboard");
        }
      }
    } catch (err) {
      const msg =
        err?.message ||
        (err?.errors && Object.values(err.errors).flat().join("\n")) ||
        "Login gagal. Silakan cek email dan password Anda.";

      alertError("Login gagal", msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue to-blue-600 flex items-stretch justify-center">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-2xl overflow-hidden m-4">
        <div className="grid grid-cols-1 md:grid-cols-2 h-full">
          {/* LEFT: hero hotel (sama gaya dengan Register) */}
          <div className="relative min-h-[420px] md:h-full">
            <div className="absolute inset-0 bg-blue-800" />
            <div className="relative z-10 h-full flex flex-col items-center justify-center text-white p-10">
              <div className="text-center max-w-md">
                <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-4">
                  <img src="/images/logo.png" alt="Logo" />
                </div>
                <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-3">
                  Selamat Datang Kembali
                </h2>
                <p className="text-blue-100">
                  Masuk ke akun Anda dan lanjutkan perjalanan menginap bersama
                  Hotello.
                </p>

                <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="bg-white/15 backdrop-blur rounded-xl p-4 border border-white/20 text-center">
                    <div className="w-8 h-8 rounded-lg bg-white/25 mx-auto mb-2 flex items-center justify-center">
                      <span className="text-sm font-bold">🏨</span>
                    </div>
                    <h3 className="font-semibold text-sm">Hotel Pilihan</h3>
                    <p className="text-xs text-blue-100">
                      Rekomendasi hotel terbaik untuk Anda
                    </p>
                  </div>

                  <div className="bg-white/15 backdrop-blur rounded-xl p-4 border border-white/20 text-center">
                    <div className="w-8 h-8 rounded-lg bg-white/25 mx-auto mb-2 flex items-center justify-center">
                      <span className="text-sm font-bold">🕒</span>
                    </div>
                    <h3 className="font-semibold text-sm">Booking Cepat</h3>
                    <p className="text-xs text-blue-100">
                      Proses pemesanan mudah dan praktis
                    </p>
                  </div>

                  <div className="bg-white/15 backdrop-blur rounded-xl p-4 border border-white/20 text-center">
                    <div className="w-8 h-8 rounded-lg bg-white/25 mx-auto mb-2 flex items-center justify-center">
                      <span className="text-sm font-bold">⭐</span>
                    </div>
                    <h3 className="font-semibold text-sm">Layanan Prima</h3>
                    <p className="text-xs text-blue-100">
                      Nikmati pelayanan terbaik setiap saat
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: form login */}
          <div className="p-8 md:p-12">
            <div className="mb-8 text-center">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Masuk ke Akun Anda
              </h1>
              <p className="text-gray-600">
                Gunakan email dan password yang telah terdaftar
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  placeholder="nama@email.com"
                  autoComplete="email"
                  required
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full pr-12 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    placeholder="Masukkan password Anda"
                    autoComplete="current-password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-blue-600"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed mt-6 shadow-lg"
              >
                {loading ? "Memproses..." : "Login"}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Belum punya akun?{" "}
                <Link
                  to="/register"
                  className="text-blue-600 hover:text-blue-700 font-semibold"
                >
                  Daftar di sini
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
