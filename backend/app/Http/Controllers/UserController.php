<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;

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
            'user_profile' => 'sometimes|nullable|image|max:2048',
            'hapus_foto' => 'sometimes|boolean',
        ]);

        // nilai biasa
        $user->fill(collect($validated)->except(['user_profile', 'hapus_foto'])->toArray());

        // handle hapus foto
        if ($request->boolean('hapus_foto') && $user->user_profile) {
            Storage::disk('public')->delete($user->user_profile);
            $user->user_profile = null;
        }

        // handle upload foto baru
        if ($request->hasFile('user_profile')) {
            // hapus foto lama jika ada
            if ($user->user_profile) {
                Storage::disk('public')->delete($user->user_profile);
            }
            $path = $request->file('user_profile')->store('profile_pictures', 'public');
            $user->user_profile = $path;
        }

        $user->save();

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
            'password' => Hash::make($request->password_baru),
        ]);

        return response()->json([
            'message' => 'Password changed successfully',
        ], 200);
    }

    public function destroy(Request $request)
    {
        $user = $request->user();

        if ($user->user_profile) {
            Storage::disk('public')->delete($user->user_profile);
        }

        if (method_exists($user, 'tokens')) {
            $user->tokens()->delete();
        }

        $user->delete();

        return response()->json([
            'message' => 'Account deleted successfully',
        ], 200);
    }
}
