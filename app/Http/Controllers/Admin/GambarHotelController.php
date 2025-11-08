<?php

namespace App\Http\Controllers\Admin;

use App\Models\GambarHotel;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class GambarHotelController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $gambarHotel = GambarHotel::all();

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
            'file_path_gambar_hotel' => 'required|string|max:255',
        ]);

        $gambarHotel = GambarHotel::create($validated);

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
        $gambarHotel = GambarHotel::where('id_gambar_hotel', $id)->first();

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
            'file_path_gambar_hotel' => 'required|string|max:255',
        ]);

        $gambarHotel->update($validated);

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

        $gambarHotel->delete();

        return response()->json([
            'message' => 'Gambar hotel deleted successfully',
        ], 200);
    }
}
