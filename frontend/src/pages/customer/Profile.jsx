import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Mail,
  Phone,
  Calendar,
  User as UserIcon,
  Trash2,
  Edit2,
  LogOut,
  Camera,
} from "lucide-react";

import Navbar from "../../components/Navbar";
import NavbarAdmin from "../../components/NavbarAdmin";
import useAxios, { BASE_URL } from "../../api";
import { alertError, alertSuccess, alertConfirm } from "../../lib/Alert";

export default function Profile() {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const isAdminView = searchParams.get("admin") === "1";

  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user") || "null")
  );

  // form profil
  const [nama, setNama] = useState(user?.nama || "");
  const [email, setEmail] = useState(user?.email || "");
  const [noTelp, setNoTelp] = useState(user?.no_telp || "");
  const [tanggalLahir, setTanggalLahir] = useState(user?.tanggal_lahir || "");

  // foto profil
  const [currentAvatar, setCurrentAvatar] = useState(
    user?.user_profile ? `${BASE_URL}/storage/${user.user_profile}` : null
  );
  const [newAvatarFile, setNewAvatarFile] = useState(null);
  const [newAvatarPreview, setNewAvatarPreview] = useState(null);
  const [hapusFoto, setHapusFoto] = useState(false);

  // form password
  const [passwordLama, setPasswordLama] = useState("");
  const [passwordBaru, setPasswordBaru] = useState("");
  const [passwordBaruKonfirmasi, setPasswordBaruKonfirmasi] = useState("");

  // loading flags
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);

  // edit mode
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  const formatTanggal = (value) => {
    if (!value) return "-";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return new Intl.DateTimeFormat("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }).format(date);
  };

  const toInputDate = (value) => {
    if (!value) return "";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toISOString().slice(0, 10);
  };

  // kalau tidak ada user di localStorage, lempar ke login
  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  // sync user terbaru dari backend
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await useAxios.get("/user");
        const freshUser = res.data.data;
        setUser(freshUser);
        localStorage.setItem("user", JSON.stringify(freshUser));

        setNama(freshUser.nama || "");
        setEmail(freshUser.email || "");
        setNoTelp(freshUser.no_telp || "");
        setTanggalLahir(toInputDate(freshUser.tanggal_lahir));
        setCurrentAvatar(
          freshUser.user_profile
            ? `${BASE_URL}/storage/${freshUser.user_profile}`
            : null
        );
      } catch (err) {
        console.error(err);
      }
    };

    fetchUser();
  }, []);

  if (!user) return null;

  /* ========== HANDLE PROFIL (DATA + FOTO) ========== */

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setNewAvatarFile(file);
    setHapusFoto(false);

    const previewUrl = URL.createObjectURL(file);
    setNewAvatarPreview(previewUrl);
  };

  const handleRemovePhoto = () => {
    setNewAvatarFile(null);
    setNewAvatarPreview(null);
    setHapusFoto(true);
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoadingProfile(true);

    try {
      const formData = new FormData();
      formData.append("nama", nama);
      formData.append("email", email);
      formData.append("no_telp", noTelp);
      formData.append("tanggal_lahir", tanggalLahir);
      formData.append("_method", "PATCH");

      if (hapusFoto) {
        formData.append("hapus_foto", "1");
      }

      if (newAvatarFile) {
        formData.append("user_profile", newAvatarFile);
      }

      const res = await useAxios.post("/user", formData);

      const updatedUser = res.data.data;
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));

      if (updatedUser.user_profile) {
        setCurrentAvatar(`${BASE_URL}/storage/${updatedUser.user_profile}`);
      } else {
        setCurrentAvatar(null);
      }
      setNewAvatarFile(null);
      setNewAvatarPreview(null);
      setHapusFoto(false);
      setIsEditingProfile(false);
      setTanggalLahir(toInputDate(updatedUser.tanggal_lahir));

      alertSuccess("Berhasil", "Profil berhasil diperbarui");
    } catch (err) {
      console.error(err);
      alertError(
        "Gagal menyimpan",
        err.response?.data?.message ||
          "Terjadi kesalahan saat menyimpan profil"
      );
    } finally {
      setLoadingProfile(false);
    }
  };

  // Simpan foto tanpa harus keluar dari kartu avatar
  const handleAvatarSave = async () => {
    if (!newAvatarFile && !hapusFoto) {
      alertError("Tidak ada perubahan", "Pilih foto baru atau hapus foto terlebih dahulu.");
      return;
    }

    setLoadingProfile(true);
    try {
      const formData = new FormData();
      formData.append("nama", nama);
      formData.append("email", email);
      formData.append("no_telp", noTelp);
      formData.append("tanggal_lahir", tanggalLahir);
      formData.append("_method", "PATCH");

      if (hapusFoto) {
        formData.append("hapus_foto", "1");
      }
      if (newAvatarFile) {
        formData.append("user_profile", newAvatarFile);
      }

      const res = await useAxios.post("/user", formData);

      const updatedUser = res.data.data;
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setCurrentAvatar(
        updatedUser.user_profile
          ? `${BASE_URL}/storage/${updatedUser.user_profile}`
          : null
      );
      setTanggalLahir(toInputDate(updatedUser.tanggal_lahir));
      setNewAvatarFile(null);
      setNewAvatarPreview(null);
      setHapusFoto(false);

      alertSuccess("Berhasil", "Foto profil berhasil diperbarui");
    } catch (err) {
      console.error(err);
      alertError(
        "Gagal menyimpan",
        err.response?.data?.message ||
          "Terjadi kesalahan saat menyimpan foto profil"
      );
    } finally {
      setLoadingProfile(false);
    }
  };

  /* ========== HANDLE PASSWORD ========== */

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setLoadingPassword(true);

    try {
      await useAxios.post("/user/password", {
        password_lama: passwordLama,
        password_baru: passwordBaru,
        password_baru_confirmation: passwordBaruKonfirmasi,
      });

      setPasswordLama("");
      setPasswordBaru("");
      setPasswordBaruKonfirmasi("");

      alertSuccess("Berhasil", "Password berhasil diubah");
    } catch (err) {
      console.error(err);
      alertError(
        "Gagal mengubah password",
        err.response?.data?.message ||
          "Terjadi kesalahan saat mengubah password"
      );
    } finally {
      setLoadingPassword(false);
    }
  };

  // hapus akun

  const handleDeleteAccount = async () => {
    const result = await alertConfirm({
      title: "Hapus akun?",
      text: "Apakah Anda yakin ingin menghapus akun? Tindakan ini tidak dapat dibatalkan.",
      confirmButtonText: "Ya, hapus",
      cancelButtonText: "Batal",
    });
    if (!result.isConfirmed) return;

    setLoadingDelete(true);

    try {
      await useAxios.delete("/user");

      localStorage.clear();
      alertSuccess("Akun dihapus", "Akun Anda telah berhasil dihapus");
      navigate("/");
    } catch (err) {
      console.error(err);
      alertError(
        "Gagal menghapus akun",
        err.response?.data?.message || "Terjadi kesalahan saat menghapus akun"
      );
    } finally {
      setLoadingDelete(false);
    }
  };

  const avatarToShow = newAvatarPreview || currentAvatar;

  const content = (
    <main className="flex-1">
      <div className="max-w-4xl mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            Profil Saya
          </h1>

          {/* Card Profil Utama dengan Foto */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-4">
            <div className="flex flex-col items-center">
              {/* Avatar dengan tombol ganti foto */}
              <div className="relative group mb-4">
                <div className="w-28 h-28 rounded-full overflow-hidden bg-blue-600 flex items-center justify-center text-white text-4xl font-semibold">
                  {avatarToShow ? (
                    <img
                      src={avatarToShow}
                      alt={nama}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  ) : (
                    (nama || "U")?.charAt(0).toUpperCase()
                  )}
                </div>
                
                {/* Overlay untuk upload foto */}
                <label className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer rounded-full">
                  <Camera className="w-6 h-6 text-white" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                </label>
              </div>

              <h2 className="text-xl font-semibold text-gray-900 mb-1">
                {nama}
              </h2>
              <p className="text-sm text-gray-500">{email}</p>

              {/* Tautan ganti foto */}
              <label className="mt-2 inline-flex items-center gap-2 text-xs font-semibold text-blue-600 hover:text-blue-700 cursor-pointer">
                <Camera className="w-4 h-4" />
                Ganti foto profil
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
              </label>

              {/* Tombol hapus foto jika ada preview baru */}
              {newAvatarPreview && (
                <button
                  type="button"
                  onClick={handleRemovePhoto}
                  className="mt-3 text-xs text-red-600 hover:text-red-700 flex items-center gap-1 transition-all duration-150 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-200 rounded-md"
                >
                  <Trash2 className="w-3 h-3" />
                  Hapus foto yang dipilih
                </button>
              )}

              {(newAvatarPreview || newAvatarFile || hapusFoto) && (
                <button
                  type="button"
                  onClick={handleAvatarSave}
                  disabled={loadingProfile}
                  className="mt-3 inline-flex items-center gap-2 px-3 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg disabled:opacity-60 shadow-sm transition-all duration-150 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-200"
                >
                  <Camera className="w-4 h-4" />
                  {loadingProfile ? "Menyimpan..." : "Simpan Foto"}
                </button>
              )}
            </div>
          </div>

          {/* Card Informasi Akun */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                Informasi Akun
              </h3>
              {!isEditingProfile ? (
                <button
                  onClick={() => setIsEditingProfile(true)}
                  className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 px-2 py-1 rounded-md transition-all duration-150 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-200"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit
                </button>
              ) : (
                <button
                  onClick={() => {
                    setIsEditingProfile(false);
                    setNama(user.nama || "");
                    setEmail(user.email || "");
                    setNoTelp(user.no_telp || "");
                    setTanggalLahir(user.tanggal_lahir || "");
                    setNewAvatarFile(null);
                    setNewAvatarPreview(null);
                    setHapusFoto(false);
                  }}
                  className="text-sm text-gray-600 hover:text-gray-700 px-2 py-1 rounded-md transition-all duration-150 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-200"
                >
                  Batal
                </button>
              )}
            </div>

            {isEditingProfile ? (
              <form onSubmit={handleProfileSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-2">
                    Nama Lengkap
                  </label>
                  <div className="flex items-center gap-3 pb-3 border-b border-gray-200">
                    <UserIcon className="w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={nama}
                      onChange={(e) => setNama(e.target.value)}
                      className="flex-1 text-gray-900 outline-none"
                      placeholder="Masukkan nama lengkap"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-2">
                    Email
                  </label>
                  <div className="flex items-center gap-3 pb-3 border-b border-gray-200">
                    <Mail className="w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="flex-1 text-gray-900 outline-none"
                      placeholder="email@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-2">
                    No. Telepon
                  </label>
                  <div className="flex items-center gap-3 pb-3 border-b border-gray-200">
                    <Phone className="w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={noTelp}
                      onChange={(e) => setNoTelp(e.target.value)}
                      className="flex-1 text-gray-900 outline-none"
                      placeholder="08xx-xxxx-xxxx"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-2">
                    Tanggal Lahir
                  </label>
                  <div className="flex items-center gap-3 pb-3 border-b border-gray-200">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <input
                      type="date"
                      value={tanggalLahir || ""}
                      onChange={(e) => setTanggalLahir(e.target.value)}
                      className="flex-1 text-gray-900 outline-none"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditingProfile(false);
                      setNama(user.nama || "");
                      setEmail(user.email || "");
                      setNoTelp(user.no_telp || "");
                      setTanggalLahir(user.tanggal_lahir || "");
                      setNewAvatarFile(null);
                      setNewAvatarPreview(null);
                      setHapusFoto(false);
                    }}
                    className="px-4 py-2 text-sm text-gray-600 hover:text-gray-700 rounded-lg transition-all duration-150 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-200"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={loadingProfile}
                    className="px-6 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-all duration-150 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-200"
                  >
                    {loadingProfile ? "Menyimpan..." : "Simpan"}
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-2">
                    Nama Lengkap
                  </label>
                  <div className="flex items-center gap-3 pb-3 border-b border-gray-200">
                    <UserIcon className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-900">{nama}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-2">
                    Email
                  </label>
                  <div className="flex items-center gap-3 pb-3 border-b border-gray-200">
                    <Mail className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-900">{email}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-2">
                    No. Telepon
                  </label>
                  <div className="flex items-center gap-3 pb-3 border-b border-gray-200">
                    <Phone className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-900">{noTelp || "-"}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-2">
                    Tanggal Lahir
                  </label>
                  <div className="flex items-center gap-3 pb-3 border-b border-gray-200">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-900">{formatTanggal(tanggalLahir)}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Card Keamanan Akun - Form langsung ditampilkan */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-4">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                Keamanan Akun
              </h3>
            </div>

            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-600 mb-2">
                  Password Lama
                </label>
                <input
                  type="password"
                  value={passwordLama}
                  onChange={(e) => setPasswordLama(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  placeholder="Masukkan password lama"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-2">
                  Password Baru
                </label>
                <input
                  type="password"
                  value={passwordBaru}
                  onChange={(e) => setPasswordBaru(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  placeholder="Masukkan password baru"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-2">
                  Konfirmasi Password Baru
                </label>
                <input
                  type="password"
                  value={passwordBaruKonfirmasi}
                  onChange={(e) => setPasswordBaruKonfirmasi(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  placeholder="Konfirmasi password baru"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setPasswordLama("");
                    setPasswordBaru("");
                    setPasswordBaruKonfirmasi("");
                  }}
                  className="px-4 py-2 text-sm text-gray-600 hover:text-gray-700 rounded-lg transition-all duration-150 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-200"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={loadingPassword}
                  className="px-6 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-all duration-150 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-200"
                >
                  {loadingPassword ? "Menyimpan..." : "Ubah Password"}
                </button>
              </div>
            </form>
          </div>

          {/* Card Logout & Delete Account */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex flex-col sm:flex-row gap-3">
              {/* <button
                onClick={handleLogout}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-150 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-200"
              >
                <LogOut className="w-4 h-4" />
                Keluar
              </button> */}
              <button
                onClick={handleDeleteAccount}
                disabled={loadingDelete}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-all duration-150 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-200 disabled:opacity-50"
              >
                <Trash2 className="w-4 h-4" />
                {loadingDelete ? "Menghapus..." : "Hapus Akun"}
              </button>
            </div>
          </div>
        </div>
      </main>
  );

  if (isAdminView) {
    return (
      <div className="min-h-screen flex bg-[#f4f6fb] text-slate-800">
        <NavbarAdmin />
        <div className="flex-1 p-4 md:p-8">{content}</div>
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
