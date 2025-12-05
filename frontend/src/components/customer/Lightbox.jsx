import React, { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

// Generic lightbox popup for image arrays
export default function Lightbox({
  images,
  startIndex = 0,
  onClose,
  altPrefix = "Foto",
}) {
  const validImages = Array.isArray(images) ? images : [];
  const [idx, setIdx] = useState(startIndex);
  if (!validImages.length) return null;

  useEffect(() => {
    const boundedIndex = Math.min(
      Math.max(startIndex, 0),
      Math.max(validImages.length - 1, 0)
    );
    setIdx(boundedIndex);
  }, [startIndex, validImages.length]);

  const goPrev = () => {
    setIdx((prev) => (prev === 0 ? validImages.length - 1 : prev - 1));
  };

  const goNext = () => {
    setIdx((prev) => (prev === validImages.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center px-4">
      <button className="absolute inset-0" aria-label="Tutup" onClick={onClose} />
      <div className="relative z-10 max-w-5xl w-full flex flex-col items-center gap-4">
        <button
          type="button"
          onClick={onClose}
          className="absolute -top-10 right-0 md:-right-12 text-white/70 hover:text-white transition"
          aria-label="Tutup lightbox"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="relative w-full flex items-center justify-center">
          {validImages.length > 1 && (
            <button
              type="button"
              onClick={goPrev}
              className="absolute left-2 md:left-6 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 text-slate-700 flex items-center justify-center shadow hover:scale-105 transition"
              aria-label="Sebelumnya"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}

          <img
            src={validImages[idx]}
            alt={`${altPrefix} ${idx + 1}`}
            className="max-h-[80vh] w-auto rounded-xl shadow-2xl object-contain bg-black"
            onError={(e) => {
              e.currentTarget.src = "/images/hotel1_main.jpg";
            }}
          />

          {validImages.length > 1 && (
            <button
              type="button"
              onClick={goNext}
              className="absolute right-2 md:right-6 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 text-slate-700 flex items-center justify-center shadow hover:scale-105 transition"
              aria-label="Selanjutnya"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          )}
        </div>

        {validImages.length > 1 && (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              {validImages.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setIdx(i)}
                  className={`w-2.5 h-2.5 rounded-full ${
                    i === idx ? "bg-white" : "bg-white/50"
                  }`}
                  aria-label={`Pilih gambar ${i + 1}`}
                />
              ))}
            </div>
            <span className="text-white/70 text-xs">
              {idx + 1} / {validImages.length}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
