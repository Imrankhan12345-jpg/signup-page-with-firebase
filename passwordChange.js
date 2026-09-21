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
const usersRef = database.ref("user");

const displayContainer = document.getElementById("display");
const accountCountEl = document.getElementById("accountCount");

// Toggle Dark / Light Theme
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

// Fetching Users & Live Counting from Firebase
usersRef.on("value", (snapshot) => {
    displayContainer.innerHTML = "";
    const data = snapshot.val();

    if (!data) {
        if (accountCountEl) accountCountEl.textContent = "0";
        displayContainer.innerHTML = `<p style="color:var(--text-muted); text-align:center; padding: 2rem;">No accounts created yet.</p>`;
        return;
    }

    const totalUsers = Object.keys(data).length;
    if (accountCountEl) accountCountEl.textContent = totalUsers;

    for (let key in data) {
        const user = data[key];
        const firstLetter = user.name ? user.name.charAt(0).toUpperCase() : "U";

        displayContainer.innerHTML += `
            <div class="user-card">
                <!-- LEFT SIDE: Account Name -->
                <div class="user-info-left">
                    <div class="avatar">${firstLetter}</div>
                    <div class="details">
                        <span class="acc-label">Account Name</span>
                        <h3>${user.name || 'Unnamed User'}</h3>
                    </div>
                </div>

                <!-- RIGHT SIDE: Change Password Button -->
                <div class="actions-right">
                    <button class="btn-change-password" onclick="goToChangePassword('${key}', '${user.name || ''}')">
                        <i class="fa-solid fa-key"></i> Change Password
                    </button>
                </div>
            </div>
        `;
    }
});

// Redirect to Verification Page
window.goToChangePassword = function(key, name) {
    localStorage.setItem("targetUserKey", key);
    localStorage.setItem("targetUserName", name);
    window.location.href = "verifyAccount.html";
};