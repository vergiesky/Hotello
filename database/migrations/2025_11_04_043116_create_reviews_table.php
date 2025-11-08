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
        Schema::create('reviews', function (Blueprint $table) {
            $table->increments('id_review');
            $table->integer('id_pembayaran')->unsigned();
            $table->integer('id_user')->unsigned();
            $table->integer('id_kamar')->unsigned();
            $table->text('komentar');
            $table->decimal('rating', 3, 2);
            $table->string('file_path_review')->nullable();
            $table->date('tanggal_review');
            $table->timestamps();

            $table->foreign('id_pembayaran')
                    ->references('id_pembayaran')
                    ->on('pembayarans')
                    ->onDelete('cascade')
                    ->onUpdate('cascade');

            $table->foreign('id_user')
                    ->references('id_user')
                    ->on('users')
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
        Schema::dropIfExists('reviews');
    }
};
