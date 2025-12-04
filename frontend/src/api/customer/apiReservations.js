import useAxios from "..";

// membuat reservasi baru
export const createReservasi = async (payload) => {
  const res = await useAxios.post("/reservasis/create", payload);
  return res.data;
};

// ambil detail reservasi by id
export const fetchReservasiById = async (id) => {
  const res = await useAxios.get(`/reservasis/${id}`);
  return res.data;
};

// ambil list reservasi user
export const fetchReservasiList = async () => {
  const res = await useAxios.get("/reservasis");
  return res.data;
};

export default { createReservasi, fetchReservasiById, fetchReservasiList };
