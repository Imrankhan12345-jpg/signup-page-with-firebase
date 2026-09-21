// Dynamic CSS Inject for Custom Glassmorphism Toast
const toastStyles = `
#toastContainer {
  position: fixed;
  top: 24px;
  right: 24px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 12px;
  pointer-events: none;
}

.custom-toast {
  pointer-events: auto;
  min-width: 280px;
  max-width: 380px;
  padding: 14px 20px;
  border-radius: 16px;
  font-size: 14px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 12px;
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  box-shadow: 0 20px 40px -15px rgba(0, 0, 0, 0.35);
  animation: toastSlideIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
  transition: all 0.3s ease;
}

/* DARK MODE STYLES */
:root[data-theme="dark"] .toast-error {
  background: rgba(244, 63, 94, 0.15);
  border: 1px solid rgba(244, 63, 94, 0.4);
  color: #fda4af;
  box-shadow: 0 10px 30px rgba(244, 63, 94, 0.2);
}
:root[data-theme="dark"] .toast-error i {
  color: #f43f5e;
  font-size: 18px;
}

:root[data-theme="dark"] .toast-success {
  background: rgba(16, 185, 129, 0.15);
  border: 1px solid rgba(16, 185, 129, 0.4);
  color: #6ee7b7;
  box-shadow: 0 10px 30px rgba(16, 185, 129, 0.2);
}
:root[data-theme="dark"] .toast-success i {
  color: #10b981;
  font-size: 18px;
}

/* LIGHT MODE STYLES */
:root[data-theme="light"] .toast-error {
  background: rgba(255, 241, 242, 0.95);
  border: 1px solid rgba(244, 63, 94, 0.3);
  color: #e11d48;
  box-shadow: 0 10px 25px rgba(225, 29, 72, 0.15);
}
:root[data-theme="light"] .toast-error i {
  color: #e11d48;
  font-size: 18px;
}

:root[data-theme="light"] .toast-success {
  background: rgba(236, 253, 245, 0.95);
  border: 1px solid rgba(16, 185, 129, 0.3);
  color: #047857;
  box-shadow: 0 10px 25px rgba(4, 120, 87, 0.15);
}
:root[data-theme="light"] .toast-success i {
  color: #10b981;
  font-size: 18px;
}

@keyframes toastSlideIn {
  0% { opacity: 0; transform: translateX(100%) scale(0.9); }
  100% { opacity: 1; transform: translateX(0) scale(1); }
}

.toast-fade-out {
  opacity: 0;
  transform: translateX(120%) scale(0.85);
  transition: all 0.35s cubic-bezier(0.4, 0, 1, 1);
}
`;

const styleSheet = document.createElement("style");
styleSheet.innerText = toastStyles;
document.head.appendChild(styleSheet);

// Elements Selection
var email = document.getElementById("email");
var password = document.getElementById("password");
var contact = document.getElementById("name");
var submitbtn = document.getElementById("signup");

let toastTimer = null;

// Create Toast Container
function getToastContainer() {
    let container = document.getElementById("toastContainer");
    if (!container) {
        container = document.createElement("div");
        container.id = "toastContainer";
        document.body.appendChild(container);
    }
    return container;
}

// Custom Glassmorphism Toast Notification (Instant Refresh on New Action)
function showToast(message, isError = true) {
    const toastContainer = getToastContainer();
    
    // Clear old toast immediately when a new trigger occurs
    toastContainer.innerHTML = "";
    if (toastTimer) clearTimeout(toastTimer);

    const toast = document.createElement("div");
    toast.className = `custom-toast ${isError ? "toast-error" : "toast-success"}`;

    const icon = isError ? "fa-circle-xmark" : "fa-circle-check";
    toast.innerHTML = `<i class="fa-solid ${icon}"></i> <span>${message}</span>`;

    toastContainer.appendChild(toast);

    // Auto remove after 4 seconds
    toastTimer = setTimeout(() => {
        toast.classList.add("toast-fade-out");
        setTimeout(() => {
            toast.remove();
        }, 350);
    }, 4000);
}

// Toggle Theme Function
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

// Google Sign-In Function
function SignLogin() {
    var provider = new firebase.auth.GoogleAuthProvider();
    provider.addScope('https://www.googleapis.com/auth/contacts.readonly');
    firebase.auth()
        .signInWithPopup(provider)
        .then((snap) => {
            console.log(snap.user);
            console.log(snap.user.email);
            console.log(snap.user.displayName);
            console.log(snap.user.photoURL);
            showToast("Google Login Successful!", false);
        })
        .catch((e) => {
            console.log(e);
            showToast(e.message || "Google Sign-In failed", true);
        });
}

// GitHub Sign-In Function
function GithubLogin() {
    var provider = new firebase.auth.GithubAuthProvider();
    firebase.auth()
        .signInWithPopup(provider)
        .then((snap) => {
            console.log(snap.user);
            showToast("GitHub Login Successful!", false);
        })
        .catch((e) => {
            console.log(e);
            showToast(e.message || "GitHub Sign-In failed", true);
        });
}

// STEP-BY-STEP STEP VALIDATION FUNCTION WITH AUTO FOCUS
function ValidatorFunction() {
    var emailValue = email ? email.value.trim().toLowerCase() : "";
    var passwordValue = password ? password.value.trim() : "";
    var contactValue = contact ? contact.value.trim() : "";

    // 1. EMAIL VALIDATION STEPS
    if (emailValue === "") {
        showToast("Please enter email address", true);
        if (email) email.focus();
        return false;
    }

    if (!emailValue.includes("@")) {
        showToast("Please add @ in your email address", true);
        if (email) email.focus();
        return false;
    }

    if (!emailValue.includes("gmail")) {
        showToast("Please add gmail in your email address", true);
        if (email) email.focus();
        return false;
    }

    if (!emailValue.includes(".com")) {
        showToast("Please add .com in your email address", true);
        if (email) email.focus();
        return false;
    }

    var fullEmailPattern = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    if (!fullEmailPattern.test(emailValue)) {
        showToast("Please enter a valid email address", true);
        if (email) email.focus();
        return false;
    }

    // 2. PASSWORD VALIDATION STEPS
    if (passwordValue === "") {
        showToast("Please enter your password", true);
        if (password) password.focus();
        return false;
    }

    if (passwordValue.length < 6) {
        showToast("Password must be at least 6 characters", true);
        if (password) password.focus();
        return false;
    }

    // 3. FULL NAME VALIDATION STEPS
    if (contactValue === "") {
        showToast("Please enter your name", true);
        if (contact) contact.focus();
        return false;
    }

    return true;
}

// Submit Function for Firebase Sign-Up
async function Submit() {
    try {
        const result = await firebase.auth().createUserWithEmailAndPassword(email.value.trim(), password.value.trim());
        console.log(result.user.uid);

        await firebase.database().ref("user").child(result.user.uid).set({
            email: email.value.trim(),
            password: password.value.trim(),
            name: contact.value.trim()
        });

        showToast("Account created successfully!", false);

        // Account successfully banne ke baad saare inputs empty karna
        if (email) email.value = "";
        if (password) password.value = "";
        if (contact) contact.value = "";

    } catch (error) {
        console.error(error);
        showToast(error.message || "Signup failed!", true);
    }
}

// Event Listeners for Step-by-Step Navigation
if (email) {
    email.addEventListener("keypress", function (e) {
        if (e.key === "Enter") {
            var emailValue = email.value.trim().toLowerCase();
            if (emailValue === "") {
                showToast("Please enter email address", true);
            } else if (!emailValue.includes("@")) {
                showToast("Please add @ in your email address", true);
            } else if (!emailValue.includes("gmail")) {
                showToast("Please add gmail in your email address", true);
            } else if (!emailValue.includes(".com")) {
                showToast("Please add .com in your email address", true);
            } else if (!/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(emailValue)) {
                showToast("Please enter a valid email address", true);
            } else {
                if (password) password.focus();
            }
        }
    });
}

if (password) {
    password.addEventListener("keypress", function (e) {
        if (e.key === "Enter") {
            var passwordValue = password.value.trim();
            if (passwordValue === "") {
                showToast("Please enter your password", true);
            } else if (passwordValue.length < 6) {
                showToast("Password must be at least 6 characters", true);
            } else {
                if (contact) contact.focus();
            }
        }
    });
}

if (contact) {
    contact.addEventListener("keypress", function (e) {
        if (e.key === "Enter") {
            if (ValidatorFunction()) {
                Submit();
            }
        }
    });
}

if (submitbtn) {
    submitbtn.addEventListener("click", function (e) {
        e.preventDefault();
        if (ValidatorFunction()) {
            Submit();
        }
    });
}