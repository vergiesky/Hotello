import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { BASE_URL } from "../../../api";
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
import AdminMediaInput from "../../../components/admin/AdminMediaInput";
import { fetchHotels } from "../../../api/admin/apiAdminHotels";
import {
  fetchGambarHotelById,
  updateGambarHotel,
} from "../../../api/admin/apiAdminGambarHotel";

export default function GambarHotelEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [hotels, setHotels] = useState([]);
  const [form, setForm] = useState({
    id_hotel: "",
    nama_gambar_hotel: "",
    keterangan_gambar_hotel: "",
    file_path_gambar_hotel: "",
  });
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [initialForm, setInitialForm] = useState(form);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (!form.id_hotel) return "Pilih hotel terlebih dahulu.";
    if (!form.nama_gambar_hotel.trim()) return "Nama gambar wajib diisi.";
    return "";
  };

  const handleFile = (e) => {
    const f = e.target.files?.[0];
    setFile(f || null);
    if (f) setForm((prev) => ({ ...prev, file_path_gambar_hotel: f.name }));
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(f ? URL.createObjectURL(f) : getImageUrl(form.file_path_gambar_hotel));
  };

  const fetchHotelsData = async () => {
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
      const res = await fetchGambarHotelById(id);
      const data = res?.data || res || {};
      const filled = {
        id_hotel: data.id_hotel || "",
        nama_gambar_hotel: data.nama_gambar_hotel || "",
        keterangan_gambar_hotel: data.keterangan_gambar_hotel || "",
        file_path_gambar_hotel: data.file_path_gambar_hotel || "",
      };
      setForm(filled);
      setInitialForm(filled);
      setFile(null);
      setPreviewUrl(getImageUrl(filled.file_path_gambar_hotel));
    } catch (err) {
      console.error(err);
      toastError("Gagal memuat gambar. Periksa koneksi atau coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHotelsData();
    if (id) fetchData();
  }, [id]);

  useEffect(() => () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
  }, [previewUrl]);

  const getImageUrl = (path) => {
    if (!path) return "";
    const clean = String(path).trim();
    if (/^https?:\/\//i.test(clean)) return clean;
    return `${BASE_URL}/storage/${clean}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      toastError(validationError);
      return;
    }
    const confirm = await alertConfirm({
      title: "Simpan perubahan?",
      text: "Perubahan data gambar hotel akan disimpan.",
      confirmButtonText: "Ya, simpan",
      cancelButtonText: "Batal",
      icon: "question",
    });
    if (!confirm.isConfirmed) return;
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append("_method", "PUT");
      formData.append("id_hotel", form.id_hotel);
      formData.append("nama_gambar_hotel", form.nama_gambar_hotel);
      formData.append("keterangan_gambar_hotel", form.keterangan_gambar_hotel);
      if (file) formData.append("file_gambar", file);

      const res = await updateGambarHotel(id, formData);
      await alertSuccess("Berhasil", res?.message || "Gambar diperbarui.");
      setInitialForm({ ...form, file_path_gambar_hotel: form.file_path_gambar_hotel });
      setFile(null);
      navigate("/admin/gambar-hotel");
    } catch (err) {
      console.error(err);
      const msg =
        err?.response?.data?.message ||
        (err?.response?.data?.errors &&
          Object.values(err.response.data.errors).flat().join("\n")) ||
        "Gagal memperbarui gambar.";
      toastError(msg);
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setForm(initialForm);
    setFile(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(getImageUrl(initialForm.file_path_gambar_hotel));
  };

  if (loading) {
    return <AdminLoadingState message="Memuat data gambar..." />;
  }

  return (
    <AdminFormShell
      title="Edit Gambar Hotel"
      subtitle="Perbarui gambar hotel di bawah ini"
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
            label="Nama Gambar"
            required
            type="text"
            name="nama_gambar_hotel"
            value={form.nama_gambar_hotel}
            onChange={handleChange}
            placeholder="Tampak depan hotel"
          />
        </div>

        <AdminTextarea
          label="Keterangan"
          name="keterangan_gambar_hotel"
          value={form.keterangan_gambar_hotel}
          onChange={handleChange}
          rows={3}
          placeholder="Contoh: Lobi utama"
        />

        <AdminMediaInput
          label="File Gambar"
          required
          onChange={handleFile}
          currentFileName={form.file_path_gambar_hotel}
          previewUrl={previewUrl}
          previewAlt={form.nama_gambar_hotel || "Preview gambar hotel"}
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
