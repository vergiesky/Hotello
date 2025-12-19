import React from "react";
import formatRupiah from "../../lib/FormatRupiah";

// Overlay to show detail per-hotel bookings and rooms.
export default function HotelDetailOverlay({ open, hotel, onClose }) {
  if (!open || !hotel) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative z-50 w-full max-w-2xl rounded-2xl bg-white shadow-2xl border border-slate-100 p-6 space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.08em] text-slate-500 font-semibold">
              Detail Hotel
            </p>
            <h3 className="text-xl font-semibold text-slate-900">
              {hotel.name}
            </h3>
            <p className="text-sm text-slate-600">
              Total booking {hotel.totalBooking} • Revenue{" "}
              {formatRupiah(hotel.revenue)}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-500 hover:text-slate-700"
            aria-label="Tutup detail hotel"
          >
            ×
          </button>
        </div>

        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-sm font-semibold text-slate-800 mb-2">
            Kamar terpopuler
          </p>
          {hotel.rooms?.length === 0 ? (
            <p className="text-sm text-slate-500">Belum ada data kamar.</p>
          ) : (
            <ul className="space-y-2 text-sm text-slate-800">
              {hotel.rooms.map((room) => (
                <li
                  key={room.name}
                  className="flex items-center justify-between rounded-lg bg-white px-3 py-2 border border-slate-200"
                >
                  <span className="font-medium">{room.name}</span>
                  <span className="text-slate-600">
                    {room.booking} booking
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

