<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Spatie\Permission\Models\Role;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create roles
        Role::create(['name' => 'admin']);
        Role::create(['name' => 'teacher']);
        Role::create(['name' => 'student']);

        // Create admin user
        $admin = User::create([
            'first_name' => 'Admin',
            'last_name' => 'User',
            'email' => 'admin@lms.com',
            'password' => Hash::make('admin123'),
        ]);
        $admin->assignRole('admin');

        // Create teacher user
        $teacher = User::create([
            'first_name' => 'Teacher',
            'last_name' => 'User',
            'email' => 'teacher@lms.com',
            'password' => Hash::make('teacher123'),
        ]);
        $teacher->assignRole('teacher');

        // Create student user
        $student = User::create([
            'first_name' => 'Student',
            'last_name' => 'User',
            'email' => 'student@lms.com',
            'password' => Hash::make('student123'),
        ]);
        $student->assignRole('student');
    }
}
