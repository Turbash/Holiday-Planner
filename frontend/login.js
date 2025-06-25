const loginTab = document.getElementById('login-tab');
const registerTab = document.getElementById('register-tab');
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');  
const loginButton = document.getElementById('login-button');
const registerButton = document.getElementById('register-button');
loginTab.onclick = () => {
    loginTab.classList.add('active');
    registerTab.classList.remove('active');
    loginForm.style.display = '';
    registerForm.style.display = 'none';
};
registerTab.onclick = () => {
    registerTab.classList.add('active');
    loginTab.classList.remove('active');
    registerForm.style.display = '';
    loginForm.style.display = 'none';
};

loginForm.onsubmit = async (e) => {
    e.preventDefault();
    loginButton.disabled = true;
    loginButton.innerText = "Logging in...";
    loginButton.style.cursor = "not-allowed";
    const email = loginForm.email.value;
    const password = loginForm.password.value;
    let res, msg, data;
    try {
        res = await fetch('https://holiday-planner-db.onrender.com/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        msg = await res.text();
        try {
            data = JSON.parse(msg);
        } catch {
            data = { message: msg };
        }

        // Backend responses:
        // 404: "User not found. Register first"
        // 401: "Invalid Credentials"
        // 500: "Error Comparing Passwords"
        // 200: { message: "...", token: "..." }

        if (res.status === 404) {
            document.getElementById('login-message').textContent = data.message || "User not found. Register first";
        } else if (res.status === 401) {
            document.getElementById('login-message').textContent = data.message || "Invalid Credentials";
        } else if (res.status === 500) {
            document.getElementById('login-message').textContent = data.message || "Error Comparing Passwords";
        } else if (res.ok && data.token) {
            document.getElementById('login-message').textContent = data.message || '';
            localStorage.setItem('token', data.token);
            setTimeout(() => window.location.href = "index.html", 1000);
            loginButton.disabled = false;
            loginButton.innerText = "Login";
            loginButton.style.cursor = "";
            return;
        } else {
            document.getElementById('login-message').textContent = data.message || "Login failed";
        }
    } catch (error) {
        document.getElementById('login-message').textContent = "Network error. Please try again.";
    }
    loginButton.disabled = false;
    loginButton.innerText = "Login";
    loginButton.style.cursor = "";
};

registerForm.onsubmit = async (e) => {
    e.preventDefault();
    registerButton.disabled = true;
    registerButton.innerText = "Registering...";
    registerButton.style.cursor = "not-allowed";
    const email = registerForm.email.value;
    const password = registerForm.password.value;
    let res, msg, data;
    try {
        res = await fetch('https://holiday-planner-db.onrender.com/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        msg = await res.text();
        try {
            data = JSON.parse(msg);
        } catch {
            data = { message: msg };
        }
        // Backend responses:
        // 500: "Account Already Exists"
        // 200: { message: "...", token: "..." }

        if (res.status === 500) {
            document.getElementById('register-message').textContent = data.message || "Account Already Exists";
        } else if (res.ok && data.token) {
            document.getElementById('register-message').textContent = data.message || '';
            localStorage.setItem('token', data.token);
            setTimeout(() => window.location.href = "index.html", 1000);
            registerButton.disabled = false;
            registerButton.innerText = "Register";
            registerButton.style.cursor = "";
            return;
        } else if (!res.ok) {
            document.getElementById('register-message').textContent = data.message || "Registration failed";
        }
    } catch (error) {
        document.getElementById('register-message').textContent = "Network error. Please try again.";
    }
    registerButton.disabled = false;
    registerButton.innerText = "Register";
    registerButton.style.cursor = "";
};