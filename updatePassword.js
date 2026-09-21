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
const targetEmail = localStorage.getItem("targetUserEmail");

const userNameSpan = document.getElementById("userName");
const userEmailInput = document.getElementById("userEmail");
const newPasswordInput = document.getElementById("newPassword");
const confirmPasswordInput = document.getElementById("confirmPassword");
const updateBtn = document.getElementById("updateBtn");
const toastContainer = document.getElementById("toast-container");

// Show Name & Fixed Email
if (targetName) userNameSpan.textContent = targetName;
if (targetEmail) userEmailInput.value = targetEmail;

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

// Toggle Password Field Eye Icon Visibility
function togglePasswordVisibility(inputId, iconElem) {
    const passInput = document.getElementById(inputId);
    if (passInput.type === "password") {
        passInput.type = "text";
        iconElem.className = "fa-solid fa-eye-slash toggle-password";
    } else {
        passInput.type = "password";
        iconElem.className = "fa-solid fa-eye toggle-password";
    }
}

function showToast(message, isError = true) {
    toastContainer.innerHTML = "";
    const toast = document.createElement("div");
    toast.className = "custom-toast";
    toast.style.borderLeftColor = isError ? "#ef4444" : "#10b981";
    toast.innerHTML = `<span>${message}</span>`;
    toastContainer.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

// Function to check input state and enable/disable button
function checkInputs() {
    const newPassVal = newPasswordInput.value.trim();
    const confirmPassVal = confirmPasswordInput.value.trim();

    // Enable button only if both inputs have at least 6 characters
    if (newPassVal.length >= 6 && confirmPassVal.length >= 6) {
        updateBtn.disabled = false;
    } else {
        updateBtn.disabled = true;
    }
}

// Attach input listeners
newPasswordInput.addEventListener("input", checkInputs);
confirmPasswordInput.addEventListener("input", checkInputs);

// Enter key handling on Change Password field
newPasswordInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        e.preventDefault();
        const newPassVal = newPasswordInput.value.trim();
        if (!newPassVal) {
            showToast("please enter email address");
        } else if (newPassVal.length < 6) {
            showToast("Password must be at least 6 characters long!");
        } else {
            confirmPasswordInput.focus();
        }
    }
});

// Enter key handling on Confirm Password field
confirmPasswordInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        e.preventDefault();
        const newPassVal = newPasswordInput.value.trim();
        const confirmPassVal = confirmPasswordInput.value.trim();

        if (!newPassVal) {
            showToast("please enter email address");
            newPasswordInput.focus();
        } else if (newPassVal.length < 6) {
            showToast("Password must be at least 6 characters long!");
            newPasswordInput.focus();
        } else if (!confirmPassVal) {
            showToast("please enter confirm password");
        } else if (confirmPassVal.length < 6) {
            showToast("Confirm Password must be at least 6 characters long!");
        } else {
            // If button is enabled, trigger click
            if (!updateBtn.disabled) {
                updateBtn.click();
            }
        }
    }
});

// Submit/Update Password logic
updateBtn.addEventListener("click", () => {
    const newPassVal = newPasswordInput.value.trim();
    const confirmPassVal = confirmPasswordInput.value.trim();

    if (!newPassVal) {
        showToast("please enter email address");
        return;
    }

    if (newPassVal.length < 6) {
        showToast("Password must be at least 6 characters long!");
        return;
    }

    if (!confirmPassVal) {
        showToast("please enter confirm password");
        return;
    }

    if (confirmPassVal.length < 6) {
        showToast("Confirm Password must be at least 6 characters long!");
        return;
    }

    // Check if passwords match
    if (newPassVal !== confirmPassVal) {
        // Only clear confirm password, keep new password as it is
        confirmPasswordInput.value = "";
        checkInputs();
        showToast("please enter correct confirm password");
        confirmPasswordInput.focus();
        return;
    }

    // Update password in Firebase Realtime Database
    database.ref("user/" + targetKey).update({
        password: newPassVal
    }).then(() => {
        showToast("Password updated successfully!", false);
        setTimeout(() => {
            window.location.href = "passwordChange.html";
        }, 1200);
    }).catch((err) => {
        showToast("Error updating password: " + err.message);
    });
});