<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\HotelController;
use App\Http\Controllers\KamarController;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Auth\AdminAuthController;
use App\Http\Controllers\Auth\CustomerAuthController;

Route::post('/register/admin',    [AdminAuthController::class, 'register']);
Route::post('/register/customer', [CustomerAuthController::class, 'register']);
Route::post('/login',  [AuthController::class, 'login']);

// hotel public
Route::get('/hotels', [HotelController::class, 'index']);
Route::get('/hotels/{id}', [HotelController::class, 'show']);


// kamar public
Route::get('/kamars',      [KamarController::class, 'index']);
Route::get('/kamars/{id}', [KamarController::class, 'show']);

// harus login
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
});

// admin
Route::middleware(['auth:sanctum', 'ability:admin'])->group(function () {
    // hotel crud
    Route::post('/hotels/create',        [HotelController::class, 'store']);
    Route::put('/hotels/update/{id}',    [HotelController::class, 'update']);
    Route::delete('/hotels/delete/{id}', [HotelController::class, 'destroy']);

    // kamar crud
    Route::post('/kamars/create',        [KamarController::class, 'store']);
    Route::put('/kamars/update/{id}',    [KamarController::class, 'update']);
    Route::delete('/kamars/delete/{id}', [KamarController::class, 'destroy']);
});
