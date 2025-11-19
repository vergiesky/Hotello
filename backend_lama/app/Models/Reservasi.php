<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Reservasi extends Model
{
    use HasFactory;

    protected $table = 'reservasis';
    protected $primaryKey = 'id_reservasi';

    protected $fillable = [
        'id_user',
        'check_in',
        'check_out',
        'jumlah_tamu',
        'total_biaya',
        'status_reservasi',
    ];

    protected function casts(): array
    {
        return [
            'check_in' => 'datetime',
            'check_out' => 'datetime',
        ];
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'id_user', 'id_user');
    }

    public function rincianReservasis()
    {
        return $this->hasMany(RincianReservasi::class, 'id_reservasi', 'id_reservasi');
    }

    public function pembayaran()
    {
        return $this->hasOne(Pembayaran::class, 'id_reservasi', 'id_reservasi');
    }
}
