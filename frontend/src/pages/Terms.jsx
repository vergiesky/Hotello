import Navbar from "../components/customer/Navbar";
import CustomerFooter from "../components/customer/CustomerFooter";

export default function Terms() {
  const sections = [
    {
      title: "1. Ketentuan Umum",
      points: [
        "Platform Hotello digunakan untuk mencari, memesan, dan mengelola reservasi kamar hotel.",
        "Penggunaan akun bersifat pribadi; jangan membagikan kredensial kepada pihak lain.",
        "Kami dapat memperbarui syarat & ketentuan sewaktu-waktu. Versi terbaru berlaku sejak dipublikasikan.",
      ],
    },
    {
      title: "2. Akun & Keamanan",
      points: [
        "Gunakan email aktif dan kata sandi yang kuat saat mendaftar.",
        "Segera ubah kata sandi jika dicurigai ada akses tidak sah.",
        "Kami berhak menangguhkan akun yang melanggar kebijakan atau terindikasi penyalahgunaan.",
      ],
    },
    {
      title: "3. Reservasi & Pembayaran",
      points: [
        "Pastikan data tamu, tanggal menginap, dan tipe kamar sudah benar sebelum konfirmasi.",
        "Pembayaran mengikuti metode yang tersedia di aplikasi; status reservasi akan diperbarui setelah verifikasi.",
        "Kebijakan pembatalan dan pengembalian dana mengikuti ketentuan masing-masing hotel.",
      ],
    },
    {
      title: "4. Data & Privasi",
      points: [
        "Kami mengumpulkan data yang diperlukan untuk memproses reservasi dan meningkatkan layanan.",
        "Data Anda tidak akan dibagikan ke pihak ketiga tanpa persetujuan, kecuali diwajibkan oleh hukum.",
        "Lihat kebijakan privasi untuk detail lebih lanjut mengenai pengelolaan data.",
      ],
    },
    {
      title: "5. Konten & Kepatuhan",
      points: [
        "Dilarang mengunggah konten yang melanggar hukum, menyinggung, atau melanggar hak pihak lain.",
        "Ulasan dan feedback harus berdasarkan pengalaman nyata dan disampaikan secara sopan.",
      ],
    },
    {
      title: "6. Tanggung Jawab Pengguna",
      points: [
        "Pengguna bertanggung jawab atas keakuratan data yang diberikan saat reservasi.",
        "Segala kerugian akibat kelalaian pengguna (mis. salah tanggal, salah tipe kamar) bukan tanggung jawab Hotello.",
      ],
    },
    {
      title: "7. Batasan Tanggung Jawab",
      points: [
        "Hotello bertindak sebagai platform; tanggung jawab operasional hotel berada pada pihak hotel.",
        "Kami tidak bertanggung jawab atas gangguan layanan akibat kejadian di luar kendali (force majeure).",
      ],
    },
    {
      title: "8. Dukungan & Kontak",
      points: [
        "Jika ada pertanyaan, hubungi dukungan melalui menu Bantuan atau email support@hotello.com.",
        "Jam dukungan mengikuti jam operasional yang diinformasikan pada halaman bantuan.",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="max-w-5xl mx-auto px-4 py-10">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
            <h1 className="text-2xl font-semibold text-slate-900 mb-2">
              Syarat & Ketentuan Hotello
            </h1>
            <p className="text-slate-600 text-sm mb-6">
              Mohon baca dengan saksama sebelum menggunakan layanan kami.
            </p>

            <div className="space-y-6">
              {sections.map((section) => ( // untuk setiap item di array sections, render 1 blok <div>
                <div key={section.title} className="space-y-2">
                  {/* menampilkan judul section */}
                  <h3 className="text-lg font-semibold text-slate-900">
                    {section.title}
                  </h3>
                  {/* menampilkan bullet points */}
                  <ul className="list-disc list-inside space-y-1 text-sm text-slate-700">
                    {section.points.map((point, idx) => (
                      <li key={idx}>{point}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="mt-8 p-4 rounded-xl bg-blue-50 border border-blue-100 text-sm text-blue-800">
              Dengan menggunakan Hotello, Anda menyatakan telah membaca, memahami, dan menyetujui
              Syarat & Ketentuan ini.
            </div>
          </div>
        </div>
      </main>
      <CustomerFooter />
    </div>
  );
}
