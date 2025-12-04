import useAxios from "..";

export const fetchPembayarans = async () => {
  const res = await useAxios.get("/admin/pembayarans");
  return res.data;
};

export const markPembayaranPaid = async (id) => {
  const res = await useAxios.put(`/admin/pembayarans/mark-paid/${id}`);
  return res.data;
};

export const markPembayaranFailed = async (id) => {
  const res = await useAxios.put(`/admin/pembayarans/mark-failed/${id}`);
  return res.data;
};

export default { fetchPembayarans, markPembayaranPaid, markPembayaranFailed };
