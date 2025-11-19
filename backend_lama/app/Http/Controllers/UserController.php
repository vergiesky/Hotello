<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    public function show(Request $request)
    {
        return response()->json([
            'data' => $request->user(),
        ], 200);
    }


    public function update(Request $request)
    {
        $user = $request->user();

        $validated = $request->validate([
            'nama' => 'sometimes|string|max:255',
            'no_telp' => 'sometimes|string|max:50',
            'email' => ['sometimes', 'email', 'max:255', Rule::unique('users', 'email')->ignore($user->id_user, 'id_user')],
            'tanggal_lahir' => 'sometimes|date',
            'user_profile' => 'sometimes|nullable|string',
        ]);

        $user->fill($validated)->save();

        return response()->json([
            'message' => 'Profile updated successfully',
            'data'    => $user->fresh(),
        ], 200);
    }

    public function updatePassword(Request $request)
    {
        $user = $request->user();

        $request->validate([
            'password_lama' => 'required|string',
            'password_baru' => 'required|string|min:8|confirmed', 
        ]);

        if (!Hash::check($request->password_lama, $user->password)) {
            return response()->json([
                'message' => 'The old password is incorrect',
            ], 400);
        }

        $user->update([
            'password' => $request->password_baru,
        ]);

        return response()->json([
            'message' => 'Password changed successfully',
        ], 200);
    }
}
