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
            $table->string('first_name')->after('id');
            $table->string('last_name')->after('first_name');
            $table->string('profile_image')->nullable()->after('password');
            $table->date('joined_date')->default(now())->after('profile_image');
            $table->integer('completed_topics')->default(0)->after('joined_date');
            $table->integer('total_topics')->default(0)->after('completed_topics');
            $table->integer('weekly_hours')->default(0)->after('total_topics');
            $table->integer('this_week_hours')->default(0)->after('weekly_hours');

            // Remove the name column since we're using first_name and last_name
            $table->dropColumn('name');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'first_name',
                'last_name',
                'profile_image',
                'joined_date',
                'completed_topics',
                'total_topics',
                'weekly_hours',
                'this_week_hours'
            ]);

            // Add back the name column
            $table->string('name')->after('id');
        });
    }
};
