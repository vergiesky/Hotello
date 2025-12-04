<?php

namespace App\Http\Controllers\Admin;

use App\Models\Hotel;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class HotelController extends Controller
{
    public function index()
    {
        // Sertakan kamar supaya frontend bisa hitung harga termurah
        $hotels = Hotel::with(['gambarHotels', 'kamars'])->get();
        
        return response()->json([
            'data' => $hotels,
        ], 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama_hotel' => 'required|string|max:255',
            'kota' => 'required|string|max:100',
            'alamat' => 'required|string|max:255',
            'deskripsi' => 'required|string',
            'rating_hotel' => 'nullable|numeric|between:0,5', // rating harus >= 5 dan <=5
        ]);

        $hotel = Hotel::create($validated);

        return response()->json([
            'message' => 'Hotel created successfully',
            'data' => $hotel,
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $hotel = Hotel::with('gambarHotels')->where('id_hotel', $id)->first();

        if (!$hotel) {
            return response()->json([
                'message' => 'Hotel not found',
            ], 404);
        }

        return response()->json([
            'data' => $hotel
        ], 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $hotel = Hotel::where('id_hotel', $id)->first();

        if (!$hotel) {
            return response()->json([
                'message' => 'Hotel not found',
            ], 404);
        }

        $validated = $request->validate([
            'nama_hotel' => 'required|string|max:255',
            'kota' => 'required|string|max:100',
            'alamat' => 'required|string|max:255',
            'deskripsi' => 'required|string',
            'rating_hotel' => 'nullable|numeric|between:0,5', // rating harus >= 0 dan <=5
        ]);

        $hotel->update($validated);

        return response()->json([
            'message' => 'Hotel updated successfully',
            'data' => $hotel->fresh(), // ganti dengan data/objek baru
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $hotel = Hotel::where('id_hotel', $id)->first();
        if (!$hotel) {
            return response()->json([
                'message' => 'Hotel not found',
            ], 404);
        }

        $hotel->delete();

        return response()->json([
            'message' => 'Hotel deleted successfully',
        ], 200);
    }
}
