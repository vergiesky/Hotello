import { Mail, Phone, Calendar, User as UserIcon } from "lucide-react";

export default function ProfileInfoForm({
  isEditing,
  nama,
  email,
  noTelp,
  tanggalLahir,
  tanggalLahirDisplay,
  onNamaChange,
  onEmailChange,
  onNoTelpChange,
  onTanggalLahirChange,
  onSubmit,
  onEdit,
  onCancel,
  loading,
}) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between gap-3 flex-wrap mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Informasi Akun</h3>
          <button
            onClick={onEdit}
            className=
            {isEditing ? "hidden" : // sembunyikan tombol edit ketika sedang mengedit
              "flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 px-2 py-1 rounded-md transition-all duration-150 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-200"
            }
          >
            Edit
          </button>
      </div>

      {isEditing ? (
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-600 mb-2">
              Nama Lengkap
            </label>
            <div className="flex items-center gap-3 pb-3 border-b border-gray-200">
              <UserIcon className="w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={nama}
                onChange={(e) => onNamaChange(e.target.value)}
                className="flex-1 text-gray-900 outline-none"
                placeholder="Masukkan nama lengkap"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-2">Email</label>
            <div className="flex items-center gap-3 pb-3 border-b border-gray-200">
              <Mail className="w-5 h-5 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => onEmailChange(e.target.value)}
                className="flex-1 text-gray-900 outline-none"
                placeholder="email@example.com"
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-2">
                No. Telepon
              </label>
              <div className="flex items-center gap-3 pb-3 border-b border-gray-200">
                <Phone className="w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={noTelp}
                  onChange={(e) => onNoTelpChange(e.target.value)}
                  className="flex-1 text-gray-900 outline-none"
                  placeholder="08xx-xxxx-xxxx"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-2">
                Tanggal Lahir
              </label>
              <div className="flex items-center gap-3 pb-3 border-b border-gray-200">
                <Calendar className="w-5 h-5 text-gray-400" />
                <input
                  type="date"
                  value={tanggalLahir || ""}
                  onChange={(e) => onTanggalLahirChange(e.target.value)}
                  className="flex-1 text-gray-900 outline-none"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-700 rounded-lg transition-all duration-150 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-200"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-all duration-150 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-200"
            >
              {loading ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        </form>
      ) : (
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-600 mb-2">
              Nama Lengkap
            </label>
            <div className="flex items-center gap-3 pb-3 border-b border-gray-200">
              <UserIcon className="w-5 h-5 text-gray-400" />
              <span className="text-gray-900">{nama}</span>
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-2">Email</label>
            <div className="flex items-center gap-3 pb-3 border-b border-gray-200">
              <Mail className="w-5 h-5 text-gray-400" />
              <span className="text-gray-900">{email}</span>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-2">
                No. Telepon
              </label>
              <div className="flex items-center gap-3 pb-3 border-b border-gray-200">
                <Phone className="w-5 h-5 text-gray-400" />
                <span className="text-gray-900">{noTelp || "-"}</span>
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-2">
                Tanggal Lahir
              </label>
              <div className="flex items-center gap-3 pb-3 border-b border-gray-200">
                <Calendar className="w-5 h-5 text-gray-400" />
                <span className="text-gray-900">
                  {tanggalLahirDisplay || "-"}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
