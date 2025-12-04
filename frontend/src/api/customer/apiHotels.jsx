import useAxios from "..";

// ambil semua hotel
export const fetchHotels = async () => {
  const res = await useAxios.get("/hotels");
  return res.data;
};

// ambil detail hotel by id
export const fetchHotelById = async (id) => {
  const res = await useAxios.get(`/hotels/${id}`);
  return res.data;
};

// ambil detail hotel
export const fetchHotelDetail = async (id) => {
  const res = await useAxios.get(`/hotel-detail/${id}`);
  return res.data;
};

// ambil ketersediaan kamar untuk rentang tanggal
export const fetchAvailability = async (id, checkIn, checkOut) => {
  const res = await useAxios.get(
    `/availability/${id}?check_in=${checkIn}&check_out=${checkOut}`
  );
  return res.data;
};

export default {
  fetchHotels,
  fetchHotelById,
  fetchHotelDetail,
  fetchAvailability,
};
