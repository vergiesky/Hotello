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
        Schema::create('fasilitas_hotels', function (Blueprint $table) {
            $table->increments('id_fasilitas_hotel');
            $table->integer('id_hotel')->unsigned();
            $table->integer('id_icon')->unsigned();
            $table->string('nama_fasilitas');
            $table->text('keterangan_fasilitas_hotel');
            $table->timestamps();

            $table->foreign('id_hotel')
                    ->references('id_hotel')
                    ->on('hotels')
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
        Schema::dropIfExists('fasilitas_hotels');
    }
};
