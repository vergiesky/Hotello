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
import { fetchKamars } from "../../../api/admin/apiAdminKamars";
import {
  fetchGambarKamarById,
  updateGambarKamar,
} from "../../../api/admin/apiAdminGambarKamar";

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
  const [previewUrl, setPreviewUrl] = useState("");
  const [initialForm, setInitialForm] = useState(form);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (!form.id_kamar) return "Pilih kamar terlebih dahulu.";
    if (!form.nama_gambar_kamar.trim()) return "Nama gambar wajib diisi.";
    return "";
  };

  const handleFile = (e) => {
    const f = e.target.files?.[0];
    setFile(f || null);
    if (f) setForm((prev) => ({ ...prev, file_path_gambar_kamar: f.name }));
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(f ? URL.createObjectURL(f) : getImageUrl(form.file_path_gambar_kamar));
  };

  const fetchRooms = async () => {
    try {
      const res = await fetchKamars();
      const list = res?.data?.data || res?.data || res || [];
      setRooms(list);
    } catch (err) {
      console.error(err);
      toastError("Gagal memuat kamar. Silakan coba lagi.");
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetchGambarKamarById(id);
      const data = res?.data || res || {};
      const filled = {
        id_kamar: data.id_kamar || "",
        nama_gambar_kamar: data.nama_gambar_kamar || "",
        keterangan_gambar_kamar: data.keterangan_gambar_kamar || "",
        file_path_gambar_kamar: data.file_path_gambar_kamar || "",
      };
      setForm(filled);
      setInitialForm(filled);
      setFile(null);
      setPreviewUrl(getImageUrl(filled.file_path_gambar_kamar));
    } catch (err) {
      console.error(err);
      toastError("Gagal memuat gambar kamar. Periksa koneksi atau coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
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
      text: "Perubahan data gambar kamar akan disimpan.",
      confirmButtonText: "Ya, simpan",
      cancelButtonText: "Batal",
      icon: "question",
    });
    if (!confirm.isConfirmed) return;
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append("_method", "PUT");
      formData.append("id_kamar", form.id_kamar);
      formData.append("nama_gambar_kamar", form.nama_gambar_kamar);
      formData.append("keterangan_gambar_kamar", form.keterangan_gambar_kamar);
      if (file) formData.append("file_gambar", file);

      const res = await updateGambarKamar(id, formData);
      await alertSuccess("Berhasil", res?.message || "Gambar kamar diperbarui.");
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
      toastError(msg);
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setForm(initialForm);
    setFile(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(getImageUrl(initialForm.file_path_gambar_kamar));
  };

  if (loading) {
    return <AdminLoadingState message="Memuat data gambar kamar..." />;
  }

  return (
    <AdminFormShell
      title="Edit Gambar Kamar"
      subtitle="Perbarui foto kamar dan simpan perubahan."
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AdminSelect
            label="Pilih Kamar"
            required
            name="id_kamar"
            value={form.id_kamar}
            onChange={handleChange}
          >
            <option value="">Pilih kamar</option>
            {rooms.map((r) => (
              <option key={r.id_kamar} value={r.id_kamar}>
                {r.nama_kamar}
              </option>
            ))}
          </AdminSelect>

          <AdminInput
            label="Nama Gambar"
            required
            type="text"
            name="nama_gambar_kamar"
            value={form.nama_gambar_kamar}
            onChange={handleChange}
            placeholder="Tampak interior"
          />
        </div>

        <AdminTextarea
          label="Keterangan"
          name="keterangan_gambar_kamar"
          value={form.keterangan_gambar_kamar}
          onChange={handleChange}
          rows={3}
          placeholder="Contoh: Kamar Deluxe - view laut"
        />

        <AdminMediaInput
          label="File Gambar"
          required
          onChange={handleFile}
          currentFileName={form.file_path_gambar_kamar}
          previewUrl={previewUrl}
          previewAlt={form.nama_gambar_kamar || "Preview gambar kamar"}
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
