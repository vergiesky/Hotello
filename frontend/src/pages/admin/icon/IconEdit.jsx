import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { BASE_URL } from "../../../api";
import { alertConfirm, alertSuccess } from "../../../lib/Alert";
import { toastError } from "../../../lib/Toast";
import AdminFormShell from "../../../components/admin/AdminFormShell";
import AdminActionBar from "../../../components/admin/AdminActionBar";
import AdminLoadingState from "../../../components/admin/AdminLoadingState";
import { AdminInput } from "../../../components/admin/AdminFormFields";
import AdminMediaInput from "../../../components/admin/AdminMediaInput";
import { fetchIconById, updateIcon } from "../../../api/admin/apiAdminIcons";

export default function IconEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({ nama_icon: "", file_path_icon: "" });
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
    if (!form.nama_icon.trim()) return "Nama icon wajib diisi.";
    return "";
  };

  const handleFile = (e) => {
    const f = e.target.files?.[0];
    setFile(f || null);
    if (f) setForm((prev) => ({ ...prev, file_path_icon: f.name }));
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(f ? URL.createObjectURL(f) : getImageUrl(form.file_path_icon));
  };

  const fetchIcon = async () => {
    setLoading(true);
    try {
      const res = await fetchIconById(id);
      const data = res?.data || res || {};
      const filled = {
        nama_icon: data.nama_icon || "",
        file_path_icon: data.file_path_icon || "",
      };
      setForm(filled);
      setInitialForm(filled);
      setFile(null);
      setPreviewUrl(getImageUrl(filled.file_path_icon));
    } catch (err) {
      console.error(err);
      toastError("Gagal memuat icon. Periksa koneksi atau coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchIcon();
  }, [id]);

  useEffect(
    () => () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    },
    [previewUrl]
  );

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
      text: "Perubahan data icon akan disimpan.",
      confirmButtonText: "Ya, simpan",
      cancelButtonText: "Batal",
      icon: "question",
    });
    if (!confirm.isConfirmed) return;
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append("nama_icon", form.nama_icon);
      if (file) formData.append("icon", file);

      const res = await updateIcon(id, formData);
      await alertSuccess("Berhasil", res?.message || "Icon diperbarui.");
      setInitialForm({ nama_icon: form.nama_icon, file_path_icon: form.file_path_icon });
      setFile(null);
      navigate("/admin/icons");
    } catch (err) {
      console.error(err);
      const msg =
        err?.response?.data?.message ||
        (err?.response?.data?.errors &&
          Object.values(err.response.data.errors).flat().join("\n")) ||
        "Gagal memperbarui icon.";
      toastError(msg);
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setForm(initialForm);
    setFile(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(getImageUrl(initialForm.file_path_icon));
  };

  if (loading) {
    return <AdminLoadingState message="Memuat data icon..." />;
  }

  return (
    <AdminFormShell
      title="Edit Icon"
      subtitle="Perbarui data icon di bawah ini"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <AdminInput
          label="Nama Icon"
          required
          type="text"
          name="nama_icon"
          value={form.nama_icon}
          onChange={handleChange}
          placeholder="Kolam Renang"
        />

        <AdminMediaInput
          label="File Icon"
          required
          onChange={handleFile}
          currentFileName={form.file_path_icon}
          previewUrl={previewUrl}
          previewAlt={form.nama_icon || "Preview icon"}
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
