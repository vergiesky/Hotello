<?php

namespace App\Http\Controllers\Customer;

use Carbon\Carbon;
use App\Models\Kamar;
use App\Models\Reservasi;
use Illuminate\Http\Request;
use App\Models\RincianReservasi;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;

class ReservasiController extends Controller
{
    // show all daftar reservasi
    public function index()
    {
        $userId = Auth::id();

        // eager loading, gunanya untuk ngambil data relasi
        $reservasi = Reservasi::with([
            'rincianReservasis.kamar', // relasi Reservasi -> rincianReservasi -> Kamar
            'rincianReservasis.kamar.hotel', // relasi Reservasi -> rincianReservasi -> Kamar -> hotel
        ])
        ->where('id_user', $userId) // ambil data reservasi sesuai user id
        ->orderByDesc('id_reservasi') // urutin dari id_resrvasi yang terbesar (terbaru)
        ->get(); // execute query dan dapat ahasilnya

        return response()->json([
            'data' => $reservasi,
        ], 200);
    }

    // Create Reservasi
    public function store(Request $request)
    {
        $userId = Auth::id();

        $validated = $request->validate([
            'check_in' => 'required|date|after_or_equal:today', // tanggal check_in tidak boleh sebelum hari ini (harus setelah/sama dengan hari ini)
            'check_out' => 'required|date|after:check_in', // tanggal check_in dengan check_out tidak boleh sama (check_out harus setelah check_in)
            'jumlah_tamu' => 'required|integer|min:1',
            'kamar' => 'required|array|min:1',
            'kamar.*.id_kamar' => 'required|integer|exists:kamars,id_kamar', // .* artinya untuk setiap item dalam array kamar (kamar), berisi field id_kamar (.)... contoh kamar[0].id_kamar
            'kamar.*.jumlah_kamar' => 'required|integer|min:1',
        ]);

        // Carbon::parse buat ngubah string jadi object carbon (carbon tuh library PHP buat manipulasi tanggal sama waktu)
        // startOfDay() buat set waktu menjadi 00:00:00 (awal hari). Soalnya hotel ngitung permalem
        // jadi contohnya jika user input: "2025-05-15" (string), hasilnya jadi seperti ini: 2025-05-15 00:00:00
        $checkIn = Carbon::parse($validated['check_in'])->startOfDay();
        $checkOut = Carbon::parse($validated['check_out'])->startOfDay();

        // diffInDays() buat ngitung selisih antara dua tanggal
        // max(..., 1) buat mastiin minimal 1 malem
        $nights = max($checkIn->diffInDays($checkOut), 1);

        // auto rollback jika gagal
        return DB::transaction(function () use ($validated, $userId, $checkIn, $checkOut, $nights) {
        
            $totalBiaya = 0; //total biaya keseluruhan reservasi
            $totalCapacity = 0; 
            $detailKamars = [];

            foreach ($validated['kamar'] as $row) {

                $kamar = Kamar::where('id_kamar', $row['id_kamar'])->first();

                if (!$kamar->status_kamar) {
                    return response()->json([
                        'message' => "Kamar {$kamar->id_kamar} is currently inactive.",
                    ], 422);
                }

                // hitung kamar yang sudah terpakai pada rentang overlap
                // cari di tabel RincianReservasi id_kamar = id_kamar yang sedang dipilih
                // ini seperti query:
                // SELECT SUM (jumlah_kamar) FROM rincian_reservasis
                // WHERE id_kamar = (misal 2) AND EXISTS(
                // SELECT 1 FROM reservasis ---- maksud select 1 cek apakah ada data yang memenuhi kondisi, tidak peduli datanya apa
                // WHERE rincian_reservasis.id_reservasi = reservasis.id_reservasi 
                // AND status_reservasi NOT IN ('cancelled')
                // AND (check_out > '2025-01-15' 
                // AND check_in < '2025-01-17'))
                $terpakai = RincianReservasi::where('id_kamar', $kamar->id_kamar)
                        // hitung hanya rincian reservasi yang memiliki relasi ke tabel reservasi
                        // $q: Laravel's Query Builder Closure (bawaan laravel)
                        // use () tuh buat bawa variabel dari luar ke dalam
                        // filter hanya data yang memiliki relasi reservasi dengan kondisi tertentu
                        ->whereHas('reservasi', function ($q) use ($checkIn, $checkOut) {
                        // buat filter reservasi yang statusnya bukan 'cancelled'
                        $q->whereNotIn('status_reservasi', ['cancelled']) // kondisi 1
                            // buat grup kondisi where yang mengelompokkan beberapa kondisi menjadi satu kesatuan (kondisi 2a dan 2b harus terpenuhi (AND))
                          ->where(function ($w) use ($checkIn, $checkOut) { // kondisi 2
                              $w->where('check_out', '>',  $checkIn) //kondisi 2a
                                ->where('check_in',  '<',  $checkOut); //kondisi 2b
                          });
                    })
                    ->sum('jumlah_kamar'); // ngitung jumlah kamar yang udah kepakai buat id_kamar yang sama
                
                // max(0) buat mastiin hasilnya ga minus
                $stokTersisa = max(0, $kamar->stok_kamar - (int)$terpakai);

                if ((int)$row['jumlah_kamar'] > $stokTersisa) {
                    return response()->json([
                        'message' => "Insufficient kamar stock.",
                        'id_kamar' => $kamar->id_kamar,
                        'diminta' => (int)$row['jumlah_kamar'],
                        'stok_tersedia' => $stokTersisa,
                    ], 422);
                }

                // perhitungan subtotal dan kapasitas
                $qty = (int)$row['jumlah_kamar'];
                $subtotal = (float)$kamar->harga * $qty * $nights;
                $totalBiaya += $subtotal;

                $kapasitas = max(0, (int)$kamar->kapasitas);
                $totalCapacity += $kapasitas * $qty;

                $detailKamars[] = [
                    'id_kamar' => $kamar->id_kamar,
                    'jumlah_kamar' => $qty,
                    'sub_total' => $subtotal,
                ];
            }

            // validasi kapasitas orang
            if ((int)$validated['jumlah_tamu'] > $totalCapacity) {
                return response()->json([
                    'message' => 'Jumlah tamu melebihi total kapasitas kamar.',
                    'jumlah_tamu' => (int)$validated['jumlah_tamu'],
                    'total_kapasitas' => $totalCapacity,
                ], 422);
            }

            // create reservasi
            $reservasi = Reservasi::create([
                'id_user' => $userId,
                'check_in' => $validated['check_in'],
                'check_out' => $validated['check_out'],
                'jumlah_tamu' => $validated['jumlah_tamu'],
                'total_biaya' => $totalBiaya,
                'status_reservasi' => 'Menunggu_Pembayaran',
            ]);

            // Insert rincian kamar
            foreach ($detailKamars as $d) {
                RincianReservasi::create([
                    'id_reservasi' => $reservasi->id_reservasi,
                    'id_kamar' => $d['id_kamar'],
                    'jumlah_kamar' => $d['jumlah_kamar'],
                    'sub_total' => $d['sub_total'],
                ]);
            }

            // buat isi data reservasi dengan semua informasi (rincian, kamar, hotel)
            $reservasi->load(['rincianReservasis.kamar', 'rincianReservasis.kamar.hotel']);

            return response()->json([
                'message' => 'Reservasi created successfully',
                'data' => $reservasi,
            ], 201);
        });
    }

    // Read reservasi
    public function show(string $id)
    {
        $userId = Auth::id();

        $reservasi = Reservasi::with([
            'rincianReservasis.kamar', 
            'rincianReservasis.kamar.hotel'
            ])
            ->where('id_reservasi', $id)
            ->where('id_user', $userId)
            ->first();

        if (!$reservasi) {
            return response()->json([
                'message' => 'Reservasi not found',
            ], 404);
        }

        return response()->json([
            'data' => $reservasi,
        ], 200);
    }

    public function update(Request $request, string $id)
    {
        return response()->json([
            'message' => 'Update is not allowed for reservasi',
        ], 422);
    }

    public function destroy(string $id)
    {
        $userId = Auth::id();

        $reservasi = Reservasi::where('id_reservasi', $id)
            ->where('id_user', $userId)
            ->first();

        if (!$reservasi) {
            return response()->json([
                'message' => 'Reservasi not found',
            ], 404);
        }

        if (strtolower($reservasi->status_reservasi) !== strtolower('Menunggu_Pembayaran')) {
            return response()->json([
                'message' => 'Reservasi cannot be cancelled in current status',
            ], 422);
        }

        $reservasi->update([
            'status_reservasi' => 'cancelled',
        ]);

        return response()->json([
            'message' => 'Reservasi cancelled successfully',
            'data' => $reservasi->fresh(),
        ], 200);
    }
}
