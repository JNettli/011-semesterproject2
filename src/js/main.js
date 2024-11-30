import { login, register, logout } from './auth/auth.js';
import { openLoginModal, closeModal, getProfileInfoToModal } from './modal.js';

const darkModeToggle = document.getElementById('dark-mode-toggle');
const userProfileNav = document.getElementById('user-profile-nav');
const modalBg = document.getElementById('secret-modal-bg');
const loginModal = document.getElementById('login-modal');
const registerModal = document.getElementById('register-modal');
const loginButton = document.getElementById('login-button');

// Logout
document.getElementById('logout-button').addEventListener('click', () => {
    logout();
});

// Login Modal
loginButton.addEventListener('click', () => openLoginModal(loginModal, registerModal));

let loginForm = document.getElementById('login-form');
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    login();
});

let registerForm = document.getElementById('register-form');
registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    register();
});

// Register Modal
document.getElementById('register-button').addEventListener('click', () => {
    registerModal.classList.remove('hidden');
    loginModal.classList.add('hidden');
});

// Back to Login from Register
document.getElementById('back-to-login').addEventListener('click', () => {
    registerModal.classList.add('hidden');
    loginModal.classList.remove('hidden');
});

// Close Modal
document.getElementById('close-modal-login').addEventListener('click', () => closeModal(loginModal, registerModal));
document.getElementById('close-modal-register').addEventListener('click', () => closeModal(loginModal, registerModal));

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

// Minimenu for user profile
userProfileNav.addEventListener('click', function() {
    modalBg.classList.remove('hidden');
    getProfileInfoToModal();

    const rect = userProfileNav.getBoundingClientRect();
    const modal = document.getElementById('user-profile-modal');
    modal.style.top = `${rect.bottom + window.scrollY}px`;
    const modalWidth = modal.offsetWidth;
    modal.style.left = `${rect.right - modalWidth}px`;
    const viewportWidth = window.innerWidth;
    if (rect.right > viewportWidth) {
        modal.style.left = `${viewportWidth - modalWidth}px`;
    }
});

// Function to close the profile modal
function closeProfileModal() {
    modalBg.classList.add('hidden');
}

// Close the modal when clicking the close button
document.querySelector('#closeModal').addEventListener('click', closeProfileModal);

// When clicking outside the modal, close it
window.onclick = function(e) {
    if (e.target === modalBg) {
        modalBg.classList.add('hidden');
    }
}

loginModal.addEventListener('click', function(event) {
    if (event.target === loginModal) {
        loginModal.classList.add('hidden');
    }
});

registerModal.addEventListener('click', function(event) {
    if (event.target === registerModal) {
        registerModal.classList.add('hidden');
    }
});

// This is where Dark Mode stuff happens

const darkIcon = document.querySelector('#dark-icon');
const lightIcon = document.querySelector('#light-icon');

if (localStorage.getItem('theme') === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    darkIcon.classList.remove('hidden');
} else {
    lightIcon.classList.remove('hidden');
}
var themeToggle = document.getElementById('dark-mode-toggle');

themeToggle.addEventListener('click', function() {

    // toggle icons inside button
    lightIcon.classList.toggle('hidden');
    darkIcon.classList.toggle('hidden');

    // if set via local storage previously
    if (localStorage.getItem('theme')) {
        if (localStorage.getItem('theme') === 'light') {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    } else {
        if (document.documentElement.classList.contains('dark')) {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        } else {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        }
    }
});