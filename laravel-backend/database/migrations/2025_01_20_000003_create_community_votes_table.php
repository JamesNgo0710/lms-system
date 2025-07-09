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
        Schema::create('community_votes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->morphs('voteable'); // voteable_type and voteable_id for posts/comments
            $table->tinyInteger('vote_type'); // 1 for upvote, -1 for downvote
            $table->timestamps();

            $table->unique(['user_id', 'voteable_type', 'voteable_id']);
            $table->index(['voteable_type', 'voteable_id', 'vote_type']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('community_votes');
    }
};
