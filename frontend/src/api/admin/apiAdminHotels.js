import useAxios from "..";

export const fetchHotels = async () => {
  const res = await useAxios.get("/hotels");
  return res.data;
};

export const fetchHotelById = async (id) => {
  const res = await useAxios.get(`/hotels/${id}`);
  return res.data;
};

export const createHotel = async (payload) => {
  const res = await useAxios.post("/hotels/create", payload);
  return res.data;
};

export const updateHotel = async (id, payload) => {
  const res = await useAxios.put(`/hotels/update/${id}`, payload);
  return res.data;
};

export const deleteHotel = async (id) => {
  const res = await useAxios.delete(`/hotels/delete/${id}`);
  return res.data;
};

export default {
  fetchHotels,
  fetchHotelById,
  createHotel,
  updateHotel,
  deleteHotel,
};
