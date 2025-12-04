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
import { fetchIcons } from "../../../api/admin/apiAdminIcons";
import {
  createFasilitasHotel,
} from "../../../api/admin/apiAdminFasilitasHotel";
import { fetchHotels } from "../../../api/admin/apiAdminHotels";

export default function FasilitasHotelCreate() {
  const navigate = useNavigate();
  const [hotels, setHotels] = useState([]);
  const [icons, setIcons] = useState([]);
  const [form, setForm] = useState({
    id_hotel: "",
    id_icon: "",
    nama_fasilitas: "",
    keterangan_fasilitas_hotel: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
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
    const fetchIconsData = async () => {
      try {
        const res = await fetchIcons();
        setIcons(res?.data || res || []);
      } catch (err) {
        console.error(err);
        toastError("Gagal memuat icon. Silakan coba lagi.");
      }
    };
    fetchHotelsData();
    fetchIconsData();
  }, []);

  const validateForm = () => {
    if (!form.id_hotel) return "Pilih hotel terlebih dahulu.";
    if (!form.id_icon) return "Pilih icon fasilitas.";
    if (!form.nama_fasilitas.trim()) return "Nama fasilitas wajib diisi.";
    if (!form.keterangan_fasilitas_hotel.trim()) return "Deskripsi fasilitas wajib diisi.";
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
      text: "Data fasilitas hotel akan ditambahkan.",
      confirmButtonText: "Ya, simpan",
      cancelButtonText: "Batal",
      icon: "question",
    });
    if (!confirm.isConfirmed) return;
    setLoading(true);
    try {
      const payload = { ...form };
      const res = await createFasilitasHotel(payload);
      await alertSuccess("Berhasil", res?.message || "Fasilitas ditambahkan.");
      setForm({
        id_hotel: "",
        id_icon: "",
        nama_fasilitas: "",
        keterangan_fasilitas_hotel: "",
      });
      navigate("/admin/fasilitas-hotel");
    } catch (err) {
      console.error(err);
      const msg =
        err?.response?.data?.message ||
        (err?.response?.data?.errors &&
          Object.values(err.response.data.errors).flat().join("\n")) ||
        "Gagal menambahkan fasilitas.";
      toastError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminFormShell
      title="Tambah Fasilitas Hotel"
      subtitle="Lengkapi data fasilitas hotel di bawah ini"
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
          onSubmitLabel="Simpan Fasilitas"
          savingLabel="Menyimpan..."
          saving={loading}
          onReset={() =>
            setForm({
              id_hotel: "",
              id_icon: "",
              nama_fasilitas: "",
              keterangan_fasilitas_hotel: "",
            })
          }
          onBack={() => navigate(-1)}
        />
      </form>
    </AdminFormShell>
  );
}
