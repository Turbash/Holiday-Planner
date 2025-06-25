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
    const res = await fetch('https://holiday-planner-db.onrender.com/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });
    let data;
    try {
        data = await res.json();
    } catch {
        data = { message: await res.text() };
        loginButton.disabled = false;
        loginButton.innerText = "Login";
        loginButton.style.cursor = "";
    }
    document.getElementById('login-message').textContent = data.message || '';
    if (res.ok && data.token) {
        localStorage.setItem('token', data.token);
        setTimeout(() => window.location.href = "index.html", 1000);
    }
};

registerForm.onsubmit = async (e) => {
    e.preventDefault();
    registerButton.disabled = true;
    registerButton.innerText = "Registering...";
    registerButton.style.cursor = "not-allowed";
    const email = registerForm.email.value;
    const password = registerForm.password.value;
    const res = await fetch('https://holiday-planner-db.onrender.com/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });
    let data;
    try {
        data = await res.json();
    } catch {
        data = { message: await res.text() };
        registerButton.disabled = false;
        registerButton.innerText = "Register";
        registerButton.style.cursor = "";
    }
    document.getElementById('register-message').textContent = data.message || '';
    if (res.ok && data.token) {
        localStorage.setItem('token', data.token);
        setTimeout(() => window.location.href = "index.html", 1000);
    }
};