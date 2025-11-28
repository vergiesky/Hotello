import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAxios from "../../../api";
import { alertError, alertSuccess } from "../../../lib/Alert";

export default function FasilitasKamarCreate() {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [icons, setIcons] = useState([]);
  const [form, setForm] = useState({
    id_kamar: "",
    id_icon: "",
    nama_fasilitas_kamar: "",
    keterangan_fasilitas_kamar: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await useAxios.get("/kamars");
        console.log(res.data);
        setRooms(res.data?.data || []);
      } catch (err) {
        console.error(err);
        alertError("Gagal memuat kamar", "Silakan coba lagi.");
      }
    };
    const fetchIcons = async () => {
      try {
        const res = await useAxios.get("/icons");
        console.log(res.data);
        setIcons(res.data?.data || []);
      } catch (err) {
        console.error(err);
        alertError("Gagal memuat icon", "Silakan coba lagi.");
      }
    };
    fetchRooms();
    fetchIcons();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { ...form };
      const res = await useAxios.post("/fasilitas-kamar/create", payload);
      console.log(res.data);
      await alertSuccess("Berhasil", res.data?.message || "Fasilitas kamar ditambahkan.");
      setForm({
        id_kamar: "",
        id_icon: "",
        nama_fasilitas_kamar: "",
        keterangan_fasilitas_kamar: "",
      });
      navigate("/admin/fasilitas-kamar");
    } catch (err) {
      console.error(err);
      const msg =
        err?.response?.data?.message ||
        (err?.response?.data?.errors &&
          Object.values(err.response.data.errors).flat().join("\n")) ||
        "Gagal menambahkan fasilitas kamar.";
      alertError("Error", msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-blue-100 text-gray-900 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 text-center md:text-left">
          <p className="text-sm uppercase tracking-[0.25em] text-blue-500 mb-2 font-semibold">
            Admin Panel
          </p>
          <h1 className="text-3xl font-bold text-gray-900">Tambah Fasilitas Kamar</h1>
          <p className="text-gray-600 mt-2">
            Lengkapi data fasilitas per kamar.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Pilih Kamar <span className="text-blue-600">*</span>
                </label>
                <select
                  name="id_kamar"
                  value={form.id_kamar}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  required
                >
                  <option value="">Pilih kamar</option>
                  {rooms.map((r) => (
                    <option key={r.id_kamar} value={r.id_kamar}>
                      {r.nama_kamar}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Icon Fasilitas <span className="text-blue-600">*</span>
                </label>
                <select
                  name="id_icon"
                  value={form.id_icon}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  required
                >
                  <option value="">Pilih icon</option>
                  {icons.map((ic) => (
                    <option key={ic.id_icon} value={ic.id_icon}>
                      {ic.nama_icon}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500">Pastikan icon sudah dibuat di menu Icon.</p>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Nama Fasilitas <span className="text-blue-600">*</span>
                </label>
                <input
                  type="text"
                  name="nama_fasilitas_kamar"
                  value={form.nama_fasilitas_kamar}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  placeholder="WiFi"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Deskripsi <span className="text-blue-600">*</span>
              </label>
              <textarea
                name="keterangan_fasilitas_kamar"
                value={form.keterangan_fasilitas_kamar}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                placeholder="Tuliskan deskripsi fasilitas..."
                required
              />
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold shadow-lg hover:from-blue-700 hover:to-blue-600 transition disabled:opacity-60"
              >
                {loading ? "Menyimpan..." : "Simpan Fasilitas"}
              </button>
              <button
                type="button"
                onClick={() =>
                  setForm({
                    id_kamar: "",
                    id_icon: "",
                    nama_fasilitas_kamar: "",
                    keterangan_fasilitas_kamar: "",
                  })
                }
                className="inline-flex items-center justify-center px-5 py-3 rounded-xl border-2 border-gray-200 text-gray-700 hover:bg-gray-50 transition"
              >
                Reset
              </button>
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="inline-flex items-center justify-center px-5 py-3 rounded-xl border-2 border-gray-200 text-gray-700 hover:bg-gray-50 transition"
              >
                Kembali
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
