const mobileMenu = document.getElementById('mobile-menu');
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const darkModeToggle = document.getElementById('dark-mode-toggle');
const loginButton = document.getElementById('login-button');
const loginModal = document.getElementById('login-modal');
const closeModalLogin = document.getElementById('close-modal-login');
const closeModalRegister = document.getElementById('close-modal-register');
const registerButton = document.getElementById('register-button');
const registerModal = document.getElementById('register-modal');
const backToLogin = document.getElementById('back-to-login');
const userProfileNav = document.getElementById('user-profile-nav');

// Check dark mode
if(localStorage.getItem('theme') === 'dark') {
    darkModeToggle.innerHTML = '☀️';
} else {
    darkModeToggle.innerHTML = '🌙';
}

// Profile in navbar when logged in
if(localStorage.getItem('userId') !== null) {
    loginButton.classList.add('hidden');
    userProfileNav.classList.remove('hidden');
    userProfileNav.innerText = localStorage.getItem('userName');
    let userProfilePic = document.createElement('img');
    userProfilePic.src = localStorage.getItem('userImage');
    userProfileNav.appendChild(userProfilePic);
    userProfilePic = document.querySelector('#user-profile-nav img');
    userProfilePic.classList.add('w-8', 'h-8', 'rounded-full', 'object-cover');
}

// Profile in navbar modal 
userProfileNav.addEventListener('click', function() {
    document.querySelector('#user-profile-modal').classList.remove('hidden');
});

// Login Request
const loginRequest = 'https://v2.api.noroff.dev/auth/login';
const loginUser = document.getElementById('email-login');
const loginPassword = document.getElementById('password-login');

// Login Modal
loginButton.addEventListener('click', openLoginModal);
document.querySelector('#mobile-menu-button').addEventListener('click', openLoginModal);

function openLoginModal () {
    loginModal.classList.remove('hidden');
    registerModal.classList.add('hidden');
}

// Register Modal
registerButton.addEventListener('click', function() {
    registerModal.classList.remove('hidden');
    loginModal.classList.add('hidden');
});

// Back to Login from Register
backToLogin.addEventListener('click', function() {
    registerModal.classList.add('hidden');
    loginModal.classList.remove('hidden');
});

// Close Modal
closeModalLogin.addEventListener('click', function() {
    loginModal.classList.add('hidden');
    registerModal.classList.add('hidden');
});

// Close Modal... Again
closeModalRegister.addEventListener('click', function() {
    registerModal.classList.add('hidden');
    loginModal.classList.add('hidden');
});

// Do the Login
let loginForm = document.getElementById('login-form');
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    login();
});

async function login() {
    const loginEmail = loginUser.value;
    const loginPass = loginPassword.value;

    const loginResponse = await fetch(loginRequest, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email: loginEmail,
            password: loginPass,
        }),
    });
    
    if(loginResponse.ok) {
        const loginData = await loginResponse.json();
        localStorage.setItem('token', loginData.data.accessToken);
        localStorage.setItem('userId', loginData.data.email);
        localStorage.setItem('userName', loginData.data.name);
        localStorage.setItem('userImage', loginData.data.avatar.url);

        window.location.href = '/';
        console.log(loginData);
    } else {
        console.error('Login failed', await loginResponse.text());
    }
}

let registerForm = document.getElementById('register-form');
registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    register();
});

async function register() {
    const registerName = document.getElementById('username').value;
    const registerEmail = document.getElementById('email-register').value;
    const registerPass = document.getElementById('password-register').value;

    const registerResponse = await fetch('https://v2.api.noroff.dev/auth/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            name: registerName,
            email: registerEmail,
            password: registerPass,
        }),
    });

    if(registerResponse.ok) {
        const registerData = await registerResponse.json();
        console.log(registerData);
        alert('Registration successful! Please login to continue.');
        window.location.href = '/';
    } else {
        console.error('Registration failed', await registerResponse.text());
    }
}


// Toggle Dark Mode
darkModeToggle.addEventListener('click', function() {
    let theme = localStorage.theme;
    if (theme === 'dark') {
        localStorage.theme = 'light';
        document.querySelector('nav').classList.remove('bg-gray-800');
        darkModeToggle.innerHTML = '🌙';
    } else {
        localStorage.theme = 'dark';
        document.querySelector('nav').classList.add('bg-gray-800');
        darkModeToggle.innerHTML = '☀️';
    }
});

document.documentElement.classList.toggle(
    'dark',
    localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
);