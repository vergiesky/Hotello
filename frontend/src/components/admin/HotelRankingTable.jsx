import React from "react";
import formatShortRupiah from "../../lib/FormatShortRupiah";
import ReportSkeleton from "./ReportSkeleton";

function RankingBadge({ rank }) {
  const styles = [
    "bg-amber-400 text-white",
    "bg-slate-400 text-white",
    "bg-orange-500 text-white",
  ];
  const base =
    "inline-flex h-9 w-9 items-center justify-center rounded-full font-bold";
  const className = styles[rank - 1] || "bg-slate-200 text-slate-700";
  return <span className={`${base} ${className}`}>{rank}</span>;
}

// Table for hotel ranking with revenue and room summary.
export default function HotelRankingTable({ hotels = [], loading = false, onSelect }) {
  if (loading) {
    return <ReportSkeleton rows={4} />;
  }

  if (!hotels.length) {
    return (
      <div className="rounded-xl border border-dashed border-slate-200 p-6 text-center text-slate-500">
        Belum ada data pemesanan.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead className="bg-slate-50 text-slate-700">
          <tr>
            <th className="px-4 py-3 text-left font-semibold">Ranking</th>
            <th className="px-4 py-3 text-left font-semibold">Nama Hotel</th>
            <th className="px-4 py-3 text-left font-semibold">Total Booking</th>
            <th className="px-4 py-3 text-left font-semibold">Kamar Terpopuler</th>
            <th className="px-4 py-3 text-left font-semibold">Booking Kamar</th>
            <th className="px-4 py-3 text-left font-semibold">Revenue</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {hotels.map((hotel, idx) => {
            const topRoom = hotel.rooms?.[0] || [];
            const [roomName, qty] = topRoom;
            return (
              <tr
                key={`${hotel.name}-${idx}`}
                className="hover:bg-slate-50 cursor-pointer"
                onClick={() => onSelect?.(hotel)}
              >
                <td className="px-4 py-3">
                  <RankingBadge rank={idx + 1} />
                </td>
                <td className="px-4 py-3 font-semibold text-slate-900">
                  {hotel.name}
                </td>
                <td className="px-4 py-3 text-slate-800">{hotel.count}</td>
                <td className="px-4 py-3 text-slate-700">{roomName || "-"}</td>
                <td className="px-4 py-3 text-slate-700">{qty || 0}</td>
                <td className="px-4 py-3 font-semibold text-slate-900">
                  {formatShortRupiah(hotel.revenue)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

