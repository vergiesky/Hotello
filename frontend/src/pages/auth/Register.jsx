// src/pages/auth/Register.jsx

import React, { useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { passwordStrengthScore } from "../../lib/Password";
import { SignUpCustomer } from "../../api/apiAuth";
import { alertError, alertSuccess } from "../../lib/Alert";


export default function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nama: "",
    email: "",
    password: "",
    password_confirmation: "",
    no_telp: "",
    tanggal_lahir: "",
    user_profile: null,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // validasi file upload (kalo nanti dipakai sebagai foto profil)
  const validateFile = (file) => {
    const maxSizeMB = 3;
    const allowed = ["image/jpeg", "image/png"];

    if (!allowed.includes(file.type)) {
      alertError("Format tidak didukung", "Format foto harus JPG / PNG");
      return false;
    }

    if (file.size > maxSizeMB * 1024 * 1024) {
      alertError("Ukuran terlalu besar", `Ukuran file maksimal ${maxSizeMB}MB`);
      return false;
    }

    return true;
  };

  const handleFile = (file) => {
    if (!file) return;
    if (!validateFile(file)) return;

    setFormData((prev) => ({ ...prev, user_profile: file }));

    const reader = new FileReader();
    reader.onloadend = () => setPreviewImage(String(reader.result));
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    handleFile(file);
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  // validasi password
  if (formData.password !== formData.password_confirmation) {
    alertError(
      "Password tidak cocok",
      "Password dan konfirmasi password harus sama."
    );
    return;
  }

  // validasi no telp
  if (formData.no_telp.replace(/\D/g, "").length < 10) {
    alertError("No. telepon tidak valid", "Nomor telepon minimal 10 digit.");
    return;
  }

  // validasi field wajib
  if (
    !formData.nama ||
    !formData.email ||
    !formData.password ||
    !formData.no_telp ||
    !formData.tanggal_lahir
  ) {
    alertError("Data belum lengkap", "Semua field wajib diisi.");
    return;
  }

  setLoading(true);

  try {
    const formDataToSend = new FormData();
    formDataToSend.append("nama", formData.nama);
    formDataToSend.append("email", formData.email);
    formDataToSend.append("password", formData.password);
    formDataToSend.append(
      "password_confirmation",
      formData.password_confirmation
    );
    formDataToSend.append("no_telp", formData.no_telp);
    formDataToSend.append("tanggal_lahir", formData.tanggal_lahir);

    if (formData.user_profile) {
      formDataToSend.append("user_profile", formData.user_profile);
    }

    // kirim ke backend
    const data = await SignUpCustomer(formDataToSend);
    // data = { user, customer, token, message }

    // SIMPAN AUTH KE LOCALSTORAGE
    if (data.token) {
      localStorage.setItem("token", data.token);
    }
    if (data.user) {
      localStorage.setItem("user", JSON.stringify(data.user));
    }
    // simpan role:
    localStorage.setItem("role", "customer");

    // kasih info sukses
    await alertSuccess(
      "Registrasi berhasil",
      data.message || "Akun berhasil dibuat, Anda akan diarahkan ke dashboard."
    );

    // MASUK DASHBOARD UTAMA
    navigate("/login");

    // reset form
    setFormData({
      nama: "",
      email: "",
      password: "",
      password_confirmation: "",
      no_telp: "",
      tanggal_lahir: "",
      user_profile: null,
    });
    setPreviewImage(null);
  } catch (err) {
    const msg =
      err?.message ||
      (err?.errors && Object.values(err.errors).flat().join("\n")) ||
      "Registrasi gagal. Silakan coba lagi.";

    alertError("Registrasi gagal", msg);
  } finally {
    setLoading(false);
  }
};

  const passwordScore = passwordStrengthScore(formData.password || "");
  const strengthLabel =
    ["Sangat Lemah", "Lemah", "Cukup", "Kuat", "Sangat Kuat"][
      Math.max(0, passwordScore - 1)
    ] || "";

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue to-blue-600 flex items-stretch justify-center">
      {/* <div className="w-full max-w-7xl bg-white rounded-2xl shadow-2xl overflow-hidden m-4"> */}
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-2xl overflow-hidden m-4">
      {/* <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden m-6"> */}

        <div className="grid grid-cols-1 md:grid-cols-2 h-full">
          {/* LEFT: hotel */}
          {/* <div className="relative min-h-[420px] md:h-full" style={{ backgroundImage: "url('/images/Hotel.jpg')" }}> */}
          <div className="relative min-h-[420px] md:h-full">
            {/* ganti dari tabel hotels / icons */}

            <div className="absolute inset-0 bg-blue-800" />

            <div className="relative z-10 h-full flex flex-col items-center justify-center text-white p-10">
              <div className="text-center max-w-md">
                {/* ganti <img src={path_logo_db} /> */}
                <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-4">
                <img src="/images/logo.png"></img>
                  
                </div>

                <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-3">
                  Selamat Datang di Hotello
                </h2>
                <p className="text-blue-100">
                  Bergabung dan nikmati pengalaman menginap terbaik dengan
                  kurasi hotel berbintang, layanan prima, dan harga bersahabat.
                </p>

                <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="bg-white/15 backdrop-blur rounded-xl p-4 border border-white/20 text-center">
                    <div className="w-8 h-8 rounded-lg bg-white/25 mx-auto mb-2 flex items-center justify-center">
                      <span className="text-sm font-bold">🛏</span>
                      {/* nanti ganti pake <img src={path_icon_kamar_dari_db} /> */}
                    </div>
                    <h3 className="font-semibold text-sm">Kamar Nyaman</h3>
                    <p className="text-xs text-blue-100">
                      Spring bed premium & linen bersih
                    </p>
                  </div>

                  <div className="bg-white/15 backdrop-blur rounded-xl p-4 border border-white/20 text-center">
                    <div className="w-8 h-8 rounded-lg bg-white/25 mx-auto mb-2 flex items-center justify-center">
                      <span className="text-sm font-bold">📶</span>
                      {/* ganti pake icon wifi dari DB */}
                    </div>
                    <h3 className="font-semibold text-sm">Wi-Fi Cepat</h3>
                    <p className="text-xs text-blue-100">
                      Streaming & kerja tanpa hambatan
                    </p>
                  </div>

                  <div className="bg-white/15 backdrop-blur rounded-xl p-4 border border-white/20 text-center">
                    <div className="w-8 h-8 rounded-lg bg-white/25 mx-auto mb-2 flex items-center justify-center">
                      <span className="text-sm font-bold">🛁</span>
                      {/* ganti pake icon bath dari DB */}
                    </div>
                    <h3 className="font-semibold text-sm">Kamar Mandi</h3>
                    <p className="text-xs text-blue-100">
                      Air panas & amenities lengkap
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: form register */}
          <div className="p-8 md:p-12">
            <div className="mb-8 text-center">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Daftar Sebagai Customer
              </h1>
              <p className="text-gray-600">
                Isi data diri Anda untuk membuat akun
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* FOTO PROFIL */}
              <div className="flex flex-col items-center mb-6">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden ring-2 ring-blue-100">
                    {previewImage ? (
                      <img
                        src={previewImage}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      // Kasih default avatar dari DB kalo bisa
                      <span className="text-gray-400 text-3xl">👤</span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-0 right-0 bg-blue-600 rounded-full p-2 hover:bg-blue-700 transition"
                  >
                    <span className="text-white text-xs">UP</span>
                    {/* ganti icon sama uploadan dari DB*/}
                  </button>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <p className="text-xs text-gray-500 mt-2">
                  Upload foto profil (opsional)
                </p>
              </div>

              {/* Nama */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nama Lengkap <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="nama"
                  value={formData.nama}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  placeholder="Masukkan nama lengkap"
                  autoComplete="name"
                  required
                />
              </div>

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

              {/* No Telp */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  No. Telepon <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="no_telp"
                  value={formData.no_telp}
                  onChange={handleInputChange}
                  minLength={10}
                  maxLength={15}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  placeholder="08123456789"
                  autoComplete="tel"
                  required
                />
              </div>

              {/* Tanggal Lahir */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tanggal Lahir <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="tanggal_lahir"
                  value={formData.tanggal_lahir}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
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
                    minLength={8}
                    className="w-full pr-12 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    placeholder="Minimal 8 karakter"
                    autoComplete="new-password"
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

                <div className="mt-2">
                  <div className="h-2 rounded-full bg-gray-200 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        passwordScore <= 1
                          ? "bg-red-400 w-1/5"
                          : passwordScore === 2
                          ? "bg-orange-400 w-2/5"
                          : passwordScore === 3
                          ? "bg-yellow-400 w-3/5"
                          : passwordScore === 4
                          ? "bg-green-400 w-4/5"
                          : "bg-emerald-500 w-full"
                      }`}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Kekuatan sandi: {strengthLabel}
                  </p>
                </div>
              </div>

              {/* Konfirmasi Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Konfirmasi Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="password_confirmation"
                    value={formData.password_confirmation}
                    onChange={handleInputChange}
                    minLength={8}
                    className="w-full pr-12 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    placeholder="Ulangi password"
                    autoComplete="new-password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-blue-600"
                  >
                    {showConfirmPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed mt-6 shadow-lg"
              >
                {loading ? "Mendaftar..." : "Daftar Sekarang"}
              </button>

              <p className="text-xs text-gray-500 text-center mt-2">
                Dengan mendaftar, Anda menyetujui{" "}
                <span className="text-blue-600">Syarat &amp; Ketentuan</span>{" "}
                dan <span className="text-blue-600">Kebijakan Privasi</span>.
              </p>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Sudah punya akun?{" "}
                <Link
                  to="/login"
                  className="text-blue-600 hover:text-blue-700 font-semibold"
                >
                  Login di sini
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
