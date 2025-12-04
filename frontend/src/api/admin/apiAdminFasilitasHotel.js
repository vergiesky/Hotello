import useAxios from "..";

export const fetchFasilitasHotel = async () => {
  const res = await useAxios.get("/fasilitas-hotel");
  return res.data;
};

export const fetchFasilitasHotelById = async (id) => {
  const res = await useAxios.get(`/fasilitas-hotel/${id}`);
  return res.data;
};

export const createFasilitasHotel = async (payload) => {
  const res = await useAxios.post("/fasilitas-hotel/create", payload);
  return res.data;
};

export const updateFasilitasHotel = async (id, payload) => {
  const res = await useAxios.put(`/fasilitas-hotel/update/${id}`, payload);
  return res.data;
};

export const deleteFasilitasHotel = async (id) => {
  const res = await useAxios.delete(`/fasilitas-hotel/delete/${id}`);
  return res.data;
};

export default {
  fetchFasilitasHotel,
  fetchFasilitasHotelById,
  createFasilitasHotel,
  updateFasilitasHotel,
  deleteFasilitasHotel,
};
