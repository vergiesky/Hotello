import useAxios from "..";

// daftar pembayaran milik customer
export const fetchPembayarans = async () => {
  const res = await useAxios.get("/pembayarans");
  return res.data;
};

// detail pembayaran tertentu
export const fetchPembayaranById = async (id) => {
  const res = await useAxios.get(`/pembayarans/${id}`);
  return res.data;
};

// membuat pembayaran baru
export const createPembayaran = async (payload) => {
  const res = await useAxios.post("/pembayarans/create", payload);
  return res.data;
};

// hapus pembayaran (hanya status pending)
export const deletePembayaran = async (id) => {
  const res = await useAxios.delete(`/pembayarans/delete/${id}`);
  return res.data;
};

export default {
  fetchPembayarans,
  fetchPembayaranById,
  createPembayaran,
  deletePembayaran,
};
