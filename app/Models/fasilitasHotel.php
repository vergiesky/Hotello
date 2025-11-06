<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class FasilitasHotel extends Model
{
    use HasFactory;

    protected $table = 'fasilitas_hotels';
    protected $primaryKey = 'id_fasilitas_hotel';

    protected $fillable = [
        'id_hotel',
        'id_icon',
        'nama_fasilitas',
        'keterangan_fasilitas_hotel',
    ];

    public function hotel()
    {
        return $this->belongsTo(Hotel::class, 'id_hotel', 'id_hotel');
    }

    public function icon()
    {
        return $this->belongsTo(Icon::class, 'id_icon', 'id_icon');
    }
}