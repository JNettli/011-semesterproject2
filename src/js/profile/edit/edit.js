import { profileRequest } from '../../constants.js';


function getUserProfileInfo(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

const userProfileId = getUserProfileInfo('userId');
document.title = `Edit ${userProfileId}'s Profile`;

// Check if current user is the same as the user being viewed
/*
if (localStorage.getItem('userName') !== userProfileId) {
    alert('You are not authorized to view this page!');
    window.location.href = '/';
};
*/
async function getSingleProfile() {
    const response = await fetch(`${profileRequest}${userProfileId}`, {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'X-Noroff-API-Key': '78ddf18d-7d41-498d-939d-195c2b76f939',
        },
    });

    const json = await response.json();

    console.log(json.data);
    const profile = json.data;
    const bio = document.querySelector('#bio');
    const avatar = document.querySelector('#avatar');
    const banner = document.querySelector('#banner');

    console.log(profile.bio);
    bio.value = profile.bio;
    avatar.value = profile.avatar.url;
    banner.value = profile.banner.url;
};

getSingleProfile();

const editProfileForm = document.querySelector('#edit-profile');

editProfileForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const bio = document.querySelector('#bio').value;
    const avatar = document.querySelector('#avatar').value;
    const banner = document.querySelector('#banner').value;


    const response = await fetch(`${profileRequest}${userProfileId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'X-Noroff-API-Key': '78ddf18d-7d41-498d-939d-195c2b76f939',
        },
        body: JSON.stringify({
            bio: bio,
            avatar: {
                url: avatar,
                alt: `${userProfileId}'s avatar`,
            },
            banner: {
                url: banner,
                alt: `${userProfileId}'s banner`,
            }
        }),
    });

    if (response.ok) {
        alert('Profile updated successfully!');
        window.location.href = `/profile/?userId=${userProfileId}`;
    } else {
        alert('Failed to update profile');
    }
});