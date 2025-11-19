<?php

namespace App\Http\Controllers\Admin;

use App\Models\GambarKamar;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class GambarKamarController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $gambarKamar = GambarKamar::all();

        return response()->json([
            'data' => $gambarKamar,
        ], 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'id_kamar' => 'required|integer|exists:kamars,id_kamar',
            'nama_gambar_kamar' => 'required|string|max:255',
            'keterangan_gambar_kamar' => 'nullable|string',
            'file_path_gambar_kamar' => 'required|string|max:255',
        ]);

        $gambarKamar = GambarKamar::create($validated);

        return response()->json([
            'message' => 'Gambar kamar created successfully',
            'data' => $gambarKamar,
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $gambarKamar = GambarKamar::where('id_gambar_kamar', $id)->first();

        if (!$gambarKamar) {
            return response()->json([
                'message' => 'Gambar kamar not found',
            ], 404);
        }

        return response()->json([
            'data' => $gambarKamar,
        ], 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $gambarKamar = GambarKamar::where('id_gambar_kamar', $id)->first();

        if (!$gambarKamar) {
            return response()->json([
                'message' => 'Gambar kamar not found',
            ], 404);
        }

        $validated = $request->validate([
            'id_kamar' => 'required|integer|exists:kamars,id_kamar',
            'nama_gambar_kamar' => 'required|string|max:255',
            'keterangan_gambar_kamar' => 'nullable|string',
            'file_path_gambar_kamar' => 'required|string|max:255',
        ]);

        $gambarKamar->update($validated);

        return response()->json([
            'message' => 'Gambar kamar updated successfully',
            'data'    => $gambarKamar->fresh(),
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $gambarKamar = GambarKamar::where('id_gambar_kamar', $id)->first();

        if (!$gambarKamar) {
            return response()->json([
                'message' => 'Gambar kamar not found',
            ], 404);
        }

        $gambarKamar->delete();

        return response()->json([
            'message' => 'Gambar kamar deleted successfully',
        ], 200);
    }
}
