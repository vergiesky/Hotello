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
import { fetchKamars } from "../../../api/admin/apiAdminKamars";
import { fetchIcons } from "../../../api/admin/apiAdminIcons";
import { createFasilitasKamar } from "../../../api/admin/apiAdminFasilitasKamar";

export default function FasilitasKamarCreate() {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [icons, setIcons] = useState([]);
  const [form, setForm] = useState({
    id_kamar: "",
    id_icon: "",
    nama_fasilitas_kamar: "",
    keterangan_fasilitas_kamar: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
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
    const fetchIconsData = async () => {
      try {
        const res = await fetchIcons();
        setIcons(res?.data || res || []);
      } catch (err) {
        console.error(err);
        toastError("Gagal memuat icon. Silakan coba lagi.");
      }
    };
    fetchRooms();
    fetchIconsData();
  }, []);

  const validateForm = () => {
    if (!form.id_kamar) return "Pilih kamar terlebih dahulu.";
    if (!form.id_icon) return "Pilih icon fasilitas.";
    if (!form.nama_fasilitas_kamar.trim()) return "Nama fasilitas wajib diisi.";
    if (!form.keterangan_fasilitas_kamar.trim()) return "Deskripsi fasilitas wajib diisi.";
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
      text: "Data fasilitas kamar akan ditambahkan.",
      confirmButtonText: "Ya, simpan",
      cancelButtonText: "Batal",
      icon: "question",
    });
    if (!confirm.isConfirmed) return;
    setLoading(true);
    try {
      const payload = { ...form };
      const res = await createFasilitasKamar(payload);
      await alertSuccess("Berhasil", res?.message || "Fasilitas kamar ditambahkan.");
      setForm({
        id_kamar: "",
        id_icon: "",
        nama_fasilitas_kamar: "",
        keterangan_fasilitas_kamar: "",
      });
      navigate("/admin/fasilitas-kamar");
    } catch (err) {
      console.error(err);
      const msg =
        err?.response?.data?.message ||
        (err?.response?.data?.errors &&
          Object.values(err.response.data.errors).flat().join("\n")) ||
        "Gagal menambahkan fasilitas kamar.";
      toastError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminFormShell
      title="Tambah Fasilitas Kamar"
      subtitle="Lengkapi data fasilitas kamar di bawah ini"
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
          onSubmitLabel="Simpan Fasilitas"
          savingLabel="Menyimpan..."
          saving={loading}
          onReset={() =>
            setForm({
              id_kamar: "",
              id_icon: "",
              nama_fasilitas_kamar: "",
              keterangan_fasilitas_kamar: "",
            })
          }
          onBack={() => navigate(-1)}
        />
      </form>
    </AdminFormShell>
  );
}
