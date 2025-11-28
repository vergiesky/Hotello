import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { SignIn } from "../../api/apiAuth";
import { alertError, alertSuccess } from "../../lib/Alert";
import { toastError } from "../../lib/Toast";

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      toastError("Email dan password wajib diisi.");
      return;
    }
    setLoading(true);
    try {
      const res = await SignIn({
        email: formData.email,
        password: formData.password,
      });
      const data = res?.data ?? res;
      console.log("Login response:", res?.data ?? res);

      if (data.token) localStorage.setItem("token", data.token);
      if (data.detail) localStorage.setItem("user", JSON.stringify(data.detail));
      if (data.abilities) {
        localStorage.setItem("abilities", JSON.stringify(data.abilities));
        const role = data.abilities.includes("admin") ? "admin" : "customer";
        localStorage.setItem("role", role);
      }

      await alertSuccess("Login berhasil", data.message || "Selamat datang kembali.");

      const role = data.abilities?.includes("admin") ? "admin" : "customer";
      navigate(role === "admin" ? "/admin/dashboard" : "/dashboard");
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
          <h1 className="text-3xl font-bold text-gray-900">Masuk ke Hotello</h1>
          <p className="text-sm text-gray-600">
            Selamat datang kembali! Silakan masuk untuk melanjutkan.
          </p>
        </div>

        {/* Card Form */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                placeholder="email@example.com"
                autoComplete="email"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                placeholder="Masukkan password"
                autoComplete="current-password"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition duration-200 shadow-lg hover:shadow-xl disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Memproses..." : "Masuk"}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-600">
            Belum punya akun?{" "}
            <Link
              to="/register"
              className="text-blue-600 font-semibold hover:text-blue-700 transition"
            >
              Daftar di sini
            </Link>
          </div>
        </div>

        {/* Footer Text */}
        <p className="text-center text-sm text-gray-600 mt-6">
          Dengan masuk, Anda menyetujui{" "}
          <a href="#" className="text-blue-600 underline hover:text-blue-700 transition">
            Syarat & Ketentuan
          </a>{" "}
          kami
        </p>
      </div>
    </div>
  );
}
