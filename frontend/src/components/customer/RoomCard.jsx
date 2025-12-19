import React from "react";
import { Users, CheckCircle2 } from "lucide-react";
import { getKamarImageUrl } from "../../lib/KamarImage";
import { getFasilitasKamarIcon } from "../../lib/FasilitasIcon";

export default function RoomCard({
  kamar,
  isSelected = false,
  onSelectRoom,
  onSelectFacility,
}) {
  const img = getKamarImageUrl(kamar);
  const fasilitasKamar = kamar?.fasilitas_kamars || kamar?.fasilitas_kamar || [];
  const fasilitasTampil = fasilitasKamar.slice(0, 3);
  const sisaFasilitas = Math.max(0, fasilitasKamar.length - fasilitasTampil.length);

  const handleSelectRoom = () => {
    if (onSelectRoom) onSelectRoom(kamar);
  };

  const handleFacilityClick = (facility, e) => {
    e.stopPropagation();
    if (onSelectFacility) onSelectFacility(facility, kamar);
  };

  const harga = kamar.harga_per_malam ?? kamar.harga ?? null;

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleSelectRoom}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleSelectRoom();
        }
      }}
      className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col cursor-pointer hover:-translate-y-0.5 hover:shadow transition"
    >
      <div className="relative h-44 bg-gray-100">
        <img
          src={img}
          alt={kamar.nama_kamar}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.src = "/images/hotel1_main.jpg";
          }}
        />
        <div className="absolute top-2 right-2 px-2 py-1 rounded-full bg-white/85 text-slate-700 text-xs flex items-center gap-1 shadow">
          <Users className="w-3.5 h-3.5" />
          {kamar.kapasitas || "-"}
        </div>
      </div>

      <div className="p-4 flex flex-col gap-2 flex-1">
        <h4 className="font-semibold text-slate-900 text-base">{kamar.nama_kamar}</h4>
        <p className="text-sm text-slate-600 line-clamp-2">
          {kamar.deskripsi || "Kamar nyaman dengan fasilitas standar."}
        </p>

        <div className="flex flex-wrap gap-2">
          {fasilitasTampil.map((f, idx) => {
            const iconUrl = getFasilitasKamarIcon(f);
            const label =
              f?.nama_fasilitas_kamar || f?.keterangan_fasilitas_kamar || "Fasilitas";
            return (
              <button
                type="button"
                key={`${kamar.id_kamar}-f-${idx}`}
                onClick={(e) => handleFacilityClick(f, e)}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 text-[11px] transition ${
                  isSelected ? "hover:bg-slate-200" : ""
                }`}
              >
                {iconUrl ? (
                  <img
                    src={iconUrl}
                    alt={label}
                    className="w-4 h-4 object-contain"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                ) : (
                  <CheckCircle2 className="w-4 h-4" />
                )}
                <span>{label}</span>
              </button>
            );
          })}
          {sisaFasilitas > 0 && (
            <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 text-[11px]">
              +{sisaFasilitas} lainnya
            </span>
          )}
        </div>

        <div className="mt-auto pt-2">
          <p className="text-sm font-semibold text-blue-600 mb-1">
            Rp {harga ? Number(harga).toLocaleString("id-ID") : "-"}
          </p>
          <p className="text-[11px] text-slate-500">per malam</p>
        </div>
      </div>
    </div>
  );
}

