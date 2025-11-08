<?php

namespace App\Http\Controllers\Admin;

use App\Models\Icon;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class IconController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $icons = Icon::all();

        return response()->json([
            'data' => $icons,
        ], 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama_icon' => 'required|string|max:255',
            'file_path_icon' => 'required|string|max:255',
        ]);

        $icon = Icon::create($validated);

        return response()->json([
            'message' => 'Icon created successfully',
            'data'    => $icon,
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $icon = Icon::where('id_icon', $id)->first();

        if (!$icon) {
            return response()->json([
                'message' => 'Icon not found',
            ], 404);
        }

        return response()->json([
            'data' => $icon,
        ], 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $icon = Icon::where('id_icon', $id)->first();

        if (!$icon) {
            return response()->json([
                'message' => 'Icon not found',
            ], 404);
        }

        $validated = $request->validate([
            'nama_icon' => 'required|string|max:255',
            'file_path_icon' => 'required|string|max:255',
        ]);

        $icon->update($validated);

        return response()->json([
            'message' => 'Icon updated successfully',
            'data' => $icon->fresh(),
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $icon = Icon::where('id_icon', $id)->first();

        if (!$icon) {
            return response()->json([
                'message' => 'Icon not found',
            ], 404);
        }

        $icon->delete();

        return response()->json([
            'message' => 'Icon deleted successfully',
        ], 200);
    }
}
