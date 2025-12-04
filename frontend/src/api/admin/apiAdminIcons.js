import useAxios from "..";

export const fetchIcons = async () => {
  const res = await useAxios.get("/icons");
  return res.data;
};

export const fetchIconById = async (id) => {
  const res = await useAxios.get(`/icons/${id}`);
  return res.data;
};

export const createIcon = async (formData) => {
  const res = await useAxios.post("/icons/create", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const updateIcon = async (id, formData) => {
  const res = await useAxios.put(`/icons/update/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const deleteIcon = async (id) => {
  const res = await useAxios.delete(`/icons/delete/${id}`);
  return res.data;
};

export default {
  fetchIcons,
  fetchIconById,
  createIcon,
  updateIcon,
  deleteIcon,
};
