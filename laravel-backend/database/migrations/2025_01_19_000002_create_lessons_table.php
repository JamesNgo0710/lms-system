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
        Schema::create('lessons', function (Blueprint $table) {
            $table->id();
            $table->foreignId('topic_id')->constrained()->onDelete('cascade');
            $table->string('title');
            $table->text('description');
            $table->string('duration');
            $table->enum('difficulty', ['Beginner', 'Intermediate', 'Advanced'])->default('Beginner');
            $table->string('video_url')->nullable();
            $table->json('prerequisites')->nullable(); // array of strings
            $table->longText('content');
            $table->json('social_links')->nullable(); // object with twitter, discord, youtube, instagram
            $table->json('downloads')->nullable(); // array of download objects
            $table->integer('order')->default(0);
            $table->enum('status', ['Published', 'Draft'])->default('Draft');
            $table->string('image')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('lessons');
    }
};
