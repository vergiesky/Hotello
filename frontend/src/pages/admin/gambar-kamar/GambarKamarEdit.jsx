import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useAxios from "../../../api";
import { alertError, alertSuccess } from "../../../lib/Alert";

export default function GambarKamarEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [rooms, setRooms] = useState([]);
  const [form, setForm] = useState({
    id_kamar: "",
    nama_gambar_kamar: "",
    keterangan_gambar_kamar: "",
    file_path_gambar_kamar: "",
  });
  const [file, setFile] = useState(null);
  const [initialForm, setInitialForm] = useState(form);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFile = (e) => {
    const f = e.target.files?.[0];
    setFile(f || null);
    if (f) setForm((prev) => ({ ...prev, file_path_gambar_kamar: f.name }));
  };

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

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await useAxios.get(`/gambar-kamar/${id}`);
      console.log(res.data);
      const data = res.data?.data || {};
      const filled = {
        id_kamar: data.id_kamar || "",
        nama_gambar_kamar: data.nama_gambar_kamar || "",
        keterangan_gambar_kamar: data.keterangan_gambar_kamar || "",
        file_path_gambar_kamar: data.file_path_gambar_kamar || "",
      };
      setForm(filled);
      setInitialForm(filled);
      setFile(null);
    } catch (err) {
      console.error(err);
      alertError("Gagal memuat gambar kamar", "Periksa koneksi atau coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
    if (id) fetchData();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append("_method", "PUT");
      formData.append("id_kamar", form.id_kamar);
      formData.append("nama_gambar_kamar", form.nama_gambar_kamar);
      formData.append("keterangan_gambar_kamar", form.keterangan_gambar_kamar);
      if (file) formData.append("file_gambar", file);

      const res = await useAxios.post(`/gambar-kamar/update/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log(res.data);
      await alertSuccess("Berhasil", res.data?.message || "Gambar kamar diperbarui.");
      setInitialForm({ ...form, file_path_gambar_kamar: form.file_path_gambar_kamar });
      setFile(null);
      navigate("/admin/gambar-kamar");
    } catch (err) {
      console.error(err);
      const msg =
        err?.response?.data?.message ||
        (err?.response?.data?.errors &&
          Object.values(err.response.data.errors).flat().join("\n")) ||
        "Gagal memperbarui gambar kamar.";
      alertError("Error", msg);
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setForm(initialForm);
    setFile(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-blue-50 to-blue-100">
        <p className="text-sm text-gray-600">Memuat data gambar kamar...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-blue-100 text-gray-900 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 text-center md:text-left">
          <p className="text-sm uppercase tracking-[0.25em] text-blue-500 mb-2 font-semibold">
            Admin Panel
          </p>
          <h1 className="text-3xl font-bold text-gray-900">Edit Gambar Kamar</h1>
          <p className="text-gray-600 mt-2">Perbarui foto kamar dan simpan perubahan.</p>
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
                  Nama Gambar <span className="text-blue-600">*</span>
                </label>
                <input
                  type="text"
                  name="nama_gambar_kamar"
                  value={form.nama_gambar_kamar}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  placeholder="Tampak interior"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Keterangan
              </label>
              <textarea
                name="keterangan_gambar_kamar"
                value={form.keterangan_gambar_kamar}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                placeholder="Contoh: Kamar Deluxe - view laut"
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
              />
              {form.file_path_gambar_kamar && (
                <p className="text-xs text-gray-500">Saat ini: {form.file_path_gambar_kamar}</p>
              )}
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
