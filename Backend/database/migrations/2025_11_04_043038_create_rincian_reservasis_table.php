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
        Schema::create('rincian_reservasis', function (Blueprint $table) {
            $table->increments('id_rincian_reservasi');
            $table->integer('id_reservasi')->unsigned();
            $table->integer('id_kamar')->unsigned();
            $table->integer('jumlah_kamar');
            $table->decimal('sub_total', 12, 2);
            $table->timestamps();

            $table->foreign('id_reservasi')
                    ->references('id_reservasi')
                    ->on('reservasis')
                    ->onDelete('cascade')
                    ->onUpdate('cascade');

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
        Schema::dropIfExists('rincian_reservasis');
    }
};
