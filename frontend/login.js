const loginTab = document.getElementById('login-tab');
const registerTab = document.getElementById('register-tab');
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
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
    const email = loginForm.email.value;
    const password = loginForm.password.value;
    const res = await fetch('http://localhost:3000/login', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });
    const msg = await res.text();
    console.log(res)
    console.log(msg)
    document.getElementById('login-message').textContent = msg;
    if (res.ok) setTimeout(() => window.location.href = "index.html", 1000);
};

registerForm.onsubmit = async (e) => {
    e.preventDefault();
    const email = registerForm.email.value;
    const password = registerForm.password.value;
    const res = await fetch('http://localhost:3000/register', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });
    const msg = await res.text();
    console.log(res);
    console.log(msg);
    document.getElementById('register-message').textContent = msg;
    if (res.ok) setTimeout(() => window.location.href = "index.html", 1000);
};