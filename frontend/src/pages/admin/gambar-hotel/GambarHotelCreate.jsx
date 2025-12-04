import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { alertConfirm, alertSuccess } from "../../../lib/Alert";
import { toastError } from "../../../lib/Toast";
import AdminFormShell from "../../../components/admin/AdminFormShell";
import AdminActionBar from "../../../components/admin/AdminActionBar";
import {
  AdminInput,
  AdminSelect,
  AdminTextarea,
} from "../../../components/admin/AdminFormFields";
import AdminMediaInput from "../../../components/admin/AdminMediaInput";
import { fetchHotels } from "../../../api/admin/apiAdminHotels";
import { createGambarHotel } from "../../../api/admin/apiAdminGambarHotel";

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
  const [previewUrl, setPreviewUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFile = (e) => {
    const f = e.target.files?.[0];
    setFile(f || null);
    if (f) setForm((prev) => ({ ...prev, file_path_gambar_hotel: f.name }));
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(f ? URL.createObjectURL(f) : "");
  };

  useEffect(() => {
    const fetchHotelsData = async () => {
      try {
        const res = await fetchHotels();
        setHotels(res?.data || res || []);
      } catch (err) {
        console.error(err);
        toastError("Gagal memuat hotel. Silakan coba lagi.");
      }
    };
    fetchHotelsData();
  }, []);

  const validateForm = () => {
    if (!form.id_hotel) return "Pilih hotel terlebih dahulu.";
    if (!form.nama_gambar_hotel.trim()) return "Nama gambar wajib diisi.";
    if (!file) return "File gambar wajib diunggah.";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      toastError(validationError);
      return;
    }
    const confirm = await alertConfirm({
      title: "Simpan data?",
      text: "Data gambar hotel akan ditambahkan.",
      confirmButtonText: "Ya, simpan",
      cancelButtonText: "Batal",
      icon: "question",
    });
    if (!confirm.isConfirmed) return;
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("id_hotel", form.id_hotel);
      formData.append("nama_gambar_hotel", form.nama_gambar_hotel);
      formData.append("keterangan_gambar_hotel", form.keterangan_gambar_hotel);
      if (file) formData.append("file_gambar", file);

      const res = await createGambarHotel(formData);
      await alertSuccess("Berhasil", res?.message || "Gambar hotel ditambahkan.");
      setForm({
        id_hotel: "",
        nama_gambar_hotel: "",
        keterangan_gambar_hotel: "",
        file_path_gambar_hotel: "",
      });
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setPreviewUrl("");
      setFile(null);
      navigate("/admin/gambar-hotel");
    } catch (err) {
      console.error(err);
      const msg =
        err?.response?.data?.message ||
        (err?.response?.data?.errors &&
          Object.values(err.response.data.errors).flat().join("\n")) ||
        "Gagal menambahkan gambar.";
      toastError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminFormShell
      title="Tambah Gambar Hotel"
      subtitle="Lengkapi data gambar hotel di bawah ini"
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
          onSubmitLabel="Simpan Gambar"
          savingLabel="Menyimpan..."
          saving={loading}
          onReset={() => {
            if (previewUrl) URL.revokeObjectURL(previewUrl);
            setPreviewUrl("");
            setForm({
              id_hotel: "",
              nama_gambar_hotel: "",
              keterangan_gambar_hotel: "",
              file_path_gambar_hotel: "",
            });
            setFile(null);
          }}
          onBack={() => navigate(-1)}
        />
      </form>
    </AdminFormShell>
  );
}
