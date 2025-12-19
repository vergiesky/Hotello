import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Calendar, CreditCard, MapPin, Wallet, Clock, ArrowLeft } from "lucide-react";

import Navbar from "../../components/customer/Navbar";
import { alertConfirm, alertError, alertSuccess } from "../../lib/Alert";
import { toastInfo } from "../../lib/Toast";
import { diffNights } from "../../lib/DiffNights";
import { formatRupiah } from "../../lib/FormatRupiah";
import { formatDate } from "../../lib/FormatDate";
import { normalizeAmount } from "../../lib/PaymentHelpers";
import {
  fetchPembayarans,
  createPembayaran,
} from "../../api/customer/apiPayments";
import { fetchReservasiById } from "../../api/customer/apiReservations";
import CustomerFooter from "../../components/customer/CustomerFooter";

export default function Payment() {
  const { reservasiId } = useParams();
  const navigate = useNavigate();

  const [reservasi, setReservasi] = useState(null);
  const [pembayaran, setPembayaran] = useState(null);
  const [metode, setMetode] = useState("Transfer Bank");
  const [jumlahBayar, setJumlahBayar] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const nights = useMemo(
    () => diffNights(reservasi?.check_in, reservasi?.check_out),
    [reservasi]
  );

  const fetchData = async () => {
    try {
      const [resReservasi, resPembayaran] = await Promise.all([
        fetchReservasiById(reservasiId),
        fetchPembayarans(),
      ]);

      const reservasiData = resReservasi?.data || resReservasi || null;
      setReservasi(reservasiData);
      setJumlahBayar(normalizeAmount(reservasiData?.total_biaya));

      const paymentList = resPembayaran?.data || resPembayaran || [];
      const found = paymentList.find(
        (p) => p?.reservasi?.id_reservasi === Number(reservasiId)
      );
      if (found) setPembayaran(found);
    } catch (err) {
      console.error(err);
      alertError(
        "Gagal memuat pembayaran",
        err.response?.data?.message || "Data reservasi tidak ditemukan."
      );
      navigate("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reservasiId]);

  const handlePay = async (e) => {
    e.preventDefault();
    if (!reservasi) return;

    const status = (reservasi.status_reservasi || "").toLowerCase();
    const paymentStatus = (pembayaran?.status_pembayaran || "").toLowerCase();
    if (
      status !== "menunggu_pembayaran" ||
      paymentStatus === "failed" ||
      paymentStatus === "paid" ||
      paymentStatus === "pending"
    ) {
      toastInfo("Reservasi ini tidak dapat dibayar lagi.");
      return;
    }

    const amount = Number(jumlahBayar);
    if (!amount || Number.isNaN(amount) || amount <= 0) {
      alertError("Jumlah tidak valid", "Masukkan nominal pembayaran yang benar.");
      return;
    }

    const confirmation = await alertConfirm({
      title: "Konfirmasi pembayaran?",
      text: `Bayar ${formatRupiah(amount)} dengan metode ${metode}.`,
      confirmButtonText: "Ya, bayar",
      cancelButtonText: "Batal",
      icon: "question",
    });

    if (!confirmation.isConfirmed) return;

    try {
      setSubmitting(true);
      const res = await createPembayaran({
        id_reservasi: Number(reservasiId),
        metode_pembayaran: metode,
        jumlah_bayar: amount,
      });

      const data = res?.data || res || null;
      setPembayaran(data);
      await alertSuccess("Pembayaran dibuat", "Status menunggu konfirmasi admin.");
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || "Gagal membuat pembayaran.";
      alertError("Gagal", msg);
    } finally {
      setSubmitting(false);
    }
  };

  const hotel = reservasi?.rincian_reservasis?.[0]?.kamar?.hotel;
  const statusReservasi = reservasi?.status_reservasi || "-";
  const statusPembayaran = pembayaran?.status_pembayaran || "-";
  const normalizedStatusReservasi = statusReservasi.toLowerCase();
  const normalizedStatusPembayaran = statusPembayaran.toLowerCase();
  const isFailed =
    normalizedStatusReservasi === "failed" ||
    normalizedStatusPembayaran === "failed";
  const isPaid = normalizedStatusPembayaran === "paid";
  const canPay =
    normalizedStatusReservasi === "menunggu_pembayaran" &&
    !isFailed &&
    !isPaid &&
    normalizedStatusPembayaran !== "pending";

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-slate-600">Memuat pembayaran...</p>
        </div>
      </div>
    );
  }

  if (!reservasi) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <div className="max-w-5xl mx-auto w-full px-4 mt-2">
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
        <div className="max-w-5xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs text-slate-500 mb-1">Reservasi</p>
                <h2 className="text-xl font-semibold text-slate-900">
                  {hotel?.nama_hotel || "Hotel"}
                </h2>
                <div className="flex items-center text-slate-600 text-sm mt-1">
                  <MapPin className="w-4 h-4 mr-1" />
                  {(hotel?.alamat || "") + (hotel?.kota ? `, ${hotel.kota}` : "")}
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-500">Status Reservasi</p>
                <p className="text-sm font-semibold text-blue-600">
                  {statusReservasi}
                </p>
              </div>
            </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <p className="text-xs text-slate-500 mb-1">Check-in</p>
                  <div className="flex items-center gap-2 text-sm text-slate-800">
                    <Calendar className="w-4 h-4 text-slate-500" />
                    {formatDate(reservasi.check_in)}
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <p className="text-xs text-slate-500 mb-1">Check-out</p>
                  <div className="flex items-center gap-2 text-sm text-slate-800">
                    <Calendar className="w-4 h-4 text-slate-500" />
                    {formatDate(reservasi.check_out)}
                  </div>
                </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <p className="text-xs text-slate-500 mb-1">Durasi</p>
                <div className="flex items-center gap-2 text-sm text-slate-800">
                  <Clock className="w-4 h-4 text-slate-500" />
                  {nights} malam
                </div>
              </div>
            </div>

            <div className="border rounded-xl border-slate-200">
              <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                <p className="text-sm font-semibold text-slate-900">Detail Kamar</p>
                <p className="text-xs text-slate-500">
                  {reservasi.jumlah_tamu} tamu
                </p>
              </div>
              <div className="divide-y divide-slate-100">
                {(reservasi.rincian_reservasis || []).map((item) => (
                  <div
                    key={item.id_rincian_reservasi}
                    className="p-4 flex justify-between text-sm text-slate-700"
                  >
                    <div>
                      <p className="font-medium text-slate-900">
                        {item.kamar?.nama_kamar || "Kamar"}
                      </p>
                      <p className="text-xs text-slate-500">
                        x{item.jumlah_kamar}
                      </p>
                    </div>
                    <p className="font-semibold">
                      {formatRupiah(item.sub_total || 0)}
                    </p>
                  </div>
                ))}
              </div>
              <div className="p-4 border-t border-slate-100 flex justify-between text-base font-semibold text-slate-900">
                <span>Total</span>
                <span>{formatRupiah(reservasi.total_biaya || 0)}</span>
              </div>
            </div>
          </div>

          <aside className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 h-fit space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Wallet className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">Pembayaran</p>
                <p className="text-xs text-slate-500">
                  Status: {statusPembayaran}
                </p>
              </div>
            </div>

            <form onSubmit={handlePay} className="space-y-4">
              <label className="flex flex-col gap-1 text-sm text-slate-700">
                Metode Pembayaran
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 bg-slate-50">
                  <CreditCard className="w-4 h-4 text-slate-500" />
                  <select
                    value={metode}
                    onChange={(e) => setMetode(e.target.value)}
                    className="flex-1 bg-transparent outline-none text-sm text-slate-800"
                  >
                    <option value="Transfer Bank">Transfer Bank</option>
                    <option value="Virtual Account">Virtual Account</option>
                    <option value="Kartu Kredit">Kartu Kredit</option>
                    <option value="E-Wallet">E-Wallet</option>
                  </select>
                </div>
              </label>

              <label className="flex flex-col gap-1 text-sm text-slate-700">
                Nominal Bayar
                <input
                  type="number"
                  min="0"
                  value={jumlahBayar}
                  onChange={(e) => setJumlahBayar(normalizeAmount(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                />
              </label>

              {pembayaran && (
                <div className="p-3 rounded-xl bg-blue-50 border border-blue-100 text-sm text-slate-800">
                  Pembayaran terakhir: {pembayaran.metode_pembayaran} -{" "}
                  {formatRupiah(pembayaran.jumlah_bayar)} (
                  {pembayaran.status_pembayaran})
                </div>
              )}

              {!canPay && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-100 text-sm text-red-700">
                  Reservasi tidak dapat dibayar lagi karena status{" "}
                  {isFailed ? "failed" : statusPembayaran}.
                </div>
              )}

              <button
                type="submit"
                disabled={submitting || !canPay}
                className="w-full py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {submitting
                  ? "Memproses..."
                  : canPay
                  ? "Bayar Sekarang"
                  : "Tidak dapat dibayar"}
              </button>
            </form>

            <p className="text-xs text-slate-500">
              Setelah pembayaran dikirim, admin akan melakukan verifikasi dan
              mengubah status menjadi paid jika berhasil.
            </p>
          </aside>
        </div>
      </main>
      <CustomerFooter />
    </div>
  );
}