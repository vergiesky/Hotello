import useAxios from "..";

export const fetchFasilitasKamar = async () => {
  const res = await useAxios.get("/fasilitas-kamar");
  return res.data;
};

export const fetchFasilitasKamarById = async (id) => {
  const res = await useAxios.get(`/fasilitas-kamar/${id}`);
  return res.data;
};

export const createFasilitasKamar = async (payload) => {
  const res = await useAxios.post("/fasilitas-kamar/create", payload);
  return res.data;
};

export const updateFasilitasKamar = async (id, payload) => {
  const res = await useAxios.put(`/fasilitas-kamar/update/${id}`, payload);
  return res.data;
};

export const deleteFasilitasKamar = async (id) => {
  const res = await useAxios.delete(`/fasilitas-kamar/delete/${id}`);
  return res.data;
};

export default {
  fetchFasilitasKamar,
  fetchFasilitasKamarById,
  createFasilitasKamar,
  updateFasilitasKamar,
  deleteFasilitasKamar,
};
