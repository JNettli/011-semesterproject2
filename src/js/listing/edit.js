import { singleListing, checkLogin, headerKey } from '../constants.js';

checkLogin();

const mediaInput = document.querySelector('#media-input');
const newImageButton = document.querySelector('#more-images');
let inputCount = 0;

newImageButton.addEventListener('click', () => {
	if (inputCount < 8) {
		const newImageInput = document.createElement('input');
		newImageInput.type = 'url';
		newImageInput.classList = 'text-black bg-gray-50 p-2 border-black border-2 rounded mt-2 product-image-input';
		newImageInput.placeholder = 'Enter Image URL';
		newImageInput.id = `productImage${inputCount}`;
		mediaInput.appendChild(newImageInput);
		inputCount++;
	} else {
		alert('You can only add up to 8 images!');
	}
});

const editForm = document.querySelector('#edit-listing');
const listingId = window.location.search.split('=')[1];

async function fillForm() {
	const response = await fetch(singleListing + listingId);
	const data = await response.json();
	const listing = data.data;

	document.querySelector('#title').value = listing.title;
	document.querySelector('#description').value = listing.description;

	listing.media.forEach((image, index) => {
		if (index >= 0) {
			const newImageInput = document.createElement('input');
			newImageInput.type = 'url';
			newImageInput.classList = 'text-black bg-gray-50 p-2 border-black border-2 rounded mt-2 product-image-input';
			newImageInput.placeholder = 'Enter Image URL';
			newImageInput.id = `productImage${inputCount}`;
			newImageInput.value = image.url;
			mediaInput.appendChild(newImageInput);
			inputCount++;
		}
	});
}

// Submit form
editForm.addEventListener('submit', async (e) => {
	e.preventDefault();

	const title = document.querySelector('#title').value;
	const description = document.querySelector('#description').value;
	const media = [];
	const tags = [];

	document.querySelectorAll('.product-image-input').forEach((input) => {
		if (input.value !== '') {
			media.push({ url: input.value, alt: input.id });
		}
	});

	const checkBoxes = document.querySelectorAll('input[type="checkbox"]');

	checkBoxes.forEach((checkbox) => {
		if (checkbox.checked) {
			tags.push(checkbox.value);
		}
	});

	async function updateListing() {
		const response = await fetch(singleListing + listingId, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${localStorage.getItem('token')}`,
				'X-Noroff-API-Key': headerKey,
			},
			body: JSON.stringify({
				title: title,
				description: description,
				media: [media],
			}),
		});

		if (response.ok) {
			alert('Listing updated successfully!');
			window.location.href = `/listing/?listingId=${listingId}`;
		} else {
			alert('Something went wrong!');
		}
	}

	updateListing();
});

fillForm();
