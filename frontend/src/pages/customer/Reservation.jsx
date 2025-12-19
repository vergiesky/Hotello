import { useEffect, useMemo, useRef, useState } from "react";
import {
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import Navbar from "../../components/customer/Navbar";
import ReservationFormFields from "../../components/customer/ReservationFormFields";
import ReservationHotelHeader from "../../components/customer/ReservationHotelHeader";
import ReservationRoomCard from "../../components/customer/ReservationRoomCard";
import ReservationSummary from "../../components/customer/ReservationSummary";
import CustomerFooter from "../../components/customer/CustomerFooter";
import { alertConfirm, alertError, alertSuccess } from "../../lib/Alert";
import { diffNights } from "../../lib/DiffNights";
import {
  fetchHotelDetail,
  fetchAvailability,
} from "../../api/customer/apiHotels";
import { createReservasi } from "../../api/customer/apiReservations";
import {
  buildReservasiPayload,
  buildSelections,
  calcTotalBiaya,
  mapAvailability,
  normalizeHotelDetail,
  nextQty,
  validateReservation,
} from "../../lib/ReservationHelpers";

export default function Reservation() {
  const { hotelId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preselectRoom = searchParams.get("room");

  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hotelError, setHotelError] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guestCount, setGuestCount] = useState(1);
  const [selectedRooms, setSelectedRooms] = useState({});
  const [availability, setAvailability] = useState({});
  const formRef = useRef(null);

  useEffect(() => {
    const fetchHotel = async () => {
      try {
        const res = await fetchHotelDetail(hotelId);
        console.log("Hotel detail (reservation):", res);
        const { hotelData, preselectedRooms } = normalizeHotelDetail(
          res,
          preselectRoom
        );
        setHotel(hotelData);
        if (!hotelData) {
          setHotelError("Data hotel tidak ditemukan.");
        }

        if (Object.keys(preselectedRooms).length > 0) {
          setSelectedRooms(preselectedRooms);
        }
      } catch (err) {
        console.error(err);
        setHotelError(
          err.response?.data?.message || "Data hotel tidak ditemukan."
        );
        alertError(
          "Gagal memuat hotel",
          err.response?.data?.message || "Data hotel tidak ditemukan."
        );
        navigate("/dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchHotel();
  }, [hotelId, navigate, preselectRoom]);

  const nights = useMemo(() => diffNights(checkIn, checkOut), [checkIn, checkOut]);

  useEffect(() => {
    if (!checkIn || !checkOut) {
      setAvailability({});
      return;
    }
    if (nights <= 0) {
      setAvailability({});
      return;
    }
    const loadAvailability = async () => {
      try {
        const res = await fetchAvailability(hotelId, checkIn, checkOut);
        const data = res?.data || res || [];
        setAvailability(mapAvailability(data));
      } catch (err) {
        console.error(err);
        setAvailability({});
        alertError(
          "Gagal memuat stok",
          err.response?.data?.message || "Coba pilih tanggal lain."
        );
      }
    };
    loadAvailability();
  }, [checkIn, checkOut, hotelId, nights]);

  const kamarList = hotel?.kamars || [];

  const selections = useMemo(() => buildSelections(selectedRooms), [selectedRooms]);

  const totalBiaya = useMemo(() => {
    return calcTotalBiaya(kamarList, selections, nights);
  }, [nights, selections, kamarList]);

  const handleQtyChange = (id_kamar, delta) => {
    if (!checkIn || !checkOut) {
      alertError("Tanggal belum lengkap", "Isi check-in dan check-out dulu untuk melihat stok.");
      return;
    }
    setSelectedRooms((prev) => {
      const current = Number(prev[id_kamar] || 0);
      const maxAvail = availability[id_kamar] ?? Number.MAX_SAFE_INTEGER;
      const next = nextQty(current, delta, maxAvail);
      const updated = { ...prev };
      if (next === 0) {
        delete updated[id_kamar];
      } else {
        updated[id_kamar] = next;
      }
      return updated;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validateReservation({
      checkIn,
      checkOut,
      nights,
      selections,
    });
    if (validationError) {
      alertError(validationError.title, validationError.message);
      return;
    }

    const confirmation = await alertConfirm({
      title: "Buat reservasi?",
      text: "Reservasi akan dibuat dan kamu akan diarahkan ke pembayaran.",
      confirmButtonText: "Ya, lanjutkan",
      cancelButtonText: "Batal",
      icon: "question",
    });

    if (!confirmation.isConfirmed) {
      return;
    }

    const payload = buildReservasiPayload({
      checkIn,
      checkOut,
      guestCount,
      selections,
    });

    try {
      const res = await createReservasi(payload);
      console.log("Create reservasi response:", res);
      alertSuccess("Berhasil", "Reservasi berhasil dibuat. Lanjut ke pembayaran.");
      const newId = res?.data?.id_reservasi || res?.id_reservasi;
      if (newId) {
        navigate(`/payment/${newId}`);
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || "Gagal membuat reservasi.";
      alertError("Gagal", msg);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-slate-600">Memuat data reservasi...</p>
        </div>
      </div>
    );
  }

  if (!hotel && hotelError) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 max-w-md w-full text-center">
            <p className="text-lg font-semibold text-slate-900 mb-2">
              Tidak dapat memuat data hotel
            </p>
            <p className="text-sm text-slate-600 mb-4">{hotelError}</p>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition"
            >
              Kembali
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
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
        <div className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6">
          <div>
            <ReservationHotelHeader hotel={hotel} primaryRoom={kamarList[0]} />

            <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
              <ReservationFormFields
                checkIn={checkIn}
                checkOut={checkOut}
                guestCount={guestCount}
                onChangeCheckIn={setCheckIn}
                onChangeCheckOut={setCheckOut}
                onChangeGuestCount={setGuestCount}
              />

              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">
                  Pilih Kamar
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {kamarList.map((kamar) => {
                    const qty = Number(selectedRooms[kamar.id_kamar] || 0);
                    const stokTersedia =
                      checkIn && checkOut && nights > 0
                        ? availability[kamar.id_kamar] ?? kamar.stok_kamar
                        : null;
                    return (
                      <ReservationRoomCard
                        key={kamar.id_kamar}
                        kamar={kamar}
                        qty={qty}
                        stokTersedia={stokTersedia}
                        checkIn={checkIn}
                        checkOut={checkOut}
                        onChangeQty={handleQtyChange}
                      />
                    );
                  })}
                  {kamarList.length === 0 && (
                    <div className="col-span-full text-center text-slate-500 py-6">
                      Belum ada kamar tersedia.
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end hidden lg:flex">
                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition shadow"
                >
                  Buat Reservasi
                </button>
              </div>
            </form>
          </div>

          <ReservationSummary
            guestCount={guestCount}
            nights={nights}
            selections={selections}
            kamarList={kamarList}
            totalBiaya={totalBiaya}
            onSubmitMobile={() => formRef.current?.requestSubmit()}
          />
        </div>
      </main>
      <CustomerFooter />
    </div>
  );
}
