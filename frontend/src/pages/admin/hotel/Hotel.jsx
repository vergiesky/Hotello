import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Star, Pencil, Trash, Search } from "lucide-react";
import { alertSuccess, alertConfirm } from "../../../lib/Alert";
import { toastError } from "../../../lib/Toast";
import NavbarAdmin from "../../../components/admin/NavbarAdmin";
import AdminPagination from "../../../components/admin/AdminPagination";
import {
  fetchHotels as fetchAdminHotels,
  deleteHotel as deleteAdminHotel,
} from "../../../api/admin/apiAdminHotels";

export default function Hotel() {
  const navigate = useNavigate();
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const start = (page - 1) * pageSize;

  const fetchHotels = async () => {
    try {
      const res = await fetchAdminHotels();
      console.log(res);
      setHotels(res?.data || []);
    } catch (err) {
      console.error(err);
      toastError("Gagal memuat hotel. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHotels();
  }, []);

  useEffect(() => {
    setPage(1);
  }, [hotels.length, query]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return hotels;
    return hotels.filter((hotel) => {
      const fields = [hotel.nama_hotel, hotel.kota]
        .map((v) => (v === null || v === undefined ? "" : String(v)))
        .join(" ")
        .toLowerCase();
      return fields.includes(q);
    });
  }, [hotels, query]);

  const handleDelete = async (id) => {
    const confirm = await alertConfirm({
      title: "Hapus hotel?",
      text: "Data akan dihapus permanen.",
      confirmButtonText: "Ya, hapus",
      cancelButtonText: "Batal",
    });
    if (!confirm.isConfirmed) return;

    try {
      await deleteAdminHotel(id);
      alertSuccess("Berhasil", "Hotel dihapus.");
      fetchHotels();
    } catch (err) {
      console.error(err);
      const msg =
        err?.response?.data?.message ||
        (err?.response?.data?.errors &&
          Object.values(err.response.data.errors).flat().join("\n")) ||
        "Tidak bisa menghapus hotel.";
      toastError(msg);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#f4f6fb] text-slate-800">
      <NavbarAdmin />

      {/* Main */}
      <main className="flex-1 w-full p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div className="flex-1">
            <h2 className="text-3xl font-bold text-slate-900">
              Manajemen Hotel
            </h2>
            <p className="text-slate-500">
              Tambah, ubah, dan kelola data hotel
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Cari nama atau kota..."
                className="pl-9 pr-3 py-2 w-full sm:w-64 rounded-lg border border-slate-200 bg-white text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
              />
            </div>
            <button
              onClick={() => navigate("/admin/hotels/create")}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 transition"
            >
              <span className="text-lg leading-none">+</span> Tambah Hotel
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50 text-slate-700">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold">ID</th>
                  <th className="px-4 py-3 text-left font-semibold">
                    Nama Hotel
                  </th>
                  <th className="px-4 py-3 text-left font-semibold">Alamat</th>
                  <th className="px-4 py-3 text-left font-semibold">Kota</th>
                  <th className="px-4 py-3 text-left font-semibold">Rating</th>
                  <th className="px-4 py-3 font-semibold text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td
                      colSpan="6"
                      className="px-4 py-6 text-center text-slate-500"
                    >
                      Memuat data...
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td
                      colSpan="6"
                      className="px-4 py-6 text-center text-slate-500"
                    >
                      Belum ada data hotel.
                    </td>
                  </tr>
                ) : (
                  filtered.slice(start, start + pageSize).map((hotel, idx) => (
                    <tr
                      key={hotel.id_hotel || idx}
                      className="hover:bg-slate-50"
                    >
                      <td className="px-4 py-3">
                        {hotel.id_hotel || start + idx + 1}
                      </td>
                      <td className="px-4 py-3 font-semibold text-slate-900">
                        {hotel.nama_hotel}
                      </td>
                      <td className="px-4 py-3 text-slate-700">
                        {hotel.alamat}
                      </td>
                      <td className="px-4 py-3 text-slate-700">{hotel.kota}</td>
                      <td className="px-4 py-3">{hotel.rating_hotel ?? "-"}</td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex items-center justify-center gap-3 mx-auto w-fit">
                          <button
                            type="button"
                            className="text-blue-600 hover:text-blue-700"
                            onClick={() =>
                              navigate(
                                `/admin/hotels/edit/${hotel.id_hotel || ""}`
                              )
                            }
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            className="text-red-500 hover:text-red-600"
                            onClick={() => handleDelete(hotel.id_hotel)}
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
