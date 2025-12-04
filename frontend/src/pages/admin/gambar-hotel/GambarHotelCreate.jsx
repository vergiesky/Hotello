import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAxios from "../../../api";
import { alertError, alertSuccess } from "../../../lib/Alert";

export default function GambarHotelCreate() {
  const navigate = useNavigate();
  const [hotels, setHotels] = useState([]);
  const [form, setForm] = useState({
    id_hotel: "",
    nama_gambar_hotel: "",
    keterangan_gambar_hotel: "",
    file_path_gambar_hotel: "",
  });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFile = (e) => {
    const f = e.target.files?.[0];
    setFile(f || null);
    if (f) setForm((prev) => ({ ...prev, file_path_gambar_hotel: f.name }));
  };

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const res = await useAxios.get("/hotels");
        console.log(res.data);
        setHotels(res.data?.data || []);
      } catch (err) {
        console.error(err);
        alertError("Gagal memuat hotel", "Silakan coba lagi.");
      }
    };
    fetchHotels();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("id_hotel", form.id_hotel);
      formData.append("nama_gambar_hotel", form.nama_gambar_hotel);
      formData.append("keterangan_gambar_hotel", form.keterangan_gambar_hotel);
      if (file) formData.append("file_gambar", file);

      const res = await useAxios.post("/gambar-hotel/create", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log(res.data);
      await alertSuccess("Berhasil", res.data?.message || "Gambar hotel ditambahkan.");
      setForm({
        id_hotel: "",
        nama_gambar_hotel: "",
        keterangan_gambar_hotel: "",
        file_path_gambar_hotel: "",
      });
      setFile(null);
      navigate("/admin/gambar-hotel");
    } catch (err) {
      console.error(err);
      const msg =
        err?.response?.data?.message ||
        (err?.response?.data?.errors &&
          Object.values(err.response.data.errors).flat().join("\n")) ||
        "Gagal menambahkan gambar.";
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
          <h1 className="text-3xl font-bold text-gray-900">Tambah Gambar Hotel</h1>
          <p className="text-gray-600 mt-2">
            Unggah foto hotel dan lengkapi keterangannya.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Pilih Hotel <span className="text-blue-600">*</span>
                </label>
                <select
                  name="id_hotel"
                  value={form.id_hotel}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  required
                >
                  <option value="">Pilih hotel</option>
                  {hotels.map((h) => (
                    <option key={h.id_hotel} value={h.id_hotel}>
                      {h.nama_hotel}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Nama Gambar <span className="text-blue-600">*</span>
                </label>
                <input
                  type="text"
                  name="nama_gambar_hotel"
                  value={form.nama_gambar_hotel}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  placeholder="Tampak depan hotel"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Keterangan
              </label>
              <textarea
                name="keterangan_gambar_hotel"
                value={form.keterangan_gambar_hotel}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                placeholder="Contoh: Lobi utama"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                File Gambar <span className="text-blue-600">*</span>
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFile}
                className="w-full px-4 py-2.5 rounded-xl border-2 border-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition bg-white"
                required
              />
              {form.file_path_gambar_hotel && (
                <p className="text-xs text-gray-500">Dipilih: {form.file_path_gambar_hotel}</p>
              )}
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold shadow-lg hover:from-blue-700 hover:to-blue-600 transition disabled:opacity-60"
              >
                {loading ? "Menyimpan..." : "Simpan Gambar"}
              </button>
              <button
                type="button"
                onClick={() =>
                  setForm({
                    id_hotel: "",
                    nama_gambar_hotel: "",
                    keterangan_gambar_hotel: "",
                    file_path_gambar_hotel: "",
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
