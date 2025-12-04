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
  AdminTextarea,
} from "../../../components/admin/AdminFormFields";
import {
  fetchFasilitasHotelById,
  updateFasilitasHotel,
} from "../../../api/admin/apiAdminFasilitasHotel";
import { fetchHotels as fetchHotelsApi } from "../../../api/admin/apiAdminHotels";
import { fetchIcons as fetchIconsApi } from "../../../api/admin/apiAdminIcons";

export default function FasilitasHotelEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [hotels, setHotels] = useState([]);
  const [icons, setIcons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    id_hotel: "",
    id_icon: "",
    nama_fasilitas: "",
    keterangan_fasilitas_hotel: "",
  });
  const [initialForm, setInitialForm] = useState(form);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (!form.id_hotel) return "Pilih hotel terlebih dahulu.";
    if (!form.id_icon) return "Pilih icon fasilitas.";
    if (!form.nama_fasilitas.trim()) return "Nama fasilitas wajib diisi.";
    if (!form.keterangan_fasilitas_hotel.trim())
      return "Deskripsi fasilitas wajib diisi.";
    return "";
  };

  const loadHotels = async () => {
    try {
      const res = await fetchHotelsApi();
      setHotels(res?.data || res || []);
    } catch (err) {
      console.error(err);
      toastError("Gagal memuat hotel. Silakan coba lagi.");
    }
  };

  const loadIcons = async () => {
    try {
      const res = await fetchIconsApi();
      setIcons(res?.data || res || []);
    } catch (err) {
      console.error(err);
      toastError("Gagal memuat icon. Silakan coba lagi.");
    }
  };

  const fetchFacility = async () => {
    setLoading(true);
    try {
      const res = await fetchFasilitasHotelById(id);
      const data = res?.data || res || {};
      const filled = {
        id_hotel: data.id_hotel || "",
        id_icon: data.id_icon || "",
        nama_fasilitas: data.nama_fasilitas || "",
        keterangan_fasilitas_hotel:
          data.keterangan_fasilitas_hotel || data.deskripsi || "",
      };
      setForm(filled);
      setInitialForm(filled);
    } catch (err) {
      console.error(err);
      toastError("Gagal memuat fasilitas. Periksa koneksi atau coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHotels();
    loadIcons();
    if (id) fetchFacility();
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
      text: "Perubahan data fasilitas hotel akan disimpan.",
      confirmButtonText: "Ya, simpan",
      cancelButtonText: "Batal",
      icon: "question",
    });
    if (!confirm.isConfirmed) return;
    setSaving(true);
    try {
      const payload = { ...form };
      const res = await updateFasilitasHotel(id, payload);
      await alertSuccess(
        "Berhasil",
        res?.message || "Fasilitas diperbarui."
      );
      setInitialForm(payload);
      navigate("/admin/fasilitas-hotel");
    } catch (err) {
      console.error(err);
      const msg =
        err?.response?.data?.message ||
        (err?.response?.data?.errors &&
          Object.values(err.response.data.errors).flat().join("\n")) ||
        "Gagal memperbarui fasilitas.";
      toastError(msg);
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => setForm(initialForm);

  if (loading) {
    return <AdminLoadingState message="Memuat data fasilitas..." />;
  }

  return (
    <AdminFormShell
      title="Edit Fasilitas Hotel"
      subtitle="Perbarui data fasilitas hotel di bawah ini"
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

          <AdminSelect
            label="Icon Fasilitas"
            required
            name="id_icon"
            value={form.id_icon}
            onChange={handleChange}
            hint="Pastikan icon sudah dibuat di menu Icon."
          >
            <option value="">Pilih icon</option>
            {icons.map((ic) => (
              <option key={ic.id_icon} value={ic.id_icon}>
                {ic.nama_icon}
              </option>
            ))}
          </AdminSelect>

          <AdminInput
            label="Nama Fasilitas"
            required
            type="text"
            name="nama_fasilitas"
            value={form.nama_fasilitas}
            onChange={handleChange}
            placeholder="Kolam Renang"
          />
        </div>

        <AdminTextarea
          label="Deskripsi"
          required
          name="keterangan_fasilitas_hotel"
          value={form.keterangan_fasilitas_hotel}
          onChange={handleChange}
          rows={4}
          placeholder="Tuliskan deskripsi fasilitas..."
        />

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
