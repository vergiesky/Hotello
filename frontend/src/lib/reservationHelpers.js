export function normalizeHotelDetail(res, preselectRoom) {
  const hotelData = res?.hotel || res?.data || null;
  const preselectedRooms = {};

  if (preselectRoom && hotelData?.kamars) {
    const exists = hotelData.kamars.some(
      (k) => `${k.id_kamar}` === `${preselectRoom}`
    );
    if (exists) {
      preselectedRooms[preselectRoom] = 1;
    }
  }

  return { hotelData, preselectedRooms };
}

export function mapAvailability(data = []) {
  const map = {};
  data.forEach((k) => {
    map[k.id_kamar] = k.stok_tersedia ?? k.stok_kamar ?? 0;
  });
  return map;
}

export function buildSelections(selectedRooms = {}) {
  return Object.entries(selectedRooms)
    .map(([id, qty]) => ({
      id_kamar: Number(id),
      jumlah_kamar: Number(qty) || 0,
    }))
    .filter((row) => row.jumlah_kamar > 0);
}

export function buildReservasiPayload({
  checkIn,
  checkOut,
  guestCount,
  selections,
}) {
  return {
    check_in: checkIn,
    check_out: checkOut,
    jumlah_tamu: Number(guestCount) || 1,
    kamar: selections,
  };
}

export function calcSubtotal(kamar, qty, nights) {
  const harga = Number(kamar?.harga) || 0;
  const jumlah = Number(qty) || 0;
  if (!Number(nights)) return 0;
  return harga * jumlah * Number(nights);
}

export function calcTotalBiaya(kamarList = [], selections = [], nights) {
  if (!Number(nights)) return 0;
  return selections.reduce((acc, row) => {
    const kamar = kamarList.find((k) => Number(k.id_kamar) === row.id_kamar);
    return acc + calcSubtotal(kamar, row.jumlah_kamar, nights);
  }, 0);
}

export function calcTotalCapacity(kamarList = [], selections = []) {
  return selections.reduce((acc, row) => {
    const kamar = kamarList.find((k) => Number(k.id_kamar) === row.id_kamar);
    const kapasitas = Number(kamar?.kapasitas) || 0;
    const qty = Number(row.jumlah_kamar) || 0;
    return acc + kapasitas * qty;
  }, 0);
}

export function validateReservation({
  checkIn,
  checkOut,
  nights,
  selections,
  guestCount,
}) {
  if (!checkIn || !checkOut) {
    return {
      title: "Tanggal belum lengkap",
      message: "Silakan pilih tanggal check-in dan check-out.",
    };
  }
  if (Number(nights) <= 0) {
    return {
      title: "Tanggal tidak valid",
      message: "Check-out harus setelah check-in.",
    };
  }
  if (!guestCount || Number(guestCount) < 1) {
    return {
      title: "Jumlah tamu tidak valid",
      message: "Minimal 1 tamu untuk membuat reservasi.",
    };
  }
  if (!selections || selections.length === 0) {
    return {
      title: "Belum pilih kamar",
      message: "Tambahkan minimal 1 kamar.",
    };
  }
  return null;
}

export function nextQty(prevQty, delta, maxAvail = Number.MAX_SAFE_INTEGER) {
  const current = Number(prevQty) || 0;
  const max = Number.isFinite(maxAvail) ? maxAvail : Number.MAX_SAFE_INTEGER;
  return Math.min(Math.max(0, current + delta), max);
}
