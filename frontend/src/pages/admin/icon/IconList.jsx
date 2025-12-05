import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Pencil, Trash } from "lucide-react";
import NavbarAdmin from "../../../components/admin/NavbarAdmin";
import AdminListHeader from "../../../components/admin/AdminListHeader";
import AdminTableLayout from "../../../components/admin/AdminTableLayout";
import { BASE_URL } from "../../../api";
import { deleteIcon, fetchIcons } from "../../../api/admin/apiAdminIcons";
import { alertConfirm, alertSuccess } from "../../../lib/Alert";
import { toastError } from "../../../lib/Toast";

export default function IconList() {
  const navigate = useNavigate();
  const [icons, setIcons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const start = (page - 1) * pageSize;

  const fetchData = async () => {
    try {
      const res = await fetchIcons();
      const list = res?.data?.data || res?.data || res || [];
      setIcons(list);
    } catch (err) {
      console.error(err);
      toastError("Gagal memuat ikon. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    setPage(1);
  }, [icons.length, query]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return icons;
    return icons.filter((icon) => {
      const name = icon.nama_icon || "";
      return String(name).toLowerCase().includes(q);
    });
  }, [icons, query]);

  const getIconUrl = (path) => {
    if (!path) return "";
    const clean = String(path).trim();
    if (/^https?:\/\//i.test(clean)) return clean;
    return `${BASE_URL}/storage/${clean}`;
  };

  const handleDelete = async (id) => {
    const confirm = await alertConfirm({
      title: "Hapus ikon?",
      text: "Data akan dihapus permanen.",
      confirmButtonText: "Ya, hapus",
      cancelButtonText: "Batal",
    });
    if (!confirm.isConfirmed) return;

    try {
      await deleteIcon(id);
      alertSuccess("Berhasil", "Ikon dihapus.");
      fetchData();
    } catch (err) {
      console.error(err);
      const msg =
        err?.response?.data?.message ||
        (err?.response?.data?.errors &&
          Object.values(err.response.data.errors).flat().join("\n")) ||
        "Tidak bisa menghapus ikon.";
      toastError(msg);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#f4f6fb] text-slate-800">
      <NavbarAdmin />

      <main className="flex-1 w-full p-6 md:p-8">
        <AdminListHeader
          title="Manajemen Icon"
          subtitle="Kelola daftar icon yang digunakan untuk setiap fasilitas"
          query={query}
          onQueryChange={setQuery}
          onAdd={() => navigate("/admin/icons/create")}
          addLabel="Tambah Icon"
          searchPlaceholder="Cari nama icon..."
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
                <th className="px-4 py-3 text-left font-semibold">
                  Nama Icon
                </th>
                <th className="px-4 py-3 text-left font-semibold">Preview</th>
                <th className="px-4 py-3 text-left font-semibold">
                  File Path
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
                      Belum ada icon.
                    </td>
                  </tr>
                ) : (
                  filtered.slice(start, start + pageSize).map((icon, idx) => (
                    <tr key={icon.id_icon || idx} className="hover:bg-slate-50">
                      <td className="px-4 py-3">
                        {icon.id_icon || start + idx + 1}
                      </td>
                      <td className="px-4 py-3 font-semibold text-slate-900">
                        {icon.nama_icon}
                      </td>
                      <td className="px-4 py-3">
                        {icon.file_path_icon ? (
                          <img
                            src={getIconUrl(icon.file_path_icon)}
                            alt={icon.nama_icon || "Preview icon"}
                            className="w-10 h-10 object-contain bg-white border border-slate-200 rounded-lg p-1"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-lg border border-dashed border-slate-200 bg-slate-50 text-[10px] text-slate-400 flex items-center justify-center">
                            Tidak ada
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3 text-slate-700 break-all">
                        {icon.file_path_icon}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-3">
                          <button
                            type="button"
                            className="text-blue-600 hover:text-blue-700"
                            onClick={() =>
                              navigate(
                                `/admin/icons/edit/${icon.id_icon || ""}`
                              )
                            }
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
        </AdminTableLayout>
      </main>
    </div>
  );
}
