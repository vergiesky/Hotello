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
        Schema::create('wishlists', function (Blueprint $table) {
            $table->increments('id_wishlist');
            $table->integer('id_user')->unsigned();
            $table->integer('id_hotel')->unsigned();
            $table->unique(['id_user', 'id_hotel'], 'wishlists_user_hotel_unique');
            $table->timestamps();

            $table->foreign('id_user')
                    ->references('id_user')
                    ->on('users')
                    ->onDelete('cascade')
                    ->onUpdate('cascade');

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
        Schema::dropIfExists('wishlists');
    }
};
