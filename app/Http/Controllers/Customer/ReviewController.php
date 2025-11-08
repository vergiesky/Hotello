<?php

namespace App\Http\Controllers\Customer;

use App\Models\Kamar;
use App\Models\Review;
use App\Models\Reservasi;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;

class ReviewController extends Controller
{
    public function index(Request $request)
    {
        // // $review = $request->user()->reviews;
        // $review = Auth::user()->reviews; // bentuk lain

        // return response()->json($review);

        $query = Review::with(['user', 'kamar']);

        if ($request->filled('id_kamar')) {
            $query->where('id_kamar', $request->id_kamar);
        }

        $review = $query->orderByDesc('id_review')->get();

        return response()->json([
            'data' => $review,
        ], 200);
    }

    // Create Review
    public function store(Request $request)
    {
        // $userId = Auth::id();

        // $validated = $request->validate([
        //     'id_pembayaran' => 'required|exists:pembayarans,id_pembayaran',
        //     'id_kamar' => 'required|exists:kamars,id_kamar',
        //     'komentar' => 'nullable|string',
        //     'rating' => 'required|numeric|between:0,5',
        //     'file_path_review' => 'nullable|string',
        //     'tanggal_review' => 'required|date',
        // ]);
        // $validated['id_user'] = $userId; // tambahkan id_user

        // $review = Review::create($validated);

        // return response()->json([
        //     'message' => 'Review added succesfully',
        //     'data' => $review,
        // ], 201);

        $userId = Auth::id();

        $validated = $request->validate([
            'id_kamar' => 'required|integer|exists:kamars,id_kamar',
            'rating'   => 'required|integer|min:1|max:5',
            'komentar' => 'nullable|string|max:500',
        ]);

        // cek pernah menginap & sudah bayar & sudah selesai menginap
        $pernahMenginapDanSudahBayar = Reservasi::where('id_user', $userId)
            ->where('status_reservasi', 'Paid')
            ->where('check_out', '<', now()) // hanya boleh review setelah selesai menginap
            ->whereHas('rincianReservasis', function ($q) use ($validated) {
                $q->where('id_kamar', $validated['id_kamar']);
            })
            ->exists();

        if (!$pernahMenginapDanSudahBayar) {
            return response()->json([
                'message' => 'Kamu hanya bisa review kamar yang sudah kamu bayar dan menginap (setelah check-out).',
            ], 403);
        }

        // cegah double-review user untuk kamar yang sama
        $sudahReview = Review::where('id_user', $userId)
            ->where('id_kamar', $validated['id_kamar'])
            ->exists();

        if ($sudahReview) {
            return response()->json([
                'message' => 'Kamu sudah pernah memberikan review untuk kamar ini.',
            ], 422);
        }

        $review = Review::create([
            'id_user'  => $userId,
            'id_kamar' => $validated['id_kamar'],
            'rating'   => $validated['rating'],
            'komentar' => $validated['komentar'] ?? null,
        ]);

        return response()->json([
            'message' => 'Review created successfully',
            'data'    => $review->load(['user','kamar']),
        ], 201);
    }

    // Read review
    public function show(string $id)
    {
        // $review = Review::find($id);
        // // $review = Review::where('id_review', $id)->first(); // bentuk lain search id

        // if (!$review) {
        //     return response()->json([
        //         'message' => 'Review not found',
        //     ], 404);
        // }

        // return response()->json([
        //     'data' => $review
        // ]);

        $review = Review::with(['user', 'kamar'])->where('id_review', $id)->first();

        if (!$review) {
            return response()->json([
                'message' => 'Review not found',
            ], 404);
        }

        return response()->json([
            'data' => $review,
        ], 200);
    }

    // Update Review
    public function update(Request $request, string $id)
    {
        // $review = Review::find($id);

        // if (!$review) {
        //     return response()->json([
        //         'message' => 'Review not found',
        //     ], 404);
        // }

        // $userId = Auth::id();

        // $validated = $request->validate([
        //     'id_pembayaran' => 'required|exists:pembayarans,id_pembayaran',
        //     'id_kamar' => 'required|exists:kamars,id_kamar',
        //     'komentar' => 'nullable|text',
        //     'rating' => 'required|numeric|between:0,5',
        //     'file_path_review' => 'nullable|string',
        //     'tanggal_review' => 'required|date',
        // ]);
        // $validated['id_user'] = $userId; // tambahkan id_user

        // $review->update($validated);

        // return response()->json([
        //     'message' => 'Review updated succesfully',
        //     'data' => $review->fresh(), // ganti dengan data/objek baru
        // ]);

        $userId = Auth::id();

        $validated = $request->validate([
            'rating'   => 'required|integer|min:1|max:5',
            'komentar' => 'nullable|string|max:500',
        ]);

        // ambil review
        $review = Review::where('id_review', $id)->first();

        if (!$review) {
            return response()->json([
                'message' => 'Review not found',
            ], 404);
        }

        // hanya pemilik review yang boleh update
        if ((int)$review->id_user !== (int)$userId) {
            return response()->json([
                'message' => 'Tidak punya izin mengubah review ini',
            ], 403);
        }

        // update field yang diizinkan
        $review->update([
            'rating'   => $validated['rating'],
            'komentar' => $validated['komentar'] ?? $review->komentar,
        ]);

        return response()->json([
            'message' => 'Review updated successfully',
            'data'    => $review->load(['user','kamar']),
        ], 200);
    }

    // Delete Review
    public function destroy(string $id)
    {
        // $review = Review::find($id);

        // if (!$review) {
        //     return response()->json([
        //         'message' => 'Review not found',
        //     ], 404);
        // }

        // $review->delete();

        // return response()->json([
        //     'message' => 'Review deleted succesfully',
        // ]);

        $userId = Auth::id();

        $review = Review::where('id_review', $id)->first();

        if (!$review) {
            return response()->json([
                'message' => 'Review not found',
            ], 404);
        }

        if ((int)$review->id_user !== (int)$userId) {
            return response()->json([
                'message' => 'Tidak punya izin menghapus review ini',
            ], 403);
        }

        $review->delete();

        return response()->json([
            'message' => 'Review deleted successfully',
        ], 200);
    }
}
