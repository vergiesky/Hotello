import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { alertConfirm, alertSuccess } from "../../../lib/Alert";
import { toastError } from "../../../lib/Toast";
import AdminFormShell from "../../../components/admin/AdminFormShell";
import AdminActionBar from "../../../components/admin/AdminActionBar";
import AdminLoadingState from "../../../components/admin/AdminLoadingState";
import {
  AdminInput,
  AdminSelect,
} from "../../../components/admin/AdminFormFields";
import { fetchHotels } from "../../../api/admin/apiAdminHotels";
import { fetchKamarById, updateKamar } from "../../../api/admin/apiAdminKamars";

export default function KamarEdit() {
  const { id } = useParams();
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
  const [initialForm, setInitialForm] = useState(form);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const validateForm = () => {
    if (!form.id_hotel) return "Pilih hotel terlebih dahulu.";
    if (!form.nama_kamar.trim()) return "Nama kamar wajib diisi.";
    if (!form.nomor_kamar.trim()) return "Nomor kamar wajib diisi.";
    if (!form.tipe_kamar.trim()) return "Tipe kamar wajib diisi.";
    const harga = Number(form.harga);
    if (!form.harga || Number.isNaN(harga) || harga <= 0)
      return "Harga harus lebih dari 0.";
    const kapasitas = Number(form.kapasitas);
    if (!kapasitas || Number.isNaN(kapasitas) || kapasitas < 1)
      return "Kapasitas minimal 1.";
    const stok = Number(form.stok_kamar);
    if (Number.isNaN(stok) || stok < 0) return "Stok tidak boleh negatif.";
    if (!form.lantai.toString().trim()) return "Lantai wajib diisi.";
    return "";
  };

  const loadHotels = async () => {
    try {
      const res = await fetchHotels();
      setHotels(res?.data || res || []);
    } catch (err) {
      console.error(err);
      toastError("Gagal memuat hotel. Silakan coba lagi.");
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetchKamarById(id);
      const data = res?.data || res || {};
      const filled = {
        id_hotel: data.id_hotel || "",
        nama_kamar: data.nama_kamar || "",
        nomor_kamar: data.nomor_kamar || "",
        tipe_kamar: data.tipe_kamar || "",
        harga: data.harga ?? "",
        status_kamar: data.status_kamar ?? true,
        lantai: data.lantai || "",
        kapasitas: data.kapasitas ?? 1,
        stok_kamar: data.stok_kamar ?? 0,
      };
      setForm(filled);
      setInitialForm(filled);
    } catch (err) {
      console.error(err);
      toastError("Gagal memuat kamar. Periksa koneksi atau coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHotels();
    if (id) fetchData();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      toastError(validationError);
      return;
    }
    const confirm = await alertConfirm({
      title: "Simpan perubahan?",
      text: "Perubahan data kamar akan disimpan.",
      confirmButtonText: "Ya, simpan",
      cancelButtonText: "Batal",
      icon: "question",
    });
    if (!confirm.isConfirmed) return;
    setSaving(true);
    try {
      const payload = {
        ...form,
        harga: Number(form.harga),
        kapasitas: Number(form.kapasitas),
        stok_kamar: Number(form.stok_kamar),
      };

      const res = await updateKamar(id, payload);
      await alertSuccess("Berhasil", res?.message || "Kamar diperbarui.");
      setInitialForm(payload);
      navigate("/admin/kamar");
    } catch (err) {
      console.error(err);
      const msg =
        err?.response?.data?.message ||
        (err?.response?.data?.errors &&
          Object.values(err.response.data.errors).flat().join("\n")) ||
        "Gagal memperbarui kamar.";
      toastError(msg);
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => setForm(initialForm);

  if (loading) {
    return <AdminLoadingState message="Memuat data kamar..." />;
  }

  return (
    <AdminFormShell
      title="Edit Kamar"
      subtitle="Perbarui data kamar di bawah ini"
      maxWidthClass="max-w-5xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AdminSelect
            label="Pilih Hotel"
            required
            name="id_hotel"
            value={form.id_hotel}
            onChange={handleChange}
          >
            <option value="">Pilih hotel</option>
            {hotels.map((h) => (
              <option key={h.id_hotel} value={h.id_hotel}>
                {h.nama_hotel}
              </option>
            ))}
          </AdminSelect>

          <AdminInput
            label="Nama Kamar"
            required
            type="text"
            name="nama_kamar"
            value={form.nama_kamar}
            onChange={handleChange}
            placeholder="Deluxe Room"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AdminInput
            label="Nomor Kamar"
            required
            type="text"
            name="nomor_kamar"
            value={form.nomor_kamar}
            onChange={handleChange}
            placeholder="101"
          />

          <AdminInput
            label="Tipe Kamar"
            required
            type="text"
            name="tipe_kamar"
            value={form.tipe_kamar}
            onChange={handleChange}
            placeholder="Suite / Deluxe / Standard"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <AdminInput
            label="Harga"
            required
            type="number"
            name="harga"
            value={form.harga}
            onChange={handleChange}
            min="0"
            placeholder="500000"
          />

          <AdminInput
            label="Kapasitas"
            required
            type="number"
            name="kapasitas"
            value={form.kapasitas}
            onChange={handleChange}
            min="1"
            placeholder="2"
          />

          <AdminInput
            label="Stok Kamar"
            required
            type="number"
            name="stok_kamar"
            value={form.stok_kamar}
            onChange={handleChange}
            min="0"
            placeholder="5"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AdminInput
            label="Lantai"
            required
            type="text"
            name="lantai"
            value={form.lantai}
            onChange={handleChange}
            placeholder="1"
          />

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

        <AdminActionBar
          onSubmitLabel="Simpan Perubahan"
          savingLabel="Menyimpan..."
          saving={saving}
          onReset={handleReset}
          onBack={() => navigate(-1)}
        />
      </form>
    </AdminFormShell>
  );
}
