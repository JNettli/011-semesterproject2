// src/js/modal.js

export function getProfileInfoToModal() {
    const userProfileModal = document.getElementById('profile-modal-content');
    const userName = localStorage.getItem('userName');
    const userAvatar = localStorage.getItem('userImage');

    userProfileModal.innerHTML = '';

    let content = document.createElement('div');
    content.classList.add('flex', 'gap-2', 'mb-1');

    const userProfilePic = document.createElement('img');
    userProfilePic.src = userAvatar;
    userProfilePic.classList.add('w-8', 'h-8', 'rounded-full', 'object-cover');
    content.appendChild(userProfilePic);

    const userNameElement = document.createElement('p');
    userNameElement.textContent = userName;
    content.appendChild(userNameElement);

    userProfileModal.appendChild(content);

    const credits = localStorage.getItem('credits');
    const creditsElement = document.createElement('p');
    creditsElement.classList.add('text-md', 'font-semibold');
    creditsElement.textContent = `🪙 ${credits}`;
    userProfileModal.appendChild(creditsElement);
}


export function openLoginModal(loginModal, registerModal) {
    loginModal.classList.remove('hidden');
    registerModal.classList.add('hidden');
}

export function closeModal(loginModal, registerModal) {
    loginModal.classList.add('hidden');
    registerModal.classList.add('hidden');
}
