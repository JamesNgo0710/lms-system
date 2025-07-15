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
        Schema::create('community_comments', function (Blueprint $table) {
            $table->id();
            $table->text('content');
            $table->foreignId('author_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('post_id')->constrained('community_posts')->onDelete('cascade');
            $table->foreignId('parent_id')->nullable()->constrained('community_comments')->onDelete('cascade');
            $table->boolean('is_hidden')->default(false);
            $table->integer('vote_count')->default(0);
            $table->integer('depth')->default(0);
            $table->timestamps();

            $table->index(['post_id', 'parent_id', 'created_at']);
            $table->index(['author_id', 'created_at']);
            $table->index(['is_hidden', 'created_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('community_comments');
    }
};
