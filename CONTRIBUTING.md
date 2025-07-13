# 🤝 Contributing to LMS System

Thank you for your interest in contributing to the Learning Management System! This document provides guidelines and information for contributors.

## 🚀 Getting Started

### Prerequisites
Before contributing, ensure you have:
- Node.js 18+ and npm
- PHP 8.1+ and Composer
- Git knowledge
- Understanding of Next.js and Laravel

### Development Setup
1. **Fork and Clone**
   ```bash
   git clone https://github.com/your-username/lms-system.git
   cd lms-system
   ```

2. **Setup Development Environment**
   ```bash
   # Run automated setup
   ./setup.sh  # Linux/Mac
   setup.bat   # Windows
   
   # Or manual setup (see README.md)
   ```

3. **Create Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

## 📋 Contribution Guidelines

### Code Style

#### Frontend (Next.js/TypeScript)
- Use TypeScript for all new components
- Follow React functional component patterns
- Use Tailwind CSS for styling
- Implement responsive design (mobile-first)
- Include dark mode support

**Example Component:**
```typescript
interface Props {
  title: string;
  children: React.ReactNode;
}

export function MyComponent({ title, children }: Props) {
  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
        {title}
      </h2>
      <div className="mt-4">{children}</div>
    </div>
  );
}
```

#### Backend (Laravel/PHP)
- Follow PSR-12 coding standards
- Use Eloquent ORM for database operations
- Implement proper validation
- Add appropriate middleware for authorization
- Include comprehensive comments

**Example Controller:**
```php
<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Feature;
use Illuminate\Http\Request;

class FeatureController extends Controller
{
    public function __construct()
    {
        $this->middleware(['auth:sanctum']);
        $this->middleware(['role:admin'])->only(['store', 'update', 'destroy']);
    }

    public function index(Request $request)
    {
        $features = Feature::query()
            ->when($request->search, function ($query, $search) {
                $query->where('title', 'like', "%{$search}%");
            })
            ->paginate($request->get('per_page', 20));

        return response()->json($features);
    }
}
```

### Database Migrations
- Always create reversible migrations
- Use descriptive migration names
- Include proper foreign key constraints
- Add database indexes where appropriate

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('features', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description');
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            
            $table->index(['user_id', 'is_active']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('features');
    }
};
```

## 🧪 Testing Requirements

### Frontend Testing
```bash
# Run tests before submitting
npm run test
npm run type-check
npm run lint
```

### Backend Testing
```bash
# Run Laravel tests
cd laravel-backend
php artisan test
```

**Example Test:**
```php
<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class FeatureTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_create_feature()
    {
        $admin = User::factory()->create();
        $admin->assignRole('admin');

        $response = $this->actingAs($admin, 'sanctum')
            ->postJson('/api/features', [
                'title' => 'Test Feature',
                'description' => 'Test description'
            ]);

        $response->assertStatus(201)
            ->assertJsonStructure(['id', 'title', 'description']);
    }
}
```

## 📝 Pull Request Process

### Before Submitting
1. **Ensure All Tests Pass**
   ```bash
   # Frontend
   npm run test && npm run type-check && npm run lint
   
   # Backend
   cd laravel-backend && php artisan test
   ```

2. **Test Cross-Platform Compatibility**
   - Test on both development environments
   - Verify database migrations work
   - Check environment variable handling

3. **Update Documentation**
   - Update API documentation if adding endpoints
   - Add comments to complex code
   - Update README if needed

### Pull Request Template
```markdown
## Description
Brief description of changes made.

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Frontend tests pass
- [ ] Backend tests pass
- [ ] Cross-browser testing completed
- [ ] Mobile responsiveness verified

## Screenshots (if applicable)
Add screenshots for UI changes.

## Checklist
- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] Tests added/updated
```

## 🎯 Contribution Areas

### High Priority
- 🐛 **Bug Fixes**: Fix existing issues
- 📱 **Mobile Improvements**: Enhance mobile experience
- ♿ **Accessibility**: Improve a11y compliance
- 🧪 **Testing**: Increase test coverage
- 📚 **Documentation**: Improve existing docs

### Medium Priority
- ✨ **New Features**: Add requested functionality
- 🎨 **UI/UX**: Improve user interface
- ⚡ **Performance**: Optimize speed and efficiency
- 🔐 **Security**: Enhance security measures

### Feature Requests
Current roadmap includes:
- Real-time notifications
- Advanced analytics
- File upload system
- Video integration
- Mobile app (React Native)

## 🔍 Code Review Guidelines

### What We Look For
- **Functionality**: Does the code work as intended?
- **Performance**: Is the code efficient?
- **Security**: Are there any security vulnerabilities?
- **Maintainability**: Is the code readable and well-structured?
- **Testing**: Are there adequate tests?

### Review Process
1. Automated checks (GitHub Actions)
2. Manual code review by maintainers
3. Testing on multiple environments
4. Documentation review
5. Final approval and merge

## 🐛 Bug Reports

When reporting bugs, please include:

### Frontend Bugs
- Browser and version
- Screen size and device
- Steps to reproduce
- Expected vs actual behavior
- Console errors (if any)
- Screenshots/video

### Backend Bugs
- PHP version
- Laravel version
- Database type and version
- Error logs
- Request details (method, URL, payload)
- Environment details

**Bug Report Template:**
```markdown
## Bug Description
Clear description of the bug.

## Environment
- OS: [Windows/Mac/Linux]
- Browser: [Chrome/Firefox/Safari] version
- PHP: version
- Database: [MySQL/PostgreSQL] version

## Steps to Reproduce
1. Go to '...'
2. Click on '...'
3. Scroll down to '...'
4. See error

## Expected Behavior
What should happen.

## Actual Behavior
What actually happens.

## Additional Context
Logs, screenshots, etc.
```

## 🎨 Design Guidelines

### UI/UX Principles
- **Consistency**: Follow existing design patterns
- **Accessibility**: WCAG 2.1 AA compliance
- **Responsiveness**: Mobile-first approach
- **Performance**: Optimize for speed
- **Usability**: Intuitive user experience

### Color Palette
```css
/* Light Mode */
--primary: #f97316;     /* Orange */
--background: #ffffff;   /* White */
--foreground: #1f2937;   /* Dark Gray */
--muted: #f3f4f6;       /* Light Gray */

/* Dark Mode */
--primary: #f97316;     /* Orange */
--background: #1f2937;   /* Dark Gray */
--foreground: #f9fafb;   /* Light Gray */
--muted: #374151;       /* Medium Gray */
```

### Typography
- **Headings**: Inter font family
- **Body**: Inter font family
- **Code**: JetBrains Mono

## 📊 Development Workflow

### Branch Naming
- `feature/description` - New features
- `fix/description` - Bug fixes
- `docs/description` - Documentation updates
- `refactor/description` - Code refactoring
- `test/description` - Test additions

### Commit Messages
Follow conventional commit format:
```
type(scope): description

Examples:
feat(auth): add password reset functionality
fix(ui): resolve mobile navigation issue
docs(api): update authentication endpoints
test(user): add user management tests
```

### Release Process
1. Feature development in branches
2. Code review and testing
3. Merge to main branch
4. Version tagging
5. Deployment to staging
6. Production deployment

## 🏆 Recognition

Contributors will be:
- Listed in the project README
- Mentioned in release notes
- Invited to become maintainers (for significant contributions)

## 📞 Getting Help

- **Questions**: Create a GitHub discussion
- **Issues**: Open a GitHub issue
- **Chat**: Join our Discord server (if available)
- **Email**: Contact maintainers directly

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to the LMS System! Every contribution, no matter how small, helps make this project better for everyone. 🙏