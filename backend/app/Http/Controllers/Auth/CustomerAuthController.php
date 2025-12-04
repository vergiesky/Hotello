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
            'user_profile' => 'nullable|image|mimes:jpg,jpeg,png|max:2048', //mimes memastikan file yang diupload benar-benar file gambar JPEG atau PNG berdasarkan kontennya, bukan hanya nama filenya
        ]);

        $profilePath = null;
        if ($request->hasFile('user_profile')) {
            // simpan di storage/app/public/profile_pictures
            $profilePath = $request->file('user_profile')->store('profile_pictures', 'public');
        }

        $user = User::create([
            'nama' => $request->nama,
            'no_telp' => $request->no_telp,
            'email' => $request->email,
            'password' => $request->password,
            'tanggal_lahir' => $request->tanggal_lahir,
            'user_profile'  => $profilePath,
        ]);

        $customer = Customer::create(['id_user' => $user->id_user]);

        return response()->json([
            'user' => $user,
            'customer' => $customer,
        ], 201);
    }
}
