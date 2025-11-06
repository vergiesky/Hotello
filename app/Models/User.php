<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory;

    protected $table = 'users';
    protected $primaryKey = 'id_user';

    protected $fillable = [
            'nama',
            'no_telp',
            'email',
            'password',
            'tanggal_lahir',
            'user_profile'
        ];

    protected function casts(): array
    {
        return [
            'tanggal_lahir' => 'date',   // cast jadi carbon, carbon = library laravel untuk tanggal dan waktu
            'password' => 'hashed',     // buat hash password pada saat create atau update
        ];
    }

    public function admin()
    {
        return $this->hasOne(Admin::class, 'id_user', 'id_user');
    }

    public function customer()
    {
        return $this->hasOne(Customer::class, 'id_user', 'id_user');
    }

    public function reservasis()
    {
        return $this->hasMany(Reservasi::class, 'id_user', 'id_user');
    }

    public function reviews()
    {
        return $this->hasMany(Review::class, 'id_user', 'id_user');
    }

    public function wishlists()
    {
        return $this->hasMany(Wishlist::class, 'id_user', 'id_user');
    }
}
