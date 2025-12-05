import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Users, CheckCircle2, ArrowLeft, Star } from "lucide-react";
import { BASE_URL } from "../../api";
import { fetchHotelDetail } from "../../api/customer/apiHotels";
import {
  fetchReviews as fetchReviewsApi,
  createReview,
} from "../../api/customer/apiReviews";
import {
  fetchWishlists,
  createWishlist,
  deleteWishlist,
} from "../../api/customer/apiWishlist";
import { fetchPembayarans } from "../../api/customer/apiPembayarans";
import Navbar from "../../components/customer/Navbar";
import { alertError, alertSuccess } from "../../lib/Alert";
import { toastInfo, toastSuccess } from "../../lib/Toast";
import { getHotelImageUrls } from "../../lib/HotelImage";
import { formatDate } from "../../lib/formatDate";
import { getHargaMulaiHotel } from "../../lib/HotelPrice";
import { getHotelRatingStats } from "../../lib/HotelRating";
import Lightbox from "../../components/customer/Lightbox";
import HotelGallery from "../../components/customer/HotelGallery";
import HotelHeaderCard from "../../components/customer/HotelHeaderCard";
import HotelFacilityList from "../../components/customer/HotelFacilityList";
import RoomCard from "../../components/customer/RoomCard";
import ReviewList from "../../components/customer/ReviewList";
import ReviewForm from "../../components/customer/ReviewForm";
import FacilityDetailPopup from "../../components/customer/FacilityDetailPopup";
import RoomDetailPopup from "../../components/customer/RoomDetailPopup";
import RoomFacilityPopup from "../../components/customer/RoomFacilityPopup";
import ReviewImagePopup from "../../components/customer/ReviewImagePopup";
import CustomerFooter from "../../components/customer/CustomerFooter";
import { toggleWishlistCommon } from "../../lib/WishlistToggle";

export default function HotelDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedFacility, setSelectedFacility] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [selectedRoomFacility, setSelectedRoomFacility] = useState(null);
  const [wishlistId, setWishlistId] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [eligiblePayments, setEligiblePayments] = useState([]);
  const [reviewForm, setReviewForm] = useState({
    paymentId: "",
    roomId: "",
    rating: 0,
    komentar: "",
  });
  const [reviewImage, setReviewImage] = useState(null);
  const [selectedReviewImage, setSelectedReviewImage] = useState(null);

  // ambil data hotel by id
  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await fetchHotelDetail(id);
        console.log("Hotel detail response:", res);
        setHotel(res?.hotel || null);
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

  // ambil semua review
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetchReviewsApi();
        setReviews(res?.data || []);
        console.log(res);
      } catch (err) {
        console.error("Gagal memuat review", err);
      }
    };
    fetchReviews();
  }, []);

  // cek apakah sudah ada di wishlist
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    const fetchWishlist = async () => {
      try {
        const res = await fetchWishlists();
        const data = res?.data || [];
        const found = data.find((item) => `${item.id_hotel}` === `${id}`); // cari item yang id hotelnya sama dengan id di URL
        console.log(found);
        if (found) setWishlistId(found.id_wishlist);
      } catch (err) {
        console.error(err);
      }
    };
    fetchWishlist();
  }, [id]);

  const heroImages = useMemo(() => getHotelImageUrls(hotel), [hotel]); // ambil array  gambar hotel, dipakai untuk slider
  const [currentImg, setCurrentImg] = useState(0); // index gambar yang sedang dipajang
  const [isLightboxOpen, setIsLightboxOpen] = useState(false); // kontrol popup Lightbox

  // ngitung kamar, fasilitas dan review hotel
  const kamars = hotel?.kamars || [];
  const fasilitas = hotel?.fasilitas_hotels || [];
  const kamarIds = useMemo(
    // useMemo buat simpan hasil perhitungan
    () => (hotel?.kamars || []).map((k) => k.id_kamar),
    [hotel]
  );

  // filter review supaya hanya review hotel saat ini
  // ambil review yang id kamarnya ada di daftar kamar hotel
  const [showAllReviews, setShowAllReviews] = useState(false);
  const hotelReviews = useMemo(() => {
    const filtered = reviews.filter((r) => kamarIds.includes(r.id_kamar));
    return filtered.sort((a, b) => (b.id_review || 0) - (a.id_review || 0));
  }, [reviews, kamarIds]);

  // default cuma tampil 3 review, kalau lihat lebih (true) tampil semua
  const visibleReviews = showAllReviews
    ? hotelReviews
    : hotelReviews.slice(0, 3);

  // buat average rating
  const { totalReviewCount, ratingDisplay } = getHotelRatingStats(
    hotelReviews,
    hotel
  );

  // harga terendah hotel
  const hargaMulai = useMemo(() => getHargaMulaiHotel(hotel), [hotel]);

  /// pembayaran
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token || kamarIds.length === 0) {
      setEligiblePayments([]);
      return;
    }
    const fetchPayments = async () => {
      try {
        const res = await fetchPembayarans();
        const data = res?.data || [];
        const now = new Date();
        const filtered = data.filter((p) => {
          if (String(p.status_pembayaran).toLowerCase() !== "paid")
            return false;
          const checkout = p.reservasi?.check_out
            ? new Date(p.reservasi.check_out)
            : null;
          if (!checkout || now < checkout) return false;
          const rincian = p.reservasi?.rincian_reservasis || [];
          return rincian.some((r) => kamarIds.includes(r.id_kamar));
        });
        setEligiblePayments(filtered);
      } catch (err) {
        console.error("Gagal memuat pembayaran untuk review", err);
      }
    };
    fetchPayments();
  }, [kamarIds]);

  // submit review
  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!reviewForm.paymentId || !reviewForm.roomId || !reviewForm.rating) {
      alertError("Form belum lengkap", "Pilih pembayaran, kamar, dan rating.");
      return;
    }
    if (reviewForm.rating < 0 || reviewForm.rating > 5) {
      alertError("Rating tidak sesuai", "Rating hanya boleh antara 0 - 5.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("id_pembayaran", Number(reviewForm.paymentId));
      formData.append("id_kamar", Number(reviewForm.roomId));
      formData.append("rating", Number(reviewForm.rating));
      if (reviewForm.komentar) formData.append("komentar", reviewForm.komentar);
      if (reviewImage) formData.append("file_path_review", reviewImage);

      const res = await createReview(formData);
      alertSuccess(
        "Review dikirim",
        res?.message || res?.data?.message || "Terima kasih atas ulasannya."
      );
      setReviews((prev) => [res?.data || res || {}, ...prev]);
      setReviewForm({ paymentId: "", roomId: "", rating: 0, komentar: "" });
      setReviewImage(null);
    } catch (err) {
      console.error(err);
      alertError(
        "Gagal kirim review",
        err.response?.data?.message ||
          "Coba lagi setelah checkout dan pembayaran paid."
      );
    }
  };

  // loading
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
    await toggleWishlistCommon({
      hotelId: hotel.id_hotel,
      existingWishlistId: wishlistId,
      createWishlistFn: createWishlist,
      deleteWishlistFn: deleteWishlist,
      onAdd: (newId) => setWishlistId(newId || true),
      onRemove: () => setWishlistId(null),
      alertError,
      toastSuccess,
      toastInfo,
      navigate,
    });
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <div className="max-w-6xl mx-auto w-full px-4 mt-2">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-blue-600 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali
          </button>
        </div>

        <main className="flex-1">
          <div className="max-w-6xl mx-auto px-4 py-8">
            <HotelGallery
              images={heroImages}
              currentIndex={currentImg}
              onPrev={() =>
                setCurrentImg((prev) =>
                  prev === 0 ? heroImages.length - 1 : prev - 1
                )
              }
              onNext={() =>
                setCurrentImg((prev) =>
                  prev === heroImages.length - 1 ? 0 : prev + 1
                )
              }
              onSelect={(idx) => setCurrentImg(idx)}
              onOpenLightbox={() => setIsLightboxOpen(true)}
              isInWishlist={isInWishlist}
              onToggleWishlist={toggleWishlist}
              alt={hotel.nama_hotel}
            />

            <HotelHeaderCard
              name={hotel.nama_hotel}
              address={hotel.alamat}
              city={hotel.kota}
              ratingDisplay={ratingDisplay}
              totalReviewCount={totalReviewCount}
              hargaMulai={hargaMulai}
            />

            {/* deskripsi */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 mt-6 p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                Deskripsi
              </h3>
              <p className="text-slate-700 text-sm leading-relaxed">
                {hotel.deskripsi}
              </p>
            </div>
            
            {/* fasilitas hotel */}
            {fasilitas.length > 0 && (
              <HotelFacilityList
                facilities={fasilitas}
                onSelect={(f) => setSelectedFacility(f)}
              />
            )}

            {/* kamar */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 mt-6 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-900">
                  Pilih Tipe Kamar
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {kamars.map((kamar) => (
                  <RoomCard
                    key={kamar.id_kamar}
                    kamar={kamar}
                    isSelected={selectedRoom?.id_kamar === kamar.id_kamar}
                    onSelectRoom={(room) => setSelectedRoom(room)}
                    onSelectFacility={(facility, room) => {
                      if (selectedRoom?.id_kamar !== room.id_kamar) {
                        setSelectedRoom(room);
                        return;
                      }
                      setSelectedRoomFacility(facility);
                    }}
                  />
                ))}
                {kamars.length === 0 && (
                  <div className="col-span-full text-center text-slate-500 py-8">
                    Belum ada data kamar.
                  </div>
                )}
              </div>
              <div className="mt-6">
                <button
                  onClick={() => {
                    const token = localStorage.getItem("token");
                    if (!token) {
                      alertError(
                        "Harus login",
                        "Masuk dulu untuk membuat reservasi."
                      );
                      navigate("/login");
                      return;
                    }
                    navigate(`/reservation/${hotel?.id_hotel}`);
                  }}
                  className="w-full py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
                >
                  Pesan Sekarang
                </button>
              </div>
            </div>
            {/* review */}
            <ReviewList
              reviews={hotelReviews}
              visibleReviews={visibleReviews}
              totalReviewCount={totalReviewCount}
              ratingDisplay={ratingDisplay}
              showAll={showAllReviews}
              onToggleShowAll={() => setShowAllReviews((prev) => !prev)}
              onSelectImage={(imgUrl) => setSelectedReviewImage(imgUrl)}
            />

            {eligiblePayments.length > 0 && (
              <ReviewForm
                eligiblePayments={eligiblePayments}
                reviewForm={reviewForm}
                setReviewForm={setReviewForm}
                reviewImage={reviewImage}
                setReviewImage={setReviewImage}
                onSubmit={handleSubmitReview}
                formatDate={formatDate}
              />
            )}
          </div>
        </main>
        <CustomerFooter />
      </div>
      
      <FacilityDetailPopup
        facility={selectedFacility}
        onClose={() => setSelectedFacility(null)}
      />
      <RoomDetailPopup
        room={selectedRoom}
        hotelId={hotel?.id_hotel}
        navigate={navigate}
        onClose={() => setSelectedRoom(null)}
        onSelectFacility={(f) => setSelectedRoomFacility(f)}
      />
      <RoomFacilityPopup
        facility={selectedRoomFacility}
        onClose={() => setSelectedRoomFacility(null)}
      />
      {isLightboxOpen && (
        <Lightbox
          images={heroImages}
          startIndex={currentImg}
          onClose={() => setIsLightboxOpen(false)}
        />
      )}
      <ReviewImagePopup
        imageUrl={selectedReviewImage}
        onClose={() => setSelectedReviewImage(null)}
      />
    </>
  );
}