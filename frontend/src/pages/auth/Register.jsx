import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { SignUpCustomer } from "../../api/apiAuth";
import { alertError, alertSuccess } from "../../lib/Alert";
import { passwordStrengthScore } from "../../lib/Password";
import { toastError } from "../../lib/Toast";

export default function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nama: "",
    email: "",
    password: "",
    password_confirmation: "",
    no_telp: "",
    tanggal_lahir: "",
  });

  const [loading, setLoading] = useState(false);
  const [passwordScore, setPasswordScore] = useState(0);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === "password") {
      setPasswordScore(passwordStrengthScore(value));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Cek nama kosong
    if (!formData.nama) {
      toastError("Isi nama terlebih dahulu!");
      return;
    }

    // Cek email kosong, validasi
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.email) {
      toastError("Isi email terlebih dahulu!");
      return;
    }
    
    if (!emailRegex.test(formData.email)) {
      toastError("Format email tidak valid!");
      return;
    }
    
    // Cek telepon kosong, validasi
    if (!formData.no_telp) {
      toastError("Isi nomor telepon terlebih dahulu!");
      return;
    }

    if (!/[0-9]/.test(formData.no_telp)) {
      toastError("Nomor Telepon tidak boleh selain angka!");
      return;
    }

    if (formData.no_telp.length < 8) {
      toastError("Nomor Telepon minimal 8 angka!");
      return;
    }

    // Cek tanggal kosong
    if (!formData.tanggal_lahir) {
      toastError("Isi tanggal lahir terlebih dahulu!");
      return;
    }

    // Cek password kosong, min.8
    if (!formData.password) {
      toastError("Isi password terlebih dahulu!");
      return;
    }

    if (formData.password.length < 8) {
      toastError("Password minimal 8 karakter!");
      return;
    }

    // Cek password dan konfirm
    if (formData.password !== formData.password_confirmation) {
      toastError("Password dan konfirmasi harus sama.");
      return;
    }

    setLoading(true);
    try {
      const payload = new FormData();
      Object.entries(formData).forEach(([k, v]) => payload.append(k, v));

      const res = await SignUpCustomer(payload);
      const data = res?.data ?? res;
      console.log("Register response:", res?.data ?? res);

      if (data.token) localStorage.setItem("token", data.token);
      if (data.user) localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("role", "customer");

      await alertSuccess(
        "Registrasi berhasil",
        data.message || "Akun berhasil dibuat."
      );
      navigate("/login");
    } catch (err) {
      const msg =
        // err?.message ||
        // (err?.errors && Object.values(err.errors).flat().join("\n")) ||
        "Registrasi gagal. Silakan coba lagi.";
      toastError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-white via-blue-50 to-blue-100 flex items-center justify-center px-4 py-12">
      {/* Decorative Elements */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(59,130,246,0.08),transparent_50%),radial-gradient(circle_at_80%_80%,rgba(96,165,250,0.06),transparent_50%)]" />
      
      <div className="relative w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-8 space-y-4">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center shadow-xl">
              <img src="images/logo.png"></img>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Daftar ke Hotello</h1>
          <p className="text-sm text-gray-600">
            Buat akun baru untuk memulai perjalanan Anda
          </p>
        </div>

        {/* Card Form */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {/* noValidate untuk matiin default */}
          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Nama Lengkap <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="nama"
                value={formData.nama}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                placeholder="Masukkan nama lengkap"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                placeholder="email@example.com"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  No. Telepon <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="no_telp"
                  value={formData.no_telp}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  placeholder="08123456789"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Tanggal Lahir <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="tanggal_lahir"
                  value={formData.tanggal_lahir}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                placeholder="Minimal 8 karakter"
                minLength={8}
                required
              />
              <div className="space-y-1">
                <div className="w-full h-2 rounded-full bg-gray-200 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-200 ${
                      ["bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-blue-500", "bg-green-600"][
                        Math.min(passwordScore, 4)
                      ]
                    }`}
                    style={{ width: `${(Math.min(passwordScore, 5) / 5) * 100}%` }}
                  />
                </div>
                <p className="text-xs text-gray-600">
                  Kekuatan password:{" "}
                  <span className="font-semibold text-gray-800">
                    {["Sangat lemah", "Lemah", "Cukup", "Kuat", "Sangat kuat"][
                      Math.min(passwordScore, 4)
                    ]}
                  </span>
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Konfirmasi Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                name="password_confirmation"
                value={formData.password_confirmation}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                placeholder="Ulangi password"
                minLength={8}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition duration-200 shadow-lg hover:shadow-xl disabled:opacity-60 disabled:cursor-not-allowed mt-6"
            >
              {loading ? "Mendaftar..." : "Daftar"}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-600">
            Sudah punya akun?{" "}
            <Link
              to="/login"
              className="text-blue-600 font-semibold hover:text-blue-700 transition"
            >
              Masuk di sini
            </Link>
          </div>
        </div>

        {/* Footer Text */}
        <p className="text-center text-sm text-gray-600 mt-6">
          Dengan mendaftar, Anda menyetujui{" "}
          <a href="#" className="text-blue-600 underline hover:text-blue-700 transition">
            Syarat & Ketentuan
          </a>{" "}
          kami
        </p>
      </div>
    </div>
  );
}
