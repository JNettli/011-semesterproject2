import { loginRequest, registerRequest, profileRequest, headerKey, checkLogin } from '../constants.js';

export async function login() {
    const loginEmail = document.getElementById('email-login').value;
    const loginPass = document.getElementById('password-login').value;

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
    
    if (loginResponse.ok) {
        const loginData = await loginResponse.json();
        localStorage.setItem('token', loginData.data.accessToken);
        localStorage.setItem('userId', loginData.data.email);
        localStorage.setItem('userName', loginData.data.name);
        localStorage.setItem('userImage', loginData.data.avatar.url);

        const profileInfo = await fetch(`${profileRequest}${loginData.data.name}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${loginData.data.accessToken}`,
                'X-Noroff-API-Key': headerKey,
            }
        });
        if (profileInfo.ok) {
            const profileData = await profileInfo.json();
            localStorage.setItem('credits', profileData.data.credits);
        } else {
            console.error('Failed to fetch profile info', await profileInfo.text());
        }

        window.location.href = '/';
    } else {
        const err = await loginResponse.json();
        console.log(err.errors[0].message);
        const errorMessage = document.createElement('p');
        const loginForm = document.querySelector('#login-form');
        errorMessage.classList.add('text-red-500', 'dark:text-red-400');
        errorMessage.innerText = `${err.errors[0].message}`;
        loginForm.appendChild(errorMessage);
        setTimeout(() => {
            errorMessage.innerText = "";
        }, 6000);
    }
}

export async function register() {
    const registerName = document.getElementById('username').value;
    const registerEmail = document.getElementById('email-register').value;
    const registerPass = document.getElementById('password-register').value;

    const registerResponse = await fetch(registerRequest, {
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

    if (registerResponse.ok) {
        alert('Registration successful! Please login to continue.');
        window.location.href = '/';
    } else {
        const err = await loginResponse.json();
        console.log(err.errors[0].message);
        const errorMessage = document.createElement('p');
        const registerForm = document.querySelector('#register-form');
        errorMessage.classList.add('text-red-500', 'dark:text-red-400');
        errorMessage.innerText = `${err.errors[0].message}`;
        registerForm.appendChild(errorMessage);
        setTimeout(() => {
            errorMessage.innerText = "";
        }, 6000);
    }
}

// Logout
export function logout() {
    localStorage.clear();
    window.location.href = '/';
}

// Get user profile info


export async function updateProfileInfo() {
    if (localStorage.getItem('userId') !== null) {
        const userProfileId = localStorage.getItem('userName');
        const response = await fetch(`${profileRequest}${userProfileId}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'X-Noroff-API-Key': headerKey,
            },
        });
        
        const json = await response.json();
        const profile = json.data;
        localStorage.setItem('userImage', profile.avatar.url);
        localStorage.setItem('credits', profile.credits);
    }
}