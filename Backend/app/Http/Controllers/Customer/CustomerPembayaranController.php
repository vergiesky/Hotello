<?php

namespace App\Http\Controllers\Customer;

use App\Models\Reservasi;
use App\Models\Pembayaran;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;

class CustomerPembayaranController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $userId = Auth::id();

        // eager load reservasinya supaya kelihatan status & total
        $pembayaran = Pembayaran::with(['reservasi'])
            ->whereHas('reservasi', function ($q) use ($userId) {
                $q->where('id_user', $userId);
            })
            ->orderByDesc('id_pembayaran')
            ->get();

        return response()->json([
            'data' => $pembayaran,
        ], 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $userId = Auth::id();

        $validated = $request->validate([
            'id_reservasi' => 'required|integer|exists:reservasis,id_reservasi',
            'metode_pembayaran' => 'required|string|max:100',
            'jumlah_bayar' => 'required|numeric|min:0',
        ]);

        // pastikan reservasi milik user dan masih menunggu_pembayaran
        $reservasi = Reservasi::where('id_reservasi', $validated['id_reservasi'])->where('id_user', $userId)->first();

        if (!$reservasi) {
            return response()->json([
                'message' => 'Reservasi not found',
            ], 404);
        }

        if (strtolower($reservasi->status_reservasi) !== strtolower('Menunggu_Pembayaran')) {
            return response()->json([
                'message' => 'Reservasi is not in a payable state',
                'status_reservasi' => $reservasi->status_reservasi,
            ], 422);
        }

        // jika sudah ada pembayaran pending untuk reservasi ini, maka update saja (idempoten)
        $pembayaran = Pembayaran::where('id_reservasi', $reservasi->id_reservasi)->first();

        if (!$pembayaran) {
            $pembayaran = Pembayaran::create([
                'id_reservasi' => $reservasi->id_reservasi,
                'tanggal_pembayaran' => now()->toDateString(),
                'metode_pembayaran' => $validated['metode_pembayaran'],
                'jumlah_bayar' => $validated['jumlah_bayar'],
                'status_pembayaran' => 'pending',
            ]);
        } else {
            // kalau sudah paid
            if (strtolower($pembayaran->status_pembayaran) === 'paid') {
                return response()->json([
                    'message' => 'Reservasi already paid',
                ], 422);
            }

            $pembayaran->update([
                'tanggal_pembayaran' => now()->toDateString(),
                'metode_pembayaran' => $validated['metode_pembayaran'],
                'jumlah_bayar' => $validated['jumlah_bayar'],
                'status_pembayaran' => 'pending',
            ]);
        }

        // kembalikan data pembayaran dan reservasi
        $pembayaran->load('reservasi');

        return response()->json([
            'message' => 'Payment initiated',
            'data' => $pembayaran,
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $userId = Auth::id();

        $pembayaran = Pembayaran::with('reservasi')
            ->where('id_pembayaran', $id)
            ->whereHas('reservasi', function ($q) use ($userId) {
                $q->where('id_user', $userId);
            })
            ->first();

        if (!$pembayaran) {
            return response()->json([
                'message' => 'Payment not found',
            ], 404);
        }

        return response()->json([
            'data' => $pembayaran,
        ], 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        return response()->json([
            'message' => 'Update is not allowed for payment',
        ], 422);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $userId = Auth::id();

        $pembayaran = Pembayaran::where('id_pembayaran', $id)
            ->whereHas('reservasi', function ($q) use ($userId) {
                $q->where('id_user', $userId);
            })
            ->first();

        if (!$pembayaran) {
            return response()->json([
                'message' => 'Payment not found',
            ], 404);
        }

        if (strtolower($pembayaran->status_pembayaran) !== 'pending') {
            return response()->json([
                'message' => 'Only pending payments can be deleted',
            ], 422);
        }

        $pembayaran->delete();

        return response()->json([
            'message' => 'Payment deleted successfully',
        ], 200);
    }
}
