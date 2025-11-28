import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Star, Pencil, Trash } from "lucide-react";
import useAxios from "../../../api";
import { alertError, alertSuccess, alertConfirm } from "../../../lib/Alert";
import NavbarAdmin from "../../../components/NavbarAdmin";

export default function Hotel() {
  const navigate = useNavigate();
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchHotels = async () => {
    try {
      const res = await useAxios.get("/hotels");
      console.log(res.data);
      setHotels(res.data?.data || []);
    } catch (err) {
      console.error(err);
      alertError("Gagal memuat hotel", "Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHotels();
  }, []);

  const handleDelete = async (id) => {
    const confirm = await alertConfirm({
      title: "Hapus hotel?",
      text: "Data akan dihapus permanen.",
      confirmButtonText: "Ya, hapus",
      cancelButtonText: "Batal",
    });
    if (!confirm.isConfirmed) return;

    try {
      await useAxios.delete(`/hotels/delete/${id}`);
      alertSuccess("Berhasil", "Hotel dihapus.");
      fetchHotels();
    } catch (err) {
      console.error(err);
      alertError("Gagal", "Tidak bisa menghapus hotel.");
    }
  };

  return (
    <div className="min-h-screen flex bg-[#f4f6fb] text-slate-800">
      <NavbarAdmin />

      {/* Main */}
      <main className="flex-1 p-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">Manajemen Hotel</h2>
            <p className="text-slate-500 text-sm">Tambah, ubah, dan kelola hotel yang tampil di aplikasi.</p>
          </div>
          <button
            onClick={() => navigate("/admin/hotels/create")}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 transition"
          >
            <span className="text-lg leading-none">+</span> Tambah Hotel
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50 text-slate-700">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold">ID</th>
                  <th className="px-4 py-3 text-left font-semibold">Nama Hotel</th>
                  <th className="px-4 py-3 text-left font-semibold">Alamat</th>
                  <th className="px-4 py-3 text-left font-semibold">Kota</th>
                  <th className="px-4 py-3 text-left font-semibold">Rating</th>
                  <th className="px-4 py-3 font-semibold text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="px-4 py-6 text-center text-slate-500">
                      Memuat data...
                    </td>
                  </tr>
                ) : hotels.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-4 py-6 text-center text-slate-500">
                      Belum ada data hotel.
                    </td>
                  </tr>
                ) : (
                  hotels.map((hotel, idx) => (
                    <tr key={hotel.id_hotel || idx} className="hover:bg-slate-50">
                      <td className="px-4 py-3">{hotel.id_hotel || idx + 1}</td>
                      <td className="px-4 py-3 font-semibold text-slate-900">{hotel.nama_hotel}</td>
                      <td className="px-4 py-3 text-slate-700">{hotel.alamat}</td>
                      <td className="px-4 py-3 text-slate-700">{hotel.kota}</td>
                      <td className="px-4 py-3">{hotel.rating_hotel ?? "-"}</td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex items-center justify-center gap-3 mx-auto w-fit">
                          <button
                            type="button"
                            className="text-blue-600 hover:text-blue-700"
                            onClick={() => navigate(`/admin/hotels/edit/${hotel.id_hotel || ""}`)}
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
        </div>
      </main>
    </div>
  );
}
