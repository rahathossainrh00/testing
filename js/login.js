// ========================
// Login Page Logic
// ========================

// Demo credentials
const DEMO_USERNAME = "admin";
const DEMO_PASSWORD = "admin123";

// If user is already logged in, redirect to main page
if (sessionStorage.getItem("isLoggedIn") === "true") {
    window.location.href = "main.html";
}

// Get form elements
const loginForm = document.getElementById("login-form");
const usernameInput = document.getElementById("username-input");
const passwordInput = document.getElementById("password-input");
const errorMessage = document.getElementById("error-message");

// Handle form submission
loginForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const enteredUsername = usernameInput.value.trim();
    const enteredPassword = passwordInput.value.trim();

    // Validate credentials
    if (enteredUsername === DEMO_USERNAME && enteredPassword === DEMO_PASSWORD) {
        // Save login state and redirect
        sessionStorage.setItem("isLoggedIn", "true");
        sessionStorage.setItem("username", enteredUsername);
        window.location.href = "main.html";
    } else {
        // Show error message
        errorMessage.classList.remove("hidden");

        // Shake the card for feedback
        const card = document.getElementById("login-card");
        card.classList.add("animate-shake");
        setTimeout(() => card.classList.remove("animate-shake"), 500);
    }
});

// Hide error message when user starts typing
usernameInput.addEventListener("input", () => errorMessage.classList.add("hidden"));
passwordInput.addEventListener("input", () => errorMessage.classList.add("hidden"));
