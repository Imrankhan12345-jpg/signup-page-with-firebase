// Firebase Setup
const firebaseConfig = {
  apiKey: "AIzaSyD1iVHNlUP1TGBtinqEjxmQcnuKJEwXFIg",
  authDomain: "signin-with-843cb.firebaseapp.com",
  databaseURL: "https://signin-with-843cb-default-rtdb.firebaseio.com",
  projectId: "signin-with-843cb",
  storageBucket: "signin-with-843cb.firebasestorage.app",
  messagingSenderId: "674994085502",
  appId: "1:674994085502:web:eeb3e807f6eec9ae31822f"
};
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

const targetKey = localStorage.getItem("targetUserKey");
const targetName = localStorage.getItem("targetUserName");

const userNameSpan = document.getElementById("userName");
const authEmail = document.getElementById("authEmail");
const authPassword = document.getElementById("authPassword");
const verifyBtn = document.getElementById("verifyBtn");
const toastContainer = document.getElementById("toast-container");

if (targetName) {
    userNameSpan.textContent = targetName;
}

// Toggle Dark / Light Theme Function
function toggleTheme() {
    const html = document.documentElement;
    const themeIcon = document.getElementById('themeIcon');
    const themeText = document.getElementById('themeText');
    const currentTheme = html.getAttribute('data-theme');

    if (currentTheme === 'dark') {
        html.setAttribute('data-theme', 'light');
        if (themeIcon) themeIcon.className = 'fa-solid fa-sun';
        if (themeText) themeText.textContent = 'Light';
    } else {
        html.setAttribute('data-theme', 'dark');
        if (themeIcon) themeIcon.className = 'fa-solid fa-moon';
        if (themeText) themeText.textContent = 'Dark';
    }
}

// Toggle Password Show / Hide Functionality
function togglePasswordVisibility() {
    const passInput = document.getElementById("authPassword");
    const passIcon = document.getElementById("togglePassIcon");
    if (passInput.type === "password") {
        passInput.type = "text";
        passIcon.className = "fa-solid fa-eye-slash toggle-password";
    } else {
        passInput.type = "password";
        passIcon.className = "fa-solid fa-eye toggle-password";
    }
}

// Strict Email Validation (Gmail specifically requires .com)
function isValidEmail(email) {
    const cleanEmail = email.toLowerCase().trim();
    
    // Standard email structure check
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(cleanEmail)) {
        return false;
    }

    // Specific strict check for gmail domain (.com only)
    if (cleanEmail.includes("@gmail.")) {
        return cleanEmail.endsWith("@gmail.com");
    }

    return true;
}

// Check inputs state and enable/disable button
function checkInputs() {
    const emailVal = authEmail.value.trim();
    const passwordVal = authPassword.value.trim();
    
    // Enabled only if email is strictly valid and password has at least 6 characters
    if (isValidEmail(emailVal) && passwordVal.length >= 6) {
        verifyBtn.disabled = false;
    } else {
        verifyBtn.disabled = true;
    }
}

// Function to clear inputs
function clearInputs() {
    if (authEmail) authEmail.value = "";
    if (authPassword) authPassword.value = "";
    checkInputs();
}

// Ensure fields are empty when page loads
window.addEventListener("pageshow", () => {
    clearInputs();
});

function showToast(message, isError = true) {
    toastContainer.innerHTML = "";
    const toast = document.createElement("div");
    toast.className = "custom-toast";
    toast.style.borderLeftColor = isError ? "#ef4444" : "#10b981";
    toast.innerHTML = `<span>${message}</span>`;
    toastContainer.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

// Input Event Listeners for enabling/disabling button dynamically
authEmail.addEventListener("input", checkInputs);
authPassword.addEventListener("input", checkInputs);

// Enter Key Navigation & Validation
authEmail.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        e.preventDefault();
        const emailVal = authEmail.value.trim();
        
        if (!isValidEmail(emailVal)) {
            showToast("please enter proper email");
        } else {
            authPassword.focus();
        }
    }
});

authPassword.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        e.preventDefault();
        const emailVal = authEmail.value.trim();
        const passwordVal = authPassword.value.trim();

        if (!isValidEmail(emailVal)) {
            showToast("please enter proper email");
            authEmail.focus();
        } else if (passwordVal.length < 6) {
            showToast("Please enter at least 6 characters for password!");
        } else {
            if (!verifyBtn.disabled) {
                verifyBtn.click();
            }
        }
    }
});

verifyBtn.addEventListener("click", () => {
    const emailVal = authEmail.value.trim();
    const passwordVal = authPassword.value.trim();

    if (!isValidEmail(emailVal)) {
        showToast("please enter proper email");
        return;
    }

    if (passwordVal.length < 6) {
        showToast("Please enter at least 6 characters for password!");
        return;
    }

    // Verify User details from Firebase
    database.ref("user/" + targetKey).once("value").then((snapshot) => {
        const userData = snapshot.val();

        if (!userData) {
            clearInputs();
            showToast("incorrect email and password");
            return;
        }

        const isEmailMatch = userData.email.toLowerCase() === emailVal.toLowerCase();
        const isPasswordMatch = userData.password === passwordVal;

        if (isEmailMatch && isPasswordMatch) {
            localStorage.setItem("targetUserEmail", userData.email);
            showToast("Verification Successful! Redirecting...", false);
            
            // Clear inputs immediately on success
            clearInputs();
            
            setTimeout(() => {
                window.location.href = "updatePassword.html";
            }, 1200);
        } else if (!isEmailMatch && !isPasswordMatch) {
            // Both email and password incorrect
            clearInputs();
            showToast("incorrect email and password");
        } else {
            // Either email is correct or password is correct
            clearInputs();
            showToast("incorrect email or password");
        }
    }).catch(() => {
        clearInputs();
        showToast("incorrect email and password");
    });
});