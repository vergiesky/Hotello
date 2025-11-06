<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class GambarKamar extends Model
{
    use HasFactory;

    protected $table = 'gambar_kamars';
    protected $primaryKey = 'id_gambar_kamar';

    protected $fillable = [
        'id_kamar',
        'nama_gambar_kamar',
        'keterangan_gambar_kamar',
        'file_path_gambar_kamar',
    ];

    public function kamar()
    {
        return $this->belongsTo(Kamar::class, 'id_kamar', 'id_kamar');
    }
}
