<?php

namespace App\Http\Controllers\Customer;

use App\Models\Kamar;
use App\Models\Review;
use App\Models\Reservasi;
use App\Models\Pembayaran;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class ReviewController extends Controller
{
    public function index(Request $request)
    {
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
        $userId = Auth::id();

        $validated = $request->validate([
            'id_pembayaran' => 'required|integer|exists:pembayarans,id_pembayaran',
            'id_kamar' => 'required|integer|exists:kamars,id_kamar',
            'rating' => 'required|numeric|min:0|max:5',
            'komentar' => 'nullable|string',
            'file_path_review' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
        ]);

        // ambil pembayaran + reservasi + rincian dan pastikan milik user
        $pembayaran = Pembayaran::with(['reservasi.rincianReservasis'])
            ->where('id_pembayaran', $validated['id_pembayaran'])
            ->whereHas('reservasi', function ($q) use ($userId) {
                $q->where('id_user', $userId);
            })
            ->first();

        if (!$pembayaran) {
            return response()->json([
                'message' => 'No payments found for this user',
            ], 404);
        }

        // harus paid
        if (strtolower($pembayaran->status_pembayaran) !== 'paid') {
            return response()->json([
                'message' => 'Reviews can only be done after the payment has paid status',
                'status_pembayaran' => $pembayaran->status_pembayaran,
            ], 422);
        }

        // pastikan reservasi sudah lewat checkout
        $reservasi = $pembayaran->reservasi;
        if (!$reservasi || now()->lt($reservasi->check_out)) {
            return response()->json([
                'message' => 'Reviews can only be done after check-out',
            ], 422);
        }

        // kamar yang direview harus termasuk dalam rincian reservasi
        $kamarTermasuk = $reservasi->rincianReservasis
            ->contains(function ($r) use ($validated) {
                return (int)$r->id_kamar === (int)$validated['id_kamar'];
            });

        if (!$kamarTermasuk) {
            return response()->json([
                'message' => 'The room reviewed is not included in this payment reservation',
            ], 422);
        }

        // mencegah double review (opsi: unik per user + kamar + pembayaran)
        $sudahReview = Review::where('id_user', $userId)
            ->where('id_kamar', $validated['id_kamar'])
            ->where('id_pembayaran', $validated['id_pembayaran'])
            ->exists();

        if ($sudahReview) {
            return response()->json([
                'message' => 'You have already provided a review for this room at the time of payment',
            ], 422);
        }

        $path = null;
        if ($request->hasFile('file_path_review')) {
            $path = $request->file('file_path_review')->store('review_images', 'public');
        }

        $review = Review::create([
            'id_pembayaran' => $validated['id_pembayaran'],
            'id_user' => $userId,
            'id_kamar' => $validated['id_kamar'],
            'komentar' => $validated['komentar'] ?? null,
            'rating' => $validated['rating'],
            'file_path_review'=> $path,
            'tanggal_review' => now()->toDateString(),
        ]);

        return response()->json([
            'message' => 'Review created successfully',
            'data'    => $review->load(['user','kamar']),
        ], 201);
    }

    // read review
    public function show(string $id)
    {   
        $review = Review::with(['user', 'kamar'])
            ->where('id_review', $id)
            ->first();

        if (!$review) {
            return response()->json([
                'message' => 'Review not found'
            ], 404);
        }

        return response()->json([
            'data' => $review
        ], 200);
    }

    // Update Review
    public function update(Request $request, string $id)
    {
        $userId = Auth::id();

        $validated = $request->validate([
            'rating' => 'required|numeric|min:0|max:5',
            'komentar' => 'nullable|string|max:500',
            'file_path_review' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
        ]);


        $review = Review::where('id_review', $id)->first();

        if (!$review) {
            return response()->json([
                'message' => 'Review not found'
            ], 404);
        }

        if ((int)$review->id_user !== (int)$userId) {
            return response()->json([
                'message' => 'Tidak punya izin mengubah review ini'
            ], 403);
        }

        $updateData = [
            'rating' => (float)$validated['rating'],
            'komentar' => $validated['komentar'] ?? $review->komentar,
        ];

        if ($request->hasFile('file_path_review')) {
            // hapus lama jika ada
            if ($review->file_path_review) {
                Storage::disk('public')->delete($review->file_path_review);
            }
            $updateData['file_path_review'] = $request->file('file_path_review')->store('review_images', 'public');
        }

        $review->update($updateData);

        return response()->json([
            'message' => 'Review updated successfully',
            'data' => $review->load(['user','kamar']),
        ], 200);
    }

    // Delete Review
    public function destroy(string $id)
    {
        $userId = Auth::id();

        $review = Review::where('id_review', $id)->first();

        if (!$review) {
            return response()->json([
                'message' => 'Review not found'
            ], 404);
        }

        if ((int)$review->id_user !== (int)$userId) {
            return response()->json([
                'message' => 'Do not have permission to delete this review'
            ], 403);
        }

        $review->delete();

        return response()->json([
            'message' => 'Review deleted successfully'
        ], 200);
    }
}
