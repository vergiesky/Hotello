import React from "react";
import { Plus, Minus } from "lucide-react";
import { getKamarImageUrl } from "../../lib/KamarImage";
import formatRupiah from "../../lib/FormatRupiah";

export default function ReservationRoomCard({
  kamar,
  qty,
  stokTersedia,
  checkIn,
  checkOut,
  onChangeQty,
}) {
  const harga = Number(kamar?.harga) || 0;
  const disableIncrement =
    !checkIn ||
    !checkOut ||
    (stokTersedia !== null && stokTersedia !== undefined && qty >= stokTersedia);

  return (
    <div className="border border-slate-200 rounded-xl p-4 flex flex-col gap-3">
      <div className="flex gap-3">
        <img
          src={getKamarImageUrl(kamar)}
          alt={kamar.nama_kamar}
          className="w-24 h-24 rounded-lg object-cover bg-slate-100"
          onError={(e) => {
            e.currentTarget.src = "/images/hotel1_main.jpg";
          }}
        />
        <div className="flex-1">
          <p className="font-semibold text-slate-900">{kamar.nama_kamar}</p>
          <p className="text-sm text-slate-600 line-clamp-2">
            {kamar.deskripsi || "Kamar nyaman dengan fasilitas standar."}
          </p>
          <p className="text-sm font-semibold text-blue-600 mt-2">
            {formatRupiah(harga)} / malam
          </p>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-xs text-slate-500">
          Kapasitas {kamar.kapasitas || "-"} | Stok{" "}
          {stokTersedia === null ? "-" : stokTersedia ?? "-"}
        </span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onChangeQty?.(kamar.id_kamar, -1)}
            className="w-8 h-8 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50"
          >
            <Minus className="w-4 h-4 mx-auto" />
          </button>
          <span className="w-6 text-center text-sm font-semibold">{qty}</span>
          <button
            type="button"
            onClick={() => onChangeQty?.(kamar.id_kamar, 1)}
            className="w-8 h-8 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 disabled:opacity-50"
            disabled={disableIncrement}
          >
            <Plus className="w-4 h-4 mx-auto" />
          </button>
        </div>
      </div>
    </div>
  );
}

