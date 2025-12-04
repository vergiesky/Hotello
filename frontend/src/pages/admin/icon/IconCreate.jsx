import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { alertConfirm, alertSuccess } from "../../../lib/Alert";
import { toastError } from "../../../lib/Toast";
import AdminFormShell from "../../../components/admin/AdminFormShell";
import AdminActionBar from "../../../components/admin/AdminActionBar";
import { AdminInput } from "../../../components/admin/AdminFormFields";
import AdminMediaInput from "../../../components/admin/AdminMediaInput";
import { createIcon } from "../../../api/admin/apiAdminIcons";

export default function IconCreate() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ nama_icon: "", file_path_icon: "" });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFile = (e) => {
    const f = e.target.files?.[0];
    setFile(f || null);
    if (f) setForm((prev) => ({ ...prev, file_path_icon: f.name }));
  };

  const validateForm = () => {
    if (!form.nama_icon.trim()) return "Nama icon wajib diisi.";
    if (!file) return "File icon wajib diunggah.";
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
      text: "Data icon akan ditambahkan.",
      confirmButtonText: "Ya, simpan",
      cancelButtonText: "Batal",
      icon: "question",
    });
    if (!confirm.isConfirmed) return;
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("nama_icon", form.nama_icon);
      if (file) {
        formData.append("icon", file);
      }

      const res = await createIcon(formData);
      await alertSuccess("Berhasil", res?.message || "Icon ditambahkan.");
      setForm({ nama_icon: "", file_path_icon: "" });
      setFile(null);
      navigate("/admin/icons");
    } catch (err) {
      console.error(err);
      const msg =
        err?.response?.data?.message ||
        (err?.response?.data?.errors &&
          Object.values(err.response.data.errors).flat().join("\n")) ||
        "Gagal menambahkan icon.";
      toastError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminFormShell
      title="Tambah Icon"
      subtitle="Lengkapi data icon di bawah ini"
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
          previewUrl={null}
          previewAlt={form.nama_icon || "Preview icon"}
        />

        <AdminActionBar
          onSubmitLabel="Simpan Icon"
          savingLabel="Menyimpan..."
          saving={loading}
          onReset={() => {
            setForm({ nama_icon: "", file_path_icon: "" });
            setFile(null);
          }}
          onBack={() => navigate(-1)}
        />
      </form>
    </AdminFormShell>
  );
}
