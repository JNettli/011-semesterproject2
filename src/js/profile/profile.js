// src/js/profile.js

export function displayUserProfile() {
    const loginButton = document.getElementById('login-button');
    const userProfileNav = document.getElementById('user-profile-nav');
    
    // Profile in navbar when logged in
    if (localStorage.getItem('userId') !== null) {
        loginButton.classList.add('hidden');
        userProfileNav.classList.remove('hidden');
        userProfileNav.innerText = localStorage.getItem('userName');

        const userProfilePic = document.createElement('img');
        userProfilePic.src = localStorage.getItem('userImage');
        userProfileNav.appendChild(userProfilePic);

        userProfilePic.classList.add('w-8', 'h-8', 'rounded-full', 'object-cover');
    }
}

export function setupProfileModal() {
    const userProfileNav = document.getElementById('user-profile-nav');
    const modalBg = document.getElementById('modal-bg'); // Adjust to your modal background ID

    userProfileNav.addEventListener('click', function() {
        modalBg.classList.remove('hidden');
    
        // Get the position of the profile navigation div
        const rect = userProfileNav.getBoundingClientRect();
        
        // Position the modal based on the profile navigation div's position
        const modal = document.getElementById('user-profile-modal');
        modal.style.top = `${rect.bottom + window.scrollY}px`; // Position below the nav
    
        // Set the left position to be the right edge of the nav minus the modal's width
        const modalWidth = modal.offsetWidth; // Get the width of the modal
        modal.style.left = `${rect.right - modalWidth}px`; // Align to the left of the right edge of the nav
    
        // Optional: Ensure the modal doesn't overflow the viewport
        const viewportWidth = window.innerWidth;
        if (rect.right > viewportWidth) {
            modal.style.left = `${viewportWidth - modalWidth}px`; // Adjust if it overflows
        }
    });

    function closeProfileModal() {
        modalBg.classList.add('hidden');
    }

    document.querySelector('#closeModal').addEventListener('click', closeProfileModal);

    window.onclick = function(e) {
        if (e.target === modalBg) {
            modalBg.classList.add('hidden');
        }
    };
}