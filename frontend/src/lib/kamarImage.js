import { BASE_URL } from "../api";

// Ambil URL gambar kamar pertama (fallback jika tidak ada)
export function getKamarImageUrl(kamar) {
  const urls = getKamarImageUrls(kamar);
  return urls?.[0] || "/images/hotel1_main.jpg";
}

// Ambil semua URL gambar kamar
export function getKamarImageUrls(kamar) {
  const imgs = kamar?.gambar_kamars || [];
  if (!imgs.length) return ["/images/hotel1_main.jpg"];

  return imgs.map((img) => {
    const path = (img?.file_path_gambar_kamar || "").trim();
    if (!path) return "/images/hotel1_main.jpg";
    const isAbsolute = path.startsWith("http://") || path.startsWith("https://");
    return isAbsolute ? path : `${BASE_URL}/storage/${path}`;
  });
}

export default getKamarImageUrl;
