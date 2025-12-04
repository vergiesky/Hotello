import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useAxios from "../../../api";
import { alertError, alertSuccess } from "../../../lib/Alert";

export default function HotelEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nama_hotel: "",
    kota: "",
    alamat: "",
    deskripsi: "",
    rating_hotel: "",
  });
  const [initialForm, setInitialForm] = useState(form);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const fetchHotel = async () => {
    setLoading(true);
    try {
      const res = await useAxios.get(`/hotels/${id}`);
      console.log(res.data);
      const data = res.data?.data || {};
      const filled = {
        nama_hotel: data.nama_hotel || "",
        kota: data.kota || "",
        alamat: data.alamat || "",
        deskripsi: data.deskripsi || "",
        rating_hotel:
          data.rating_hotel === null || data.rating_hotel === undefined
            ? ""
            : data.rating_hotel,
      };
      setForm(filled);
      setInitialForm(filled);
    } catch (err) {
      console.error(err);
      alertError("Gagal memuat hotel", "Periksa koneksi atau coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchHotel();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        rating_hotel: form.rating_hotel === "" ? null : Number(form.rating_hotel),
      };

      const res = await useAxios.put(`/hotels/update/${id}`, payload);
      console.log(res.data);
      await alertSuccess("Berhasil", res.data?.message || "Data hotel diperbarui.");
      setInitialForm(payload);
      navigate("/admin/dashboard");
    } catch (err) {
      console.error(err);
      const msg =
        err?.response?.data?.message ||
        (err?.response?.data?.errors &&
          Object.values(err.response.data.errors).flat().join("\n")) ||
        "Gagal memperbarui hotel.";
      alertError("Error", msg);
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => setForm(initialForm);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-blue-50 to-blue-100">
        <p className="text-sm text-gray-600">Memuat data hotel...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-blue-100 text-gray-900 py-10 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8 text-center md:text-left">
          <p className="text-sm uppercase tracking-[0.25em] text-blue-500 mb-2 font-semibold">
            ADMIN PANEL
          </p>
          <h1 className="text-3xl font-bold text-gray-900">Edit Hotel</h1>
          <p className="text-gray-600 mt-2">
            Perbarui data hotel dan simpan perubahan.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Nama Hotel <span className="text-blue-600">*</span>
                </label>
                <input
                  type="text"
                  name="nama_hotel"
                  value={form.nama_hotel}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  placeholder="Contoh: Hotel Nusantara"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Kota <span className="text-blue-600">*</span>
                </label>
                <input
                  type="text"
                  name="kota"
                  value={form.kota}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  placeholder="Yogyakarta"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Alamat <span className="text-blue-600">*</span>
              </label>
              <input
                type="text"
                name="alamat"
                value={form.alamat}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                placeholder="Jl. Malioboro No. 123"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Deskripsi <span className="text-blue-600">*</span>
              </label>
              <textarea
                name="deskripsi"
                value={form.deskripsi}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                placeholder="Tuliskan deskripsi singkat hotel..."
                required
              />
            </div>

            <div className="space-y-2 max-w-xs">
              <label className="block text-sm font-medium text-gray-700">
                Rating (0 - 5) <span className="text-gray-500">(opsional)</span>
              </label>
              <input
                type="number"
                name="rating_hotel"
                value={form.rating_hotel}
                onChange={handleChange}
                min="0"
                max="5"
                step="0.1"
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                placeholder="4.5"
              />
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold shadow-lg hover:from-blue-700 hover:to-blue-600 transition disabled:opacity-60"
              >
                {saving ? "Menyimpan..." : "Simpan Perubahan"}
              </button>
              <button
                type="button"
                onClick={handleReset}
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
