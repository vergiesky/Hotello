<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class GambarHotel extends Model
{
    use HasFactory;

    protected $table = 'gambar_hotels';
    protected $primaryKey = 'id_gambar_hotel';

    protected $fillable = [
        'id_hotel',
        'nama_gambar_hotel',
        'keterangan_gambar_hotel',
        'file_path_gambar_hotel',
    ];

    public function hotel()
    {
        return $this->belongsTo(Hotel::class, 'id_hotel', 'id_hotel');
    }
}
