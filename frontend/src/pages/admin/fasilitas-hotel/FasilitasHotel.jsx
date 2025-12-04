import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Pencil, Trash } from "lucide-react";
import NavbarAdmin from "../../../components/NavbarAdmin";
import useAxios from "../../../api";
import { alertConfirm, alertError, alertSuccess } from "../../../lib/Alert";

export default function FacilityHotel() {
  const navigate = useNavigate();
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFacilities = async () => {
    try {
      const res = await useAxios.get("/fasilitas-hotel");
      console.log(res.data);
      setFacilities(res.data?.data || []);
    } catch (err) {
      console.error(err);
      alertError("Gagal memuat fasilitas", "Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFacilities();
  }, []);

  const handleDelete = async (id) => {
    const confirm = await alertConfirm({
      title: "Hapus fasilitas?",
      text: "Data akan dihapus permanen.",
      confirmButtonText: "Ya, hapus",
      cancelButtonText: "Batal",
    });
    if (!confirm.isConfirmed) return;

    try {
      await useAxios.delete(`/fasilitas-hotel/delete/${id}`);
      alertSuccess("Berhasil", "Fasilitas dihapus.");
      fetchFacilities();
    } catch (err) {
      console.error(err);
      alertError("Gagal", "Tidak bisa menghapus fasilitas.");
    }
  };

  return (
    <div className="min-h-screen flex bg-[#f4f6fb] text-slate-800">
      <NavbarAdmin />

      <main className="flex-1 p-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">Manajemen Fasilitas Hotel</h2>
            <p className="text-slate-500 text-sm">Kelola daftar fasilitas yang dimiliki setiap hotel.</p>
          </div>
          <button
            onClick={() => navigate("/admin/fasilitas-hotel/create")}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 transition"
          >
            <span className="text-lg leading-none">+</span> Tambah Fasilitas
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50 text-slate-700">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold">ID</th>
                  <th className="px-4 py-3 text-left font-semibold">Hotel</th>
                  <th className="px-4 py-3 text-left font-semibold">Nama Fasilitas</th>
                  <th className="px-4 py-3 text-left font-semibold">Deskripsi</th>
                  <th className="px-4 py-3 text-center font-semibold">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan="5" className="px-4 py-6 text-center text-slate-500">
                      Memuat data...
                    </td>
                  </tr>
                ) : facilities.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-4 py-6 text-center text-slate-500">
                      Belum ada fasilitas hotel.
                    </td>
                  </tr>
                ) : (
                  facilities.map((item, idx) => (
                    <tr key={item.id_fasilitas_hotel || item.id || idx} className="hover:bg-slate-50">
                      <td className="px-4 py-3">{item.id_fasilitas_hotel || item.id || idx + 1}</td>
                      <td className="px-4 py-3 font-semibold text-slate-900">
                        {item.hotel?.nama_hotel || item.nama_hotel || "Tidak ada nama"}
                      </td>
                      <td className="px-4 py-3 text-slate-800">{item.nama_fasilitas || item.fasilitas || "-"}</td>
                      <td className="px-4 py-3 text-slate-700">
                        {item.keterangan_fasilitas_hotel || item.deskripsi || "-"}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-3">
                          <button
                            type="button"
                            className="text-blue-600 hover:text-blue-700"
                            onClick={() =>
                              navigate(`/admin/fasilitas-hotel/edit/${item.id_fasilitas_hotel || item.id || ""}`)
                            }
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            className="text-red-500 hover:text-red-600"
                            onClick={() => handleDelete(item.id_fasilitas_hotel || item.id)}
                          >
                            <Trash className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
