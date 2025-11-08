<?php

namespace App\Http\Controllers\Customer;

use Illuminate\Http\Request;
use App\Models\Reservasi;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\Controller;

class ReservasiController extends Controller
{
    public function index()
    {
        // $reservasi = $request->user()->reservasis;
        $reservasi = Auth::user()->reservasis; // bentuk lain

        return response()->json($reservasi);
    }

    // Create Reservasi
    public function store(Request $request)
    {
        $userId = Auth::id();

        $validated = $request->validate([
            'check_in' => 'required|date',
            'check_out' => 'required|date',
            'jumlah_tamu' => 'required|numeric|min:1',
            'total_biaya' => 'required|numeric|min:0',
            'status_reservasi' => 'required|string|max:255',
        ]);
        $validated['id_user'] = $userId; // tambahkan id_user

        $reservasi = Reservasi::create($validated);

        return response()->json([
            'message' => 'Reservasi added succesfully',
            'data' => $reservasi,
        ], 201);
    }

    // Read reservasi
    public function show(string $id)
    {
        $reservasi = Reservasi::find($id);
        // $reservasi = Reservasi::where('id_reservasi', $id)->first(); // bentuk lain search id

        if (!$reservasi) {
            return response()->json([
                'message' => 'Reservasi not found',
            ], 404);
        }

        return response()->json([
            'data' => $reservasi
        ]);
    }

    // Update Reservasi
    public function update(Request $request, string $id)
    {
        $reservasi = Reservasi::find($id);

        if (!$reservasi) {
            return response()->json([
                'message' => 'Reservasi not found',
            ], 404);
        }

        $userId = Auth::id();

        $validated = $request->validate([
            'check_in' => 'required|date',
            'check_out' => 'required|date',
            'jumlah_tamu' => 'required|numeric|min:1',
            'total_biaya' => 'required|numeric|min:0',
            'status_reservasi' => 'required|string|max:255',
        ]);
        $validated['id_user'] = $userId; // tambahkan id_user

        $reservasi->update($validated);

        return response()->json([
            'message' => 'Reservasi updated succesfully',
            'data' => $reservasi->fresh(), // ganti dengan data/objek baru
        ]);
    }

    // Delete Reservasi
    public function destroy(string $id)
    {
        $reservasi = Reservasi::find($id);

        if (!$reservasi) {
            return response()->json([
                'message' => 'Reservasi not found',
            ], 404);
        }

        $reservasi->delete();

        return response()->json([
            'message' => 'Reservasi deleted succesfully',
        ]);
    }
}
