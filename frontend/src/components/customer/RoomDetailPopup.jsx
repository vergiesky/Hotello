import React, { useEffect, useMemo, useState } from "react";
import { Users, CheckCircle2, ChevronLeft, ChevronRight, X, Maximize2 } from "lucide-react";
import { getKamarImageUrl, getKamarImageUrls } from "../../lib/KamarImage";
import { getFasilitasKamarIcon } from "../../lib/FasilitasIcon";
import Lightbox from "./Lightbox";

export default function RoomDetailPopup({
  room,
  hotelId,
  onClose,
  onSelectFacility,
  navigate,
}) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const images = useMemo(() => getKamarImageUrls(room), [room]);

  useEffect(() => {
    setActiveIdx(0);
  }, [room?.id_kamar]);

  if (!room) return null;
  const fasilitasRoom = room.fasilitas_kamars || room.fasilitas_kamar || [];
  const harga = room.harga_per_malam ?? room.harga ?? null;

  const goPrev = () => {
    setActiveIdx((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goNext = () => {
    setActiveIdx((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative z-50 bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-2xl w-full overflow-hidden">
        <div
          className="relative h-60 bg-gray-100 group cursor-pointer"
          onClick={() => setIsLightboxOpen(true)}
        >
          <img
            src={images[activeIdx]}
            alt={room.nama_kamar}
            className="w-full h-full object-cover transition"
            onError={(e) => {
              e.currentTarget.src = getKamarImageUrl(room);
            }}
          />
          <div className="absolute inset-x-0 bottom-3 flex items-center justify-center gap-2">
            {images.length > 1 &&
              images.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveIdx(i);
                  }}
                  className={`h-1.5 rounded-full transition ${
                    i === activeIdx ? "w-8 bg-white" : "w-4 bg-white/60"
                  }`}
                  aria-label={`Gambar ${i + 1}`}
                />
              ))}
          </div>

          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  goPrev();
                }}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/85 text-slate-700 hidden md:flex items-center justify-center shadow hover:scale-105 transition"
                aria-label="Gambar sebelumnya"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  goNext();
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/85 text-slate-700 hidden md:flex items-center justify-center shadow hover:scale-105 transition"
                aria-label="Gambar selanjutnya"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}

          <div className="absolute top-3 right-3 flex items-center gap-2">
            <div className="px-2 py-1 rounded-full bg-white/85 text-slate-700 text-xs flex items-center gap-1 shadow">
              <Users className="w-3.5 h-3.5" />
              {room.kapasitas || "-"}
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsLightboxOpen(true);
              }}
              className="w-8 h-8 rounded-full bg-white/90 shadow flex items-center justify-center text-slate-600 hover:bg-white"
              aria-label="Perbesar gambar"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              className="w-8 h-8 rounded-full bg-white/90 shadow flex items-center justify-center text-slate-600 hover:bg-white"
              aria-label="Tutup"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div className="p-5 space-y-3">
          <h4 className="text-lg font-semibold text-slate-900">{room.nama_kamar}</h4>
          <p className="text-sm text-slate-600">{room.deskripsi || "Kamar nyaman dengan fasilitas standar."}</p>
          <div className="flex flex-wrap gap-2">
            {fasilitasRoom.map((f, idx) => {
              const iconUrl = getFasilitasKamarIcon(f);
              const label = f?.nama_fasilitas_kamar || f?.keterangan_fasilitas_kamar || "Fasilitas";
              return (
                <button
                  type="button"
                  key={`modal-${room.id_kamar}-f-${idx}`}
                  onClick={() => onSelectFacility && onSelectFacility(f)}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 text-[11px] hover:bg-slate-200 transition"
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
          </div>
          <div>
            <p className="text-base font-semibold text-blue-600 mb-1">
              Rp {harga ? Number(harga).toLocaleString("id-ID") : "-"}
            </p>
            <p className="text-[11px] text-slate-500">per malam</p>
          </div>
          <div className="flex justify-end pt-2">
            <button
              onClick={() => navigate(`/reservation/${hotelId}?room=${room.id_kamar}`)}
              className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition"
            >
              Pesan Kamar Ini
            </button>
          </div>
        </div>
      </div>
      {isLightboxOpen && (
        <Lightbox
          images={images}
          startIndex={activeIdx}
          onClose={() => setIsLightboxOpen(false)}
          altPrefix={room.nama_kamar || "Kamar"}
        />
      )}
    </div>
  );
}
