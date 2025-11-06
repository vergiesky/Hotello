<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class RincianReservasi extends Model
{
    use HasFactory;

    protected $table = 'rincian_reservasis';
    protected $primaryKey = 'id_rincian_reservasi';

    protected $fillable = [
        'id_reservasi',
        'id_kamar',
        'jumlah_kamar',
        'sub_total',
    ];

    protected $casts = [
        'jumlah_kamar' => 'integer',
        'sub_total'    => 'decimal:2',
    ];

    public function reservasi()
    {
        return $this->belongsTo(Reservasi::class, 'id_reservasi', 'id_reservasi');
    }

    public function kamar()
    {
        return $this->belongsTo(Kamar::class, 'id_kamar', 'id_kamar');
    }
}
