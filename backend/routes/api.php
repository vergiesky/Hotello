<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\UserController;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\ShowHotelController;
use App\Http\Controllers\Admin\IconController;
use App\Http\Controllers\Admin\HotelController;
use App\Http\Controllers\Admin\KamarController;
use App\Http\Controllers\Auth\AdminAuthController;
use App\Http\Controllers\Customer\ReviewController;
use App\Http\Controllers\Admin\GambarHotelController;
use App\Http\Controllers\Admin\GambarKamarController;
use App\Http\Controllers\Auth\CustomerAuthController;
use App\Http\Controllers\Customer\WishListController;
use App\Http\Controllers\Customer\ReservasiController;
use App\Http\Controllers\Admin\FasilitasHotelController;
use App\Http\Controllers\Admin\FasilitasKamarController;
use App\Http\Controllers\Admin\AdminPembayaranController;
use App\Http\Controllers\Customer\CustomerPembayaranController;

// routes
Route::post('/register/admin', [AdminAuthController::class, 'register']); // halaman registr admin & customer dibedain?
Route::post('/register/customer', [CustomerAuthController::class, 'register']);
Route::post('/login',  [AuthController::class, 'login']);
Route::middleware('auth:sanctum')->post('/logout', [AuthController::class, 'logout']);

// hotel public
Route::get('/hotels', [HotelController::class, 'index']);
Route::get('/hotels/{id}', [HotelController::class, 'show']);
Route::get('/hotel-detail/{id}', [ShowHotelController::class, 'show']);
Route::get('/availability/{hotelId}', [ReservasiController::class, 'availability']);

// review public (baca saja)
Route::get('/reviews', [ReviewController::class, 'index']); // tampil seluruh review
Route::get('/reviews/{id}', [ReviewController::class, 'show']); // tampil 1 review


// kamar public
Route::get('/kamars', [KamarController::class, 'index']);
Route::get('/kamars/{id}', [KamarController::class, 'show']);

// buat ngedit profile (data diri)
Route::middleware('auth:sanctum')->group(function () {
    // kompatibel dengan frontend customer/profile.jsx
    Route::get('/user', [UserController::class, 'show']);
    Route::patch('/user/foto', [UserController::class, 'updateFoto']);
    Route::patch('/user', [UserController::class, 'update']);
    Route::delete('/user', [UserController::class, 'destroy'])->name('user.destroy'); // pastikan ada method destroy jika dipakai
    Route::post('/user/password', [UserController::class, 'updatePassword']);
});

// admin
Route::middleware(['auth:sanctum', 'ability:admin'])->group(function () {
    // hotel crud
    Route::post('/hotels/create', [HotelController::class, 'store']);
    Route::put('/hotels/update/{id}', [HotelController::class, 'update']);
    Route::delete('/hotels/delete/{id}', [HotelController::class, 'destroy']);

    // kamar crud
    Route::post('/kamars/create', [KamarController::class, 'store']);
    Route::put('/kamars/update/{id}', [KamarController::class, 'update']);
    Route::delete('/kamars/delete/{id}', [KamarController::class, 'destroy']);

    // faslitas hotel crud
    Route::get('/fasilitas-hotel', [FasilitasHotelController::class, 'index']);
    Route::get('/fasilitas-hotel/{id}', [FasilitasHotelController::class, 'show']);
    Route::post('/fasilitas-hotel/create', [FasilitasHotelController::class, 'store']);
    Route::put('/fasilitas-hotel/update/{id}', [FasilitasHotelController::class, 'update']);
    Route::delete('/fasilitas-hotel/delete/{id}', [FasilitasHotelController::class, 'destroy']);

    // fasilitas kamar crud
    Route::get('/fasilitas-kamar', [FasilitasKamarController::class, 'index']);
    Route::get('/fasilitas-kamar/{id}', [FasilitasKamarController::class, 'show']);
    Route::post('/fasilitas-kamar/create', [FasilitasKamarController::class, 'store']);
    Route::put('/fasilitas-kamar/update/{id}', [FasilitasKamarController::class, 'update']);
    Route::delete('/fasilitas-kamar/delete/{id}', [FasilitasKamarController::class, 'destroy']);

    // gambar hotel crud
    Route::get('/gambar-hotel', [GambarHotelController::class, 'index']);
    Route::get('/gambar-hotel/{id}', [GambarHotelController::class, 'show']);
    Route::post('/gambar-hotel/create', [GambarHotelController::class, 'store']);
    Route::put('/gambar-hotel/update/{id}', [GambarHotelController::class, 'update']);
    Route::delete('/gambar-hotel/delete/{id}', [GambarHotelController::class, 'destroy']);

    // gambar kamar crud
    Route::get('/gambar-kamar', [GambarKamarController::class, 'index']);
    Route::get('/gambar-kamar/{id}', [GambarKamarController::class, 'show']);
    Route::post('/gambar-kamar/create', [GambarKamarController::class, 'store']);
    Route::put('/gambar-kamar/update/{id}', [GambarKamarController::class, 'update']);
    Route::delete('/gambar-kamar/delete/{id}', [GambarKamarController::class, 'destroy']);

    // icon crud
    Route::get('/icons', [IconController::class, 'index']);
    Route::get('/icons/{id}', [IconController::class, 'show']);
    Route::post('/icons/create', [IconController::class, 'store']);
    Route::put('/icons/update/{id}', [IconController::class, 'update']);
    Route::delete('/icons/delete/{id}', [IconController::class, 'destroy']);

    // admin pembayaran
    Route::get('/admin/pembayarans', [AdminPembayaranController::class, 'index']);
    Route::get('/admin/pembayarans/{id}', [AdminPembayaranController::class, 'show']);
    Route::put('/admin/pembayarans/mark-paid/{id}', [AdminPembayaranController::class, 'markPaid']);
    Route::put('/admin/pembayarans/mark-failed/{id}', [AdminPembayaranController::class, 'markFailed']);
});

// customer
Route::middleware(['auth:sanctum', 'ability:customer'])->group(function () {
    // menambahkan daftar wishlist
    Route::get('/wishlists', [WishListController::class, 'index']);
    Route::get('/wishlists/{id}', [WishListController::class, 'show']);
    Route::post('/wishlists/create', [WishListController::class, 'store']);
    Route::delete('/wishlists/delete/{id}', [WishListController::class, 'destroy']);

    // melakukan pemesanan
    Route::get('/reservasis', [ReservasiController::class, 'index']);
    Route::get('/reservasis/{id}', [ReservasiController::class, 'show']);
    Route::post('/reservasis/create', [ReservasiController::class, 'store']);
    Route::put('/reservasis/update/{id}', [ReservasiController::class, 'update']);
    Route::delete('/reservasis/delete/{id}', [ReservasiController::class, 'destroy']);

    // customer pembayaran
    Route::get('/pembayarans', [CustomerPembayaranController::class, 'index']);
    Route::get('/pembayarans/{id}', [CustomerPembayaranController::class, 'show']);
    Route::post('/pembayarans/create', [CustomerPembayaranController::class, 'store']);
    Route::put('/pembayarans/update/{id}', [CustomerPembayaranController::class, 'update']);
    Route::delete('/pembayarans/delete/{id}', [CustomerPembayaranController::class, 'destroy']);

    // memberi review
    Route::post('/reviews/create', [ReviewController::class, 'store']);
    Route::put('/reviews/update/{id}', [ReviewController::class, 'update']);
    Route::delete('/reviews/delete/{id}', [ReviewController::class, 'destroy']);
});
