import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MapPin, Star, Users, Wifi, Leaf, CheckCircle2, Heart } from "lucide-react";
import useAxios, { BASE_URL } from "../../api";
import Navbar from "../../components/Navbar";
import { alertError } from "../../lib/Alert";
import { toastInfo, toastSuccess } from "../../lib/Toast";

function getHotelImageUrl(hotel) {
  const images = hotel?.gambar_hotels || [];
  const firstImage = images[0];
  const fallback = "/images/hotel1_main.jpg";
  if (!firstImage || !firstImage.file_path_gambar_hotel) return fallback;

  let path = (firstImage.file_path_gambar_hotel || "").trim();
  const isAbsolute =
    path.startsWith("http://") || path.startsWith("https://");

  if (isAbsolute) return path;
  // path relatif dari storage Laravel, contoh: "gambar_hotels/93T....jpg"
  return `${BASE_URL}/storage/${path}`;
}

function getHotelImageUrls(hotel) {
  const imgs = hotel?.gambar_hotels || [];
  if (!imgs.length) return ["/images/hotel1_main.jpg"];
  return imgs.map((img) => {
    const path = (img?.file_path_gambar_hotel || "").trim();
    if (!path) return "/images/hotel1_main.jpg";
    const isAbsolute = path.startsWith("http://") || path.startsWith("https://");
    return isAbsolute ? path : `${BASE_URL}/storage/${path}`;
  });
}

function getKamarImageUrl(kamar) {
  const firstImage = kamar?.gambar_kamars?.[0];
  const fallback = "/images/hotel1_main.jpg";
  if (!firstImage || !firstImage.file_path_gambar_kamar) return fallback;

  let path = (firstImage.file_path_gambar_kamar || "").trim();
  const isAbsolute =
    path.startsWith("http://") || path.startsWith("https://");

  if (isAbsolute) return path;
  // path relatif dari storage Laravel, contoh: "gambar_kamars/93T....jpg"
  return `${BASE_URL}/storage/${path}`;
}

export default function HotelDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedFacility, setSelectedFacility] = useState(null);
  const [wishlistId, setWishlistId] = useState(null);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await useAxios.get(`/hotel-detail/${id}`);
        console.log("Hotel detail response:", res.data);
        setHotel(res.data?.hotel || res.data?.data || null);
        console.log("Berhasil memuat detail hotel");
      } catch (err) {
        console.error(err);
        alertError(
          "Gagal memuat hotel",
          err.response?.data?.message || "Hotel tidak ditemukan"
        );
        navigate("/dashboard");
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id, navigate]);

  // cek apakah sudah ada di wishlist (hanya jika login)
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    const fetchWishlist = async () => {
      try {
        const res = await useAxios.get("/wishlists");
        const data = res.data?.data || [];
        const found = data.find(
          (item) => `${item.id_hotel || item.hotel?.id_hotel}` === `${id}`
        );
        if (found) setWishlistId(found.id_wishlist);
      } catch (err) {
        console.error(err);
      }
    };
    fetchWishlist();
  }, [id]);

  const heroImage = useMemo(() => getHotelImageUrl(hotel), [hotel]);
  const heroImages = useMemo(() => getHotelImageUrls(hotel), [hotel]);
  const [currentImg, setCurrentImg] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const kamars = hotel?.kamars || [];
  const fasilitas = hotel?.fasilitas_hotels || [];
  const hargaMulai = useMemo(() => {
    const hargaList = (hotel?.kamars || [])
      .map((k) => Number(k.harga))
      .filter((n) => !Number.isNaN(n));
    if (hargaList.length > 0) return Math.min(...hargaList);
    return hotel?.harga_termurah || hotel?.harga_mulai || null;
  }, [hotel]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-slate-600">Memuat detail hotel...</p>
        </div>
      </div>
    );
  }

  if (!hotel) return null;

  const isInWishlist = !!wishlistId;

  const toggleWishlist = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alertError("Harus login", "Masuk dulu untuk menyimpan wishlist.");
      navigate("/login");
      return;
    }

    if (isInWishlist) {
      try {
        await useAxios.delete(`/wishlists/delete/${wishlistId}`);
        setWishlistId(null);
        toastInfo("Hotel dihapus dari wishlist");
      } catch (err) {
        console.error(err);
        alertError("Gagal", "Tidak bisa menghapus wishlist.");
      }
    } else {
      try {
        const res = await useAxios.post("/wishlists/create", {
          id_hotel: hotel.id_hotel,
        });
        const newId = res.data?.data?.id_wishlist;
        setWishlistId(newId || true);
        toastSuccess("Hotel ditambahkan ke wishlist");
      } catch (err) {
        console.error(err);
        alertError("Gagal", "Tidak bisa menambahkan wishlist.");
      }
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />

        <main className="flex-1">
          <div className="max-w-6xl mx-auto px-4 py-8">
            {/* Hero */}
            <div className="rounded-3xl overflow-hidden shadow-md border border-slate-200 relative">
              <button
                type="button"
                className="block w-full"
                onClick={() => setIsLightboxOpen(true)}
              >
                <img
                  src={heroImages[currentImg]}
                  alt={hotel.nama_hotel}
                  className="w-full h-[360px] object-cover transition-all duration-300"
                  onError={(e) => {
                    e.currentTarget.src = "/images/hotel1_main.jpg";
                  }}
                />
              </button>
              {heroImages.length > 1 && (
                <>
                  <button
                    type="button"
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 backdrop-blur flex items-center justify-center shadow hover:scale-105 transition"
                    onClick={() =>
                      setCurrentImg((prev) =>
                        prev === 0 ? heroImages.length - 1 : prev - 1
                      )
                    }
                  >
                    ‹
                  </button>
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 backdrop-blur flex items-center justify-center shadow hover:scale-105 transition"
                    onClick={() =>
                      setCurrentImg((prev) =>
                        prev === heroImages.length - 1 ? 0 : prev + 1
                      )
                    }
                  >
                    ›
                  </button>
                  <div className="absolute bottom-3 inset-x-0 flex items-center justify-center gap-2">
                    {heroImages.map((_, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setCurrentImg(idx)}
                        className={`w-2.5 h-2.5 rounded-full ${
                          idx === currentImg ? "bg-white" : "bg-white/50"
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
              <button
                type="button"
                onClick={toggleWishlist}
                className={`absolute top-4 right-4 w-11 h-11 rounded-full bg-white/90 backdrop-blur shadow-md flex items-center justify-center hover:scale-105 transition ${
                  isInWishlist ? "text-blue-600" : "text-slate-500"
                }`}
              >
                <Heart
                  className={`w-6 h-6 ${
                    isInWishlist ? "fill-blue-600" : "fill-transparent"
                  }`}
                />
              </button>
            </div>

            {/* Summary */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 mt-6 p-6 flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div className="space-y-2">
                <h1 className="text-2xl font-semibold text-slate-900">
                  {hotel.nama_hotel}
                </h1>
                <div className="flex items-center text-slate-600 text-sm gap-1">
                  <MapPin className="w-4 h-4" />
                  <span>
                    {(hotel.alamat || "") +
                      (hotel.kota ? `, ${hotel.kota}` : "")}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-700">
                  <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                  <span className="font-semibold">
                    {hotel.rating_hotel ?? "-"}
                  </span>
                  <span className="text-slate-500">
                    ({hotel.jumlah_ulasan ?? 0} ulasan)
                  </span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-500">Mulai dari</p>
                <p className="text-lg font-semibold text-blue-600">
                  {hargaMulai ? `Rp ${hargaMulai}` : "Rp -"}
                </p>
                <p className="text-xs text-slate-500">per malam</p>
              </div>
            </div>

            {/* Deskripsi */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 mt-6 p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                Deskripsi
              </h3>
              <p className="text-slate-700 text-sm leading-relaxed">
                {hotel.deskripsi ||
                  "Deskripsi belum tersedia. Silakan lihat detail fasilitas dan kamar di bawah."}
              </p>
            </div>

            {/* Fasilitas */}
            {fasilitas.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 mt-6 p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-3">
                  Fasilitas
                </h3>
                <div className="flex flex-wrap gap-2">
                  {fasilitas.map((f) => {
                    const iconPath = f?.icon?.file_path_icon;
                    const iconUrl =
                      iconPath && (iconPath.startsWith("http://") || iconPath.startsWith("https://"))
                        ? iconPath
                        : iconPath
                        ? `${BASE_URL}/storage/${iconPath}`
                        : null;
                    return (
                      <button
                        type="button"
                        key={f.id_fasilitas_hotel || f.nama_fasilitas}
                        onClick={() => setSelectedFacility(f)}
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 text-blue-600 text-xs font-medium hover:bg-blue-100 transition"
                      >
                        {iconUrl ? (
                          <img
                            src={iconUrl}
                            alt={f.nama_fasilitas || "icon"}
                            className="w-4 h-4 object-contain"
                            onError={(e) => {
                              e.currentTarget.style.display = "none";
                            }}
                          />
                        ) : (
                          <CheckCircle2 className="w-4 h-4" />
                        )}
                        {f.nama_fasilitas || f.keterangan_fasilitas_hotel || "Fasilitas"}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Kamar */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 mt-6 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-900">
                  Pilih Tipe Kamar
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {kamars.map((kamar) => {
                  const img = getKamarImageUrl(kamar);
                  const fasilitasKamar =
                    kamar?.fasilitas_kamars ||
                    kamar?.fasilitas_kamar ||
                    [];
                  const fasilitasTampil = fasilitasKamar.slice(0, 3);
                  const sisaFasilitas = Math.max(
                    0,
                    fasilitasKamar.length - fasilitasTampil.length
                  );
                  return (
                    <div
                      key={kamar.id_kamar}
                      className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col"
                    >
                      <div className="relative h-44 bg-gray-100">
                        <img
                          src={img}
                          alt={kamar.nama_kamar}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = "/images/hotel1_main.jpg";
                          }}
                        />
                        <div className="absolute top-2 right-2 px-2 py-1 rounded-full bg-white/85 text-slate-700 text-xs flex items-center gap-1 shadow">
                          <Users className="w-3.5 h-3.5" />
                          {kamar.kapasitas || "-"}
                        </div>
                      </div>
                      <div className="p-4 flex flex-col gap-2 flex-1">
                        <h4 className="font-semibold text-slate-900 text-base">
                          {kamar.nama_kamar}
                        </h4>
                        <p className="text-sm text-slate-600 line-clamp-2">
                          {kamar.deskripsi ||
                            "Kamar nyaman dengan fasilitas standar."}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {fasilitasTampil.map((f, idx) => (
                            <span
                              key={`${kamar.id_kamar}-f-${idx}`}
                              className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 text-[11px]"
                            >
                              {f?.nama_fasilitas_kamar ||
                                f?.keterangan_fasilitas_kamar ||
                                "Fasilitas"}
                            </span>
                          ))}
                          {sisaFasilitas > 0 && (
                            <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 text-[11px]">
                              +{sisaFasilitas} lainnya
                            </span>
                          )}
                        </div>
                        <div className="mt-auto flex items-center justify-between pt-2">
                          <div>
                            {(() => {
                              const harga =
                                kamar.harga_per_malam ?? kamar.harga ?? null;
                              return (
                                <>
                                  <p className="text-sm font-semibold text-blue-600 mb-1">
                                    Rp{" "}
                                    {harga
                                      ? Number(harga).toLocaleString("id-ID")
                                      : "-"}
                                  </p>
                                  <p className="text-[11px] text-slate-500">
                                    per malam
                                  </p>
                                </>
                              );
                            })()}
                          </div>
                          <button
                            onClick={() =>
                              navigate(
                                `/reservation/${hotel?.id_hotel}?room=${kamar.id_kamar}`
                              )
                            }
                            className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition"
                          >
                            Pilih
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
                {kamars.length === 0 && (
                  <div className="col-span-full text-center text-slate-500 py-8">
                    Belum ada data kamar.
                  </div>
                )}
              </div>
              <div className="mt-6">
                <button
                  onClick={() => navigate(`/reservation/${hotel?.id_hotel}`)}
                  className="w-full py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
                >
                  Pesan Sekarang
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
      {selectedFacility && (
        <div className="fixed inset-0 z-40 flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setSelectedFacility(null)}
          />
          <div className="relative z-50 bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full p-6">
            <div className="flex items-start gap-3">
              {selectedFacility?.icon?.file_path_icon ? (
                <img
                  src={
                    selectedFacility.icon.file_path_icon.startsWith("http")
                      ? selectedFacility.icon.file_path_icon
                      : `${BASE_URL}/storage/${selectedFacility.icon.file_path_icon}`
                  }
                  alt={selectedFacility.nama_fasilitas || "Icon"}
                  className="w-10 h-10 object-contain"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              ) : (
                <CheckCircle2 className="w-6 h-6 text-blue-600 mt-1" />
              )}
              <div className="flex-1">
                <h4 className="text-lg font-semibold text-slate-900">
                  {selectedFacility?.nama_fasilitas || "Fasilitas"}
                </h4>
                <p className="text-sm text-slate-600 mt-1">
                  {selectedFacility?.keterangan_fasilitas_hotel ||
                    "Tidak ada keterangan fasilitas."}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedFacility(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                x
              </button>
            </div>
          </div>
        </div>
      )}
      {isLightboxOpen && (
        <Lightbox
          images={heroImages}
          startIndex={currentImg}
          onClose={() => setIsLightboxOpen(false)}
        />
      )}
    </>
  );
}

// Lightbox popup for hero images
function Lightbox({ images, startIndex = 0, onClose }) {
  const [idx, setIdx] = useState(startIndex);
  if (!images?.length) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center px-4">
      <button
        className="absolute inset-0"
        aria-label="Tutup"
        onClick={onClose}
      />
      <div className="relative z-10 max-w-5xl w-full flex flex-col items-center gap-4">
        <img
          src={images[idx]}
          alt="Hotel"
          className="max-h-[80vh] w-auto rounded-xl shadow-2xl object-contain bg-black"
          onError={(e) => {
            e.currentTarget.src = "/images/hotel1_main.jpg";
          }}
        />
        {images.length > 1 && (
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIdx(idx === 0 ? images.length - 1 : idx - 1)}
              className="w-10 h-10 rounded-full bg-white/80 text-slate-700 flex items-center justify-center hover:scale-105 transition"
            >
              ‹
            </button>
            <div className="flex items-center gap-2">
              {images.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setIdx(i)}
                  className={`w-2.5 h-2.5 rounded-full ${
                    i === idx ? "bg-white" : "bg-white/50"
                  }`}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={() => setIdx(idx === images.length - 1 ? 0 : idx + 1)}
              className="w-10 h-10 rounded-full bg-white/80 text-slate-700 flex items-center justify-center hover:scale-105 transition"
            >
              ›
            </button>
          </div>
        )}
        <button
          type="button"
          onClick={onClose}
          className="text-white/80 hover:text-white text-sm"
        >
          Tutup
        </button>
      </div>
    </div>
  );
}
