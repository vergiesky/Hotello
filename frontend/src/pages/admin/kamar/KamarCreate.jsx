import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAxios from "../../../api";
import { alertError, alertSuccess } from "../../../lib/Alert";

export default function KamarCreate() {
  const navigate = useNavigate();
  const [hotels, setHotels] = useState([]);
  const [form, setForm] = useState({
    id_hotel: "",
    nama_kamar: "",
    nomor_kamar: "",
    tipe_kamar: "",
    harga: "",
    status_kamar: true,
    lantai: "",
    kapasitas: 1,
    stok_kamar: 0,
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
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
      const payload = {
        ...form,
        harga: Number(form.harga),
        kapasitas: Number(form.kapasitas),
        stok_kamar: Number(form.stok_kamar),
      };

      const res = await useAxios.post("/kamars/create", payload);
      console.log(res.data);
      await alertSuccess("Berhasil", res.data?.message || "Kamar ditambahkan.");
      setForm({
        id_hotel: "",
        nama_kamar: "",
        nomor_kamar: "",
        tipe_kamar: "",
        harga: "",
        status_kamar: true,
        lantai: "",
        kapasitas: 1,
        stok_kamar: 0,
      });
      navigate("/admin/kamar");
    } catch (err) {
      console.error(err);
      const msg =
        err?.response?.data?.message ||
        (err?.response?.data?.errors &&
          Object.values(err.response.data.errors).flat().join("\n")) ||
        "Gagal menambahkan kamar.";
      alertError("Error", msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-blue-100 text-gray-900 py-10 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8 text-center md:text-left">
          <p className="text-sm uppercase tracking-[0.25em] text-blue-500 mb-2 font-semibold">
            Admin Panel
          </p>
          <h1 className="text-3xl font-bold text-gray-900">Tambah Kamar</h1>
          <p className="text-gray-600 mt-2">
            Lengkapi data kamar sesuai format backend (<code className="text-blue-600">/kamars/create</code>).
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
                  Nama Kamar <span className="text-blue-600">*</span>
                </label>
                <input
                  type="text"
                  name="nama_kamar"
                  value={form.nama_kamar}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  placeholder="Deluxe Room"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Nomor Kamar <span className="text-blue-600">*</span>
                </label>
                <input
                  type="text"
                  name="nomor_kamar"
                  value={form.nomor_kamar}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  placeholder="101"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Tipe Kamar <span className="text-blue-600">*</span>
                </label>
                <input
                  type="text"
                  name="tipe_kamar"
                  value={form.tipe_kamar}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  placeholder="Suite / Deluxe / Standard"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Harga <span className="text-blue-600">*</span>
                </label>
                <input
                  type="number"
                  name="harga"
                  value={form.harga}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  placeholder="500000"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Kapasitas <span className="text-blue-600">*</span>
                </label>
                <input
                  type="number"
                  name="kapasitas"
                  value={form.kapasitas}
                  onChange={handleChange}
                  min="1"
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  placeholder="2"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Stok Kamar <span className="text-blue-600">*</span>
                </label>
                <input
                  type="number"
                  name="stok_kamar"
                  value={form.stok_kamar}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  placeholder="5"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Lantai <span className="text-blue-600">*</span>
                </label>
                <input
                  type="text"
                  name="lantai"
                  value={form.lantai}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  placeholder="1"
                  required
                />
              </div>

              <div className="flex items-center gap-3 pt-7">
                <input
                  type="checkbox"
                  name="status_kamar"
                  checked={!!form.status_kamar}
                  onChange={handleChange}
                  className="w-4 h-4"
                />
                <span className="text-sm text-gray-700">Kamar aktif</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold shadow-lg hover:from-blue-700 hover:to-blue-600 transition disabled:opacity-60"
              >
                {loading ? "Menyimpan..." : "Simpan Kamar"}
              </button>
              <button
                type="button"
                onClick={() =>
                  setForm({
                    id_hotel: "",
                    nama_kamar: "",
                    nomor_kamar: "",
                    tipe_kamar: "",
                    harga: "",
                    status_kamar: true,
                    lantai: "",
                    kapasitas: 1,
                    stok_kamar: 0,
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
