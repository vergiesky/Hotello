<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Auth
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Auth\AdminAuthController;
use App\Http\Controllers\Auth\CustomerAuthController;

// Admin
use App\Http\Controllers\Admin\HotelController;
use App\Http\Controllers\Admin\KamarController;

// Customer
use App\Http\Controllers\Customer\WishListController;
use App\Http\Controllers\Customer\ReservasiController;
use App\Http\Controllers\Customer\ReviewController;

// ROUTES

Route::post('/register/admin', [AdminAuthController::class, 'register']); // halaman registr admin & customer dibedain?
Route::post('/register/customer', [CustomerAuthController::class, 'register']);
Route::post('/login',  [AuthController::class, 'login']);

// hotel public
Route::get('/hotels', [HotelController::class, 'index']);
Route::get('/hotels/{id}', [HotelController::class, 'show']);


// kamar public
Route::get('/kamars', [KamarController::class, 'index']);
Route::get('/kamars/{id}', [KamarController::class, 'show']);

// harus login
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
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

    // memproses pemesanan
});

// customer
Route::middleware(['auth:sanctum', 'ability:customer'])->group(function () {
    // menambahkan daftar wishlist
    Route::get('/wishlists', [WishListController::class, 'index']);
    Route::post('/wishlists/create', [WishListController::class, 'store']);
    // Route::put('/wishlists/update/{id}',    [WishListController::class, 'update']); // wishlist ada update?
    Route::delete('/wishlists/delete/{id}', [WishListController::class, 'destroy']);

    // melakukan pemesanan
    Route::get('/reservasis', [ReservasiController::class, 'index']);
    Route::post('/reservasis/create', [ReservasiController::class, 'store']);
    Route::put('/reservasis/update/{id}', [ReservasiController::class, 'update']); // reservasi ada update?
    Route::delete('/reservasis/delete/{id}', [ReservasiController::class, 'destroy']);

    // melakukan pembayaran
    // memberi review
    Route::get('/reviews', [ReviewController::class, 'index']); // tampil seluruh review
    Route::get('/reviews/{id}', [ReviewController::class, 'show']); // tampil 1 review
    Route::post('/reviews/create', [ReviewController::class, 'store']);
    Route::put('/reviews/update/{id}', [ReviewController::class, 'update']);
    Route::delete('/reviews/delete/{id}', [ReviewController::class, 'destroy']);
});
