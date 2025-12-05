import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Pencil, Trash, Search } from "lucide-react";
import NavbarAdmin from "../../../components/admin/NavbarAdmin";
import AdminPagination from "../../../components/admin/AdminPagination";
import { alertConfirm, alertSuccess } from "../../../lib/Alert";
import { toastError } from "../../../lib/Toast";
import {
  fetchFasilitasKamar,
  deleteFasilitasKamar,
} from "../../../api/admin/apiAdminFasilitasKamar";

export default function FasilitasKamar() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const start = (page - 1) * pageSize;

  const fetchData = async () => {
    try {
      const res = await fetchFasilitasKamar();
      setItems(res?.data || res || []);
    } catch (err) {
      console.error(err);
      toastError("Gagal memuat fasilitas kamar. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    setPage(1);
  }, [items.length, query]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((item) => {
      const room = item.kamar?.nama_kamar || item.nama_kamar || "";
      const name = item.nama_fasilitas_kamar || item.nama_fasilitas || "";
      const fields = [room, name].join(" ").toLowerCase();
      return fields.includes(q);
    });
  }, [items, query]);

  const handleDelete = async (id) => {
    const confirm = await alertConfirm({
      title: "Hapus fasilitas?",
      text: "Data akan dihapus permanen.",
      confirmButtonText: "Ya, hapus",
      cancelButtonText: "Batal",
    });
    if (!confirm.isConfirmed) return;

    try {
      await deleteFasilitasKamar(id);
      alertSuccess("Berhasil", "Fasilitas dihapus.");
      fetchData();
    } catch (err) {
      console.error(err);
      const msg =
        err?.response?.data?.message ||
        (err?.response?.data?.errors &&
          Object.values(err.response.data.errors).flat().join("\n")) ||
        "Tidak bisa menghapus fasilitas.";
      toastError(msg);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#f4f6fb] text-slate-800">
      <NavbarAdmin />

      <main className="flex-1 w-full p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div className="flex-1">
            <h2 className="text-3xl font-bold text-slate-900">
              Manajemen Fasilitas Kamar
            </h2>
            <p className="text-slate-500">
              Kelola fasilitas yang dimiliki setiap kamar
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Cari kamar atau nama fasilitas..."
                className="pl-9 pr-3 py-2 w-full sm:w-64 rounded-lg border border-slate-200 bg-white text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
              />
            </div>
            <button
              onClick={() => navigate("/admin/fasilitas-kamar/create")}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 transition"
            >
              <span className="text-lg leading-none">+</span> Tambah Fasilitas
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50 text-slate-700">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold">ID</th>
                  <th className="px-4 py-3 text-left font-semibold">Kamar</th>
                  <th className="px-4 py-3 text-left font-semibold">
                    Nama Fasilitas
                  </th>
                  <th className="px-4 py-3 text-left font-semibold">
                    Deskripsi
                  </th>
                  <th className="px-4 py-3 text-center font-semibold">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td
                      colSpan="5"
                      className="px-4 py-6 text-center text-slate-500"
                    >
                      Memuat data...
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td
                      colSpan="5"
                      className="px-4 py-6 text-center text-slate-500"
                    >
                      Belum ada fasilitas kamar.
                    </td>
                  </tr>
                ) : (
                  filtered.slice(start, start + pageSize).map((item, idx) => (
                    <tr
                      key={item.id_fasilitas_kamar || item.id || idx}
                      className="hover:bg-slate-50"
                    >
                      <td className="px-4 py-3">
                        {item.id_fasilitas_kamar || item.id || start + idx + 1}
                      </td>
                      <td className="px-4 py-3 font-semibold text-slate-900">
                        {item.kamar?.nama_kamar || item.nama_kamar || "-"}
                      </td>
                      <td className="px-4 py-3 text-slate-800">
                        {item.nama_fasilitas_kamar}
                      </td>
                      <td className="px-4 py-3 text-slate-700">
                        {item.keterangan_fasilitas_kamar ||
                          item.deskripsi ||
                          "-"}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-3">
                          <button
                            type="button"
                            className="text-blue-600 hover:text-blue-700"
                            onClick={() =>
                              navigate(
                                `/admin/fasilitas-kamar/edit/${
                                  item.id_fasilitas_kamar || item.id || ""
                                }`
                              )
                            }
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            className="text-red-500 hover:text-red-600"
                            onClick={() =>
                              handleDelete(item.id_fasilitas_kamar || item.id)
                            }
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
          <AdminPagination
            page={page}
            totalItems={filtered.length}
            pageSize={pageSize}
            onChange={setPage}
          />
        </div>
      </main>
    </div>
  );
}
