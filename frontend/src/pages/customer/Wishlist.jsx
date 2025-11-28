import React, { useEffect, useState } from "react";
import { MapPin, Star, Trash2, ArrowLeft } from "lucide-react";

import useAxios, { BASE_URL } from "../../api";
import { alertError } from "../../lib/Alert";
import Navbar from "../../components/Navbar";
import { toastInfo } from "../../lib/Toast";

/* HELPER IMAGE HOTEL (DARI DB) */
function getHotelImageUrl(hotel) {
  const firstImage = hotel?.gambar_hotels?.[0];

  if (!firstImage || !firstImage.file_path_gambar_hotel) {
    return "/images/hotel1_main.jpg";
  }

  let path = (firstImage.file_path_gambar_hotel || "").trim();

  const isAbsolute =
    path.startsWith("http://") || path.startsWith("https://");

  if (isAbsolute) {
    return path;
  }

  // path relatif dari storage Laravel, contoh: "gambar_hotels/93T....jpg"
  return `${BASE_URL}/storage/${path}`;
}

export default function Wishlist() {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        // Pake endpoint backend
        const res = await useAxios.get("/wishlists");
        const data = res.data.data || [];
        setWishlist(Array.isArray(data) ? data : []);
        console.log(res.data);
      } catch (err) {
        console.error(err);
        alertError(
          "Gagal memuat wishlist",
          "Terjadi kesalahan saat mengambil data wishlist."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, []);

const handleRemove = async (item) => {
  try {
    await useAxios.delete(`/wishlists/delete/${item.id_wishlist}`);

    setWishlist((prev) =>
      prev.filter((w) => w.id_wishlist !== item.id_wishlist)
    );

    // 🔔 Toastify sukses hapus
    toastInfo("Hotel dihapus dari wishlist");
  } catch (err) {
    console.error(err);
    alertError(
      "Gagal menghapus",
      "Terjadi kesalahan saat menghapus dari wishlist."
    );
  }
};
  // Ambil data hotel dari item wishlist (bisa nested)
  const getHotelFromItem = (item) => {
    return item.hotel || item.kamar?.hotel || item;
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      {/* KONTEN WISHLIST */}
      <main className="flex-1">
        <section className="max-w-6xl mx-auto px-4 pt-8 pb-12">

          {/* Judul & info jumlah */}
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
              Hotel Favorit Saya
            </h1>
            <p className="text-slate-500 mt-2">
              {loading
                ? "Memuat wishlist..."
                : wishlist.length === 0
                ? "Belum ada hotel dalam wishlist Anda."
                : `${wishlist.length} hotel dalam wishlist Anda`}
            </p>
          </div>

          {/* Grid card */}
          {!loading && wishlist.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
              {wishlist.map((item) => {
                const hotel = getHotelFromItem(item);
                const imageUrl = getHotelImageUrl(hotel);

                const hargaNumber =
                  hotel?.harga_termurah ||
                  hotel?.harga_per_malam ||
                  hotel?.harga ||
                  0;

                const hargaFormatted =
                  hargaNumber && !isNaN(hargaNumber)
                    ? `Rp ${Number(hargaNumber).toLocaleString("id-ID")}`
                    : "-";

                return (
                  <div
                    key={item.id_wishlist || hotel?.id_hotel}
                    className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col relative h-full"
                  >
                    {/* Tombol hapus */}
                    <button
                      type="button"
                      onClick={() => handleRemove(item)}
                      className="absolute top-4 right-4 w-9 h-9 rounded-full bg-red-50 border border-red-200 flex items-center justify-center hover:bg-red-100 transition"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>

                    {/* FOTO HOTEL */}
                    <div className="h-40 bg-gray-100">
                      <img
                        src={imageUrl}
                        alt={hotel?.nama_hotel}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = "/images/hotel1_main.jpg";
                        }}
                      />
                    </div>

                    {/* DETAIL HOTEL */}
                    <div className="p-6 flex flex-col flex-1">
                      <h3 className="font-semibold text-lg mb-1">
                        {hotel?.nama_hotel || "Nama hotel"}
                      </h3>

                      <div className="flex items-center text-gray-600 text-sm mb-2">
                        <MapPin className="w-4 h-4 mr-1" />
                        {(hotel?.kota || "") +
                          (hotel?.alamat ? ` • ${hotel.alamat}` : "")}
                      </div>

                      <div className="flex items-center gap-1 mb-2">
                        <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                        <span>{hotel?.rating_hotel ?? "-"}</span>
                      </div>

                      <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-grow">
                        {hotel?.deskripsi ||
                          "Hotel nyaman dengan fasilitas lengkap untuk perjalanan Anda."}
                      </p>

                      <div className="mb-4 text-sm">
                        <p className="text-gray-500 mb-1">Mulai dari</p>
                        <p className="font-semibold text-blue-600">
                          {hargaFormatted}
                        </p>
                      </div>

                      <button
                        onClick={() => navigate(`/hotel/${hotel?.id_hotel}`)}
                        className="w-full h-11 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition mt-auto"
                      >
                        Lihat Detail
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
