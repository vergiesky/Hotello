<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Pembayaran extends Model
{
    use HasFactory;

    protected $table = 'pembayarans';
    protected $primaryKey = 'id_pembayaran';

    protected $fillable = [
        'id_reservasi',
        'tanggal_pembayaran',
        'metode_pembayaran',
        'jumlah_bayar',
        'status_pembayaran',
    ];

    public function reservasi()
    {
        return $this->belongsTo(Reservasi::class, 'id_reservasi', 'id_reservasi');
    }

    public function review()
    {
        return $this->hasOne(Review::class, 'id_pembayaran', 'id_pembayaran');
    }
}
