<?php

namespace App\Http\Controllers\Admin;

use App\Models\Pembayaran;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;

class AdminPembayaranController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $pembayaran = Pembayaran::with([
            'reservasi',
            'reservasi.user',
            'reservasi.rincianReservasis.kamar.hotel',
        ])->orderByDesc('id_pembayaran')->get();

        return response()->json([
            'data' => $pembayaran,
        ], 200);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $pembayaran = Pembayaran::with([
            'reservasi',
            'reservasi.user',
            'reservasi.rincianReservasis.kamar.hotel',
        ])->where('id_pembayaran', $id)->first();

        if (!$pembayaran) {
            return response()->json([
                'message' => 'Payment not found',
            ], 404);
        }

        return response()->json([
            'data' => $pembayaran,
        ], 200);
    }

    public function markPaid(string $id)
    {
        return DB::transaction(function () use ($id) {
            $pembayaran = Pembayaran::with('reservasi')->where('id_pembayaran', $id)->first();

            if (!$pembayaran) {
                return response()->json([
                'message' => 'Payment not found'
                ], 404);
            }

            if (strtolower($pembayaran->status_pembayaran) === 'paid') {
                return response()->json([
                'message' => 'Payment already paid'
                ], 422);
            }

            // cek apakah pembayaran memiliki relasi dengan tabel reservasu dan cek apaakh status_resrvasi === cancelled
            if ($pembayaran->reservasi && strtolower($pembayaran->reservasi->status_reservasi) === 'cancelled') {
                return response()->json([
                'message' => 'Cannot pay a cancelled reservation'
                ], 422);
            }

            $pembayaran->update([
                'status_pembayaran' => 'paid',
                'tanggal_pembayaran' => now()->toDateString(),
            ]);

            if ($pembayaran->reservasi
                && strtolower($pembayaran->reservasi->status_reservasi) === strtolower('Menunggu_Pembayaran')) {
                $pembayaran->reservasi->update([
                    'status_reservasi' => 'Paid',
                ]);
            }

            return response()->json([
                'message' => 'Payment marked as paid',
                'data' => $pembayaran->fresh('reservasi'),
            ], 200);
        });
    }

    public function markFailed(string $id)
    {
        return DB::transaction(function () use ($id) {
            $pembayaran = Pembayaran::with('reservasi')->where('id_pembayaran', $id)->first();

            if (!$pembayaran) {
                return response()->json(['message' => 'Payment not found'], 404);
            }

            if (strtolower($pembayaran->status_pembayaran) === 'paid') {
                return response()->json(['message' => 'Cannot mark failed after paid'], 422);
            }

            $pembayaran->update([
                'status_pembayaran' => 'failed',
                'tanggal_pembayaran' => now()->toDateString(),
            ]);

            return response()->json([
                'message' => 'Payment marked as failed',
                'data' => $pembayaran->fresh('reservasi'),
            ], 200);
    });
    }

}
