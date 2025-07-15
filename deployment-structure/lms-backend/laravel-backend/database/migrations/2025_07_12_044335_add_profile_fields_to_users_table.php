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
        Schema::table('users', function (Blueprint $table) {
            $table->text('bio')->nullable()->after('this_week_hours');
            $table->string('phone')->nullable()->after('bio');
            $table->string('location')->nullable()->after('phone');
            $table->text('skills')->nullable()->after('location');
            $table->text('interests')->nullable()->after('skills');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'bio',
                'phone',
                'location',
                'skills',
                'interests'
            ]);
        });
    }
};
