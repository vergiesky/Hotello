import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "../components/customer/Navbar";
import NavbarAdmin from "../components/admin/NavbarAdmin";
import { BASE_URL } from "../api";
import { alertError, alertSuccess, alertConfirm } from "../lib/Alert";
import { formatDateLong, toInputDate } from "../lib/formatDate";
import {
  fetchUser,
  updateUser,
  updateFoto, // pisahin update foto
  updatePassword,
  deleteUser,
} from "../api/apiUser";
import ProfileHeader from "../components/profile/ProfileHeader";
import ProfileAvatarCard from "../components/profile/ProfileAvatarCard";
import ProfileInfoForm from "../components/profile/ProfileInfoForm";
import ProfileSecurityForm from "../components/profile/ProfileSecurityForm";
import ProfileDangerZone from "../components/profile/ProfileDangerZone";
import {
  normalizeUser,
  buildProfileFormData,
  buildPhotoProfileFormData, // bikin update foto
  resetProfileState,
  resetPasswordState,
  hasProfileChanges,
  hasAvatarChanges,
  validateProfileFields,
} from "../lib/userHelpers";

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
  const [tanggalLahir, setTanggalLahir] = useState(
    toInputDate(user?.tanggal_lahir)
  );

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

  const hasPendingAvatar = Boolean(newAvatarPreview || newAvatarFile);

  const resetProfileFields = () => {
    if (!user) return;
    resetProfileState(
      {
        setNama,
        setEmail,
        setNoTelp,
        setTanggalLahir,
        setAvatarFile: setNewAvatarFile,
        setAvatarPreview: setNewAvatarPreview,
        setHapusFoto,
      },
      user
    );
  };

  const resetPasswordForm = () => {
    resetPasswordState({
      setPasswordLama,
      setPasswordBaru,
      setPasswordBaruKonfirmasi,
    });
  };

  // kalau tidak ada user di localStorage, lempar ke login
  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  // sync user terbaru dari backend
  useEffect(() => {
    const loadUser = async () => {
      try {
        const res = await fetchUser();
        const freshUser = normalizeUser(res?.data || res);
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

    loadUser();
  }, []);

  if (!user) return null;

  // profile (data dan foto)
  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    // reset input value so selecting the same file twice still triggers onChange
    e.target.value = "";
    if (!file) return;

    setNewAvatarFile(file);
    setHapusFoto(false);

    const previewUrl = URL.createObjectURL(file);
    setNewAvatarPreview(previewUrl);
  };

  const handleRemovePhoto = () => {
    setNewAvatarFile(null);
    setNewAvatarPreview(null);
    setHapusFoto(false);
  };

  // Update profil
  const handleProfileSubmit = async (e) => {
    e.preventDefault();

    const validationError = validateProfileFields({
      nama,
      email,
      noTelp,
      tanggalLahir,
    });
    if (validationError) {
      alertError("Validasi gagal", validationError);
      return;
    }

    setLoadingProfile(true);

    try {
      const formData = buildProfileFormData({
        nama,
        email,
        noTelp,
        tanggalLahir,
        // avatarFile: newAvatarFile,
        // hapusFoto,
      });

      const res = await updateUser(formData);
      const updatedUser = res?.data || res;
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));

      // if (updatedUser.user_profile) {
      //   setCurrentAvatar(`${BASE_URL}/storage/${updatedUser.user_profile}`);
      // } else {
      //   setCurrentAvatar(null);
      // }
      // setNewAvatarFile(null);
      // setNewAvatarPreview(null);
      // setHapusFoto(false);
      // setIsEditingProfile(false);
      setTanggalLahir(toInputDate(updatedUser.tanggal_lahir));

      alertSuccess("Berhasil", "Profil berhasil diperbarui");
    } catch (err) {
      console.error(err);
      alertError(
        "Gagal menyimpan",
        err.response?.data?.message || "Terjadi kesalahan saat menyimpan profil"
      );
    } finally {
      setLoadingProfile(false);
    }
  };

  // simpan foto
  const handleAvatarSave = async () => {
    if (!hasAvatarChanges({ avatarFile: newAvatarFile, hapusFoto })) {
      alertError(
        "Tidak ada perubahan",
        "Pilih foto baru atau hapus foto terlebih dahulu."
      );
      return;
    }

    // const validationError = validateProfileFields({
    //   nama,
    //   email,
    //   noTelp,
    //   tanggalLahir,
    // });
    // if (validationError) {
    //   alertError("Validasi gagal", validationError);
    //   return;
    // }

    if (
      !hasProfileChanges({
        // nama,
        // email,
        // noTelp,
        // tanggalLahir,
        current: user,
        avatarFile: newAvatarFile,
        hapusFoto,
      })
    ) {
      alertError("Tidak ada perubahan", "Tidak ada pembaruan data profil.");
      return;
    }

    setLoadingProfile(true);
    try {
      const formData = buildPhotoProfileFormData({
        // nama,
        // email,
        // noTelp,
        // tanggalLahir,
        avatarFile: newAvatarFile,
        hapusFoto,
      });

      const res = await updateFoto(formData);
      const updatedUser = res?.data || res;
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

  // passowrd
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setLoadingPassword(true);

    try {
      await updatePassword({
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
      await deleteUser();

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
  const containerClass =
    "max-w-5xl mx-auto px-4 sm:px-6 lg:px-10 py-8 space-y-6";

  const content = (
    <main className="flex-1">
      <div className={containerClass}>
        <ProfileHeader />

        <div className="space-y-6">
          <ProfileAvatarCard
            name={nama}
            email={email}
            avatarUrl={avatarToShow}
            hasPendingAvatar={hasPendingAvatar}
            loading={loadingProfile}
            onAvatarChange={handleAvatarChange}
            onRemoveSelected={handleRemovePhoto}
            onSaveAvatar={handleAvatarSave}
          />

          <div className="space-y-6 max-w-4xl mx-auto w-full">
            <ProfileInfoForm
              isEditing={isEditingProfile}
              nama={nama}
              email={email}
              noTelp={noTelp}
              tanggalLahir={tanggalLahir}
              tanggalLahirDisplay={formatDateLong(tanggalLahir)}
              onNamaChange={setNama}
              onEmailChange={setEmail}
              onNoTelpChange={setNoTelp}
              onTanggalLahirChange={setTanggalLahir}
              onSubmit={handleProfileSubmit}
              onEdit={() => setIsEditingProfile(true)}
              onCancel={() => {
                setIsEditingProfile(false);
                resetProfileFields();
              }}
              loading={loadingProfile}
            />

            <ProfileSecurityForm
              passwordLama={passwordLama}
              passwordBaru={passwordBaru}
              passwordBaruKonfirmasi={passwordBaruKonfirmasi}
              onPasswordLamaChange={setPasswordLama}
              onPasswordBaruChange={setPasswordBaru}
              onPasswordBaruKonfirmasiChange={setPasswordBaruKonfirmasi}
              onSubmit={handlePasswordSubmit}
              onReset={resetPasswordForm}
              loading={loadingPassword}
            />

            <ProfileDangerZone
              onDelete={handleDeleteAccount}
              loading={loadingDelete}
            />
          </div>
        </div>
      </div>
    </main>
  );

  if (isAdminView) {
    return (
      <div className="min-h-screen bg-[#f4f6fb] text-slate-800 flex flex-col md:flex-row">
        <NavbarAdmin />
        <div className="flex-1 w-full p-4 sm:p-6 lg:p-8">{content}</div>
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
