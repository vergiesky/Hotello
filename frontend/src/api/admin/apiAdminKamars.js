import useAxios from "..";

export const fetchKamars = async () => {
  const res = await useAxios.get("/kamars");
  return res.data;
};

export const fetchKamarById = async (id) => {
  const res = await useAxios.get(`/kamars/${id}`);
  return res.data;
};

export const createKamar = async (payload) => {
  const res = await useAxios.post("/kamars/create", payload);
  return res.data;
};

export const updateKamar = async (id, payload) => {
  const res = await useAxios.put(`/kamars/update/${id}`, payload);
  return res.data;
};

export const deleteKamar = async (id) => {
  const res = await useAxios.delete(`/kamars/delete/${id}`);
  return res.data;
};

export default {
  fetchKamars,
  fetchKamarById,
  createKamar,
  updateKamar,
  deleteKamar,
};
