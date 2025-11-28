<?php

namespace App\Http\Controllers\Admin;

use App\Models\GambarHotel;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Storage;

class GambarHotelController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $gambarHotel = GambarHotel::with('hotel')->get();

        return response()->json([
            'data' => $gambarHotel,
        ], 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'id_hotel' => 'required|integer|exists:hotels,id_hotel',
            'nama_gambar_hotel' => 'required|string|max:255',
            'keterangan_gambar_hotel' => 'nullable|string',
            'file_gambar' => 'required|file|mimes:png,jpg,jpeg,webp|max:4096',
        ]);

        $path = $request->file('file_gambar')->store('gambar_hotels', 'public');

        $gambarHotel = GambarHotel::create([
            'id_hotel' => $validated['id_hotel'],
            'nama_gambar_hotel' => $validated['nama_gambar_hotel'],
            'keterangan_gambar_hotel' => $validated['keterangan_gambar_hotel'] ?? null,
            'file_path_gambar_hotel' => $path,
        ]);

        return response()->json([
            'message' => 'Gambar hotel created successfully',
            'data' => $gambarHotel,
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $gambarHotel = GambarHotel::with('hotel')->where('id_gambar_hotel', $id)->first();

        if (!$gambarHotel) {
            return response()->json([
                'message' => 'Gambar hotel not found',
            ], 404);
        }

        return response()->json([
            'data' => $gambarHotel,
        ], 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $gambarHotel = GambarHotel::where('id_gambar_hotel', $id)->first();

        if (!$gambarHotel) {
            return response()->json([
                'message' => 'Gambar hotel not found',
            ], 404);
        }

        $validated = $request->validate([
            'id_hotel' => 'required|integer|exists:hotels,id_hotel',
            'nama_gambar_hotel' => 'required|string|max:255',
            'keterangan_gambar_hotel' => 'nullable|string',
            'file_gambar' => 'nullable|file|mimes:png,jpg,jpeg,webp|max:4096',
        ]);

        $payload = [
            'id_hotel' => $validated['id_hotel'],
            'nama_gambar_hotel' => $validated['nama_gambar_hotel'],
            'keterangan_gambar_hotel' => $validated['keterangan_gambar_hotel'] ?? null,
        ];

        if ($request->hasFile('file_gambar')) {
            if ($gambarHotel->file_path_gambar_hotel && Storage::disk('public')->exists($gambarHotel->file_path_gambar_hotel)) {
                Storage::disk('public')->delete($gambarHotel->file_path_gambar_hotel);
            }
            $path = $request->file('file_gambar')->store('gambar_hotels', 'public');
            $payload['file_path_gambar_hotel'] = $path;
        }

        $gambarHotel->update($payload);

        return response()->json([
            'message' => 'Gambar hotel updated successfully',
            'data'    => $gambarHotel->fresh(),
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $gambarHotel = GambarHotel::where('id_gambar_hotel', $id)->first();

        if (!$gambarHotel) {
            return response()->json([
                'message' => 'Gambar hotel not found',
            ], 404);
        }

        if ($gambarHotel->file_path_gambar_hotel && Storage::disk('public')->exists($gambarHotel->file_path_gambar_hotel)) {
            Storage::disk('public')->delete($gambarHotel->file_path_gambar_hotel);
        }

        $gambarHotel->delete();

        return response()->json([
            'message' => 'Gambar hotel deleted successfully',
        ], 200);
    }
}
