<?php

namespace App\Http\Controllers\Admin;

use Illuminate\Http\Request;
use App\Models\FasilitasKamar;
use App\Http\Controllers\Controller;

class FasilitasKamarController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $fasilitasKamar = FasilitasKamar::with('kamar', 'icon')->get();

        return response()->json([
            'data' => $fasilitasKamar,
        ], 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'id_kamar' => 'required|integer|exists:kamars,id_kamar',
            'id_icon' => 'required|integer|exists:icons,id_icon',
            'nama_fasilitas_kamar' => 'required|string|max:255',
            'keterangan_fasilitas_kamar' => 'required|string',
        ]);

        $fasilitasKamar = FasilitasKamar::create($validated);

        return response()->json([
            'message' => 'Fasilitas kamar created successfully',
            'data' => $fasilitasKamar,
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
         $fasilitasKamar = FasilitasKamar::with('kamar', 'icon')->where('id_fasilitas_kamar', $id)->first();

        if (!$fasilitasKamar) {
            return response()->json([
                'message' => 'Fasilitas kamar not found',
            ], 404);
        }

        return response()->json([
            'data' => $fasilitasKamar,
        ], 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $fasilitasKamar = FasilitasKamar::where('id_fasilitas_kamar', $id)->first();

        if (!$fasilitasKamar) {
            return response()->json([
                'message' => 'Fasilitas kamar not found',
            ], 404);
        }

        $validated = $request->validate([
            'id_kamar' => 'required|integer|exists:kamars,id_kamar',
            'id_icon' => 'required|integer|exists:icons,id_icon',
            'nama_fasilitas_kamar' => 'required|string|max:255',
            'keterangan_fasilitas_kamar' => 'required|string',
        ]);

        $fasilitasKamar->update($validated);

        return response()->json([
            'message' => 'Fasilitas kamar updated successfully',
            'data' => $fasilitasKamar->fresh(), // ganti dengan data/objek baru
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $item = FasilitasKamar::where('id_fasilitas_kamar', $id)->first();

        if (!$item) {
            return response()->json([
                'message' => 'Fasilitas kamar not found',
            ], 404);
        }

        $item->delete();

        return response()->json([
            'message' => 'Fasilitas kamar deleted successfully',
        ], 200);
    }
}
