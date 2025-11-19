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
        Schema::create('kamars', function (Blueprint $table) {
            $table->increments('id_kamar');
            $table->integer('id_hotel')->unsigned();
            $table->string('nama_kamar');
            $table->string('nomor_kamar');
            $table->string('tipe_kamar');
            $table->decimal('harga', 12, 2);
            $table->boolean('status_kamar')->default(true);
            $table->string('lantai');
            $table->integer('kapasitas');
            $table->integer('stok_kamar');
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
        Schema::dropIfExists('kamars');
    }
};
