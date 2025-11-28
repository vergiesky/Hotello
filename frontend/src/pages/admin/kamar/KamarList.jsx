import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Pencil, Trash } from "lucide-react";
import NavbarAdmin from "../../../components/NavbarAdmin";
import useAxios from "../../../api";
import { alertConfirm, alertError, alertSuccess } from "../../../lib/Alert";

export default function KamarList() {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const res = await useAxios.get("/kamars");
      console.log(res.data);
      setRooms(res.data?.data || []);
    } catch (err) {
      console.error(err);
      alertError("Gagal memuat kamar", "Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    const confirm = await alertConfirm({
      title: "Hapus kamar?",
      text: "Data akan dihapus permanen.",
      confirmButtonText: "Ya, hapus",
      cancelButtonText: "Batal",
    });
    if (!confirm.isConfirmed) return;

    try {
      await useAxios.delete(`/kamars/delete/${id}`);
      alertSuccess("Berhasil", "Kamar dihapus.");
      fetchData();
    } catch (err) {
      console.error(err);
      alertError("Gagal", "Tidak bisa menghapus kamar.");
    }
  };

  return (
    <div className="min-h-screen flex bg-[#f4f6fb] text-slate-800">
      <NavbarAdmin />

      <main className="flex-1 p-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">Manajemen Kamar</h2>
            <p className="text-slate-500 text-sm">Kelola data kamar per hotel.</p>
          </div>
          <button
            onClick={() => navigate("/admin/kamar/create")}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 transition"
          >
            <span className="text-lg leading-none">+</span> Tambah Kamar
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50 text-slate-700">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold">ID</th>
                  <th className="px-4 py-3 text-left font-semibold">Hotel</th>
                  <th className="px-4 py-3 text-left font-semibold">Nama Kamar</th>
                  <th className="px-4 py-3 text-left font-semibold">Tipe</th>
                  <th className="px-4 py-3 text-left font-semibold">Harga</th>
                  <th className="px-4 py-3 text-left font-semibold">Kapasitas</th>
                  <th className="px-4 py-3 text-left font-semibold">Stok</th>
                  <th className="px-4 py-3 text-center font-semibold">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan="8" className="px-4 py-6 text-center text-slate-500">
                      Memuat data...
                    </td>
                  </tr>
                ) : rooms.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="px-4 py-6 text-center text-slate-500">
                      Belum ada data kamar.
                    </td>
                  </tr>
                ) : (
                  rooms.map((item, idx) => (
                    <tr key={item.id_kamar || idx} className="hover:bg-slate-50">
                      <td className="px-4 py-3">{item.id_kamar || idx + 1}</td>
                      <td className="px-4 py-3 font-semibold text-slate-900">
                        {item.hotel?.nama_hotel || item.nama_hotel || "-"}
                      </td>
                      <td className="px-4 py-3 text-slate-800">{item.nama_kamar}</td>
                      <td className="px-4 py-3 text-slate-700">{item.tipe_kamar}</td>
                      <td className="px-4 py-3 text-slate-700">
                        {item.harga ? `Rp ${item.harga}` : "-"}
                      </td>
                      <td className="px-4 py-3 text-slate-700">{item.kapasitas}</td>
                      <td className="px-4 py-3 text-slate-700">{item.stok_kamar}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-3">
                          <button
                            type="button"
                            className="text-blue-600 hover:text-blue-700"
                            onClick={() => navigate(`/admin/kamar/edit/${item.id_kamar || ""}`)}
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            className="text-red-500 hover:text-red-600"
                            onClick={() => handleDelete(item.id_kamar)}
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
