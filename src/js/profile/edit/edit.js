import { profileRequest, headerKey } from '../../constants.js';

function getUserProfileInfo(param) {
	const urlParams = new URLSearchParams(window.location.search);
	return urlParams.get(param);
}

const userProfileId = getUserProfileInfo('userId');
document.title = `Edit ${userProfileId}'s Profile`;

if (localStorage.getItem('userName') !== userProfileId) {
	alert('You are not authorized to view this page!');
	window.location.href = '/';
}

async function getSingleProfile() {
	const response = await fetch(`${profileRequest}${userProfileId}`, {
		headers: {
			Authorization: `Bearer ${localStorage.getItem('token')}`,
			'X-Noroff-API-Key': headerKey,
		},
	});

	const json = await response.json();
	const profile = json.data;
	const bio = document.querySelector('#bio');
	const avatar = document.querySelector('#avatar');
	const banner = document.querySelector('#banner');

	bio.value = profile.bio;
	avatar.value = profile.avatar.url;
	banner.value = profile.banner.url;
}

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
			Authorization: `Bearer ${localStorage.getItem('token')}`,
			'X-Noroff-API-Key': headerKey,
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
			},
		}),
	});

	if (response.ok) {
		alert('Profile updated successfully!');
		window.location.href = `/profile/?userId=${userProfileId}`;
	} else {
		const err = await response.json();
		alert(`Something went wrong: ${err.errors[0].message}`);
	}
});
