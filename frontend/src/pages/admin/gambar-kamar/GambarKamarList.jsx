import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Pencil, Trash } from "lucide-react";
import NavbarAdmin from "../../../components/NavbarAdmin";
import useAxios from "../../../api";
import { alertConfirm, alertError, alertSuccess } from "../../../lib/Alert";

export default function GambarKamarList() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const res = await useAxios.get("/gambar-kamar");
      console.log(res.data);
      setItems(res.data?.data || []);
    } catch (err) {
      console.error(err);
      alertError("Gagal memuat gambar kamar", "Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    const confirm = await alertConfirm({
      title: "Hapus gambar?",
      text: "Data akan dihapus permanen.",
      confirmButtonText: "Ya, hapus",
      cancelButtonText: "Batal",
    });
    if (!confirm.isConfirmed) return;

    try {
      await useAxios.delete(`/gambar-kamar/delete/${id}`);
      alertSuccess("Berhasil", "Gambar dihapus.");
      fetchData();
    } catch (err) {
      console.error(err);
      alertError("Gagal", "Tidak bisa menghapus gambar.");
    }
  };

  return (
    <div className="min-h-screen flex bg-[#f4f6fb] text-slate-800">
      <NavbarAdmin />

      <main className="flex-1 p-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">Manajemen Gambar Kamar</h2>
            <p className="text-slate-500 text-sm">Kelola foto kamar.</p>
          </div>
          <button
            onClick={() => navigate("/admin/gambar-kamar/create")}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 transition"
          >
            <span className="text-lg leading-none">+</span> Tambah Gambar
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50 text-slate-700">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold">ID</th>
                  <th className="px-4 py-3 text-left font-semibold">Kamar</th>
                  <th className="px-4 py-3 text-left font-semibold">Nama Gambar</th>
                  <th className="px-4 py-3 text-left font-semibold">Keterangan</th>
                  <th className="px-4 py-3 text-left font-semibold">Path</th>
                  <th className="px-4 py-3 text-center font-semibold">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="px-4 py-6 text-center text-slate-500">
                      Memuat data...
                    </td>
                  </tr>
                ) : items.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-4 py-6 text-center text-slate-500">
                      Belum ada gambar kamar.
                    </td>
                  </tr>
                ) : (
                  items.map((item, idx) => (
                    <tr key={item.id_gambar_kamar || idx} className="hover:bg-slate-50">
                      <td className="px-4 py-3">{item.id_gambar_kamar || idx + 1}</td>
                      <td className="px-4 py-3 font-semibold text-slate-900">
                        {item.kamar?.nama_kamar || item.nama_kamar || "-"}
                      </td>
                      <td className="px-4 py-3 text-slate-800">{item.nama_gambar_kamar}</td>
                      <td className="px-4 py-3 text-slate-700">
                        {item.keterangan_gambar_kamar || "-"}
                      </td>
                      <td className="px-4 py-3 text-slate-700 break-all">{item.file_path_gambar_kamar}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-3">
                          <button
                            type="button"
                            className="text-blue-600 hover:text-blue-700"
                            onClick={() => navigate(`/admin/gambar-kamar/edit/${item.id_gambar_kamar || ""}`)}
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            className="text-red-500 hover:text-red-600"
                            onClick={() => handleDelete(item.id_gambar_kamar)}
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
