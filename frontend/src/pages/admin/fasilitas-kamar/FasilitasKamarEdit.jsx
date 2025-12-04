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
import { fetchKamars } from "../../../api/admin/apiAdminKamars";
import {
  fetchFasilitasKamarById,
  updateFasilitasKamar,
} from "../../../api/admin/apiAdminFasilitasKamar";
import { fetchIcons as fetchIconsApi } from "../../../api/admin/apiAdminIcons";

export default function FasilitasKamarEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [rooms, setRooms] = useState([]);
  const [icons, setIcons] = useState([]);
  const [form, setForm] = useState({
    id_kamar: "",
    id_icon: "",
    nama_fasilitas_kamar: "",
    keterangan_fasilitas_kamar: "",
  });
  const [initialForm, setInitialForm] = useState(form);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (!form.id_kamar) return "Pilih kamar terlebih dahulu.";
    if (!form.id_icon) return "Pilih icon fasilitas.";
    if (!form.nama_fasilitas_kamar.trim()) return "Nama fasilitas wajib diisi.";
    if (!form.keterangan_fasilitas_kamar.trim()) return "Deskripsi fasilitas wajib diisi.";
    return "";
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

  const fetchIcons = async () => {
    try {
      const res = await fetchIconsApi();
      const list = res?.data?.data || res?.data || res || [];
      setIcons(list);
    } catch (err) {
      console.error(err);
      toastError("Gagal memuat icon. Silakan coba lagi.");
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetchFasilitasKamarById(id);
      const data = res?.data || res?.data?.data || res || {};
      const filled = {
        id_kamar: data.id_kamar || "",
        id_icon: data.id_icon || "",
        nama_fasilitas_kamar: data.nama_fasilitas_kamar || "",
        keterangan_fasilitas_kamar: data.keterangan_fasilitas_kamar || data.deskripsi || "",
      };
      setForm(filled);
      setInitialForm(filled);
    } catch (err) {
      console.error(err);
      toastError("Gagal memuat fasilitas kamar. Periksa koneksi atau coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
    fetchIcons();
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
      text: "Perubahan data fasilitas kamar akan disimpan.",
      confirmButtonText: "Ya, simpan",
      cancelButtonText: "Batal",
      icon: "question",
    });
    if (!confirm.isConfirmed) return;
    setSaving(true);
    try {
      const payload = { ...form };
      const res = await updateFasilitasKamar(id, payload);
      console.log(res.data);
      await alertSuccess("Berhasil", res.data?.message || "Fasilitas diperbarui.");
      setInitialForm(payload);
      navigate("/admin/fasilitas-kamar");
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
    return <AdminLoadingState message="Memuat data fasilitas kamar..." />;
  }

  return (
    <AdminFormShell
      title="Edit Fasilitas Kamar"
      subtitle="Perbarui data fasilitas kamar di bawah ini"
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
            name="nama_fasilitas_kamar"
            value={form.nama_fasilitas_kamar}
            onChange={handleChange}
            placeholder="WiFi"
          />
        </div>

        <AdminTextarea
          label="Deskripsi"
          required
          name="keterangan_fasilitas_kamar"
          value={form.keterangan_fasilitas_kamar}
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
