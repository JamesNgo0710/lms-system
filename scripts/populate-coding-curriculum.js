const fs = require('fs');
const path = require('path');

// Get the API URL from environment or use default
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://learning-management-system-master-zcttuk.laravel.cloud';

// Admin credentials for authentication (try multiple possible admin accounts)
const ADMIN_ACCOUNTS = [
  { email: 'admin@example.com', password: 'password123' },
  { email: 'admin@admin.com', password: 'password' },
  { email: 'admin@test.com', password: 'admin123' },
  { email: 'test@example.com', password: 'password' }
];

let authToken = null;

// Utility functions
function log(message) {
  console.log(`[${new Date().toISOString()}] ${message}`);
}

function warn(message) {
  console.warn(`[${new Date().toISOString()}] WARNING: ${message}`);
}

function error(message) {
  console.error(`[${new Date().toISOString()}] ERROR: ${message}`);
}

// Authentication function
async function authenticate() {
  log('Authenticating with backend...');
  
  for (const account of ADMIN_ACCOUNTS) {
    try {
      log(`Trying to authenticate with ${account.email}...`);
      const response = await fetch(`${API_URL}/api/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          email: account.email,
          password: account.password,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        authToken = data.token;
        log(`✅ Authentication successful with ${account.email}`);
        return true;
      } else {
        const errorData = await response.json().catch(() => ({}));
        log(`❌ Authentication failed for ${account.email}: ${response.status} - ${errorData.message || 'Unknown error'}`);
      }
    } catch (err) {
      log(`❌ Network error for ${account.email}: ${err.message}`);
    }
  }
  
  error('❌ All authentication attempts failed');
  
  // Try to create a default admin account
  log('🔄 Attempting to create default admin account...');
  try {
    await createDefaultAdmin();
    return await authenticate(); // Try again after creating admin
  } catch (err) {
    error(`Failed to create default admin: ${err.message}`);
    return false;
  }
}

// Create default admin account
async function createDefaultAdmin() {
  const adminData = {
    first_name: 'Admin',
    last_name: 'User',
    email: 'admin@example.com',
    password: 'password123',
    role: 'admin'
  };
  
  try {
    const response = await fetch(`${API_URL}/api/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(adminData),
    });
    
    if (response.ok) {
      log('✅ Default admin account created successfully');
    } else {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Registration failed: ${response.status} - ${errorData.message || 'Unknown error'}`);
    }
  } catch (err) {
    throw new Error(`Failed to create admin account: ${err.message}`);
  }
}

// API request helper
async function makeApiRequest(endpoint, options = {}) {
  const url = `${API_URL}/api${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...options.headers,
  };

  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API request failed: ${response.status} - ${errorText}`);
  }

  return response.json();
}

// Coding curriculum data
const codingTopics = [
  {
    title: "Introduction to Programming",
    category: "Fundamentals",
    status: "Published",
    difficulty: "Beginner",
    description: "Learn the basic concepts of programming, including variables, data types, and basic logic. Perfect for complete beginners who have never written code before.",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=450&fit=crop",
    hasAssessment: true,
    lessons: [
      {
        title: "What is Programming?",
        description: "Understanding what programming is and why it's important in today's world.",
        duration: "15 min",
        difficulty: "Beginner",
        content: `# What is Programming?

Programming is the process of creating instructions for computers to follow. Think of it like writing a recipe - you're telling the computer exactly what steps to take to solve a problem or complete a task.

## Key Concepts:
- **Algorithm**: A step-by-step solution to a problem
- **Code**: Instructions written in a programming language
- **Bug**: An error in the code
- **Debug**: Finding and fixing errors

## Why Learn Programming?
- **Problem Solving**: Programming teaches you to break down complex problems
- **Career Opportunities**: High demand for programmers across all industries
- **Creativity**: Build websites, apps, games, and more
- **Logical Thinking**: Improves analytical and logical reasoning skills

## Programming in Daily Life:
Programming is everywhere! From your smartphone apps to websites, from cars to smart home devices - everything runs on code.`,
        videoUrl: "https://www.youtube.com/embed/zOjov-2OZ0E",
        order: 1,
        image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=450&fit=crop"
      },
      {
        title: "Setting Up Your Development Environment",
        description: "Learn how to set up the tools you need to start coding.",
        duration: "20 min",
        difficulty: "Beginner",
        content: `# Setting Up Your Development Environment

Before you can start coding, you need the right tools. Think of this like setting up a workshop before building something.

## Essential Tools:

### 1. Code Editor
A code editor is where you'll write your code. Popular options:
- **Visual Studio Code** (Recommended for beginners)
- **Sublime Text**
- **Atom**

### 2. Web Browser
For web development, you'll need a modern browser:
- **Google Chrome** (Recommended)
- **Firefox**
- **Safari**

### 3. Terminal/Command Line
A text-based interface to interact with your computer:
- **Command Prompt** (Windows)
- **Terminal** (Mac/Linux)

## Installation Steps:
1. Download and install Visual Studio Code
2. Install useful extensions (HTML, CSS, JavaScript)
3. Create your first project folder
4. Write your first "Hello World" program

## File Organization:
- Create a dedicated folder for your projects
- Use meaningful names for your files
- Keep related files together`,
        order: 2,
        image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=450&fit=crop"
      },
      {
        title: "Variables and Data Types",
        description: "Understanding how to store and work with different types of data.",
        duration: "25 min",
        difficulty: "Beginner",
        content: `# Variables and Data Types

Variables are like containers that store data. Imagine them as labeled boxes where you can put different things.

## What is a Variable?
A variable is a named storage location that can hold a value. The value can change during program execution.

\`\`\`javascript
let name = "John";
let age = 25;
let isStudent = true;
\`\`\`

## Common Data Types:

### 1. Numbers
- **Integers**: Whole numbers (1, 2, 100, -5)
- **Decimals**: Numbers with decimal points (3.14, -2.5)

\`\`\`javascript
let score = 95;
let price = 29.99;
\`\`\`

### 2. Strings
Text data enclosed in quotes:

\`\`\`javascript
let firstName = "Alice";
let message = 'Hello World!';
let template = \`Welcome, \${firstName}!\`;
\`\`\`

### 3. Booleans
True or false values:

\`\`\`javascript
let isLoggedIn = true;
let hasPermission = false;
\`\`\`

### 4. Arrays
Lists of values:

\`\`\`javascript
let colors = ["red", "green", "blue"];
let numbers = [1, 2, 3, 4, 5];
\`\`\`

## Variable Naming Rules:
- Use descriptive names
- Start with a letter or underscore
- No spaces (use camelCase or snake_case)
- Avoid reserved keywords`,
        order: 3,
        image: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=800&h=450&fit=crop"
      }
    ],
    assessment: {
      totalQuestions: 5,
      timeLimit: "10 minutes",
      retakePeriod: "24 hours",
      cooldownPeriod: 1,
      questions: [
        {
          type: "multiple-choice",
          question: "What is programming?",
          options: [
            "Writing emails to computers",
            "Creating instructions for computers to follow",
            "Fixing broken computers",
            "Designing computer hardware"
          ],
          correctAnswer: 1
        },
        {
          type: "multiple-choice",
          question: "Which of these is a code editor?",
          options: [
            "Microsoft Word",
            "Google Chrome",
            "Visual Studio Code",
            "Adobe Photoshop"
          ],
          correctAnswer: 2
        },
        {
          type: "true-false",
          question: "Variables can store different types of data.",
          correctAnswer: "true"
        },
        {
          type: "multiple-choice",
          question: "Which data type represents true/false values?",
          options: ["String", "Number", "Boolean", "Array"],
          correctAnswer: 2
        },
        {
          type: "multiple-choice",
          question: "What is the correct way to create a variable in JavaScript?",
          options: [
            "variable name = value;",
            "let name = value;",
            "create name = value;",
            "new name = value;"
          ],
          correctAnswer: 1
        }
      ]
    }
  },
  {
    title: "HTML & CSS Fundamentals",
    category: "Web Development",
    status: "Published",
    difficulty: "Beginner",
    description: "Learn to create beautiful web pages with HTML structure and CSS styling. Build your first websites from scratch.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=450&fit=crop",
    hasAssessment: true,
    lessons: [
      {
        title: "HTML Basics",
        description: "Learn the building blocks of web pages with HTML elements and structure.",
        duration: "30 min",
        difficulty: "Beginner",
        content: `# HTML Basics

HTML (HyperText Markup Language) is the foundation of all web pages. It provides the structure and content.

## What is HTML?
HTML uses "tags" to mark up content and tell the browser how to display it.

\`\`\`html
<!DOCTYPE html>
<html>
<head>
    <title>My First Web Page</title>
</head>
<body>
    <h1>Welcome to My Website</h1>
    <p>This is my first paragraph.</p>
</body>
</html>
\`\`\`

## Common HTML Elements:

### Headings
\`\`\`html
<h1>Main Title</h1>
<h2>Subtitle</h2>
<h3>Section Title</h3>
\`\`\`

### Paragraphs and Text
\`\`\`html
<p>This is a paragraph of text.</p>
<strong>Bold text</strong>
<em>Italic text</em>
\`\`\`

### Lists
\`\`\`html
<ul>
    <li>First item</li>
    <li>Second item</li>
</ul>

<ol>
    <li>First step</li>
    <li>Second step</li>
</ol>
\`\`\`

### Links and Images
\`\`\`html
<a href="https://google.com">Visit Google</a>
<img src="image.jpg" alt="Description">
\`\`\`

## HTML Structure:
- Every HTML document starts with \`<!DOCTYPE html>\`
- Content goes inside the \`<body>\` tag
- Metadata goes in the \`<head>\` tag
- Tags usually come in pairs: opening and closing`,
        order: 1,
        image: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=800&h=450&fit=crop"
      },
      {
        title: "CSS Styling",
        description: "Make your web pages beautiful with CSS styles, colors, and layouts.",
        duration: "35 min",
        difficulty: "Beginner",
        content: `# CSS Styling

CSS (Cascading Style Sheets) makes your web pages look beautiful. While HTML provides structure, CSS provides the visual design.

## What is CSS?
CSS consists of rules that select HTML elements and apply styles to them.

\`\`\`css
h1 {
    color: blue;
    font-size: 2em;
    text-align: center;
}
\`\`\`

## CSS Syntax:
- **Selector**: Which element to style (h1, p, .class, #id)
- **Property**: What to change (color, font-size, margin)
- **Value**: How to change it (blue, 16px, 10px)

## Common CSS Properties:

### Colors and Text
\`\`\`css
.title {
    color: #333333;
    background-color: lightblue;
    font-family: Arial, sans-serif;
    font-size: 18px;
    font-weight: bold;
    text-align: center;
}
\`\`\`

### Spacing and Layout
\`\`\`css
.container {
    margin: 20px;
    padding: 15px;
    border: 1px solid black;
    width: 300px;
    height: 200px;
}
\`\`\`

### Positioning
\`\`\`css
.sidebar {
    position: relative;
    float: left;
    display: block;
}
\`\`\`

## Adding CSS to HTML:

### Inline CSS
\`\`\`html
<p style="color: red;">Red text</p>
\`\`\`

### Internal CSS
\`\`\`html
<head>
    <style>
        p { color: blue; }
    </style>
</head>
\`\`\`

### External CSS
\`\`\`html
<head>
    <link rel="stylesheet" href="styles.css">
</head>
\`\`\`

## CSS Selectors:
- **Element**: \`p\` selects all paragraphs
- **Class**: \`.highlight\` selects elements with class="highlight"
- **ID**: \`#header\` selects element with id="header"`,
        order: 2,
        image: "https://images.unsplash.com/photo-1523437113738-bbd3cc89fb19?w=800&h=450&fit=crop"
      },
      {
        title: "Building Your First Website",
        description: "Put it all together and create a complete website with multiple pages.",
        duration: "45 min",
        difficulty: "Beginner",
        content: `# Building Your First Website

Now let's combine HTML and CSS to build a complete website with multiple pages and professional styling.

## Project: Personal Portfolio Website

We'll create a personal portfolio with:
- Home page
- About page
- Contact page
- Navigation menu
- Responsive design

## File Structure:
\`\`\`
my-website/
├── index.html
├── about.html
├── contact.html
├── css/
│   └── styles.css
└── images/
    └── profile.jpg
\`\`\`

## HTML Template (index.html):
\`\`\`html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>John Doe - Portfolio</title>
    <link rel="stylesheet" href="css/styles.css">
</head>
<body>
    <header>
        <nav>
            <ul>
                <li><a href="index.html">Home</a></li>
                <li><a href="about.html">About</a></li>
                <li><a href="contact.html">Contact</a></li>
            </ul>
        </nav>
    </header>
    
    <main>
        <section class="hero">
            <h1>Welcome to My Portfolio</h1>
            <p>I'm a web developer passionate about creating amazing websites.</p>
        </section>
        
        <section class="projects">
            <h2>My Projects</h2>
            <div class="project-card">
                <h3>Project 1</h3>
                <p>Description of my first project.</p>
            </div>
        </section>
    </main>
    
    <footer>
        <p>&copy; 2024 John Doe. All rights reserved.</p>
    </footer>
</body>
</html>
\`\`\`

## CSS Styling (styles.css):
\`\`\`css
/* Reset and base styles */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: Arial, sans-serif;
    line-height: 1.6;
    color: #333;
}

/* Header and Navigation */
header {
    background-color: #2c3e50;
    color: white;
    padding: 1rem 0;
}

nav ul {
    list-style: none;
    display: flex;
    justify-content: center;
}

nav li {
    margin: 0 1rem;
}

nav a {
    color: white;
    text-decoration: none;
    font-weight: bold;
}

nav a:hover {
    color: #3498db;
}

/* Main content */
main {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
}

.hero {
    text-align: center;
    padding: 3rem 0;
    background-color: #ecf0f1;
    margin-bottom: 2rem;
}

.hero h1 {
    font-size: 2.5rem;
    margin-bottom: 1rem;
    color: #2c3e50;
}

/* Project cards */
.project-card {
    background-color: white;
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 1.5rem;
    margin-bottom: 1rem;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

/* Footer */
footer {
    background-color: #34495e;
    color: white;
    text-align: center;
    padding: 1rem 0;
    margin-top: 2rem;
}

/* Responsive design */
@media (max-width: 768px) {
    nav ul {
        flex-direction: column;
        align-items: center;
    }
    
    .hero h1 {
        font-size: 2rem;
    }
}
\`\`\`

## Best Practices:
1. **Semantic HTML**: Use appropriate tags for content
2. **Organized CSS**: Group related styles together
3. **Responsive Design**: Make it work on all devices
4. **Clean Code**: Use proper indentation and comments
5. **Accessibility**: Include alt text for images, proper headings

## Testing Your Website:
1. Open HTML files in different browsers
2. Test on mobile devices
3. Validate your HTML and CSS
4. Check loading speed
5. Ensure all links work`,
        order: 3,
        image: "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=800&h=450&fit=crop"
      }
    ],
    assessment: {
      totalQuestions: 6,
      timeLimit: "15 minutes",
      retakePeriod: "24 hours",
      cooldownPeriod: 1,
      questions: [
        {
          type: "multiple-choice",
          question: "What does HTML stand for?",
          options: [
            "High Tech Markup Language",
            "HyperText Markup Language",
            "Home Tool Markup Language",
            "Hyperlink Text Markup Language"
          ],
          correctAnswer: 1
        },
        {
          type: "multiple-choice",
          question: "Which tag is used for the largest heading?",
          options: ["<h6>", "<h3>", "<h1>", "<header>"],
          correctAnswer: 2
        },
        {
          type: "multiple-choice",
          question: "What does CSS stand for?",
          options: [
            "Creative Style Sheets",
            "Cascading Style Sheets",
            "Computer Style Sheets",
            "Colorful Style Sheets"
          ],
          correctAnswer: 1
        },
        {
          type: "true-false",
          question: "CSS can only be written inside HTML files.",
          correctAnswer: "false"
        },
        {
          type: "multiple-choice",
          question: "Which CSS property is used to change text color?",
          options: ["text-color", "color", "font-color", "background-color"],
          correctAnswer: 1
        },
        {
          type: "multiple-choice",
          question: "What is the correct HTML tag for creating a hyperlink?",
          options: ["<link>", "<href>", "<a>", "<url>"],
          correctAnswer: 2
        }
      ]
    }
  },
  {
    title: "JavaScript Programming",
    category: "Programming Languages",
    status: "Published",
    difficulty: "Intermediate",
    description: "Master JavaScript programming with functions, objects, DOM manipulation, and modern ES6+ features. Build interactive web applications.",
    image: "https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=800&h=450&fit=crop",
    hasAssessment: true,
    lessons: [
      {
        title: "JavaScript Fundamentals",
        description: "Learn JavaScript syntax, variables, functions, and control structures.",
        duration: "40 min",
        difficulty: "Intermediate",
        content: `# JavaScript Fundamentals

JavaScript is the programming language of the web. It makes websites interactive and dynamic.

## Variables and Constants
\`\`\`javascript
// Variables (can change)
let userName = "Alice";
let age = 25;

// Constants (cannot change)
const PI = 3.14159;
const siteName = "My Website";

// Older way (avoid using)
var oldVariable = "deprecated";
\`\`\`

## Functions
Functions are reusable blocks of code:

\`\`\`javascript
// Function declaration
function greetUser(name) {
    return "Hello, " + name + "!";
}

// Function expression
const addNumbers = function(a, b) {
    return a + b;
};

// Arrow function (ES6+)
const multiply = (x, y) => x * y;

// Using functions
console.log(greetUser("John")); // "Hello, John!"
console.log(addNumbers(5, 3)); // 8
console.log(multiply(4, 7)); // 28
\`\`\`

## Control Structures

### Conditional Statements
\`\`\`javascript
let score = 85;

if (score >= 90) {
    console.log("Excellent!");
} else if (score >= 70) {
    console.log("Good job!");
} else {
    console.log("Keep practicing!");
}

// Ternary operator
let result = score >= 70 ? "Pass" : "Fail";
\`\`\`

### Loops
\`\`\`javascript
// For loop
for (let i = 0; i < 5; i++) {
    console.log("Count: " + i);
}

// While loop
let count = 0;
while (count < 3) {
    console.log("While count: " + count);
    count++;
}

// For...of loop (arrays)
let colors = ["red", "green", "blue"];
for (let color of colors) {
    console.log(color);
}
\`\`\`

## Arrays and Objects

### Arrays
\`\`\`javascript
let fruits = ["apple", "banana", "orange"];

// Array methods
fruits.push("grape"); // Add to end
fruits.pop(); // Remove from end
fruits.unshift("mango"); // Add to beginning

// Array iteration
fruits.forEach(fruit => {
    console.log(fruit);
});

// Array filtering and mapping
let longNames = fruits.filter(fruit => fruit.length > 5);
let upperCaseFruits = fruits.map(fruit => fruit.toUpperCase());
\`\`\`

### Objects
\`\`\`javascript
let person = {
    name: "Alice",
    age: 30,
    email: "alice@example.com",
    hobbies: ["reading", "coding", "hiking"],
    
    // Object method
    introduce: function() {
        return \`Hi, I'm \${this.name} and I'm \${this.age} years old.\`;
    }
};

// Accessing properties
console.log(person.name); // "Alice"
console.log(person["email"]); // "alice@example.com"
console.log(person.introduce()); // "Hi, I'm Alice..."

// Adding new properties
person.city = "New York";
\`\`\`

## Modern JavaScript Features (ES6+)

### Template Literals
\`\`\`javascript
let name = "John";
let age = 25;
let message = \`Hello, my name is \${name} and I'm \${age} years old.\`;
\`\`\`

### Destructuring
\`\`\`javascript
// Array destructuring
let [first, second, third] = ["red", "green", "blue"];

// Object destructuring
let {name, age, email} = person;
\`\`\`

### Spread Operator
\`\`\`javascript
let arr1 = [1, 2, 3];
let arr2 = [4, 5, 6];
let combined = [...arr1, ...arr2]; // [1, 2, 3, 4, 5, 6]

let newPerson = {...person, city: "Boston"};
\`\`\``,
        order: 1,
        image: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800&h=450&fit=crop"
      },
      {
        title: "DOM Manipulation",
        description: "Learn to interact with web pages using JavaScript and the Document Object Model.",
        duration: "35 min",
        difficulty: "Intermediate",
        content: `# DOM Manipulation

The DOM (Document Object Model) allows JavaScript to interact with HTML elements on a web page.

## What is the DOM?
The DOM represents the structure of an HTML document as a tree of objects that JavaScript can manipulate.

## Selecting Elements

### By ID
\`\`\`javascript
let element = document.getElementById("myElement");
\`\`\`

### By Class
\`\`\`javascript
let elements = document.getElementsByClassName("myClass");
let firstElement = document.querySelector(".myClass");
let allElements = document.querySelectorAll(".myClass");
\`\`\`

### By Tag
\`\`\`javascript
let paragraphs = document.getElementsByTagName("p");
let firstParagraph = document.querySelector("p");
\`\`\`

### Advanced Selectors
\`\`\`javascript
// CSS-style selectors
let specificElement = document.querySelector("#header .navigation li:first-child");
let allButtons = document.querySelectorAll("button.btn-primary");
\`\`\`

## Modifying Elements

### Changing Content
\`\`\`javascript
let heading = document.getElementById("title");

// Change text content
heading.textContent = "New Title";

// Change HTML content
heading.innerHTML = "<em>New</em> Title";
\`\`\`

### Changing Attributes
\`\`\`javascript
let image = document.querySelector("img");

// Set attributes
image.setAttribute("src", "new-image.jpg");
image.setAttribute("alt", "New image description");

// Get attributes
let currentSrc = image.getAttribute("src");

// Direct property access
image.src = "another-image.jpg";
image.alt = "Another description";
\`\`\`

### Changing Styles
\`\`\`javascript
let box = document.getElementById("box");

// Individual styles
box.style.backgroundColor = "red";
box.style.width = "200px";
box.style.height = "200px";

// Multiple styles
box.style.cssText = "background-color: blue; width: 300px; height: 300px;";

// Adding/removing CSS classes
box.classList.add("highlight");
box.classList.remove("hidden");
box.classList.toggle("active");
\`\`\`

## Creating and Removing Elements

### Creating Elements
\`\`\`javascript
// Create new element
let newParagraph = document.createElement("p");
newParagraph.textContent = "This is a new paragraph";
newParagraph.className = "dynamic-content";

// Add to the page
document.body.appendChild(newParagraph);

// Insert at specific position
let container = document.getElementById("container");
container.insertBefore(newParagraph, container.firstChild);
\`\`\`

### Removing Elements
\`\`\`javascript
let elementToRemove = document.getElementById("oldElement");
elementToRemove.parentNode.removeChild(elementToRemove);

// Modern way (newer browsers)
elementToRemove.remove();
\`\`\`

## Event Handling

### Adding Event Listeners
\`\`\`javascript
let button = document.getElementById("myButton");

// Click event
button.addEventListener("click", function() {
    alert("Button clicked!");
});

// Using arrow function
button.addEventListener("click", () => {
    console.log("Arrow function click handler");
});

// Event with parameters
function handleClick(event) {
    console.log("Clicked element:", event.target);
    event.preventDefault(); // Prevent default behavior
}

button.addEventListener("click", handleClick);
\`\`\`

### Common Events
\`\`\`javascript
// Form events
let form = document.getElementById("myForm");
form.addEventListener("submit", function(e) {
    e.preventDefault();
    console.log("Form submitted");
});

// Input events
let input = document.getElementById("nameInput");
input.addEventListener("input", function() {
    console.log("Input value:", this.value);
});

// Mouse events
let div = document.getElementById("myDiv");
div.addEventListener("mouseenter", () => console.log("Mouse entered"));
div.addEventListener("mouseleave", () => console.log("Mouse left"));

// Keyboard events
document.addEventListener("keydown", function(e) {
    if (e.key === "Enter") {
        console.log("Enter key pressed");
    }
});
\`\`\`

## Practical Example: Interactive To-Do List
\`\`\`javascript
// HTML: <input id="taskInput" placeholder="Enter task">
//       <button id="addBtn">Add Task</button>
//       <ul id="taskList"></ul>

let taskInput = document.getElementById("taskInput");
let addBtn = document.getElementById("addBtn");
let taskList = document.getElementById("taskList");

function addTask() {
    let taskText = taskInput.value.trim();
    if (taskText === "") return;
    
    // Create list item
    let li = document.createElement("li");
    li.textContent = taskText;
    
    // Create delete button
    let deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.addEventListener("click", function() {
        li.remove();
    });
    
    li.appendChild(deleteBtn);
    taskList.appendChild(li);
    
    // Clear input
    taskInput.value = "";
}

// Add event listeners
addBtn.addEventListener("click", addTask);
taskInput.addEventListener("keydown", function(e) {
    if (e.key === "Enter") {
        addTask();
    }
});
\`\`\``,
        order: 2,
        image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=450&fit=crop"
      },
      {
        title: "Asynchronous JavaScript",
        description: "Master promises, async/await, and API calls for modern web development.",
        duration: "50 min",
        difficulty: "Intermediate",
        content: `# Asynchronous JavaScript

Asynchronous programming allows JavaScript to handle time-consuming operations without blocking the main thread.

## Understanding Synchronous vs Asynchronous

### Synchronous Code (Blocking)
\`\`\`javascript
console.log("First");
console.log("Second");
console.log("Third");
// Output: First, Second, Third (in order)
\`\`\`

### Asynchronous Code (Non-blocking)
\`\`\`javascript
console.log("First");
setTimeout(() => {
    console.log("Second (after delay)");
}, 1000);
console.log("Third");
// Output: First, Third, Second (after delay)
\`\`\`

## Callbacks
The traditional way to handle asynchronous operations:

\`\`\`javascript
function fetchData(callback) {
    setTimeout(() => {
        let data = {id: 1, name: "John"};
        callback(data);
    }, 1000);
}

fetchData(function(result) {
    console.log("Received data:", result);
});

// Callback Hell (avoid this!)
getData(function(a) {
    getMoreData(a, function(b) {
        getEvenMoreData(b, function(c) {
            // This gets messy quickly!
        });
    });
});
\`\`\`

## Promises
A better way to handle asynchronous operations:

\`\`\`javascript
// Creating a Promise
function fetchUserData(userId) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (userId > 0) {
                resolve({id: userId, name: "User " + userId});
            } else {
                reject(new Error("Invalid user ID"));
            }
        }, 1000);
    });
}

// Using Promises with .then() and .catch()
fetchUserData(1)
    .then(user => {
        console.log("User data:", user);
        return user.id; // Return value for next .then()
    })
    .then(userId => {
        console.log("User ID:", userId);
    })
    .catch(error => {
        console.error("Error:", error.message);
    })
    .finally(() => {
        console.log("Promise completed");
    });

// Promise.all() - Wait for multiple promises
let promise1 = fetchUserData(1);
let promise2 = fetchUserData(2);
let promise3 = fetchUserData(3);

Promise.all([promise1, promise2, promise3])
    .then(users => {
        console.log("All users:", users);
    })
    .catch(error => {
        console.error("One or more promises failed:", error);
    });
\`\`\`

## Async/Await
The modern, clean way to handle asynchronous code:

\`\`\`javascript
// Async function declaration
async function getUserData(userId) {
    try {
        let user = await fetchUserData(userId);
        console.log("User:", user);
        
        // You can use await with any Promise
        let posts = await fetchUserPosts(user.id);
        console.log("User posts:", posts);
        
        return {user, posts};
    } catch (error) {
        console.error("Error fetching data:", error);
        throw error; // Re-throw if needed
    }
}

// Using async function
getUserData(1)
    .then(result => {
        console.log("Complete result:", result);
    })
    .catch(error => {
        console.error("Failed to get user data:", error);
    });

// Async arrow function
const getMultipleUsers = async (userIds) => {
    let users = [];
    for (let id of userIds) {
        try {
            let user = await fetchUserData(id);
            users.push(user);
        } catch (error) {
            console.error(\`Failed to fetch user \${id}:\`, error);
        }
    }
    return users;
};
\`\`\`

## Fetch API - Making HTTP Requests

### Basic GET Request
\`\`\`javascript
async function fetchPosts() {
    try {
        let response = await fetch('https://jsonplaceholder.typicode.com/posts');
        
        if (!response.ok) {
            throw new Error(\`HTTP error! status: \${response.status}\`);
        }
        
        let posts = await response.json();
        console.log("Posts:", posts);
        return posts;
    } catch (error) {
        console.error("Error fetching posts:", error);
    }
}
\`\`\`

### POST Request with Data
\`\`\`javascript
async function createPost(title, body) {
    try {
        let response = await fetch('https://jsonplaceholder.typicode.com/posts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                title: title,
                body: body,
                userId: 1
            })
        });
        
        if (!response.ok) {
            throw new Error(\`HTTP error! status: \${response.status}\`);
        }
        
        let newPost = await response.json();
        console.log("Created post:", newPost);
        return newPost;
    } catch (error) {
        console.error("Error creating post:", error);
    }
}
\`\`\`

## Practical Example: Weather App
\`\`\`javascript
class WeatherApp {
    constructor() {
        this.apiKey = 'your-api-key';
        this.baseUrl = 'https://api.openweathermap.org/data/2.5';
    }
    
    async getCurrentWeather(city) {
        try {
            let url = \`\${this.baseUrl}/weather?q=\${city}&appid=\${this.apiKey}&units=metric\`;
            let response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(\`Weather data not found for \${city}\`);
            }
            
            let data = await response.json();
            return {
                city: data.name,
                temperature: data.main.temp,
                description: data.weather[0].description,
                humidity: data.main.humidity
            };
        } catch (error) {
            console.error("Error fetching weather:", error);
            throw error;
        }
    }
    
    async displayWeather(city) {
        try {
            let weather = await this.getCurrentWeather(city);
            
            document.getElementById('city').textContent = weather.city;
            document.getElementById('temperature').textContent = \`\${weather.temperature}°C\`;
            document.getElementById('description').textContent = weather.description;
            document.getElementById('humidity').textContent = \`Humidity: \${weather.humidity}%\`;
            
        } catch (error) {
            document.getElementById('error').textContent = "Could not fetch weather data";
        }
    }
}

// Usage
let weatherApp = new WeatherApp();

document.getElementById('searchBtn').addEventListener('click', async () => {
    let city = document.getElementById('cityInput').value;
    if (city) {
        await weatherApp.displayWeather(city);
    }
});
\`\`\`

## Error Handling Best Practices
\`\`\`javascript
async function robustApiCall(url) {
    try {
        let response = await fetch(url);
        
        // Check if request was successful
        if (!response.ok) {
            throw new Error(\`HTTP \${response.status}: \${response.statusText}\`);
        }
        
        let data = await response.json();
        return data;
        
    } catch (error) {
        // Handle different types of errors
        if (error instanceof TypeError) {
            console.error("Network error:", error.message);
        } else if (error instanceof SyntaxError) {
            console.error("Invalid JSON:", error.message);
        } else {
            console.error("API error:", error.message);
        }
        
        // Return default value or re-throw
        return null;
    }
}
\`\`\``,
        order: 3,
        image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=450&fit=crop"
      }
    ],
    assessment: {
      totalQuestions: 8,
      timeLimit: "20 minutes",
      retakePeriod: "24 hours",
      cooldownPeriod: 1,
      questions: [
        {
          type: "multiple-choice",
          question: "Which keyword is used to declare a constant in JavaScript?",
          options: ["var", "let", "const", "final"],
          correctAnswer: 2
        },
        {
          type: "multiple-choice",
          question: "What is the correct way to create an arrow function?",
          options: [
            "function => (x) { return x * 2; }",
            "(x) => { return x * 2; }",
            "x -> { return x * 2; }",
            "(x) { return x * 2; }"
          ],
          correctAnswer: 1
        },
        {
          type: "true-false",
          question: "The DOM allows JavaScript to interact with HTML elements.",
          correctAnswer: "true"
        },
        {
          type: "multiple-choice",
          question: "Which method is used to select an element by its ID?",
          options: [
            "document.getElementByID()",
            "document.getElementById()",
            "document.selectElementById()",
            "document.findElementById()"
          ],
          correctAnswer: 1
        },
        {
          type: "multiple-choice",
          question: "What does 'async/await' help with in JavaScript?",
          options: [
            "Creating functions",
            "Handling asynchronous operations",
            "Declaring variables",
            "Creating loops"
          ],
          correctAnswer: 1
        },
        {
          type: "true-false",
          question: "Promises can only be resolved, never rejected.",
          correctAnswer: "false"
        },
        {
          type: "multiple-choice",
          question: "Which method is used to make HTTP requests in modern JavaScript?",
          options: ["ajax()", "fetch()", "request()", "http()"],
          correctAnswer: 1
        },
        {
          type: "multiple-choice",
          question: "What happens when you use 'await' without 'async'?",
          options: [
            "It works normally",
            "It causes a syntax error",
            "It returns undefined",
            "It creates a promise"
          ],
          correctAnswer: 1
        }
      ]
    }
  },
  {
    title: "React.js Framework",
    category: "Frontend Frameworks",
    status: "Published",
    difficulty: "Intermediate",
    description: "Build modern user interfaces with React.js. Learn components, state management, hooks, and create dynamic web applications.",
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=450&fit=crop",
    hasAssessment: true,
    lessons: [
      {
        title: "React Fundamentals",
        description: "Learn React components, JSX, props, and basic project structure.",
        duration: "45 min",
        difficulty: "Intermediate",
        content: `# React Fundamentals

React is a JavaScript library for building user interfaces, particularly single-page applications where data changes over time.

## What is React?
React allows you to build UIs using components - reusable pieces of code that return JSX (JavaScript XML).

## Setting Up React
\`\`\`bash
# Create a new React app
npx create-react-app my-app
cd my-app
npm start
\`\`\`

## JSX - JavaScript XML
JSX allows you to write HTML-like syntax in JavaScript:

\`\`\`jsx
// JSX example
const element = <h1>Hello, World!</h1>;

// JSX with expressions
const name = "Alice";
const greeting = <h1>Hello, {name}!</h1>;

// JSX with attributes
const image = <img src="photo.jpg" alt="Profile" className="profile-pic" />;

// JSX must return a single parent element
const component = (
    <div>
        <h1>Title</h1>
        <p>Description</p>
    </div>
);
\`\`\`

## Components

### Function Components
\`\`\`jsx
// Simple component
function Welcome() {
    return <h1>Hello, World!</h1>;
}

// Arrow function component
const Welcome = () => {
    return <h1>Hello, World!</h1>;
};

// Component with JSX variable
const Welcome = () => {
    const message = <h1>Hello, World!</h1>;
    return message;
};
\`\`\`

### Using Components
\`\`\`jsx
// App.js
import Welcome from './Welcome';

function App() {
    return (
        <div className="App">
            <Welcome />
            <Welcome />
            <Welcome />
        </div>
    );
}

export default App;
\`\`\`

## Props - Passing Data to Components
\`\`\`jsx
// Component that receives props
function UserCard(props) {
    return (
        <div className="user-card">
            <h2>{props.name}</h2>
            <p>Age: {props.age}</p>
            <p>Email: {props.email}</p>
        </div>
    );
}

// Using destructuring
function UserCard({ name, age, email }) {
    return (
        <div className="user-card">
            <h2>{name}</h2>
            <p>Age: {age}</p>
            <p>Email: {email}</p>
        </div>
    );
}

// Using the component with props
function App() {
    return (
        <div>
            <UserCard 
                name="Alice Johnson" 
                age={28} 
                email="alice@example.com" 
            />
            <UserCard 
                name="Bob Smith" 
                age={32} 
                email="bob@example.com" 
            />
        </div>
    );
}
\`\`\`

## Conditional Rendering
\`\`\`jsx
function WelcomeMessage({ isLoggedIn, username }) {
    if (isLoggedIn) {
        return <h1>Welcome back, {username}!</h1>;
    } else {
        return <h1>Please log in.</h1>;
    }
}

// Ternary operator
function StatusMessage({ isOnline }) {
    return (
        <div>
            <h2>User Status</h2>
            <p>{isOnline ? "Online" : "Offline"}</p>
        </div>
    );
}

// Logical AND operator
function Notification({ hasNewMessages, messageCount }) {
    return (
        <div>
            <h2>Inbox</h2>
            {hasNewMessages && <p>You have {messageCount} new messages!</p>}
        </div>
    );
}
\`\`\`

## Lists and Keys
\`\`\`jsx
function TodoList() {
    const todos = [
        { id: 1, text: "Learn React", completed: false },
        { id: 2, text: "Build a project", completed: false },
        { id: 3, text: "Deploy to production", completed: true }
    ];

    return (
        <ul>
            {todos.map(todo => (
                <li key={todo.id} className={todo.completed ? "completed" : ""}>
                    {todo.text}
                </li>
            ))}
        </ul>
    );
}

// More complex list rendering
function UserList({ users }) {
    return (
        <div className="user-list">
            {users.map(user => (
                <UserCard 
                    key={user.id}
                    name={user.name}
                    age={user.age}
                    email={user.email}
                />
            ))}
        </div>
    );
}
\`\`\`

## Event Handling
\`\`\`jsx
function Button() {
    const handleClick = () => {
        alert("Button clicked!");
    };

    const handleClickWithEvent = (event) => {
        console.log("Event:", event);
        console.log("Button text:", event.target.textContent);
    };

    return (
        <div>
            <button onClick={handleClick}>
                Simple Click
            </button>
            <button onClick={handleClickWithEvent}>
                Click with Event
            </button>
            <button onClick={() => alert("Inline handler")}>
                Inline Handler
            </button>
        </div>
    );
}

// Form handling
function ContactForm() {
    const handleSubmit = (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const name = formData.get('name');
        const email = formData.get('email');
        console.log("Form submitted:", { name, email });
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="text" name="name" placeholder="Your name" required />
            <input type="email" name="email" placeholder="Your email" required />
            <button type="submit">Submit</button>
        </form>
    );
}
\`\`\`

## Component Composition
\`\`\`jsx
// Container component
function Card({ children, title }) {
    return (
        <div className="card">
            <div className="card-header">
                <h3>{title}</h3>
            </div>
            <div className="card-body">
                {children}
            </div>
        </div>
    );
}

// Using composition
function App() {
    return (
        <div>
            <Card title="User Profile">
                <UserCard name="Alice" age={28} email="alice@example.com" />
            </Card>
            
            <Card title="Todo List">
                <TodoList />
            </Card>
            
            <Card title="Custom Content">
                <p>This is custom content inside a card.</p>
                <button>Custom Button</button>
            </Card>
        </div>
    );
}
\`\`\`

## Project Structure Best Practices
\`\`\`
src/
├── components/
│   ├── common/
│   │   ├── Button.jsx
│   │   ├── Card.jsx
│   │   └── index.js
│   ├── UserCard.jsx
│   ├── TodoList.jsx
│   └── index.js
├── pages/
│   ├── Home.jsx
│   ├── About.jsx
│   └── Contact.jsx
├── styles/
│   ├── components.css
│   └── global.css
├── utils/
│   └── helpers.js
├── App.js
└── index.js
\`\`\``,
        order: 1,
        image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=450&fit=crop"
      },
      {
        title: "State and Hooks",
        description: "Master React hooks including useState, useEffect, and state management patterns.",
        duration: "50 min",
        difficulty: "Intermediate",
        content: `# State and Hooks

React Hooks allow you to use state and other React features in function components.

## useState Hook
useState lets you add state to function components:

\`\`\`jsx
import React, { useState } from 'react';

function Counter() {
    // Declare state variable with initial value
    const [count, setCount] = useState(0);

    return (
        <div>
            <p>You clicked {count} times</p>
            <button onClick={() => setCount(count + 1)}>
                Click me
            </button>
        </div>
    );
}

// Multiple state variables
function UserProfile() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [age, setAge] = useState(0);

    return (
        <form>
            <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Name"
            />
            <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
            />
            <input 
                type="number" 
                value={age}
                onChange={(e) => setAge(parseInt(e.target.value))}
                placeholder="Age"
            />
        </form>
    );
}
\`\`\`

## Complex State with Objects
\`\`\`jsx
function UserForm() {
    const [user, setUser] = useState({
        name: "",
        email: "",
        preferences: {
            theme: "light",
            notifications: true
        }
    });

    const updateUser = (field, value) => {
        setUser(prevUser => ({
            ...prevUser,
            [field]: value
        }));
    };

    const updatePreferences = (preference, value) => {
        setUser(prevUser => ({
            ...prevUser,
            preferences: {
                ...prevUser.preferences,
                [preference]: value
            }
        }));
    };

    return (
        <div>
            <input 
                value={user.name}
                onChange={(e) => updateUser('name', e.target.value)}
                placeholder="Name"
            />
            <input 
                value={user.email}
                onChange={(e) => updateUser('email', e.target.value)}
                placeholder="Email"
            />
            <select 
                value={user.preferences.theme}
                onChange={(e) => updatePreferences('theme', e.target.value)}
            >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
            </select>
            <label>
                <input 
                    type="checkbox"
                    checked={user.preferences.notifications}
                    onChange={(e) => updatePreferences('notifications', e.target.checked)}
                />
                Enable notifications
            </label>
        </div>
    );
}
\`\`\`

## useEffect Hook
useEffect lets you perform side effects in function components:

\`\`\`jsx
import React, { useState, useEffect } from 'react';

// Basic useEffect
function Timer() {
    const [seconds, setSeconds] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setSeconds(prev => prev + 1);
        }, 1000);

        // Cleanup function
        return () => clearInterval(interval);
    }, []); // Empty dependency array means run once on mount

    return <div>Timer: {seconds} seconds</div>;
}

// useEffect with dependencies
function UserProfile({ userId }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            setLoading(true);
            try {
                const response = await fetch(\`/api/users/\${userId}\`);
                const userData = await response.json();
                setUser(userData);
            } catch (error) {
                console.error("Error fetching user:", error);
            } finally {
                setLoading(false);
            }
        };

        if (userId) {
            fetchUser();
        }
    }, [userId]); // Re-run when userId changes

    if (loading) return <div>Loading...</div>;
    if (!user) return <div>User not found</div>;

    return (
        <div>
            <h2>{user.name}</h2>
            <p>{user.email}</p>
        </div>
    );
}

// Multiple useEffect hooks
function Dashboard() {
    const [data, setData] = useState(null);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    // Effect for data fetching
    useEffect(() => {
        fetch('/api/dashboard')
            .then(response => response.json())
            .then(setData);
    }, []);

    // Effect for window resize
    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div>
            <p>Window width: {windowWidth}px</p>
            {data && <DataDisplay data={data} />}
        </div>
    );
}
\`\`\`

## Custom Hooks
Create reusable stateful logic:

\`\`\`jsx
// Custom hook for local storage
function useLocalStorage(key, initialValue) {
    const [storedValue, setStoredValue] = useState(() => {
        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.error("Error reading localStorage:", error);
            return initialValue;
        }
    });

    const setValue = (value) => {
        try {
            setStoredValue(value);
            window.localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.error("Error setting localStorage:", error);
        }
    };

    return [storedValue, setValue];
}

// Using the custom hook
function Settings() {
    const [theme, setTheme] = useLocalStorage('theme', 'light');
    const [language, setLanguage] = useLocalStorage('language', 'en');

    return (
        <div>
            <select value={theme} onChange={(e) => setTheme(e.target.value)}>
                <option value="light">Light</option>
                <option value="dark">Dark</option>
            </select>
            <select value={language} onChange={(e) => setLanguage(e.target.value)}>
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
            </select>
        </div>
    );
}

// Custom hook for API calls
function useApi(url) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error(\`HTTP error! status: \${response.status}\`);
                }
                const result = await response.json();
                setData(result);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [url]);

    return { data, loading, error };
}

// Using the API hook
function PostList() {
    const { data: posts, loading, error } = useApi('/api/posts');

    if (loading) return <div>Loading posts...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            {posts.map(post => (
                <div key={post.id}>
                    <h3>{post.title}</h3>
                    <p>{post.body}</p>
                </div>
            ))}
        </div>
    );
}
\`\`\`

## Other Important Hooks

### useContext
\`\`\`jsx
import React, { useContext, createContext } from 'react';

// Create context
const ThemeContext = createContext();

// Provider component
function ThemeProvider({ children }) {
    const [theme, setTheme] = useState('light');

    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

// Component using context
function ThemedButton() {
    const { theme, setTheme } = useContext(ThemeContext);

    return (
        <button 
            className={\`btn-\${theme}\`}
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
        >
            Switch to {theme === 'light' ? 'dark' : 'light'} theme
        </button>
    );
}
\`\`\`

### useReducer
\`\`\`jsx
import React, { useReducer } from 'react';

// Reducer function
function counterReducer(state, action) {
    switch (action.type) {
        case 'increment':
            return { count: state.count + 1 };
        case 'decrement':
            return { count: state.count - 1 };
        case 'reset':
            return { count: 0 };
        default:
            throw new Error(\`Unknown action type: \${action.type}\`);
    }
}

function Counter() {
    const [state, dispatch] = useReducer(counterReducer, { count: 0 });

    return (
        <div>
            <p>Count: {state.count}</p>
            <button onClick={() => dispatch({ type: 'increment' })}>+</button>
            <button onClick={() => dispatch({ type: 'decrement' })}>-</button>
            <button onClick={() => dispatch({ type: 'reset' })}>Reset</button>
        </div>
    );
}
\`\`\`

## Practical Example: Todo App with Hooks
\`\`\`jsx
function TodoApp() {
    const [todos, setTodos] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [filter, setFilter] = useState('all');

    const addTodo = () => {
        if (inputValue.trim()) {
            setTodos([...todos, {
                id: Date.now(),
                text: inputValue,
                completed: false
            }]);
            setInputValue('');
        }
    };

    const toggleTodo = (id) => {
        setTodos(todos.map(todo =>
            todo.id === id ? { ...todo, completed: !todo.completed } : todo
        ));
    };

    const deleteTodo = (id) => {
        setTodos(todos.filter(todo => todo.id !== id));
    };

    const filteredTodos = todos.filter(todo => {
        if (filter === 'active') return !todo.completed;
        if (filter === 'completed') return todo.completed;
        return true;
    });

    return (
        <div>
            <div>
                <input 
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addTodo()}
                    placeholder="Add a todo..."
                />
                <button onClick={addTodo}>Add</button>
            </div>
            
            <div>
                <button onClick={() => setFilter('all')}>All</button>
                <button onClick={() => setFilter('active')}>Active</button>
                <button onClick={() => setFilter('completed')}>Completed</button>
            </div>
            
            <ul>
                {filteredTodos.map(todo => (
                    <li key={todo.id}>
                        <input 
                            type="checkbox"
                            checked={todo.completed}
                            onChange={() => toggleTodo(todo.id)}
                        />
                        <span style={{ 
                            textDecoration: todo.completed ? 'line-through' : 'none' 
                        }}>
                            {todo.text}
                        </span>
                        <button onClick={() => deleteTodo(todo.id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}
\`\`\``,
        order: 2,
        image: "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&h=450&fit=crop"
      },
      {
        title: "React Router and Navigation",
        description: "Create single-page applications with React Router for navigation and routing.",
        duration: "40 min",
        difficulty: "Intermediate",
        content: `# React Router and Navigation

React Router enables navigation among different components in a React application, allowing you to build single-page applications with multiple views.

## Installation
\`\`\`bash
npm install react-router-dom
\`\`\`

## Basic Setup
\`\`\`jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

// Page components
function Home() {
    return <h2>Home Page</h2>;
}

function About() {
    return <h2>About Page</h2>;
}

function Contact() {
    return <h2>Contact Page</h2>;
}

function App() {
    return (
        <Router>
            <div>
                {/* Navigation */}
                <nav>
                    <ul>
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/about">About</Link></li>
                        <li><Link to="/contact">Contact</Link></li>
                    </ul>
                </nav>

                {/* Routes */}
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contact />} />
                </Routes>
            </div>
        </Router>
    );
}
\`\`\`

## Route Parameters
\`\`\`jsx
import { useParams } from 'react-router-dom';

function UserProfile() {
    const { userId } = useParams();
    
    return (
        <div>
            <h2>User Profile</h2>
            <p>User ID: {userId}</p>
        </div>
    );
}

function ProductDetail() {
    const { category, productId } = useParams();
    
    return (
        <div>
            <h2>Product Detail</h2>
            <p>Category: {category}</p>
            <p>Product ID: {productId}</p>
        </div>
    );
}

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/user/:userId" element={<UserProfile />} />
                <Route path="/products/:category/:productId" element={<ProductDetail />} />
            </Routes>
        </Router>
    );
}
\`\`\`

## Programmatic Navigation
\`\`\`jsx
import { useNavigate } from 'react-router-dom';

function LoginForm() {
    const navigate = useNavigate();
    const [credentials, setCredentials] = useState({ username: '', password: '' });

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            // Simulate login
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(credentials)
            });

            if (response.ok) {
                // Redirect to dashboard after successful login
                navigate('/dashboard');
            } else {
                alert('Login failed');
            }
        } catch (error) {
            console.error('Login error:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input 
                type="text" 
                placeholder="Username"
                value={credentials.username}
                onChange={(e) => setCredentials({
                    ...credentials, 
                    username: e.target.value
                })}
            />
            <input 
                type="password" 
                placeholder="Password"
                value={credentials.password}
                onChange={(e) => setCredentials({
                    ...credentials, 
                    password: e.target.value
                })}
            />
            <button type="submit">Login</button>
            <button type="button" onClick={() => navigate('/register')}>
                Go to Register
            </button>
        </form>
    );
}
\`\`\`

## Nested Routes
\`\`\`jsx
import { Outlet, Link } from 'react-router-dom';

function Dashboard() {
    return (
        <div>
            <h2>Dashboard</h2>
            <nav>
                <Link to="profile">Profile</Link> | 
                <Link to="settings">Settings</Link> | 
                <Link to="analytics">Analytics</Link>
            </nav>
            <hr />
            {/* This is where nested routes will be rendered */}
            <Outlet />
        </div>
    );
}

function Profile() {
    return <h3>Profile Section</h3>;
}

function Settings() {
    return <h3>Settings Section</h3>;
}

function Analytics() {
    return <h3>Analytics Section</h3>;
}

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/dashboard" element={<Dashboard />}>
                    <Route path="profile" element={<Profile />} />
                    <Route path="settings" element={<Settings />} />
                    <Route path="analytics" element={<Analytics />} />
                </Route>
            </Routes>
        </Router>
    );
}
\`\`\`

## Query Parameters and Location
\`\`\`jsx
import { useSearchParams, useLocation } from 'react-router-dom';

function SearchResults() {
    const [searchParams, setSearchParams] = useSearchParams();
    const location = useLocation();
    
    const query = searchParams.get('q') || '';
    const category = searchParams.get('category') || 'all';
    const page = parseInt(searchParams.get('page')) || 1;

    const updateSearch = (newQuery) => {
        setSearchParams({
            q: newQuery,
            category: category,
            page: 1 // Reset to first page on new search
        });
    };

    const updateCategory = (newCategory) => {
        setSearchParams({
            q: query,
            category: newCategory,
            page: 1
        });
    };

    return (
        <div>
            <h2>Search Results</h2>
            <p>Current path: {location.pathname}</p>
            <p>Query: {query}</p>
            <p>Category: {category}</p>
            <p>Page: {page}</p>
            
            <input 
                value={query}
                onChange={(e) => updateSearch(e.target.value)}
                placeholder="Search..."
            />
            
            <select value={category} onChange={(e) => updateCategory(e.target.value)}>
                <option value="all">All Categories</option>
                <option value="electronics">Electronics</option>
                <option value="clothing">Clothing</option>
                <option value="books">Books</option>
            </select>
        </div>
    );
}
\`\`\`

## Protected Routes
\`\`\`jsx
import { Navigate } from 'react-router-dom';

// Higher-order component for protected routes
function ProtectedRoute({ children }) {
    const isAuthenticated = localStorage.getItem('authToken'); // Check auth status
    
    return isAuthenticated ? children : <Navigate to="/login" replace />;
}

// Usage in routes
function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<LoginForm />} />
                <Route 
                    path="/dashboard" 
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    } 
                />
                <Route 
                    path="/profile" 
                    element={
                        <ProtectedRoute>
                            <Profile />
                        </ProtectedRoute>
                    } 
                />
            </Routes>
        </Router>
    );
}

// Alternative using custom hook
function useAuth() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    
    useEffect(() => {
        const token = localStorage.getItem('authToken');
        setIsAuthenticated(!!token);
    }, []);
    
    return isAuthenticated;
}

function AuthenticatedRoute({ children }) {
    const isAuthenticated = useAuth();
    
    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }
    
    return children;
}
\`\`\`

## Navigation Guards and Route Matching
\`\`\`jsx
import { useMatch, useResolvedPath } from 'react-router-dom';

// Custom active link component
function CustomNavLink({ children, to, ...props }) {
    const resolved = useResolvedPath(to);
    const match = useMatch({ path: resolved.pathname, end: true });

    return (
        <Link
            style={{
                textDecoration: match ? "underline" : "none",
                color: match ? "red" : "black"
            }}
            to={to}
            {...props}
        >
            {children}
        </Link>
    );
}

// Navigation component
function Navigation() {
    return (
        <nav>
            <CustomNavLink to="/">Home</CustomNavLink>
            <CustomNavLink to="/about">About</CustomNavLink>
            <CustomNavLink to="/products">Products</CustomNavLink>
            <CustomNavLink to="/contact">Contact</CustomNavLink>
        </nav>
    );
}
\`\`\`

## Error Boundaries and 404 Pages
\`\`\`jsx
function NotFound() {
    const navigate = useNavigate();
    
    return (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
            <h1>404 - Page Not Found</h1>
            <p>The page you're looking for doesn't exist.</p>
            <button onClick={() => navigate('/')}>
                Go to Home
            </button>
            <button onClick={() => navigate(-1)}>
                Go Back
            </button>
        </div>
    );
}

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/products" element={<Products />} />
                {/* Catch-all route for 404 */}
                <Route path="*" element={<NotFound />} />
            </Routes>
        </Router>
    );
}
\`\`\`

## Complete Example: E-commerce Navigation
\`\`\`jsx
import React from 'react';
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Link,
    useParams,
    useNavigate,
    useSearchParams
} from 'react-router-dom';

// Components
function Header() {
    return (
        <header style={{ backgroundColor: '#f8f9fa', padding: '1rem' }}>
            <nav>
                <Link to="/" style={{ marginRight: '1rem' }}>Home</Link>
                <Link to="/products" style={{ marginRight: '1rem' }}>Products</Link>
                <Link to="/cart" style={{ marginRight: '1rem' }}>Cart</Link>
                <Link to="/account">Account</Link>
            </nav>
        </header>
    );
}

function Home() {
    const navigate = useNavigate();
    
    return (
        <div>
            <h1>Welcome to Our Store</h1>
            <button onClick={() => navigate('/products')}>
                Shop Now
            </button>
        </div>
    );
}

function ProductList() {
    const [searchParams, setSearchParams] = useSearchParams();
    const category = searchParams.get('category') || 'all';
    
    const products = [
        { id: 1, name: 'Laptop', category: 'electronics' },
        { id: 2, name: 'T-Shirt', category: 'clothing' },
        { id: 3, name: 'Book', category: 'books' }
    ];
    
    const filteredProducts = category === 'all' 
        ? products 
        : products.filter(p => p.category === category);
    
    return (
        <div>
            <h2>Products</h2>
            <select 
                value={category} 
                onChange={(e) => setSearchParams({ category: e.target.value })}
            >
                <option value="all">All Categories</option>
                <option value="electronics">Electronics</option>
                <option value="clothing">Clothing</option>
                <option value="books">Books</option>
            </select>
            
            <div>
                {filteredProducts.map(product => (
                    <div key={product.id} style={{ margin: '1rem 0' }}>
                        <Link to={\`/products/\${product.id}\`}>
                            {product.name}
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
}

function ProductDetail() {
    const { productId } = useParams();
    const navigate = useNavigate();
    
    return (
        <div>
            <h2>Product Detail</h2>
            <p>Product ID: {productId}</p>
            <button onClick={() => navigate('/products')}>
                Back to Products
            </button>
        </div>
    );
}

function Cart() {
    return <h2>Shopping Cart</h2>;
}

function Account() {
    return <h2>Account Settings</h2>;
}

function App() {
    return (
        <Router>
            <div>
                <Header />
                <main style={{ padding: '1rem' }}>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/products" element={<ProductList />} />
                        <Route path="/products/:productId" element={<ProductDetail />} />
                        <Route path="/cart" element={<Cart />} />
                        <Route path="/account" element={<Account />} />
                        <Route path="*" element={<div>Page not found</div>} />
                    </Routes>
                </main>
            </div>
        </Router>
    );
}

export default App;
\`\`\``,
        order: 3,
        image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=450&fit=crop"
      }
    ],
    assessment: {
      totalQuestions: 8,
      timeLimit: "20 minutes",
      retakePeriod: "24 hours",
      cooldownPeriod: 1,
      questions: [
        {
          type: "multiple-choice",
          question: "What is JSX in React?",
          options: [
            "A new programming language",
            "JavaScript XML - a syntax extension",
            "A CSS framework",
            "A database query language"
          ],
          correctAnswer: 1
        },
        {
          type: "multiple-choice",
          question: "Which hook is used to add state to functional components?",
          options: ["useEffect", "useState", "useContext", "useReducer"],
          correctAnswer: 1
        },
        {
          type: "true-false",
          question: "Props are used to pass data from parent to child components.",
          correctAnswer: "true"
        },
        {
          type: "multiple-choice",
          question: "What is the purpose of the useEffect hook?",
          options: [
            "To create state variables",
            "To handle form submissions",
            "To perform side effects",
            "To create components"
          ],
          correctAnswer: 2
        },
        {
          type: "multiple-choice",
          question: "In React Router, which component is used to create clickable links?",
          options: ["Route", "Link", "Navigate", "Router"],
          correctAnswer: 1
        },
        {
          type: "true-false",
          question: "React components must always return a single parent element.",
          correctAnswer: "false"
        },
        {
          type: "multiple-choice",
          question: "What is the correct way to handle events in React?",
          options: [
            "onclick=\"function()\"",
            "onClick={function}",
            "onEvent={function}",
            "event={function}"
          ],
          correctAnswer: 1
        },
        {
          type: "multiple-choice",
          question: "Which hook would you use to access URL parameters in React Router?",
          options: ["useParams", "useRoute", "useURL", "useLocation"],
          correctAnswer: 0
        }
      ]
    }
  },
  {
    title: "Backend Development with Node.js",
    category: "Backend Development",
    status: "Published",
    difficulty: "Advanced",
    description: "Learn server-side development with Node.js, Express, databases, and API creation. Build scalable backend applications.",
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=450&fit=crop",
    hasAssessment: true,
    lessons: [
      {
        title: "Node.js and Express Setup",
        description: "Set up a Node.js development environment and create your first Express server.",
        duration: "45 min",
        difficulty: "Advanced",
        content: `# Node.js and Express Setup

Node.js allows you to run JavaScript on the server, while Express is a web framework that simplifies building web applications and APIs.

## What is Node.js?
Node.js is a JavaScript runtime built on Chrome's V8 JavaScript engine. It allows you to execute JavaScript outside of a web browser.

## Setting Up Node.js
\`\`\`bash
# Check if Node.js is installed
node --version
npm --version

# If not installed, download from nodejs.org
# Or use a version manager like nvm (recommended)
\`\`\`

## Creating Your First Node.js Project
\`\`\`bash
# Create project directory
mkdir my-api
cd my-api

# Initialize npm project
npm init -y

# Install Express
npm install express

# Install development dependencies
npm install --save-dev nodemon
\`\`\`

## Basic Express Server
\`\`\`javascript
// server.js
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON
app.use(express.json());

// Basic route
app.get('/', (req, res) => {
    res.json({ message: 'Hello World!' });
});

// Start server
app.listen(PORT, () => {
    console.log(\`Server running on port \${PORT}\`);
});
\`\`\`

## Package.json Scripts
\`\`\`json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "test": "echo \\"Error: no test specified\\" && exit 1"
  }
}
\`\`\`

## Express Middleware
Middleware functions execute during the request-response cycle:

\`\`\`javascript
const express = require('express');
const app = express();

// Built-in middleware
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(express.static('public')); // Serve static files

// Custom middleware
const logger = (req, res, next) => {
    console.log(\`\${new Date().toISOString()} - \${req.method} \${req.path}\`);
    next(); // Call next middleware
};

app.use(logger);

// Error handling middleware
const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
};

app.use(errorHandler);
\`\`\`

## Routing
\`\`\`javascript
// Basic routes
app.get('/users', (req, res) => {
    res.json({ message: 'Get all users' });
});

app.post('/users', (req, res) => {
    const { name, email } = req.body;
    res.json({ message: 'User created', user: { name, email } });
});

app.put('/users/:id', (req, res) => {
    const { id } = req.params;
    const { name, email } = req.body;
    res.json({ message: 'User updated', id, user: { name, email } });
});

app.delete('/users/:id', (req, res) => {
    const { id } = req.params;
    res.json({ message: 'User deleted', id });
});

// Route parameters
app.get('/users/:id', (req, res) => {
    const { id } = req.params;
    res.json({ message: \`Get user with ID: \${id}\` });
});

// Query parameters
app.get('/search', (req, res) => {
    const { q, category, page = 1 } = req.query;
    res.json({ 
        message: 'Search results',
        query: q,
        category,
        page: parseInt(page)
    });
});
\`\`\`

## Express Router
Organize routes using Express Router:

\`\`\`javascript
// routes/users.js
const express = require('express');
const router = express.Router();

// Mock data
let users = [
    { id: 1, name: 'John Doe', email: 'john@example.com' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
];

// GET /api/users
router.get('/', (req, res) => {
    res.json(users);
});

// GET /api/users/:id
router.get('/:id', (req, res) => {
    const user = users.find(u => u.id === parseInt(req.params.id));
    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
});

// POST /api/users
router.post('/', (req, res) => {
    const { name, email } = req.body;
    
    if (!name || !email) {
        return res.status(400).json({ error: 'Name and email are required' });
    }
    
    const newUser = {
        id: users.length + 1,
        name,
        email
    };
    
    users.push(newUser);
    res.status(201).json(newUser);
});

// PUT /api/users/:id
router.put('/:id', (req, res) => {
    const userIndex = users.findIndex(u => u.id === parseInt(req.params.id));
    
    if (userIndex === -1) {
        return res.status(404).json({ error: 'User not found' });
    }
    
    const { name, email } = req.body;
    users[userIndex] = { ...users[userIndex], name, email };
    
    res.json(users[userIndex]);
});

// DELETE /api/users/:id
router.delete('/:id', (req, res) => {
    const userIndex = users.findIndex(u => u.id === parseInt(req.params.id));
    
    if (userIndex === -1) {
        return res.status(404).json({ error: 'User not found' });
    }
    
    users.splice(userIndex, 1);
    res.status(204).send();
});

module.exports = router;
\`\`\`

## Main Server with Router
\`\`\`javascript
// server.js
const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/users');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/users', userRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
    console.log(\`Server running on http://localhost:\${PORT}\`);
});
\`\`\`

## Environment Variables
\`\`\`bash
# Install dotenv
npm install dotenv
\`\`\`

\`\`\`javascript
// .env file
PORT=3000
NODE_ENV=development
DB_CONNECTION_STRING=mongodb://localhost:27017/myapp
JWT_SECRET=your-secret-key
\`\`\`

\`\`\`javascript
// server.js
require('dotenv').config();

const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

console.log(\`Running in \${NODE_ENV} mode\`);
\`\`\`

## Validation Middleware
\`\`\`javascript
// middleware/validation.js
const validateUser = (req, res, next) => {
    const { name, email } = req.body;
    
    if (!name || name.trim().length < 2) {
        return res.status(400).json({ 
            error: 'Name is required and must be at least 2 characters' 
        });
    }
    
    if (!email || !/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email)) {
        return res.status(400).json({ 
            error: 'Valid email is required' 
        });
    }
    
    next();
};

// Usage in routes
router.post('/', validateUser, (req, res) => {
    // Route handler
});
\`\`\`

## Testing Your API
\`\`\`bash
# Using curl
curl -X GET http://localhost:3000/api/users
curl -X POST http://localhost:3000/api/users \\
  -H "Content-Type: application/json" \\
  -d '{"name":"John Doe","email":"john@example.com"}'

# Or use tools like Postman, Insomnia, or Thunder Client (VS Code extension)
\`\`\`

## Project Structure
\`\`\`
my-api/
├── routes/
│   ├── users.js
│   ├── auth.js
│   └── index.js
├── middleware/
│   ├── auth.js
│   ├── validation.js
│   └── errorHandler.js
├── models/
│   └── User.js
├── controllers/
│   └── userController.js
├── config/
│   └── database.js
├── .env
├── .gitignore
├── package.json
└── server.js
\`\`\``,
        order: 1,
        image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=450&fit=crop"
      }
    ],
    assessment: {
      totalQuestions: 6,
      timeLimit: "15 minutes",
      retakePeriod: "24 hours",
      cooldownPeriod: 1,
      questions: [
        {
          type: "multiple-choice",
          question: "What is Node.js?",
          options: [
            "A web browser",
            "A JavaScript runtime for server-side development",
            "A database management system",
            "A CSS framework"
          ],
          correctAnswer: 1
        },
        {
          type: "multiple-choice",
          question: "Which framework is commonly used with Node.js for web applications?",
          options: ["React", "Angular", "Express", "Vue"],
          correctAnswer: 2
        },
        {
          type: "true-false",
          question: "Express middleware functions execute in the order they are defined.",
          correctAnswer: "true"
        },
        {
          type: "multiple-choice",
          question: "What HTTP method is used to create new resources?",
          options: ["GET", "POST", "PUT", "DELETE"],
          correctAnswer: 1
        },
        {
          type: "multiple-choice",
          question: "Which Express method is used to handle URL parameters?",
          options: ["req.query", "req.params", "req.body", "req.headers"],
          correctAnswer: 1
        },
        {
          type: "true-false",
          question: "Environment variables are used to store sensitive configuration data.",
          correctAnswer: "true"
        }
      ]
    }
  },
  {
    title: "Database Design & SQL",
    category: "Database",
    status: "Published",
    difficulty: "Advanced",
    description: "Master database design principles, SQL queries, and data modeling. Learn to design efficient and scalable database systems.",
    image: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800&h=450&fit=crop",
    hasAssessment: true,
    lessons: [
      {
        title: "Database Fundamentals",
        description: "Understanding databases, tables, relationships, and basic SQL operations.",
        duration: "40 min",
        difficulty: "Advanced",
        content: `# Database Fundamentals

Databases are organized collections of data that can be easily accessed, managed, and updated.

## What is a Database?
A database is a structured collection of data stored electronically. It allows for efficient storage, retrieval, and manipulation of information.

## Types of Databases

### Relational Databases (SQL)
- Data organized in tables with rows and columns
- Use Structured Query Language (SQL)
- Examples: MySQL, PostgreSQL, SQLite, SQL Server

### NoSQL Databases
- Document stores: MongoDB, CouchDB
- Key-value stores: Redis, DynamoDB
- Column-family: Cassandra
- Graph databases: Neo4j

## Database Management System (DBMS)
Software that manages databases:
- **MySQL**: Open-source, widely used
- **PostgreSQL**: Advanced open-source
- **SQLite**: Lightweight, file-based
- **MongoDB**: Popular NoSQL option

## Basic SQL Concepts

### Tables
Tables store data in rows and columns:
\`\`\`sql
-- Example: Users table
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    age INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
\`\`\`

### Data Types
Common SQL data types:
- **INT**: Integer numbers
- **VARCHAR(n)**: Variable-length strings
- **TEXT**: Long text
- **DATE**: Date values
- **TIMESTAMP**: Date and time
- **BOOLEAN**: True/false values
- **DECIMAL(p,s)**: Decimal numbers

### Primary Keys
Uniquely identify each row:
\`\`\`sql
CREATE TABLE products (
    product_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(200) NOT NULL,
    price DECIMAL(10,2) NOT NULL
);
\`\`\`

### Foreign Keys
Link tables together:
\`\`\`sql
CREATE TABLE orders (
    order_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    product_id INT,
    quantity INT NOT NULL,
    order_date DATE DEFAULT CURRENT_DATE,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (product_id) REFERENCES products(product_id)
);
\`\`\`

## CRUD Operations

### CREATE (INSERT)
\`\`\`sql
-- Insert single record
INSERT INTO users (name, email, age) 
VALUES ('John Doe', 'john@example.com', 28);

-- Insert multiple records
INSERT INTO users (name, email, age) VALUES 
('Jane Smith', 'jane@example.com', 25),
('Bob Johnson', 'bob@example.com', 32),
('Alice Brown', 'alice@example.com', 29);
\`\`\`

### READ (SELECT)
\`\`\`sql
-- Select all columns
SELECT * FROM users;

-- Select specific columns
SELECT name, email FROM users;

-- Filter with WHERE
SELECT * FROM users WHERE age > 25;

-- Sort results
SELECT * FROM users ORDER BY name ASC;

-- Limit results
SELECT * FROM users LIMIT 5;
\`\`\`

### UPDATE
\`\`\`sql
-- Update single record
UPDATE users 
SET age = 29 
WHERE id = 1;

-- Update multiple records
UPDATE users 
SET age = age + 1 
WHERE age < 30;
\`\`\`

### DELETE
\`\`\`sql
-- Delete specific record
DELETE FROM users WHERE id = 1;

-- Delete with condition
DELETE FROM users WHERE age < 18;

-- Delete all records (be careful!)
DELETE FROM users;
\`\`\`

## Filtering and Searching

### WHERE Clause
\`\`\`sql
-- Exact match
SELECT * FROM users WHERE name = 'John Doe';

-- Comparison operators
SELECT * FROM users WHERE age >= 25;
SELECT * FROM users WHERE age BETWEEN 25 AND 35;

-- Pattern matching
SELECT * FROM users WHERE email LIKE '%@gmail.com';
SELECT * FROM users WHERE name LIKE 'J%'; -- Starts with J

-- Multiple conditions
SELECT * FROM users 
WHERE age > 25 AND email LIKE '%@gmail.com';

SELECT * FROM users 
WHERE age < 20 OR age > 65;

-- NULL values
SELECT * FROM users WHERE age IS NULL;
SELECT * FROM users WHERE age IS NOT NULL;
\`\`\`

### IN and NOT IN
\`\`\`sql
SELECT * FROM users 
WHERE age IN (25, 30, 35);

SELECT * FROM users 
WHERE name NOT IN ('John Doe', 'Jane Smith');
\`\`\`

## Aggregate Functions
\`\`\`sql
-- Count records
SELECT COUNT(*) FROM users;
SELECT COUNT(age) FROM users; -- Excludes NULL values

-- Mathematical functions
SELECT AVG(age) FROM users;
SELECT MIN(age) FROM users;
SELECT MAX(age) FROM users;
SELECT SUM(age) FROM users;

-- Group by
SELECT age, COUNT(*) as user_count 
FROM users 
GROUP BY age;

-- Having clause (filter groups)
SELECT age, COUNT(*) as user_count 
FROM users 
GROUP BY age 
HAVING COUNT(*) > 1;
\`\`\`

## Joins
Combine data from multiple tables:

### Sample Tables
\`\`\`sql
-- Users table
CREATE TABLE users (
    id INT PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100)
);

-- Orders table
CREATE TABLE orders (
    id INT PRIMARY KEY,
    user_id INT,
    product VARCHAR(100),
    amount DECIMAL(10,2),
    FOREIGN KEY (user_id) REFERENCES users(id)
);
\`\`\`

### INNER JOIN
Returns records that have matching values in both tables:
\`\`\`sql
SELECT users.name, orders.product, orders.amount
FROM users
INNER JOIN orders ON users.id = orders.user_id;
\`\`\`

### LEFT JOIN
Returns all records from left table, matched records from right:
\`\`\`sql
SELECT users.name, orders.product, orders.amount
FROM users
LEFT JOIN orders ON users.id = orders.user_id;
\`\`\`

### RIGHT JOIN
Returns all records from right table, matched records from left:
\`\`\`sql
SELECT users.name, orders.product, orders.amount
FROM users
RIGHT JOIN orders ON users.id = orders.user_id;
\`\`\`

## Indexes
Improve query performance:
\`\`\`sql
-- Create index
CREATE INDEX idx_user_email ON users(email);
CREATE INDEX idx_user_age ON users(age);

-- Composite index
CREATE INDEX idx_user_name_age ON users(name, age);

-- Drop index
DROP INDEX idx_user_email;
\`\`\`

## Practical Example: E-commerce Database
\`\`\`sql
-- Create database schema
CREATE TABLE categories (
    category_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    description TEXT
);

CREATE TABLE products (
    product_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    category_id INT,
    stock_quantity INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(category_id)
);

CREATE TABLE customers (
    customer_id INT PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20),
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE orders (
    order_id INT PRIMARY KEY AUTO_INCREMENT,
    customer_id INT NOT NULL,
    order_date DATE DEFAULT CURRENT_DATE,
    total_amount DECIMAL(12,2) NOT NULL,
    status ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
);

CREATE TABLE order_items (
    order_item_id INT PRIMARY KEY AUTO_INCREMENT,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(order_id),
    FOREIGN KEY (product_id) REFERENCES products(product_id)
);

-- Sample queries
-- Get all orders with customer information
SELECT 
    o.order_id,
    c.first_name,
    c.last_name,
    o.order_date,
    o.total_amount,
    o.status
FROM orders o
JOIN customers c ON o.customer_id = c.customer_id
ORDER BY o.order_date DESC;

-- Get order details with products
SELECT 
    o.order_id,
    c.first_name,
    c.last_name,
    p.name as product_name,
    oi.quantity,
    oi.unit_price,
    (oi.quantity * oi.unit_price) as line_total
FROM orders o
JOIN customers c ON o.customer_id = c.customer_id
JOIN order_items oi ON o.order_id = oi.order_id
JOIN products p ON oi.product_id = p.product_id
WHERE o.order_id = 1;

-- Get best-selling products
SELECT 
    p.name,
    SUM(oi.quantity) as total_sold,
    SUM(oi.quantity * oi.unit_price) as total_revenue
FROM products p
JOIN order_items oi ON p.product_id = oi.product_id
GROUP BY p.product_id, p.name
ORDER BY total_sold DESC
LIMIT 10;
\`\`\``,
        order: 1,
        image: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800&h=450&fit=crop"
      }
    ],
    assessment: {
      totalQuestions: 7,
      timeLimit: "18 minutes",
      retakePeriod: "24 hours",
      cooldownPeriod: 1,
      questions: [
        {
          type: "multiple-choice",
          question: "What does SQL stand for?",
          options: [
            "Simple Query Language",
            "Structured Query Language", 
            "Standard Query Language",
            "System Query Language"
          ],
          correctAnswer: 1
        },
        {
          type: "multiple-choice",
          question: "Which SQL command is used to retrieve data from a database?",
          options: ["INSERT", "UPDATE", "SELECT", "DELETE"],
          correctAnswer: 2
        },
        {
          type: "true-false",
          question: "A primary key can contain NULL values.",
          correctAnswer: "false"
        },
        {
          type: "multiple-choice",
          question: "Which JOIN returns all records from the left table?",
          options: ["INNER JOIN", "LEFT JOIN", "RIGHT JOIN", "FULL JOIN"],
          correctAnswer: 1
        },
        {
          type: "multiple-choice",
          question: "What is the purpose of a foreign key?",
          options: [
            "To uniquely identify rows",
            "To link tables together",
            "To store large text",
            "To create indexes"
          ],
          correctAnswer: 1
        },
        {
          type: "true-false",
          question: "The WHERE clause is used to filter records in SQL.",
          correctAnswer: "true"
        },
        {
          type: "multiple-choice",
          question: "Which aggregate function returns the number of rows?",
          options: ["SUM()", "AVG()", "COUNT()", "MAX()"],
          correctAnswer: 2
        }
      ]
    }
  }
];

// Function to create a topic
async function createTopic(topicData) {
  try {
    log(`Creating topic: ${topicData.title}`);
    const topic = await makeApiRequest('/topics', {
      method: 'POST',
      body: JSON.stringify({
        title: topicData.title,
        category: topicData.category,
        status: topicData.status,
        difficulty: topicData.difficulty,
        description: topicData.description,
        image: topicData.image,
        has_assessment: topicData.hasAssessment
      })
    });
    
    log(`✅ Created topic: ${topic.title} (ID: ${topic.id})`);
    return topic;
  } catch (err) {
    error(`Failed to create topic ${topicData.title}: ${err.message}`);
    throw err;
  }
}

// Function to create lessons for a topic
async function createLessons(topicId, lessons) {
  const createdLessons = [];
  
  for (const lessonData of lessons) {
    try {
      log(`Creating lesson: ${lessonData.title}`);
      const lesson = await makeApiRequest('/lessons', {
        method: 'POST',
        body: JSON.stringify({
          topic_id: topicId,
          title: lessonData.title,
          description: lessonData.description,
          content: lessonData.content,
          duration: lessonData.duration,
          difficulty: lessonData.difficulty,
          video_url: lessonData.videoUrl || null,
          order: lessonData.order,
          status: 'Published',
          image: lessonData.image
        })
      });
      
      log(`✅ Created lesson: ${lesson.title} (ID: ${lesson.id})`);
      createdLessons.push(lesson);
    } catch (err) {
      error(`Failed to create lesson ${lessonData.title}: ${err.message}`);
    }
  }
  
  return createdLessons;
}

// Function to create assessment for a topic
async function createAssessment(topicId, assessmentData) {
  try {
    log(`Creating assessment for topic ID: ${topicId}`);
    const assessment = await makeApiRequest('/assessments', {
      method: 'POST',
      body: JSON.stringify({
        topic_id: topicId,
        total_questions: assessmentData.totalQuestions,
        time_limit: assessmentData.timeLimit,
        retake_period: assessmentData.retakePeriod,
        cooldown_period: assessmentData.cooldownPeriod,
        questions: assessmentData.questions,
        status: 'Published'
      })
    });
    
    log(`✅ Created assessment for topic (ID: ${assessment.id})`);
    return assessment;
  } catch (err) {
    error(`Failed to create assessment for topic ${topicId}: ${err.message}`);
    throw err;
  }
}

// Main population function
async function populateDatabase() {
  try {
    log('🚀 Starting database population...');
    
    // Authenticate first
    const authenticated = await authenticate();
    if (!authenticated) {
      throw new Error('Authentication failed');
    }
    
    // Check if topics already exist
    try {
      const existingTopics = await makeApiRequest('/topics');
      if (existingTopics.length > 0) {
        warn(`Found ${existingTopics.length} existing topics. Skipping population to avoid duplicates.`);
        warn('Use --force flag to populate anyway.');
        return;
      }
    } catch (err) {
      log('Could not check existing topics, proceeding with population...');
    }
    
    let totalTopicsCreated = 0;
    let totalLessonsCreated = 0;
    let totalAssessmentsCreated = 0;
    
    // Create each topic with its lessons and assessment
    for (const topicData of codingTopics) {
      try {
        // Create topic
        const topic = await createTopic(topicData);
        totalTopicsCreated++;
        
        // Create lessons
        if (topicData.lessons && topicData.lessons.length > 0) {
          const lessons = await createLessons(topic.id, topicData.lessons);
          totalLessonsCreated += lessons.length;
        }
        
        // Create assessment
        if (topicData.assessment) {
          await createAssessment(topic.id, topicData.assessment);
          totalAssessmentsCreated++;
        }
        
        log(`✅ Completed topic: ${topic.title}`);
        
      } catch (err) {
        error(`Failed to process topic ${topicData.title}: ${err.message}`);
      }
    }
    
    log('🎉 Database population completed!');
    log(`📊 Summary:`);
    log(`   - Topics created: ${totalTopicsCreated}`);
    log(`   - Lessons created: ${totalLessonsCreated}`);
    log(`   - Assessments created: ${totalAssessmentsCreated}`);
    
  } catch (err) {
    error(`Database population failed: ${err.message}`);
    process.exit(1);
  }
}

// Check for force flag
const forcePopulate = process.argv.includes('--force');

if (forcePopulate) {
  log('🔄 Force populate mode enabled');
}

// Run the population
populateDatabase();