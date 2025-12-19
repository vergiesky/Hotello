import React from "react";
import { MapPin } from "lucide-react";
import { getKamarImageUrl } from "../../lib/KamarImage";

export default function ReservationHotelHeader({ hotel, primaryRoom }) {
  if (!hotel) return null;

  const imageSrc = getKamarImageUrl(primaryRoom);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 mb-4">
      <div className="flex items-start gap-3">
        <img
          src={imageSrc}
          alt={hotel.nama_hotel}
          className="w-20 h-20 rounded-lg object-cover bg-slate-100"
          onError={(e) => {
            e.currentTarget.src = "/images/hotel1_main.jpg";
          }}
        />
        <div className="flex-1">
          <h1 className="text-xl font-semibold text-slate-900">{hotel.nama_hotel}</h1>
          <div className="flex items-center text-slate-600 text-sm mt-1">
            <MapPin className="w-4 h-4 mr-1" />
            {(hotel.kota || "") + (hotel.alamat ? `, ${hotel.alamat}` : "")}
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Pilih tanggal, jumlah tamu, dan kamar untuk melanjutkan reservasi.
          </p>
        </div>
      </div>
    </div>
  );
}

