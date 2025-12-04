<?php

namespace App\Http\Controllers\Auth;

use App\Models\User;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|string|email',
            'password' => 'required|string',
        ]);

        // cari user by email
        $user = User::where('email', $request->email)->first(); // first artinya ambil satu baris pertama yang ditemukan

        if (!$user) {
            return response()->json([
                'message' => 'User tidak ditemukan',
            ], 404);
        }

        if (!Hash::check($request->password, $user->password)) {
            return response()->json([
                'message' => 'Password salah',
            ], 401);
        }

        // cek apakah user punya relasi di tabel admins atau tidak
        $abilities  = $user->admin()->exists() ? ['admin'] : ['customer'];
        
        $token = $user->createToken('Personal Access Token', $abilities )->plainTextToken;

        return response()->json([
            'detail' => $user,
            'token' => $token,
            'abilities' => $abilities,
        ]);
    }

    public function logout(Request $request)
    {
        // jika sedang login
        if ($request->user()) {
            $request->user()->currentAccessToken()->delete();

            return response()->json([
                'message' => 'Logged out successfully'
            ]);
        }

        return response()->json([
            'message' => 'Not logged in'
        ], 401);
    }
}
