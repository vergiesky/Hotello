// Normalize user payload into consistent shape for profile state.
export function normalizeUser(user) {
  if (!user) return null;
  return {
    ...user,
    nama: user.nama || "",
    email: user.email || "",
    no_telp: user.no_telp || "",
    tanggal_lahir: user.tanggal_lahir || "",
    user_profile: user.user_profile || null,
  };
}

// Build FormData for profile updates (supports foto & hapus_foto).
export function buildProfileFormData({
  nama,
  email,
  noTelp,
  tanggalLahir,
  // avatarFile,
  // hapusFoto,
}) {
  const formData = new FormData();
  formData.append("nama", nama || "");
  formData.append("email", email || "");
  formData.append("no_telp", noTelp || "");
  formData.append("tanggal_lahir", tanggalLahir || "");
  formData.append("_method", "PATCH");

  // if (hapusFoto) {
  //   formData.append("hapus_foto", "1");
  // }

  // if (avatarFile) {
  //   formData.append("user_profile", avatarFile);
  // }

  return formData;
}

// Update khusus Foto Profile
export function buildPhotoProfileFormData({
  avatarFile,
  hapusFoto,
}) {
  const formData = new FormData();
  formData.append("_method", "PATCH");

  if (hapusFoto) {
    formData.append("hapus_foto", "1");
  }

  if (avatarFile) {
    formData.append("user_profile", avatarFile);
  }

  return formData;
}

// Reset helpers
export function resetProfileState(setters, user) {
  const { setNama, setEmail, setNoTelp, setTanggalLahir, setAvatarFile, setAvatarPreview, setHapusFoto } =
    setters;
  if (!user) return;
  setNama(user.nama || "");
  setEmail(user.email || "");
  setNoTelp(user.no_telp || "");
  setTanggalLahir(user.tanggal_lahir || "");
  setAvatarFile?.(null);
  setAvatarPreview?.(null);
  setHapusFoto?.(false);
}

export function resetPasswordState(setters) {
  const { setPasswordLama, setPasswordBaru, setPasswordBaruKonfirmasi } = setters;
  setPasswordLama("");
  setPasswordBaru("");
  setPasswordBaruKonfirmasi("");
}

// validasi
export function hasProfileChanges({
  nama,
  email,
  noTelp,
  tanggalLahir,
  current,
  avatarFile,
  hapusFoto,
}) {
  if (!current) return true;
  const changedFields =
    nama !== (current.nama || "") ||
    email !== (current.email || "") ||
    noTelp !== (current.no_telp || "") ||
    (tanggalLahir || "") !== (current.tanggal_lahir || "");

  const avatarChanged = Boolean(avatarFile) || Boolean(hapusFoto);
  return changedFields || avatarChanged;
}

export function hasAvatarChanges({ avatarFile, hapusFoto }) {
  return Boolean(avatarFile) || Boolean(hapusFoto);
}

// validasi profil
export function validateProfileFields({ nama, email, noTelp, tanggalLahir }) {
  if (!nama?.trim()) return "Nama lengkap wajib diisi.";

  if (!email?.trim()) return "Email wajib diisi.";

  const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
  if (!emailRegex.test(email)) {
    return "Format email tidak valid. Gunakan contoh: email@gmail.com.";
  }

  if (!noTelp?.trim()) return "No. telepon wajib diisi.";
  const phoneDigits = noTelp.replace(/\D/g, "");
  if (phoneDigits.length < 12) return "No. telepon minimal 12 digit.";

  if (!tanggalLahir?.trim()) return "Tanggal lahir wajib diisi.";

  return null;
}

export default {
  normalizeUser,
  buildProfileFormData,
  resetProfileState,
  resetPasswordState,
  hasProfileChanges,
  hasAvatarChanges,
  validateProfileFields,
};