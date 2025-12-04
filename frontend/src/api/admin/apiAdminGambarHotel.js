import useAxios from "..";

export const fetchGambarHotel = async () => {
  const res = await useAxios.get("/gambar-hotel");
  return res.data;
};

export const fetchGambarHotelById = async (id) => {
  const res = await useAxios.get(`/gambar-hotel/${id}`);
  return res.data;
};

export const createGambarHotel = async (formData) => {
  const res = await useAxios.post("/gambar-hotel/create", formData, {
    headers: { "Content-Type": "multipart/form-data" }, // format khusus untuk mengirim data form yang berisi file (gambar)
  });
  return res.data;
};

export const updateGambarHotel = async (id, formData) => {
  const res = await useAxios.post(`/gambar-hotel/update/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const deleteGambarHotel = async (id) => {
  const res = await useAxios.delete(`/gambar-hotel/delete/${id}`);
  return res.data;
};

export default {
  fetchGambarHotel,
  fetchGambarHotelById,
  createGambarHotel,
  updateGambarHotel,
  deleteGambarHotel,
};
