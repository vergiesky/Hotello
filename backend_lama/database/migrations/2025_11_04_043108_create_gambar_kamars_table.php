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
        Schema::create('gambar_kamars', function (Blueprint $table) {
            $table->increments('id_gambar_kamar');
            $table->integer('id_kamar')->unsigned();
            $table->string('nama_gambar_kamar');
            $table->string('keterangan_gambar_kamar');
            $table->string('file_path_gambar_kamar');
            $table->timestamps();

            $table->foreign('id_kamar')
                    ->references('id_kamar')
                    ->on('kamars')
                    ->onDelete('cascade')
                    ->onUpdate('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('gambar_kamars');
    }
};
