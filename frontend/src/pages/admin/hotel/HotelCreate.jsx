import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { alertConfirm, alertSuccess } from "../../../lib/Alert";
import { toastError } from "../../../lib/Toast";
import AdminFormShell from "../../../components/admin/AdminFormShell";
import AdminActionBar from "../../../components/admin/AdminActionBar";
import {
  AdminInput,
  AdminTextarea,
} from "../../../components/admin/AdminFormFields";
import { createHotel } from "../../../api/admin/apiAdminHotels";

export default function HotelCreate() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nama_hotel: "",
    kota: "",
    alamat: "",
    deskripsi: "",
    rating_hotel: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (!form.nama_hotel.trim()) return "Nama hotel wajib diisi.";
    if (!form.kota.trim()) return "Kota wajib diisi.";
    if (!form.alamat.trim()) return "Alamat wajib diisi.";
    if (!form.deskripsi.trim()) return "Deskripsi wajib diisi.";
    if (form.rating_hotel !== "") {
      const rating = Number(form.rating_hotel);
      if (Number.isNaN(rating) || rating < 0 || rating > 5) {
        return "Rating harus di antara 0 - 5.";
      }
    }
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
      text: "Data hotel akan ditambahkan.",
      confirmButtonText: "Ya, simpan",
      cancelButtonText: "Batal",
      icon: "question",
    });
    if (!confirm.isConfirmed) return;
    setLoading(true);
    try {
      const payload = {
        ...form,
        rating_hotel: form.rating_hotel === "" ? null : Number(form.rating_hotel),
      };

      const res = await createHotel(payload);
      console.log(res);

      await alertSuccess("Hotel berhasil ditambahkan", res?.message || "Data tersimpan.");
      navigate("/admin/hotels");
    } catch (err) {
      console.error(err);
      const msg =
        err?.response?.data?.message ||
        (err?.response?.data?.errors &&
          Object.values(err.response.data.errors).flat().join("\n")) ||
        "Gagal menambahkan hotel. Coba lagi.";
      toastError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminFormShell
      title="Tambah Hotel"
      subtitle="Lengkapi data hotel di bawah ini"
      maxWidthClass="max-w-5xl"
      badge="ADMIN PANEL"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AdminInput
            label="Nama Hotel"
            required
            type="text"
            name="nama_hotel"
            value={form.nama_hotel}
            onChange={handleChange}
            placeholder="Contoh: Hotel Nusantara"
          />

          <AdminInput
            label="Kota"
            required
            type="text"
            name="kota"
            value={form.kota}
            onChange={handleChange}
            placeholder="Yogyakarta"
          />
        </div>

        <AdminInput
          label="Alamat"
          required
          type="text"
          name="alamat"
          value={form.alamat}
          onChange={handleChange}
          placeholder="Jl. Malioboro No. 123"
        />

        <AdminTextarea
          label="Deskripsi"
          required
          name="deskripsi"
          value={form.deskripsi}
          onChange={handleChange}
          rows={4}
          placeholder="Tuliskan deskripsi singkat hotel..."
        />

        <div className="space-y-2 max-w-xs">
          <label className="block text-sm font-medium text-gray-700">
            Rating (0 - 5) <span className="text-gray-500">(opsional)</span>
          </label>
          <input
            type="number"
            name="rating_hotel"
            value={form.rating_hotel}
            onChange={handleChange}
            step="0.1"
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            placeholder="4.5"
          />
        </div>

        <AdminActionBar
          onSubmitLabel="Simpan Hotel"
          savingLabel="Menyimpan..."
          saving={loading}
          onReset={() =>
            setForm({
              nama_hotel: "",
              kota: "",
              alamat: "",
              deskripsi: "",
              rating_hotel: "",
            })
          }
          onBack={() => navigate(-1)}
        />
      </form>
    </AdminFormShell>
  );
}
