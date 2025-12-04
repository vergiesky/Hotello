import useAxios from "..";

// ambil semua review
export const fetchReviews = async () => {
  const res = await useAxios.get("/reviews");
  return res.data;
};

// ambil detail review by id
export const fetchReviewById = async (id) => {
  const res = await useAxios.get(`/reviews/${id}`);
  return res.data;
};

// buat review
export const createReview = async (formData) => {
  const res = await useAxios.post("/reviews/create", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

// hapus review
export const deleteReview = async (id) => {
  const res = await useAxios.delete(`/reviews/delete/${id}`);
  return res.data;
};

export default { fetchReviews, fetchReviewById, createReview, deleteReview };
