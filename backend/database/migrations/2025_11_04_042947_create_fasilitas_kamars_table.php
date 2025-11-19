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
        Schema::create('fasilitas_kamars', function (Blueprint $table) {
            $table->increments('id_fasilitas_kamar');
            $table->integer('id_kamar')->unsigned();
            $table->integer('id_icon')->unsigned();
            $table->string('nama_fasilitas_kamar');
            $table->string('keterangan_fasilitas_kamar');
            $table->timestamps();

            $table->foreign('id_kamar')
                    ->references('id_kamar')
                    ->on('kamars')
                    ->onDelete('cascade')
                    ->onUpdate('cascade');

            $table->foreign('id_icon')
                    ->references('id_icon')
                    ->on('icons')
                    ->onDelete('cascade')
                    ->onUpdate('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('fasilitas_kamars');
    }
};
