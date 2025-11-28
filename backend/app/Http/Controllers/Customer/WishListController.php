<?php

namespace App\Http\Controllers\Customer;

use App\Models\Wishlist;
// use Illuminate\Container\Attributes\Auth;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\Controller;

class WishListController extends Controller
{
    public function index()
    {
        $userId = Auth::id();
        $wishList = Wishlist::with(['hotel.gambarHotels'])
            ->where('id_user', $userId)               
            ->orderByDesc('id_wishlist')
            ->get();

        return response()->json([
            'data' => $wishList
        ], 200);
    }

    public function store(Request $request)
    {
        $userId = Auth::id();

        $validated = $request->validate([
            'id_hotel' => 'required|exists:hotels,id_hotel',
        ]);
        
        $already = Wishlist::where('id_user', $userId)
                ->where('id_hotel', $validated['id_hotel'])
                ->exists();

        if ($already) {
            return response()->json([
                'message' => 'Hotel ini sudah ada di wishlist kamu',
            ], 409);
        }

        $wishList = Wishlist::create([
            'id_user'  => $userId,
            'id_hotel' => $validated['id_hotel'],
        ]);

        return response()->json([
            'message' => 'Wishlist added succesfully',
            'data' => $wishList,
        ], 201);
    }

    public function show(string $id)
    {
        $wishList = Wishlist::with('hotel')->find($id);

        if (!$wishList) {
            return response()->json([
                'message' => 'Wishlist not found',
            ], 404);
        }

        return response()->json([
            'data' => $wishList
        ]);
    }

    public function destroy(string $id)
    {
        $userId = Auth::id();
        $wishList = Wishlist::find($id);

        if (!$wishList) {
            return response()->json(['message' => 'Wishlist not found'], 404);
        }

        if ((int)$wishList->id_user !== (int)$userId) {
            return response()->json(['message' => 'Dont have permission'], 403);
        }

        $wishList->delete();
        return response()->json([
            'message' => 'Wishlist deleted succesfully'
        ], 200);
    }
}
