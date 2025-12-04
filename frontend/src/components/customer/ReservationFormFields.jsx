import React from "react";
import { Calendar as CalendarIcon, Users } from "lucide-react";

export default function ReservationFormFields({
  checkIn,
  checkOut,
  guestCount,
  onChangeCheckIn,
  onChangeCheckOut,
  onChangeGuestCount,
}) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
      <h3 className="text-lg font-semibold text-slate-900 mb-4">Detail Reservasi</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <label className="flex flex-col gap-1 text-sm text-slate-700">
          Check-in
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 bg-slate-50">
            <CalendarIcon className="w-4 h-4 text-slate-500" />
            <input
              type="date"
              value={checkIn}
              onChange={(e) => onChangeCheckIn?.(e.target.value)}
              className="flex-1 bg-transparent outline-none text-sm text-slate-800 accent-blue-600 focus:outline-none"
            />
          </div>
        </label>
        <label className="flex flex-col gap-1 text-sm text-slate-700">
          Check-out
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 bg-slate-50">
            <CalendarIcon className="w-4 h-4 text-slate-500" />
            <input
              type="date"
              value={checkOut}
              onChange={(e) => onChangeCheckOut?.(e.target.value)}
              className="flex-1 bg-transparent outline-none text-sm text-slate-800 accent-blue-600 focus:outline-none"
            />
          </div>
        </label>
        <label className="flex flex-col gap-1 text-sm text-slate-700">
          Jumlah Tamu
          <div className="flex items-center gap-3 px-3 py-2 rounded-lg border border-slate-200 bg-slate-50">
            <Users className="w-4 h-4 text-slate-500" />
            <input
              type="number"
              min="1"
              value={guestCount}
              onChange={(e) => onChangeGuestCount?.(e.target.value)}
              className="flex-1 bg-transparent outline-none text-sm text-slate-800 focus:outline-none"
            />
          </div>
        </label>
      </div>
    </div>
  );
}
