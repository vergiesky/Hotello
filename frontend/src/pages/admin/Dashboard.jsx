import React, { useEffect, useMemo, useState } from "react";
import {
  BarChart3,
  TrendingUp,
  Building2,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import {
  LineChart as ReLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ReTooltip,
  Legend as ReLegend,
  ResponsiveContainer,
} from "recharts";
import NavbarAdmin from "../../components/admin/NavbarAdmin";
import { alertError } from "../../lib/Alert";
import formatRupiah from "../../lib/FormatRupiah";
import { fetchPembayarans } from "../../api/admin/apiAdminPembayarans";
import { buildHotelDetail, buildMonthlyRevenue } from "../../lib/ReportingHelpers";
import SortToggle from "../../components/admin/SortToggle";
import HotelRankingTable from "../../components/admin/HotelRankingTable";
import HotelDetailOverlay from "../../components/admin/HotelDetailOverlay";

function StatCard({ icon: Icon, label, value, accent }) {
  return (
    <div className="flex items-center gap-4 rounded-2xl bg-white p-4 border border-slate-100 shadow-sm">
      <div
        className={`flex h-12 w-12 items-center justify-center rounded-xl text-white shadow-inner ${accent}`}
      >
        <Icon className="h-6 w-6" />
      </div>
      <div className="flex flex-col">
        <p className="text-sm text-slate-500">{label}</p>
        <p className="text-2xl font-semibold text-slate-900">{value}</p>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [detailHotel, setDetailHotel] = useState(null); // data hotel untuk modal detail
  const [showDetail, setShowDetail] = useState(false);
  const [sortBy, setSortBy] = useState("booking"); // booking | revenue

  const fetchData = async () => {
    setRefreshing(true);
    try {
      const res = await fetchPembayarans();
      setPayments(res?.data || res || []);
      console.log(res);
    } catch (err) {
      console.error(err);
      alertError("Gagal memuat pelaporan", "Silakan coba lagi.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const summary = useMemo(() => {
    const paidPayments = payments.filter(
      (p) => (p.status_pembayaran || "").toLowerCase() === "paid"
    );

    const totals = {
      totalBooking: payments.length,
      totalPaid: 0,
      totalPending: 0,
      revenue: 0,
    };
    const hotelMap = {};

    payments.forEach((item) => {
      const status = (item.status_pembayaran || "").toLowerCase();
      if (status === "paid") totals.totalPaid += 1;
      if (status === "pending") totals.totalPending += 1;
      totals.revenue += Number(item.jumlah_bayar) || 0;
    });

    // gunakan hanya pembayaran yang sudah paid untuk laporan hotel/kamar
    paidPayments.forEach((item) => {
      const rincian = item.reservasi?.rincian_reservasis || [];
      const hotelData = rincian[0]?.kamar?.hotel;
      const hotelKey =
        hotelData?.id_hotel || hotelData?.nama_hotel || "unknown";
      const hotelName = hotelData?.nama_hotel || "Tanpa Nama Hotel";

      if (!hotelMap[hotelKey]) {
        hotelMap[hotelKey] = {
          id: hotelData?.id_hotel || null,
          name: hotelName,
          count: 0,
          rooms: {},
          revenue: 0,
        };
      }

      hotelMap[hotelKey].count += 1;
      hotelMap[hotelKey].revenue += Number(item.jumlah_bayar) || 0;

      rincian.forEach((r) => {
        const roomName = r.kamar?.nama_kamar || "Kamar";
        const qty = Number(r.jumlah_kamar) || 0;
        hotelMap[hotelKey].rooms[roomName] =
          (hotelMap[hotelKey].rooms[roomName] || 0) + qty;
      });
    });

    const hotels = Object.values(hotelMap)
      .map((h) => ({
        ...h,
        rooms: Object.entries(h.rooms).sort((a, b) => b[1] - a[1]),
      }))
      .sort((a, b) => {
        if (sortBy === "revenue") {
          if (b.revenue === a.revenue) return b.count - a.count;
          return b.revenue - a.revenue;
        }
        if (b.count === a.count) return b.revenue - a.revenue;
        return b.count - a.count;
      });

    return { totals, hotels, paidPayments };
  }, [payments, sortBy]);

  const monthlyRevenue = useMemo(
    () => buildMonthlyRevenue(payments),
    [payments]
  );

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#f4f6fb] text-slate-800">
      <NavbarAdmin />

      <main className="flex-1 w-full p-6 md:p-8 space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-3xl font-bold text-slate-900">Dashboard</h2>
            <p className="text-slate-500">
              Pantau hotel yang paling sering dipesan total pendapatan perbulan
            </p>
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

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatCard
            icon={BarChart3}
            label="Total Booking"
            value={summary.totals.totalBooking}
            accent="bg-blue-600"
          />
          <StatCard
            icon={TrendingUp}
            label="Total Pendapatan"
            value={formatRupiah(summary.totals.revenue)}
            accent="bg-indigo-600"
          />
          <StatCard
            icon={Building2}
            label="Pembayaran Berhasil"
            value={summary.totals.totalPaid}
            accent="bg-green-600"
          />
          <StatCard
            icon={AlertCircle}
            label="Menunggu Pembayaran"
            value={summary.totals.totalPending}
            accent="bg-amber-500"
          />
        </div>

        <div className="rounded-2xl bg-white p-6 shadow border border-slate-100 space-y-3">
          <div>
            <p className="text-sm font-semibold text-blue-600">
              Trend Penghasilan
            </p>
            <h3 className="text-2xl font-bold text-slate-900">
              Penghasilan 6 Bulan Terakhir
            </h3>
            <p className="text-slate-500 text-sm">
              Pertumbuhan pendapatan booking dari {monthlyRevenue.rangeLabel}
            </p>
          </div>
          <div className="w-full h-72">
            <ResponsiveContainer width="100%" height="100%">
              <ReLineChart
                data={monthlyRevenue.data}
                margin={{ top: 10, right: 20, left: 0, bottom: 10 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" tick={{ fill: "#334155" }} />
                <YAxis
                  tick={{ fill: "#334155" }}
                  tickFormatter={(v) => `${Math.round(v / 1_000_000)} Jt`}
                />
                <ReTooltip
                  formatter={(value) => [
                    `Rp ${(Number(value) / 1_000_000).toFixed(1)} Jt`,
                    "Total Penghasilan",
                  ]}
                  labelFormatter={(label) => label}
                />
                <ReLegend formatter={() => "Total Penghasilan"} />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#2563eb"
                  strokeWidth={3}
                  dot={{ r: 5 }}
                  activeDot={{ r: 7 }}
                />
              </ReLineChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center gap-2 text-sm text-blue-700 font-semibold">
            <span className="inline-flex h-3 w-3 rounded-full bg-blue-600" />
            Total Penghasilan (paid)
          </div>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow border border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-slate-500">Detail Pelaporan</p>
              <h3 className="text-lg font-semibold text-slate-900">
                Laporan Hotel & Kamar Terpopuler
              </h3>
            </div>
            <SortToggle value={sortBy} onChange={setSortBy} />
          </div>

          <HotelRankingTable
            loading={loading}
            hotels={summary.hotels.slice(0, 8)}
            onSelect={(hotel) => {
              setDetailHotel(buildHotelDetail(hotel, summary.paidPayments || payments));
              setShowDetail(true);
            }}
          />
        </div>
      </main>

      <HotelDetailOverlay
        open={showDetail && !!detailHotel}
        hotel={detailHotel}
        onClose={() => setShowDetail(false)}
      />
    </div>
  );
}
