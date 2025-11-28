import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Pencil, Trash } from "lucide-react";
import NavbarAdmin from "../../../components/NavbarAdmin";
import useAxios from "../../../api";
import { alertConfirm, alertError, alertSuccess } from "../../../lib/Alert";

export default function IconList() {
  const navigate = useNavigate();
  const [icons, setIcons] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchIcons = async () => {
    try {
      const res = await useAxios.get("/icons");
      console.log(res.data);
      setIcons(res.data?.data || []);
    } catch (err) {
      console.error(err);
      alertError("Gagal memuat ikon", "Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIcons();
  }, []);

  const handleDelete = async (id) => {
    const confirm = await alertConfirm({
      title: "Hapus ikon?",
      text: "Data akan dihapus permanen.",
      confirmButtonText: "Ya, hapus",
      cancelButtonText: "Batal",
    });
    if (!confirm.isConfirmed) return;

    try {
      await useAxios.delete(`/icons/delete/${id}`);
      alertSuccess("Berhasil", "Ikon dihapus.");
      fetchIcons();
    } catch (err) {
      console.error(err);
      alertError("Gagal", "Tidak bisa menghapus ikon.");
    }
  };

  return (
    <div className="min-h-screen flex bg-[#f4f6fb] text-slate-800">
      <NavbarAdmin />

      <main className="flex-1 p-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">Manajemen Icon</h2>
            <p className="text-slate-500 text-sm">Kelola daftar icon yang digunakan untuk fasilitas.</p>
          </div>
          <button
            onClick={() => navigate("/admin/icons/create")}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 transition"
          >
            <span className="text-lg leading-none">+</span> Tambah Icon
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50 text-slate-700">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold">ID</th>
                  <th className="px-4 py-3 text-left font-semibold">Nama Icon</th>
                  <th className="px-4 py-3 text-left font-semibold">File Path</th>
                  <th className="px-4 py-3 text-center font-semibold">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan="4" className="px-4 py-6 text-center text-slate-500">
                      Memuat data...
                    </td>
                  </tr>
                ) : icons.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-4 py-6 text-center text-slate-500">
                      Belum ada icon.
                    </td>
                  </tr>
                ) : (
                  icons.map((icon, idx) => (
                    <tr key={icon.id_icon || idx} className="hover:bg-slate-50">
                      <td className="px-4 py-3">{icon.id_icon || idx + 1}</td>
                      <td className="px-4 py-3 font-semibold text-slate-900">{icon.nama_icon}</td>
                      <td className="px-4 py-3 text-slate-700 break-all">{icon.file_path_icon}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-3">
                          <button
                            type="button"
                            className="text-blue-600 hover:text-blue-700"
                            onClick={() => navigate(`/admin/icons/edit/${icon.id_icon || ""}`)}
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            className="text-red-500 hover:text-red-600"
                            onClick={() => handleDelete(icon.id_icon)}
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
