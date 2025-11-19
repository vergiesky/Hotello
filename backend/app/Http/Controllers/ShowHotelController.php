<?php

namespace App\Http\Controllers;

use App\Models\Hotel;
use Illuminate\Http\Request;

class ShowHotelController extends Controller
{
    public function show(string $id)
    {
        $hotel = Hotel::with([
            // gambar hotel
            'gambarHotels',

            // fasilitas hotel + icon
            'fasilitasHotels.icon',

            // kamar + gambar + fasilitas + review user
            'kamars.gambarKamars',
            'kamars.fasilitasKamar',
            'kamars.reviews.user:id_user,nama', // relasi review + user

        ])->where('id_hotel', $id)->first();

        if (!$hotel) {
            return response()->json([
                'message' => 'Hotel not found',
            ], 404);
        }

        return response()->json([
            'hotel' => $hotel,
        ], 200);
    }
}
