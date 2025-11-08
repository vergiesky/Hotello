<?php

namespace App\Http\Controllers\Admin;

use App\Models\Kamar;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class KamarController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $kamars = Kamar::all();

        return response()->json([
            'data' => $kamars,
        ], 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'id_hotel' => 'required|integer|exists:hotels,id_hotel',
            'nomor_kamar' => 'required|string|max:50',
            'tipe_kamar' => 'required|string|max:100',
            'harga' => 'required|numeric|min:0',
            'status_kamar' => 'nullable|boolean',
            'lantai' => 'required|string|max:20',
            'kapasitas' => 'required|integer|min:1',
        ]);

        $kamar = Kamar::create($validated);

        return response()->json([
            'message' => 'Kamar created successfully',
            'data'    => $kamar,
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $kamar = Kamar::where('id_kamar', $id)->first();
        if (!$kamar) {
            return response()->json(['message' => 'Kamar not found'], 404);
        }

        return response()->json([
            'data' => $kamar,
        ], 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $kamar = Kamar::where('id_kamar', $id)->first();

        if (!$kamar) {
            return response()->json(['message' => 'Kamar not found'], 404);
        }

        $validated = $request->validate([
            'id_hotel' => 'required|integer|exists:hotels,id_hotel',
            'nomor_kamar' => 'required|string|max:50',
            'tipe_kamar' => 'required|string|max:100',
            'harga' => 'required|numeric|min:0',
            'status_kamar' => 'nullable|boolean',
            'lantai' => 'required|string|max:20',
            'kapasitas' => 'required|integer|min:1',
        ]);

        $kamar->update($validated);

        return response()->json([
            'message' => 'Kamar updated successfully',
            'data'    => $kamar->fresh(),
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $kamar = Kamar::where('id_kamar', $id)->first();
        if (!$kamar) {
            return response()->json([
                'message' => 'Kamar not found'
            ], 404);
        }

        $kamar->delete();
        return response()->json([
            'message' => 'Kamar deleted successfully'
        ], 200);
    }
}
