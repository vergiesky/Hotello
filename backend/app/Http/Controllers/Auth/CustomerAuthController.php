<?php

namespace App\Http\Controllers\Auth;

use App\Models\User;
use App\Models\Customer;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class CustomerAuthController extends Controller
{
    public function register(Request $request)
    {
        $request->validate([
            'nama' => 'required|string|max:100',
            'no_telp' => 'required|string|max:20',
            'email' => 'required|string|email|max:255|unique:users,email',
            'password' => 'required|string|min:8',
            'tanggal_lahir' => 'required|date',
            'user_profile' => 'nullable|string',
        ]);

        $user = User::create([
            'nama' => $request->nama,
            'no_telp' => $request->no_telp,
            'email' => $request->email,
            'password' => $request->password,
            'tanggal_lahir' => $request->tanggal_lahir,
            'user_profile' => $request->user_profile,
        ]);

        $customer = Customer::create(['id_user' => $user->id_user]);

        $token = $user->createToken('Personal Access Token', ['customer'])->plainTextToken;

        return response()->json([
            'user' => $user,
            'customer' => $customer,
            'token' => $token,
            'message' => 'Customer registered successfully',
        ], 201);
    }
}
