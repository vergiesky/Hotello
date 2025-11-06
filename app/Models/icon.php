<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Icon extends Model
{
    use HasFactory;

    protected $table = 'icons';
    protected $primaryKey = 'id_icon';

    protected $fillable = [
        'nama_icon',
        'file_path_icon',
    ];

    public function fasilitasHotel()
    {
        return $this->hasMany(FasilitasHotel::class, 'id_icon', 'id_icon');
    }

    public function fasilitasKamar()
    {
        return $this->hasMany(FasilitasKamar::class, 'id_icon', 'id_icon');
    }
}
