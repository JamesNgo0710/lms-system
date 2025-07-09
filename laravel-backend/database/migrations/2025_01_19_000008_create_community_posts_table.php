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
        Schema::create('community_posts', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->longText('content');
            $table->foreignId('author_id')->constrained('users')->onDelete('cascade');
            $table->string('category');
            $table->json('tags')->nullable(); // array of strings
            $table->integer('views')->default(0);
            $table->integer('likes')->default(0);
            $table->boolean('is_answered')->default(false);
            $table->boolean('is_pinned')->default(false);
            $table->enum('status', ['active', 'closed', 'archived'])->default('active');
            $table->integer('reply_count')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('community_posts');
    }
};
