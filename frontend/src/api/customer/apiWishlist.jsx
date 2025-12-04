import useAxios from "..";

// ambil semua wishlist milik user yang sedang login
export const fetchWishlists = async () => {
  const res = await useAxios.get("/wishlists");
  return res.data;
};

// tambah hotel ke wishlist
export const createWishlist = async (id_hotel) => {
  const res = await useAxios.post("/wishlists/create", { id_hotel });
  return res.data;
};

// hapus wishlist berdasarkan id_wishlist
export const deleteWishlist = async (id_wishlist) => {
  const res = await useAxios.delete(`/wishlists/delete/${id_wishlist}`);
  return res.data;
};

export default { fetchWishlists, createWishlist, deleteWishlist };
