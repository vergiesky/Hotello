<?php

namespace App\Http\Controllers\Admin;

use Illuminate\Http\Request;
use App\Models\FasilitasHotel;
use App\Http\Controllers\Controller;

class FasilitasHotelController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $fasilitasHotel = FasilitasHotel::all();

        return response()->json([
            'data' => $fasilitasHotel,
        ], 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'id_hotel' => 'required|integer|exists:hotels,id_hotel',
            'id_icon' => 'nullable|integer|exists:icons,id_icon',
            'nama_fasilitas' => 'required|string|max:255',
            'keterangan_fasilitas_hotel' => 'nullable|string',
        ]);

        $fasilitasHotel = FasilitasHotel::create($validated);

        return response()->json([
            'message' => 'Fasilitas hotel created successfully',
            'data' => $fasilitasHotel,
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $fasilitasHotel = FasilitasHotel::where('id_fasilitas_hotel', $id)->first();

        if (!$fasilitasHotel) {
            return response()->json([
                'message' => 'Fasilitas hotel not found',
            ], 404);
        }

        return response()->json([
            'data' => $fasilitasHotel,
        ], 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $fasilitasHotel = FasilitasHotel::where('id_fasilitas_hotel', $id)->first();

        if (!$fasilitasHotel) {
            return response()->json([
                'message' => 'Fasilitas hotel not found',
            ], 404);
        }

        $validated = $request->validate([
            'id_hotel' => 'required|integer|exists:hotels,id_hotel',
            'id_icon' => 'nullable|integer|exists:icons,id_icon',
            'nama_fasilitas' => 'required|string|max:255',
            'keterangan_fasilitas_hotel' => 'nullable|string',
        ]);

        $fasilitasHotel->update($validated);

        return response()->json([
            'message' => 'Fasilitas hotel updated successfully',
            'data'    => $fasilitasHotel->fresh(), // ganti dengan data/objek baru
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $fasilitasHotel = FasilitasHotel::where('id_fasilitas_hotel', $id)->first();

        if (!$fasilitasHotel) {
            return response()->json([
                'message' => 'Fasilitas hotel not found',
            ], 404);
        }

        $fasilitasHotel->delete();

        return response()->json([
            'message' => 'Fasilitas hotel deleted successfully',
        ], 200);
    }
}
