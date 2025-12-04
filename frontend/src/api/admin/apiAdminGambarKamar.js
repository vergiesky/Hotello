import useAxios from "..";

export const fetchGambarKamar = async () => {
  const res = await useAxios.get("/gambar-kamar");
  return res.data;
};

export const fetchGambarKamarById = async (id) => {
  const res = await useAxios.get(`/gambar-kamar/${id}`);
  return res.data;
};

export const createGambarKamar = async (formData) => {
  const res = await useAxios.post("/gambar-kamar/create", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const updateGambarKamar = async (id, formData) => {
  const res = await useAxios.post(`/gambar-kamar/update/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const deleteGambarKamar = async (id) => {
  const res = await useAxios.delete(`/gambar-kamar/delete/${id}`);
  return res.data;
};

export default {
  fetchGambarKamar,
  fetchGambarKamarById,
  createGambarKamar,
  updateGambarKamar,
  deleteGambarKamar,
};