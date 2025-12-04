import React, { useEffect, useMemo, useState } from "react";
import {
  CheckCircle,
  XCircle,
  Clock,
  Check,
  X,
  RefreshCw,
  Search,
} from "lucide-react";

import NavbarAdmin from "../../../components/admin/NavbarAdmin";
import AdminPagination from "../../../components/admin/AdminPagination";
import useAxios from "../../../api";
import { alertConfirm, alertError, alertSuccess } from "../../../lib/Alert";

function formatRupiah(val) {
  const num = Number(val) || 0;
  return `Rp ${num.toLocaleString("id-ID")}`;
}

function formatDate(value) {
  if (!value) return "-";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}-${month}-${year}`;
}

// Komponen badge status pembayaran
function StatusBadge({ status }) {
  const normalized = (status || "").toLowerCase();
  const map = {
    paid: {
      color: "bg-green-50 text-green-700 border border-green-100",
      icon: CheckCircle,
    },
    pending: {
      color: "bg-amber-50 text-amber-700 border border-amber-100",
      icon: Clock,
    },
    failed: {
      color: "bg-red-50 text-red-700 border border-red-100",
      icon: XCircle,
    },
  };
  const style = map[normalized] || map.pending;
  const Icon = style.icon;
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${style.color}`}
    >
      <Icon className="w-4 h-4" />
      <span className="capitalize">{normalized || "-"}</span>
    </span>
  );
}

export default function PembayaranList() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selected, setSelected] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const fetchData = async () => {
    setRefreshing(true);
    try {
      const res = await useAxios.get("/admin/pembayarans");
      setData(res.data?.data || []);
    } catch (err) {
      console.error(err);
      alertError("Gagal memuat pembayaran", "Silakan coba lagi.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    setPage(1);
  }, [data.length, query]);

  // Mengubah status pembayaran
  const handleMark = async (id, type) => {
    const confirm = await alertConfirm({
      title: type === "paid" ? "Tandai Paid?" : "Tandai Failed?",
      text:
        type === "paid"
          ? "Status pembayaran akan diubah menjadi paid."
          : "Status pembayaran akan diubah menjadi failed.",
      confirmButtonText: "Ya, lanjut",
      cancelButtonText: "Batal",
    });
    if (!confirm.isConfirmed) return;

    try {
      const url =
        type === "paid"
          ? `/admin/pembayarans/mark-paid/${id}`
          : `/admin/pembayarans/mark-failed/${id}`;
      await useAxios.put(url);
      // Update status di UI
      setSelectedStatus(type);
      setSelected((prev) =>
        prev ? { ...prev, status_pembayaran: type } : prev
      );
      alertSuccess("Berhasil", "Status pembayaran diperbarui.");
      fetchData();
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || "Gagal memperbarui status.";
      alertError("Gagal", msg);
    }
  };

  // Filter & search
  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return data;
    return data.filter((item) => {
      const hotelName =
        item.reservasi?.rincian_reservasis?.[0]?.kamar?.hotel?.nama_hotel || "";
      const guestName = item.reservasi?.user?.nama || "";
      const bookingId = item.reservasi?.id_reservasi || item.id_reservasi || "";
      const fields = [
        hotelName,
        guestName,
        item.metode_pembayaran || "",
        item.status_pembayaran || "",
        String(bookingId),
      ]
        .join(" ")
        .toLowerCase();
      return fields.includes(q);
    });
  }, [data, query]);
  const start = (page - 1) * pageSize;
  const pagedRows = rows.slice(start, start + pageSize);

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#f4f6fb] text-slate-800">
      <NavbarAdmin />
      <main className="flex-1 w-full p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div className="flex-1">
            <h2 className="text-3xl font-bold text-slate-900">Pembayaran</h2>
            <p className="text-slate-500">
              Kelola status pembayaran reservasi pelanggan
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Cari booking, tamu, hotel..."
                className="pl-9 pr-3 py-2 w-full sm:w-64 rounded-lg border border-slate-200 bg-white text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
              />
            </div>
            <button
              type="button"
              onClick={fetchData}
              className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow border border-slate-200 hover:bg-slate-50 transition"
            >
              <RefreshCw
                className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
              />
              Muat ulang
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50 text-slate-700">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold">ID</th>
                  <th className="px-4 py-3 text-left font-semibold">
                    Booking ID
                  </th>
                  <th className="px-4 py-3 text-left font-semibold">
                    Nama Tamu
                  </th>
                  <th className="px-4 py-3 text-left font-semibold">Hotel</th>
                  <th className="px-4 py-3 text-left font-semibold">Jumlah</th>
                  <th className="px-4 py-3 text-left font-semibold">Metode</th>
                  <th className="px-4 py-3 text-left font-semibold">Status</th>
                  <th className="px-4 py-3 text-left font-semibold">Tanggal</th>
                  <th className="px-4 py-3 font-semibold text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td
                      colSpan="9"
                      className="px-4 py-6 text-center text-slate-500"
                    >
                      Memuat data...
                    </td>
                  </tr>
                ) : rows.length === 0 ? (
                  <tr>
                    <td
                      colSpan="9"
                      className="px-4 py-6 text-center text-slate-500"
                    >
                      Belum ada data pembayaran.
                    </td>
                  </tr>
                ) : (
                  pagedRows.map((item) => {
                    const hotelName =
                      item.reservasi?.rincian_reservasis?.[0]?.kamar?.hotel
                        ?.nama_hotel || "-";
                    const guestName = item.reservasi?.user?.nama || "-";
                    const bookingId =
                      item.reservasi?.id_reservasi || item.id_reservasi;
                    const normalizedStatus = (
                      item.status_pembayaran || ""
                    ).toLowerCase();
                    return (
                      <tr
                        key={item.id_pembayaran}
                        className="hover:bg-slate-50"
                      >
                        <td className="px-4 py-3">{item.id_pembayaran}</td>
                        <td className="px-4 py-3 font-semibold text-slate-900">
                          #{bookingId}
                        </td>
                        <td className="px-4 py-3 text-slate-800">
                          {guestName}
                        </td>
                        <td className="px-4 py-3 text-slate-700">
                          {hotelName}
                        </td>
                        <td className="px-4 py-3 font-semibold text-slate-900">
                          {formatRupiah(item.jumlah_bayar)}
                        </td>
                        <td className="px-4 py-3 text-slate-700">
                          {item.metode_pembayaran || "-"}
                        </td>
                        <td className="px-4 py-3">
                          <StatusBadge status={item.status_pembayaran} />
                        </td>
                        <td className="px-4 py-3 text-slate-700">
                          {formatDate(item.tanggal_pembayaran)}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <button
                            type="button"
                            onClick={() => {
                              setSelected(item);
                              setSelectedStatus(item.status_pembayaran);
                            }}
                            className="text-xs font-semibold text-blue-600 hover:underline"
                          >
                            Lihat Detail
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
          <AdminPagination
            page={page}
            totalItems={rows.length}
            pageSize={pageSize}
            onChange={setPage}
          />
        </div>
      </main>
      <DetailModal
        item={selected}
        onClose={() => {
          setSelected(null);
          setSelectedStatus(null);
        }}
        onMark={handleMark}
        currentStatus={selectedStatus}
      />
    </div>
  );
}

function DetailModal({ item, onClose, onMark, currentStatus }) {
  if (!item) return null;
  const hotelName =
    item.reservasi?.rincian_reservasis?.[0]?.kamar?.hotel?.nama_hotel || "-";
  const guestName = item.reservasi?.user?.nama || "-";
  const bookingId = item.reservasi?.id_reservasi || item.id_reservasi;
  const kamarList = item.reservasi?.rincian_reservasis || [];
  const statusNormalized = (
    currentStatus ||
    item.status_pembayaran ||
    ""
  ).toLowerCase();
  const isPending = statusNormalized === "pending";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative z-10 w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div>
            <p className="text-xs text-slate-500">Booking ID</p>
            <h3 className="text-lg font-semibold text-slate-900">
              #{bookingId}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <DetailRow label="Nama Tamu" value={guestName} />
            <DetailRow label="Hotel" value={hotelName} />
            <DetailRow label="Metode" value={item.metode_pembayaran || "-"} />
            <DetailRow
              label="Status"
              value={<StatusBadge status={statusNormalized} />}
            />
            <DetailRow label="Tanggal" value={item.tanggal_pembayaran || "-"} />
            <DetailRow
              label="Jumlah Bayar"
              value={formatRupiah(item.jumlah_bayar)}
            />
          </div>

          <div className="border rounded-xl border-slate-200 overflow-hidden">
            <div className="px-4 py-3 bg-slate-50 border-b border-slate-100 font-semibold text-slate-900">
              Detail Reservasi
            </div>
            <div className="px-4 py-3 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-slate-700">
              <DetailRow
                label="Check-in"
                value={formatDate(item.reservasi?.check_in)}
              />
              <DetailRow
                label="Check-out"
                value={formatDate(item.reservasi?.check_out)}
              />
              <DetailRow
                label="Jumlah Tamu"
                value={`${item.reservasi?.jumlah_tamu || 0} orang`}
              />
              <DetailRow
                label="Status Reservasi"
                value={item.reservasi?.status_reservasi || "-"}
              />
              <DetailRow
                label="Total Biaya"
                value={formatRupiah(item.reservasi?.total_biaya || 0)}
              />
            </div>
            <div className="border-t border-slate-100">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 text-slate-700">
                  <tr>
                    <th className="px-4 py-2 text-left">Kamar</th>
                    <th className="px-4 py-2 text-left">Jumlah</th>
                    <th className="px-4 py-2 text-left">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {kamarList.map((r) => (
                    <tr key={r.id_rincian_reservasi}>
                      <td className="px-4 py-2">
                        {r.kamar?.nama_kamar || "-"}
                      </td>
                      <td className="px-4 py-2">{r.jumlah_kamar}</td>
                      <td className="px-4 py-2">
                        {formatRupiah(r.sub_total || 0)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {isPending && (
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => onMark(item.id_pembayaran, "failed")}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-red-50 text-red-700 border border-red-100 text-sm font-semibold hover:bg-red-100 transition"
              >
                <X className="w-4 h-4" />
                Tandai Failed
              </button>
              <button
                type="button"
                onClick={() => onMark(item.id_pembayaran, "paid")}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-green-50 text-green-700 border border-green-100 text-sm font-semibold hover:bg-green-100 transition"
              >
                <Check className="w-4 h-4" />
                Tandai Paid
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function DetailRow({ label, value }) {
  return (
    <div className="flex items-start gap-2 text-sm">
      <span className="text-slate-500 w-32 shrink-0">{label}</span>
      <span className="text-slate-800 font-medium">{value}</span>
    </div>
  );
}
