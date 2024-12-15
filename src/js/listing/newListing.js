import { allListings, checkLogin, headerKey } from '../constants.js';

checkLogin();

const backToProfile = document.querySelector('#back-to-profile');

backToProfile.addEventListener('click', () => {
    window.location.href = `/profile/?userId=${localStorage.getItem('userName')}`;
});

const mediaInput = document.querySelector('#media-input');
const newImageButton = document.querySelector('#more-images');
let inputCount = 1;

newImageButton.addEventListener('click', () => {
    if(inputCount < 8) {
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
})

const newListingForm = document.querySelector('#new-listing-form');

newListingForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const title = document.querySelector('#title').value;
    const description = document.querySelector('#description').value;
    const endDate = document.querySelector('#endDate').value;
    const media = [];
    
    document.querySelectorAll('.product-image-input').forEach(input => {
        if(input.value !== '') {

            media.push({url:input.value, alt:input.id})
        }
    });

    async function createPost() {
        const response = await fetch(allListings, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'X-Noroff-API-Key': headerKey,
            },
            body: JSON.stringify({
                title: title,
                description: description,
                media: media,
                endsAt: endDate,
            }),
        });
        if (response.ok) {
            const data = await response.json();
            alert('Listing created!');
            window.location.href = `/listing/?listingId=${data.data.id}`;
        } else {
            console.error('Failed to create listing', await response.text());
        }
    }

    createPost();
});
