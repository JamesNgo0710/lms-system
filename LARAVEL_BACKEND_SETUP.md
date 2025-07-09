# Laravel Backend Setup Guide for LMS System

## Prerequisites
- PHP 8.1+
- Composer
- MySQL/PostgreSQL
- Node.js & NPM

## Step 1: Create Laravel Project

```bash
# Create new Laravel project
composer create-project laravel/laravel lms-backend

# Navigate to project directory
cd lms-backend
```

## Step 2: Install Required Packages

```bash
# Install Sanctum for API authentication
composer require laravel/sanctum

# Install Spatie Laravel Permission
composer require spatie/laravel-permission

# Install CORS package for cross-origin requests
composer require fruitcake/laravel-cors
```

## Step 3: Configure Database

Edit `.env` file:
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=lms_system
DB_USERNAME=your_username
DB_PASSWORD=your_password

# Add Sanctum stateful domains
SANCTUM_STATEFUL_DOMAINS=localhost:3000,127.0.0.1:3000
SESSION_DOMAIN=localhost
```

## Step 4: Publish Configuration Files

```bash
# Publish Sanctum config
php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"

# Publish Spatie Permission config
php artisan vendor:publish --provider="Spatie\Permission\PermissionServiceProvider"

# Publish CORS config
php artisan vendor:publish --tag="cors"
```

## Step 5: Configure Sanctum

### Update `config/sanctum.php`:
```php
'stateful' => explode(',', env('SANCTUM_STATEFUL_DOMAINS', sprintf(
    '%s%s',
    'localhost,localhost:3000,127.0.0.1,127.0.0.1:8000,::1',
    env('APP_URL') ? ','.parse_url(env('APP_URL'), PHP_URL_HOST) : ''
))),
```

### Update `config/cors.php`:
```php
'paths' => ['api/*', 'sanctum/csrf-cookie'],
'allowed_methods' => ['*'],
'allowed_origins' => ['http://localhost:3000'],
'allowed_origins_patterns' => [],
'allowed_headers' => ['*'],
'exposed_headers' => [],
'max_age' => 0,
'supports_credentials' => true,
```

## Step 6: Update Kernel Middleware

### Update `app/Http/Kernel.php`:
```php
protected $middlewareGroups = [
    'web' => [
        // ... existing middleware
        \Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful::class,
    ],

    'api' => [
        \Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful::class,
        'throttle:api',
        \Illuminate\Routing\Middleware\SubstituteBindings::class,
    ],
];
```

## Step 7: Create User Model with Roles

### Update `app/Models/User.php`:
```php
<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable, HasRoles;

    protected $fillable = [
        'first_name',
        'last_name',
        'email',
        'password',
        'profile_image',
        'joined_date',
        'completed_topics',
        'total_topics',
        'weekly_hours',
        'this_week_hours',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'joined_date' => 'date',
    ];

    protected $appends = ['name', 'role'];

    public function getNameAttribute()
    {
        return $this->first_name . ' ' . $this->last_name;
    }

    public function getRoleAttribute()
    {
        return $this->roles->first()?->name ?? 'student';
    }
}
```

## Step 8: Create Migration for Users Table

Create migration:
```bash
php artisan make:migration update_users_table_for_lms
```

### Migration file:
```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
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
        });
    }

    public function down()
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
        });
    }
};
```

## Step 9: Create Authentication Controller

```bash
php artisan make:controller Api/AuthController
```

### `app/Http/Controllers/Api/AuthController.php`:
```php
<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        if (! $user || ! Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        return response()->json([
            'user' => $user->load('roles'),
            'token' => $user->createToken('auth-token')->plainTextToken,
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Logged out successfully']);
    }

    public function user(Request $request)
    {
        return response()->json($request->user()->load('roles'));
    }
}
```

## Step 10: Create User Management Controller

```bash
php artisan make:controller Api/UserController --resource
```

### `app/Http/Controllers/Api/UserController.php`:
```php
<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    public function __construct()
    {
        $this->middleware(['auth:sanctum']);
        $this->middleware(['role:admin'])->except(['show', 'update']);
    }

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
```

## Step 11: Define API Routes

### Update `routes/api.php`:
```php
<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\UserController;

// Public routes
Route::post('/login', [AuthController::class, 'login']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', [AuthController::class, 'user']);
    Route::post('/logout', [AuthController::class, 'logout']);
    
    // User management
    Route::apiResource('users', UserController::class);
    Route::put('/users/{user}/password', [UserController::class, 'updatePassword']);
});
```

## Step 12: Create Database Seeder

### Update `database/seeders/DatabaseSeeder.php`:
```php
<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Spatie\Permission\Models\Role;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run()
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
```

## Step 13: Run Migrations and Seeders

```bash
# Run migrations
php artisan migrate

# Run seeders
php artisan db:seed

# Start Laravel development server
php artisan serve
```

## Step 14: Test API Endpoints

### Login Request:
```bash
curl -X POST http://localhost:8000/api/login \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{"email": "admin@lms.com", "password": "admin123"}'
```

### Get User:
```bash
curl -X GET http://localhost:8000/api/user \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Accept: application/json"
```

## Additional Considerations

1. **HTTPS in Production**: Ensure you use HTTPS in production
2. **Environment Variables**: Update `.env` for production
3. **CORS Configuration**: Update allowed origins for production
4. **Rate Limiting**: Configure appropriate rate limits
5. **API Documentation**: Consider using Laravel Scribe or similar for API docs

## Next Steps

1. Set up additional API endpoints for topics, lessons, assessments
2. Implement file upload endpoints for profile images
3. Add WebSocket support for real-time features
4. Set up queue workers for background jobs
5. Configure email notifications 