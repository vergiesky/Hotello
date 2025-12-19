import React from "react";
import { calcSubtotal } from "../../lib/ReservationHelpers";
import formatRupiah from "../../lib/FormatRupiah";

export default function ReservationSummary({
  guestCount,
  nights,
  selections,
  kamarList,
  totalBiaya,
  onSubmitMobile,
}) {
  return (
    <aside className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 h-fit">
      <h3 className="text-lg font-semibold text-slate-900 mb-4">Ringkasan</h3>
      <div className="space-y-3 text-sm text-slate-700">
        <div className="flex justify-between">
          <span>Tamu</span>
          <span>{guestCount} orang</span>
        </div>
        <div className="flex justify-between">
          <span>Malam</span>
          <span>{nights} malam</span>
        </div>
        <div className="border-t border-slate-100 pt-3">
          <p className="font-semibold text-slate-900 mb-2">Detail Kamar</p>
          {selections.length === 0 ? (
            <p className="text-slate-500 text-sm">Belum ada kamar dipilih.</p>
          ) : (
            <div className="space-y-2">
              {selections.map((row) => {
                const kamar = kamarList.find(
                  (k) => Number(k.id_kamar) === row.id_kamar
                );
                const subtotal = calcSubtotal(kamar, row.jumlah_kamar, nights);
                return (
                  <div
                    key={row.id_kamar}
                    className="flex justify-between text-slate-700"
                  >
                    <span>
                      {kamar?.nama_kamar || "Kamar"} x {row.jumlah_kamar}
                    </span>
                    <span className="font-semibold">{formatRupiah(subtotal)}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        <div className="border-t border-slate-100 pt-3 flex justify-between text-base font-semibold text-slate-900">
          <span>Total</span>
          <span>{formatRupiah(totalBiaya)}</span>
        </div>
        <div className="pt-4 lg:hidden">
          <button
            type="button"
            onClick={onSubmitMobile}
            className="w-full py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition shadow"
          >
            Buat Reservasi
          </button>
        </div>
      </div>
    </aside>
  );
}

