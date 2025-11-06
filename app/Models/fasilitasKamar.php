<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class FasilitasKamar extends Model
{
    use HasFactory;

    protected $table = 'fasilitas_kamars';
    protected $primaryKey = 'id_fasilitas_kamar';

    protected $fillable = [
        'id_kamar',
        'id_icon',
        'nama_fasilitas_kamar',
        'keterangan_fasilitas_kamar',
    ];

    public function kamar()
    {
        return $this->belongsTo(Kamar::class, 'id_kamar', 'id_kamar');
    }

    public function icon()
    {
        return $this->belongsTo(Icon::class, 'id_icon', 'id_icon');
    }
}
