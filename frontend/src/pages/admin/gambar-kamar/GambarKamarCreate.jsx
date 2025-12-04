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
import { fetchKamars } from "../../../api/admin/apiAdminKamars";
import { createGambarKamar } from "../../../api/admin/apiAdminGambarKamar";

export default function GambarKamarCreate() {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [form, setForm] = useState({
    id_kamar: "",
    nama_gambar_kamar: "",
    keterangan_gambar_kamar: "",
    file_path_gambar_kamar: "",
  });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFile = (e) => {
    const f = e.target.files?.[0];
    setFile(f || null);
    if (f) setForm((prev) => ({ ...prev, file_path_gambar_kamar: f.name }));
  };

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await fetchKamars();
        setRooms(res?.data || res || []);
      } catch (err) {
        console.error(err);
        toastError("Gagal memuat kamar. Silakan coba lagi.");
      }
    };
    fetchRooms();
  }, []);

  const validateForm = () => {
    if (!form.id_kamar) return "Pilih kamar terlebih dahulu.";
    if (!form.nama_gambar_kamar.trim()) return "Nama gambar wajib diisi.";
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
      text: "Data gambar kamar akan ditambahkan.",
      confirmButtonText: "Ya, simpan",
      cancelButtonText: "Batal",
      icon: "question",
    });
    if (!confirm.isConfirmed) return;
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("id_kamar", form.id_kamar);
      formData.append("nama_gambar_kamar", form.nama_gambar_kamar);
      formData.append("keterangan_gambar_kamar", form.keterangan_gambar_kamar);
      if (file) formData.append("file_gambar", file);

      const res = await createGambarKamar(formData);
      await alertSuccess("Berhasil", res?.message || "Gambar kamar ditambahkan.");
      setForm({
        id_kamar: "",
        nama_gambar_kamar: "",
        keterangan_gambar_kamar: "",
        file_path_gambar_kamar: "",
      });
      setFile(null);
      navigate("/admin/gambar-kamar");
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
      title="Tambah Gambar Kamar"
      subtitle="Lengkapi data gambar kamar di bawah ini"
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
          previewUrl={null}
          previewAlt={form.nama_gambar_kamar || "Preview gambar kamar"}
        />

        <AdminActionBar
          onSubmitLabel="Simpan Gambar"
          savingLabel="Menyimpan..."
          saving={loading}
          onReset={() =>
            setForm({
              id_kamar: "",
              nama_gambar_kamar: "",
              keterangan_gambar_kamar: "",
              file_path_gambar_kamar: "",
            })
          }
          onBack={() => navigate(-1)}
        />
      </form>
    </AdminFormShell>
  );
}
