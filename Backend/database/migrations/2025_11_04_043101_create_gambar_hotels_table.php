<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('gambar_hotels', function (Blueprint $table) {
            $table->increments('id_gambar_hotel');
            $table->integer('id_hotel')->unsigned();
            $table->string('nama_gambar_hotel');
            $table->string('keterangan_gambar_hotel');
            $table->string('file_path_gambar_hotel');
            $table->timestamps();

            $table->foreign('id_hotel')
                    ->references('id_hotel')
                    ->on('hotels')
                    ->onDelete('cascade')
                    ->onUpdate('cascade');
            
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('gambar_hotels');
    }
};
