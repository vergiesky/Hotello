<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Hotel extends Model
{
    use HasFactory;

    protected $table = 'hotels';
    protected $primaryKey = 'id_hotel';

    protected $fillable = [
        'nama_hotel',
        'kota',
        'alamat',
        'deskripsi',
        'rating_hotel',
    ];

    public function kamars()
    {
        return $this->hasMany(Kamar::class, 'id_hotel', 'id_hotel');
    }

    public function gambarHotels()
    {
        return $this->hasMany(GambarHotel::class, 'id_hotel', 'id_hotel');
    }

    public function fasilitasHotels()
    {
        return $this->hasMany(FasilitasHotel::class, 'id_hotel', 'id_hotel');
    }

    // public function icons()
    // {
    //     return $this->belongsToMany(Icon::class, 'fasilitas_hotel', 'id_hotel', 'id_hotel')->withPivot(['nama_fasilitas', 'keterangan_fasilitas_hotel'])->withTimestamps();
    //     // withPivot digunakan untuk menyimpan kolom tambahan selain FK
    // }
}
