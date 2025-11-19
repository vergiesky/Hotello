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
        Schema::create('reservasis', function (Blueprint $table) {
            $table->increments('id_reservasi');
            $table->integer('id_user')->unsigned();
            $table->dateTime('check_in');
            $table->dateTime('check_out');
            $table->integer('jumlah_tamu');
            $table->decimal('total_biaya', 12, 2);
            $table->string('status_reservasi');
            $table->timestamps();

            $table->foreign('id_user')
                    ->references('id_user')
                    ->on('users')
                    ->onDelete('cascade')
                    ->onUpdate('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reservasis');
    }
};
