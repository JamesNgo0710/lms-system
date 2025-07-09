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
        Schema::create('topics', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('category');
            $table->enum('status', ['Published', 'Draft'])->default('Draft');
            $table->integer('students')->default(0);
            $table->integer('lessons')->default(0);
            $table->boolean('has_assessment')->default(false);
            $table->enum('difficulty', ['Beginner', 'Intermediate', 'Advanced'])->default('Beginner');
            $table->text('description')->nullable();
            $table->string('image')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('topics');
    }
};
