import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Pencil, Trash } from "lucide-react";
import NavbarAdmin from "../../../components/admin/NavbarAdmin";
import AdminListHeader from "../../../components/admin/AdminListHeader";
import AdminTableLayout from "../../../components/admin/AdminTableLayout";
import { BASE_URL } from "../../../api";
import { alertConfirm, alertSuccess } from "../../../lib/Alert";
import { toastError } from "../../../lib/Toast";
import {
  fetchGambarHotel,
  deleteGambarHotel,
} from "../../../api/admin/apiAdminGambarHotel";

export default function GambarHotelList() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const start = (page - 1) * pageSize;

  const fetchData = async () => {
    try {
      const res = await fetchGambarHotel();
      setItems(res?.data || res || []);
    } catch (err) {
      console.error(err);
      toastError("Gagal memuat gambar hotel. Silakan coba lagi.");
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

  const getImageUrl = (path) => {
    if (!path) return "";
    const clean = String(path).trim();
    if (/^https?:\/\//i.test(clean)) return clean;
    return `${BASE_URL}/storage/${clean}`;
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((item) => {
      const hotel = item.hotel?.nama_hotel || item.nama_hotel || "";
      const name = item.nama_gambar_hotel || "";
      return [hotel, name].some((val) =>
        String(val).toLowerCase().includes(q)
      );
    });
  }, [items, query]);

  const handleDelete = async (id) => {
    const confirm = await alertConfirm({
      title: "Hapus gambar?",
      text: "Data akan dihapus permanen.",
      confirmButtonText: "Ya, hapus",
      cancelButtonText: "Batal",
    });
    if (!confirm.isConfirmed) return;

    try {
      await deleteGambarHotel(id);
      alertSuccess("Berhasil", "Gambar dihapus.");
      fetchData();
    } catch (err) {
      console.error(err);
      const msg =
        err?.response?.data?.message ||
        (err?.response?.data?.errors &&
          Object.values(err.response.data.errors).flat().join("\n")) ||
        "Tidak bisa menghapus gambar.";
      toastError(msg);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#f4f6fb] text-slate-800">
      <NavbarAdmin />

      <main className="flex-1 w-full p-6 md:p-8">
        <AdminListHeader
          title="Manajemen Gambar Hotel"
          subtitle="Kelola gambar setiap hotel"
          query={query}
          onQueryChange={setQuery}
          onAdd={() => navigate("/admin/gambar-hotel/create")}
          addLabel="Tambah Gambar"
          searchPlaceholder="Cari nama gambar atau hotel..."
        />

        <AdminTableLayout
          page={page}
          totalItems={filtered.length}
          pageSize={pageSize}
          onPageChange={setPage}
        >
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-slate-700">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">ID</th>
                <th className="px-4 py-3 text-left font-semibold">Hotel</th>
                <th className="px-4 py-3 text-left font-semibold">Preview</th>
                <th className="px-4 py-3 text-left font-semibold">
                  Nama Gambar
                </th>
                <th className="px-4 py-3 text-left font-semibold">
                  Keterangan
                </th>
                <th className="px-4 py-3 text-left font-semibold">Path</th>
                <th className="px-4 py-3 text-center font-semibold">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td
                      colSpan="7"
                      className="px-4 py-6 text-center text-slate-500"
                    >
                      Memuat data...
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td
                      colSpan="7"
                      className="px-4 py-6 text-center text-slate-500"
                    >
                      Belum ada gambar hotel.
                    </td>
                  </tr>
                ) : (
                  filtered.slice(start, start + pageSize).map((item, idx) => (
                    <tr
                      key={item.id_gambar_hotel || idx}
                      className="hover:bg-slate-50"
                    >
                      <td className="px-4 py-3">
                        {item.id_gambar_hotel || start + idx + 1}
                      </td>
                      <td className="px-4 py-3 font-semibold text-slate-900">
                        {item.hotel?.nama_hotel || item.nama_hotel || "-"}
                      </td>
                      <td className="px-4 py-3">
                        {item.file_path_gambar_hotel ? (
                          <img
                            src={getImageUrl(item.file_path_gambar_hotel)}
                            alt={
                              item.nama_gambar_hotel || "Preview gambar hotel"
                            }
                            className="w-16 h-16 rounded-lg object-cover border border-slate-200"
                          />
                        ) : (
                          <div className="w-16 h-16 rounded-lg border border-dashed border-slate-200 bg-slate-50 text-[10px] text-slate-400 flex items-center justify-center">
                            Tidak ada
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3 text-slate-800">
                        {item.nama_gambar_hotel}
                      </td>
                      <td className="px-4 py-3 text-slate-700">
                        {item.keterangan_gambar_hotel || "-"}
                      </td>
                      <td className="px-4 py-3 text-slate-700 break-all">
                        {item.file_path_gambar_hotel}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-3">
                          <button
                            type="button"
                            className="text-blue-600 hover:text-blue-700"
                            onClick={() =>
                              navigate(
                                `/admin/gambar-hotel/edit/${
                                  item.id_gambar_hotel || ""
                                }`
                              )
                            }
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            className="text-red-500 hover:text-red-600"
                            onClick={() => handleDelete(item.id_gambar_hotel)}
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
        </AdminTableLayout>
      </main>
    </div>
  );
}
