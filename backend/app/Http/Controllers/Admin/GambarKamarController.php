<?php

namespace App\Http\Controllers\Admin;

use App\Models\GambarKamar;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Storage;

class GambarKamarController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $gambarKamar = GambarKamar::with('kamar')->get();

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
            'file_gambar' => 'required|file|mimes:png,jpg,jpeg,webp|max:4096',
        ]);

        $path = $request->file('file_gambar')->store('gambar_kamars', 'public');

        $gambarKamar = GambarKamar::create([
            'id_kamar' => $validated['id_kamar'],
            'nama_gambar_kamar' => $validated['nama_gambar_kamar'],
            'keterangan_gambar_kamar' => $validated['keterangan_gambar_kamar'] ?? null,
            'file_path_gambar_kamar' => $path,
        ]);

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
        $gambarKamar = GambarKamar::with('kamar')->where('id_gambar_kamar', $id)->first();

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
            'file_gambar' => 'nullable|file|mimes:png,jpg,jpeg,webp|max:4096',
        ]);

        $payload = [
          'id_kamar' => $validated['id_kamar'],
          'nama_gambar_kamar' => $validated['nama_gambar_kamar'],
          'keterangan_gambar_kamar' => $validated['keterangan_gambar_kamar'] ?? null,
        ];

        if ($request->hasFile('file_gambar')) {
            if ($gambarKamar->file_path_gambar_kamar && Storage::disk('public')->exists($gambarKamar->file_path_gambar_kamar)) {
                Storage::disk('public')->delete($gambarKamar->file_path_gambar_kamar);
            }
            $path = $request->file('file_gambar')->store('gambar_kamars', 'public');
            $payload['file_path_gambar_kamar'] = $path;
        }

        $gambarKamar->update($payload);

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

        if ($gambarKamar->file_path_gambar_kamar && Storage::disk('public')->exists($gambarKamar->file_path_gambar_kamar)) {
            Storage::disk('public')->delete($gambarKamar->file_path_gambar_kamar);
        }

        $gambarKamar->delete();

        return response()->json([
            'message' => 'Gambar kamar deleted successfully',
        ], 200);
    }
}
