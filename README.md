# GitHub Issues Tracker

A web-based GitHub Issues Tracker application built with HTML, Tailwind CSS, DaisyUI, and Vanilla JavaScript.


## Features

- **Login System** – Sign in with demo credentials (admin / admin123)
- **Issue Dashboard** – View all issues in a 4-column card grid
- **Tab Filtering** – Filter issues by All, Open, or Closed status
- **Search** – Search issues by keyword
- **Detail Modal** – Click any card to view full issue details
- **Loading Spinner** – Visual feedback during data fetch
- **Responsive Design** – Works on mobile, tablet, and desktop
- **Color-coded Cards** – Green border for open, purple for closed

## Technology Stack

- HTML5
- Tailwind CSS + DaisyUI
- Vanilla JavaScript (ES6+)

## Demo Credentials

- **Username:** admin
- **Password:** admin123

---

## JavaScript Concepts

### 1. What is the difference between var, let, and const?

`var`, `let`, and `const` are all used to declare variables in JavaScript, but they differ in scope, hoisting, and reassignment.

- **var** – Has function scope, meaning it is accessible throughout the entire function where it is declared. It is hoisted to the top of its scope and initialized with `undefined`. It can be redeclared and reassigned.
- **let** – Has block scope, meaning it is only accessible within the `{}` block where it is declared (like inside an `if` or `for` block). It is hoisted but not initialized, so accessing it before declaration gives a ReferenceError (Temporal Dead Zone). It can be reassigned but not redeclared in the same scope.
- **const** – Also has block scope like `let`. It must be initialized at the time of declaration and cannot be reassigned afterward. However, if the value is an object or array, the contents (properties or elements) can still be modified.

### 2. What is the spread operator (...)?

The spread operator (`...`) is used to expand or "spread" the elements of an iterable (like an array, string, or object) into individual elements. It is very useful for copying, merging, and passing data.

**Use cases:**
- **Copying arrays:** `const copy = [...originalArray]` creates a shallow copy.
- **Merging arrays:** `const merged = [...arr1, ...arr2]` combines two arrays into one.
- **Copying objects:** `const copy = {...originalObject}` creates a shallow copy of an object.
- **Merging objects:** `const merged = {...obj1, ...obj2}` merges two objects.
- **Function arguments:** `Math.max(...numbers)` spreads array elements as individual arguments.

### 3. What is the difference between map(), filter(), and forEach()?

All three are array methods that iterate over each element, but they serve different purposes:

- **forEach()** – Executes a provided function once for each array element. It does not return a new array; it is used for side effects like logging or modifying external variables.
- **map()** – Creates a new array by applying a function to every element of the original array. Each element is transformed, and the result is returned as a new array of the same length.
- **filter()** – Creates a new array containing only the elements that pass a test (i.e., the callback returns `true`). The resulting array can be shorter than the original.

In short: `forEach` is for doing something with each item, `map` is for transforming each item, and `filter` is for selecting certain items.

### 4. What is an arrow function?

An arrow function is a shorter syntax for writing functions in JavaScript, introduced in ES6. Instead of using the `function` keyword, you use `=>`.

**Example:**
```js
// Traditional function
function add(a, b) {
    return a + b;
}

// Arrow function
const add = (a, b) => a + b;
```

Key differences from regular functions: arrow functions do not have their own `this` context (they inherit `this` from the surrounding scope), they cannot be used as constructors with `new`, and they do not have the `arguments` object.

### 5. What are template literals?

Template literals are a way to create strings in JavaScript using backticks (`` ` ``) instead of regular quotes. They were introduced in ES6 and offer powerful features.

**Features:**
- **String interpolation:** You can embed variables and expressions inside the string using `${}`.
  ```js
  const name = "Rahat";
  console.log(`Hello, ${name}!`); // Output: Hello, Rahat!
  ```
- **Multi-line strings:** You can write strings across multiple lines without using `\n`.
  ```js
  const message = `This is
  a multi-line
  string.`;
  ```
- **Expression evaluation:** You can put any JavaScript expression inside `${}`, like `${2 + 3}` or `${user.name.toUpperCase()}`.
"# testing" 
