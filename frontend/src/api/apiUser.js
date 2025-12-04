import useAxios from ".";

// Ambil profil user yang sedang login
export async function fetchUser() {
  const res = await useAxios.get("/user");
  return res.data;
}

// Perbarui profil (FormData dengan _method PATCH)
export async function updateUser(payload) {
  const res = await useAxios.post("/user", payload);
  return res.data;
}

// Perbarui foto profil (FormData dengan _method PATCH)
export async function updateFoto(payload) {
  const res = await useAxios.post("/user/foto", payload);
  return res.data;
}

// Ubah password user
export async function updatePassword(payload) {
  const res = await useAxios.post("/user/password", payload);
  return res.data;
}

// Hapus akun user
export async function deleteUser() {
  const res = await useAxios.delete("/user");
  return res.data;
}

export default {
  fetchUser,
  updateUser,
  updatePassword,
  deleteUser,
};
