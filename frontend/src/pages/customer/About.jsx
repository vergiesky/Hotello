import React, { useEffect } from "react";
import {
  MapPin,
  ShieldCheck,
  Star,
  Heart,
  Phone,
  Mail,
  CheckCircle2,
} from "lucide-react";

import Navbar from "../../components/Navbar";
import useAxios from "../../api";

export default function About() {
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await useAxios.get("/hotels");
        console.log("Berhasil memuat about");
      } catch (err) {
        console.error("Gagal memuat data", err);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Navbar utama */}
      <Navbar />

      <main className="flex-1">
        {/* Hero */}
        <section className="bg-white border-b border-gray-100">
          <div className="max-w-6xl mx-auto px-4 py-10 md:py-14">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-500 mb-2">
                  Tentang Hotello
                </p>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  Booking hotel jadi lebih{" "}
                  <span className="text-blue-600">mudah</span> dan{" "}
                  <span className="text-blue-600">nyaman</span>.
                </h1>
                <p className="text-gray-600 text-sm md:text-base leading-relaxed mb-4">
                  Hotello adalah platform pemesanan hotel yang dirancang untuk
                  membantu kamu menemukan tempat menginap terbaik dengan proses
                  yang cepat, transparan, dan tanpa ribet.
                </p>
                <p className="text-gray-500 text-xs md:text-sm">
                  Cocok untuk liburan, perjalanan bisnis, atau sekadar staycation
                  singkat di akhir pekan.
                </p>
              </div>

              <div className="relative">
                <div className="rounded-3xl bg-blue-600/90 text-white p-6 md:p-7 shadow-xl">
                  <p className="text-sm font-semibold mb-2">
                    Kenapa pengguna suka Hotello?
                  </p>
                  <ul className="space-y-3 text-xs md:text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 mt-0.5 text-emerald-300" />
                      <span>Pencarian hotel berdasarkan kota dan tanggal menginap.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 mt-0.5 text-emerald-300" />
                      <span>Detail hotel yang jelas: foto, fasilitas, rating, dan lokasi.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 mt-0.5 text-emerald-300" />
                      <span>Wishlist untuk menyimpan hotel favoritmu.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 mt-0.5 text-emerald-300" />
                      <span>Integrasi dengan sistem backend Laravel untuk data yang aman.</span>
                    </li>
                  </ul>
                </div>

                <div className="hidden md:block absolute -bottom-6 -right-4 bg-white rounded-2xl shadow-lg px-4 py-3 text-xs text-gray-700">
                  <p className="font-semibold flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    Rata-rata rating hotel 4.5/5
                  </p>
                  <p className="text-[11px] text-gray-500">
                    dari berbagai kota & tipe penginapan
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Kenapa Hotello */}
        <section className="py-10 md:py-14">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-2">
              Kenapa memilih Hotello?
            </h2>
            <p className="text-gray-500 text-sm mb-6">
              Beberapa alasan kenapa Hotello nyaman digunakan sebagai platform
              pemesanan hotel:
            </p>

            <div className="grid md:grid-cols-3 gap-5">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center mb-3">
                  <MapPin className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1 text-sm">
                  Jelajahi berbagai kota
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Cari hotel berdasarkan kota tujuan, lihat alamat lengkap, dan
                  temukan lokasi yang strategis dekat tempat favoritmu.
                </p>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                <div className="w-9 h-9 rounded-xl bg-green-50 flex items-center justify-center mb-3">
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1 text-sm">
                  Data aman & terkelola
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Backend menggunakan Laravel, autentikasi dengan Sanctum, dan
                  pemisahan peran Admin & Customer untuk pengelolaan data yang lebih aman.
                </p>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                <div className="w-9 h-9 rounded-xl bg-pink-50 flex items-center justify-center mb-3">
                  <Heart className="w-5 h-5 text-pink-500" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1 text-sm">
                  Simpan hotel favorit
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Fitur wishlist memudahkan kamu menyimpan dan membandingkan
                  beberapa hotel sebelum memutuskan untuk reservasi.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Cara kerja singkat */}
        <section className="py-10 md:py-14 bg-white border-t border-b border-gray-100">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-2">
              Bagaimana Hotello bekerja?
            </h2>
            <p className="text-gray-500 text-sm mb-6">
              Hanya dalam beberapa langkah, kamu sudah bisa menemukan dan
              memesan hotel yang sesuai kebutuhan.
            </p>

            <div className="grid md:grid-cols-3 gap-6 text-sm">
              <div className="flex gap-3">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-semibold">
                    1
                  </div>
                </div>
                <div>
                  <p className="font-semibold text-gray-900 mb-1">
                    Cari destinasi
                  </p>
                  <p className="text-gray-600 text-xs">
                    Masukkan kota tujuan, tanggal check-in dan check-out, serta
                    jumlah tamu yang akan menginap.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-semibold">
                    2
                  </div>
                </div>
                <div>
                  <p className="font-semibold text-gray-900 mb-1">
                    Jelajahi hotel
                  </p>
                  <p className="text-gray-600 text-xs">
                    Lihat foto, rating, fasilitas, serta deskripsi hotel. Simpan
                    ke wishlist jika masih ingin membandingkan.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-semibold">
                    3
                  </div>
                </div>
                <div>
                  <p className="font-semibold text-gray-900 mb-1">
                    Lanjut ke reservasi
                  </p>
                  <p className="text-gray-600 text-xs">
                    Setelah memilih hotel, kamu bisa melanjutkan proses reservasi
                    dan melengkapi data sesuai kebijakan hotel.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Komitmen & Kontak */}
        <section className="py-10 md:py-14">
          <div className="max-w-6xl mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-3">
                  Komitmen kami
                </h2>
                <p className="text-sm text-gray-600 mb-3 leading-relaxed">
                  Hotello dikembangkan sebagai bagian dari proyek aplikasi web /
                  sistem informasi perhotelan. Fokus utama kami adalah memberikan
                  pengalaman pemesanan yang jelas, konsisten, dan mudah dipahami
                  oleh pengguna.
                </p>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Ke depannya, fitur-fitur seperti riwayat reservasi, metode
                  pembayaran yang lebih lengkap, serta integrasi pendapatan untuk
                  pemilik hotel dapat ditambahkan di atas fondasi yang sudah ada.
                </p>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">
                  Butuh bantuan atau ingin memberi masukan?
                </h3>
                <p className="text-xs text-gray-600 mb-4">
                  Jika kamu menemukan bug, ingin memberikan saran, atau sekadar
                  bertanya seputar cara penggunaan sistem, kamu bisa menghubungi
                  kami melalui:
                </p>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-700">
                      support@hotello.test
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-700">
                      +62 812-0000-0000 (demo)
                    </span>
                  </div>
                </div>

                <p className="text-[11px] text-gray-400 mt-4">
                  *Kontak di atas dapat disesuaikan dengan kebutuhan tugas / proyek
                  kamu (misalnya diganti dengan email kampus atau repo GitHub).
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
