import { allListings } from '../constants.js';

// Get all listings and display them
async function getAllListings() {
    const response = await fetch(allListings + '?limit=10&_active=true&sort=endsAt&sortOrder=asc&page=1');
    const data = await response.json();
    console.log(data);
    
    const listingBox = document.getElementById('listing-box');
    data.data.forEach(listing => {
        const listingDiv = document.createElement('div');
        listingBox.appendChild(listingDiv);
        listingDiv.classList.add('bg-white', 'dark:bg-gray-800', 'p-6', 'rounded', 'flex', 'justify-between', 'mb-4', 'max-w-5xl');

        const listingId = listing.id;
        
        const listingImageAnchor = document.createElement('a');
        listingImageAnchor.href = `/listing/?listingId=${listingId}`;
        const listingImage = document.createElement('img');
        listingDiv.appendChild(listingImageAnchor);
        listingImageAnchor.appendChild(listingImage);
        listingImage.src = listing.media[0]?.url || 'https://via.placeholder.com/150';
        listingImage.alt = listing.media[0]?.alt || 'Nice image';
        listingImage.classList.add('w-48', 'h-48', 'object-cover', 'rounded', 'mr-4');
        
        const listingInfo = document.createElement('div');
        listingDiv.appendChild(listingInfo);
        listingInfo.classList.add('flex', 'flex-col', 'max-w-3xl');
        
        const listingTitle = document.createElement('a');
        listingTitle.href = `/listing/?listingId=${listingId}`;
        listingInfo.appendChild(listingTitle);
        listingTitle.innerText = listing.title;
        listingTitle.classList.add('text-2xl', 'font-bold', 'text-black', 'dark:text-white');
        
        const listingDescription = document.createElement('p');
        listingInfo.appendChild(listingDescription);
        listingDescription.innerText = listing.description;
        listingDescription.classList.add('text-lg', 'text-black', 'dark:text-white');
        
        const listingPrice = document.createElement('p');
        listingInfo.appendChild(listingPrice);
        listingPrice.innerText = `Price: ${listing._count.bids} 🪙`;
        listingPrice.classList.add('text-lg', 'font-semibold', 'text-black', 'dark:text-white');
        
        const listingEnds = document.createElement('p');
        listingInfo.appendChild(listingEnds);
        listingEnds.innerText = (Math.floor((Date.parse(data.data[0].endsAt)-Date.now()) / 1000 / 60 / 60 / 24) + " days " + Math.floor((Date.parse(data.data[0].endsAt)-Date.now()) / 1000 / 60 / 60 % 24) + " hours " + Math.floor((Date.parse(data.data[0].endsAt)-Date.now()) / 1000 / 60 % 60) + " minutes remaining");
        listingEnds.classList.add('text-lg', 'font-semibold', 'text-black', 'dark:text-white');
    });
}

getAllListings();