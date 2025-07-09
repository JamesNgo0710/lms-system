<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    public function index()
    {
        return User::with('roles')->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
            'role' => 'required|in:admin,teacher,student',
        ]);

        $user = User::create([
            'first_name' => $validated['first_name'],
            'last_name' => $validated['last_name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
        ]);

        $user->assignRole($validated['role']);

        return response()->json($user->load('roles'), 201);
    }

    public function show(User $user)
    {
        // Users can only view their own profile unless they're admin
        if (auth()->user()->id !== $user->id && !auth()->user()->hasRole('admin')) {
            abort(403);
        }

        return $user->load('roles');
    }

    public function update(Request $request, User $user)
    {
        // Users can only update their own profile unless they're admin
        if (auth()->user()->id !== $user->id && !auth()->user()->hasRole('admin')) {
            abort(403);
        }

        $validated = $request->validate([
            'first_name' => 'sometimes|string|max:255',
            'last_name' => 'sometimes|string|max:255',
            'email' => 'sometimes|string|email|max:255|unique:users,email,' . $user->id,
            'profile_image' => 'sometimes|string|nullable',
        ]);

        $user->update($validated);

        // Update role if admin
        if ($request->has('role') && auth()->user()->hasRole('admin')) {
            $user->syncRoles([$request->role]);
        }

        return $user->load('roles');
    }

    public function destroy(User $user)
    {
        $user->delete();
        return response()->json(['message' => 'User deleted successfully']);
    }

    public function updatePassword(Request $request, User $user)
    {
        // Only admins can change other users' passwords
        if (auth()->user()->id !== $user->id && !auth()->user()->hasRole('admin')) {
            abort(403);
        }

        $validated = $request->validate([
            'password' => 'required|string|min:8|confirmed',
        ]);

        $user->update([
            'password' => Hash::make($validated['password']),
        ]);

        return response()->json(['message' => 'Password updated successfully']);
    }
}
