import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, MapPin, Clock } from "lucide-react";
import Navbar from "../../components/customer/Navbar";
import { alertError } from "../../lib/Alert";
import CustomerPagination from "../../components/customer/CustomerPagination";
import SearchBar from "../../components/customer/SearchBar";
import StatusBadge from "../../lib/StatusBadge";
import { formatDate } from "../../lib/FormatDate";
import { formatRupiah } from "../../lib/FormatRupiah";
import { fetchReservasiList } from "../../api/customer/apiReservations";
import CustomerFooter from "../../components/customer/CustomerFooter";

export default function ReservationHistory() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const pageSize = 9;
  const [query, setQuery] = useState("");

  const fetchData = async () => {
    try {
      const res = await fetchReservasiList();
      const data = res?.data || res || [];
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      alertError("Gagal memuat reservasi", "Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const list = useMemo(() => items, [items]);
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return list;
    return list.filter((item) => {
      const hotel =
        item.rincian_reservasis?.[0]?.kamar?.hotel?.nama_hotel || "";
      const alamat = item.rincian_reservasis?.[0]?.kamar?.hotel?.alamat || "";
      const status = item.status_reservasi || "";
      const paymentStatus = item.pembayaran?.status_pembayaran || "";
      const idStr = String(item.id_reservasi || "");

      return (
        hotel.toLowerCase().includes(q) ||
        alamat.toLowerCase().includes(q) ||
        status.toLowerCase().includes(q) ||
        paymentStatus.toLowerCase().includes(q) ||
        idStr.includes(q)
      );
    });
  }, [list, query]);

  const totalItems = filtered.length;
  const start = (page - 1) * pageSize;
  const displayed = useMemo(
    () => filtered.slice(start, start + pageSize),
    [filtered, start, pageSize]
  );

  useEffect(() => {
    setPage(1);
  }, [query]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="max-w-5xl mx-auto px-4 py-8">
          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-slate-900">
              Riwayat Reservasi
            </h1>
            <p className="text-slate-600 text-sm">
              Lihat daftar reservasi yang sudah kamu buat.
            </p>
          </div>

          <div className="mb-4">
            <SearchBar
              value={query}
              onChange={setQuery}
              placeholder="Cari berdasarkan nama hotel, alamat, status, atau ID reservasi..."
            />
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="divide-y divide-slate-100">
              {loading ? (
                <div className="p-6 text-center text-slate-500">
                  Memuat data...
                </div>
              ) : filtered.length === 0 ? (
                <div className="p-6 text-center text-slate-500">
                  Belum ada reservasi.
                </div>
              ) : (
                displayed.map((item) => {
                  const hotel =
                    item.rincian_reservasis?.[0]?.kamar?.hotel?.nama_hotel ||
                    "Hotel";
                  const alamat =
                    item.rincian_reservasis?.[0]?.kamar?.hotel?.alamat || "";
                  const reservationStatus = item.status_reservasi;
                  const paymentStatus =
                    item.pembayaran?.status_pembayaran || "";
                  const status = paymentStatus || reservationStatus;
                  const canPay =
                    reservationStatus?.toLowerCase() === "menunggu_pembayaran" &&
                    !paymentStatus;
                  return (
                    <div
                      key={item.id_reservasi}
                      className="p-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between"
                    >
                      <div className="space-y-1">
                        <h3 className="text-lg font-semibold text-slate-900">
                          #{item.id_reservasi} - {hotel}
                        </h3>
                        <div className="flex items-center text-slate-600 text-sm gap-1">
                          <MapPin className="w-4 h-4" />
                          {alamat || "Alamat tidak tersedia"}
                        </div>
                        <div className="flex flex-wrap items-center gap-3 text-sm text-slate-700">
                          <span className="inline-flex items-center gap-1">
                            <Calendar className="w-4 h-4 text-slate-500" />
                            {formatDate(item.check_in)} -{" "}
                            {formatDate(item.check_out)}
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <Clock className="w-4 h-4 text-slate-500" />
                            {item.jumlah_tamu} tamu
                          </span>
                        </div>
                        <div className="text-sm text-slate-800 font-semibold">
                          Total: {formatRupiah(item.total_biaya)}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <StatusBadge status={status} />
                        {canPay && (
                            <button
                              type="button"
                              onClick={() =>
                                navigate(`/payment/${item.id_reservasi}`)
                              }
                              className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition"
                            >
                              Bayar
                            </button>
                          )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {totalItems > 0 && (
            <CustomerPagination
              page={page}
              totalItems={totalItems}
              pageSize={pageSize}
              onChange={(p) => setPage(p)}
              className="mb-8"
            />
          )}
        </div>
      </main>
      <CustomerFooter />
    </div>
  );
}
