const fs = require('fs');
const path = require('path');

// List of all API route files to fix
const apiRoutes = [
  'app/api/users/route.ts',
  'app/api/users/[id]/route.ts',
  'app/api/users/[id]/password/route.ts',
  'app/api/topics/[id]/route.ts',
  'app/api/topics/[id]/assessment/route.ts',
  'app/api/topics/[id]/lessons/route.ts',
  'app/api/lessons/route.ts',
  'app/api/lessons/[id]/route.ts',
  'app/api/assessments/route.ts',
  'app/api/lessons/[id]/complete/route.ts',
  'app/api/lessons/[id]/view/route.ts',
  'app/api/assessments/[id]/route.ts',
  'app/api/assessments/[id]/submit/route.ts',
  'app/api/assessments/[id]/attempts/route.ts',
  'app/api/users/[id]/lesson-completions/route.ts',
  'app/api/users/[id]/lesson-views/route.ts',
  'app/api/users/[id]/assessment-attempts/route.ts',
  'app/api/users/[id]/topics/[topicId]/progress/route.ts',
];

// Function to fix a single API route file
function fixApiRoute(filePath) {
  const fullPath = path.join(__dirname, '..', filePath);
  
  if (!fs.existsSync(fullPath)) {
    console.log(`File not found: ${filePath}`);
    return;
  }
  
  let content = fs.readFileSync(fullPath, 'utf-8');
  let modified = false;
  
  // Add import for api-url-utils if not present
  if (!content.includes('api-url-utils')) {
    const importLine = "import { createApiEndpoint, createApiHeaders } from '@/lib/api-url-utils'";
    if (content.includes("import { authOptions }")) {
      content = content.replace(
        "import { authOptions }",
        `import { authOptions }`
      );
      content = content.replace(
        "import { authOptions } from '@/app/api/auth/[...nextauth]/route'",
        `import { authOptions } from '@/app/api/auth/[...nextauth]/route'\n${importLine}`
      );
      modified = true;
    }
  }
  
  // Remove old URL constants
  const urlConstants = [
    'const LARAVEL_BASE_URL = process.env.LARAVEL_BASE_URL || \'http://localhost:8000\'',
    'const LARAVEL_API_URL = process.env.LARAVEL_API_URL || \'http://localhost:8000/api\'',
    'const API_URL = process.env.NEXT_PUBLIC_API_URL || process.env.API_URL || \'http://localhost:8000\'',
  ];
  
  urlConstants.forEach(constant => {
    if (content.includes(constant)) {
      content = content.replace(constant, '');
      modified = true;
    }
  });
  
  // Replace fetch calls with createApiEndpoint
  const fetchPatterns = [
    /await fetch\(`\${LARAVEL_BASE_URL}\/api\/([^`]+)`/g,
    /await fetch\(`\${LARAVEL_API_URL}\/([^`]+)`/g,
    /await fetch\(`\${API_URL}\/api\/([^`]+)`/g,
  ];
  
  fetchPatterns.forEach(pattern => {
    content = content.replace(pattern, (match, endpoint) => {
      modified = true;
      return `await fetch(createApiEndpoint('/${endpoint}')`;
    });
  });
  
  // Replace manual headers with createApiHeaders
  const headerPatterns = [
    /headers:\s*{\s*'Authorization':\s*`Bearer \$\{session\.user\.laravelToken\}`,[^}]+}/g,
    /headers:\s*{\s*'Authorization':\s*`Bearer \$\{session\.accessToken\}`,[^}]+}/g,
    /headers:\s*{\s*'Authorization':\s*`Bearer \$\{.*?accessToken\}`,[^}]+}/g,
  ];
  
  headerPatterns.forEach(pattern => {
    content = content.replace(pattern, (match) => {
      modified = true;
      return 'headers: createApiHeaders(session)';
    });
  });
  
  // Clean up any double newlines
  content = content.replace(/\n\n\n+/g, '\n\n');
  
  if (modified) {
    fs.writeFileSync(fullPath, content);
    console.log(`Fixed: ${filePath}`);
  } else {
    console.log(`No changes needed: ${filePath}`);
  }
}

// Fix all API routes
console.log('Fixing API routes...');
apiRoutes.forEach(fixApiRoute);
console.log('Done!');