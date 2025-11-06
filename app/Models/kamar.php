<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Kamar extends Model
{
     use HasFactory;

    protected $table = 'kamars';
    protected $primaryKey = 'id_kamar';

    protected $fillable = [
        'id_hotel',
        'nomor_kamar',
        'tipe_kamar',
        'harga',
        'status_kamar',
        'lantai',
        'kapasitas',
    ];

    public function hotel()
    {
        return $this->belongsTo(Hotel::class, 'id_hotel', 'id_hotel');
    }

    public function gambarKamars()
    {
        return $this->hasMany(GambarKamar::class, 'id_kamar', 'id_kamar');
    }

    public function fasilitasKamar()
    {
        return $this->hasMany(FasilitasKamar::class, 'id_kamar', 'id_kamar');
    }

    public function rincianReservasis()
    {
        return $this->hasMany(RincianReservasi::class, 'id_kamar', 'id_kamar');
    }

    public function reviews()
    {
        return $this->hasMany(Review::class, 'id_kamar', 'id_kamar');
    }

    public function wishlists()
    {
        return $this->hasMany(Wishlist::class, 'id_kamar', 'id_kamar');
    }
}
