import { singleListing } from '../constants.js'

// Get single listing and display it
async function getSingleListing() {
    const urlParams = new URLSearchParams(window.location.search);
    const listingId = urlParams.get('listingId');
    const response = await fetch(singleListing + listingId);
    const data = await response.json();
    console.log(data);

    const listingBox = document.getElementById('listing');
    listingBox.classList.add('flex');
    const listing = data.data;

    const listingDiv = document.createElement('div');
    listingBox.appendChild(listingDiv);
    listingDiv.classList.add('bg-white', 'dark:bg-gray-800', 'p-4', 'rounded', 'mb-4', 'max-w-3xl');

    const listingImage = document.createElement('img');
    listingDiv.appendChild(listingImage);
    listingImage.src = listing.media[0]?.url || 'https://bitsofco.de/img/Qo5mfYDE5v-350.png';
    listingImage.alt = listing.media[0]?.alt || 'Nice image';
    listingImage.classList.add('max-h-64', 'object-cover', 'rounded', 'mx-auto', 'mb-4');

    const listingInfo = document.createElement('div');
    listingDiv.appendChild(listingInfo);
    listingInfo.classList.add('flex', 'flex-col', 'w-2/3', 'mx-auto');

    const listingTitle = document.createElement('div');
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
    listingEnds.innerText = (Math.floor((Date.parse(data.data.endsAt)-Date.now()) / 1000 / 60 / 60 / 24) + " days " + Math.floor((Date.parse(data.data.endsAt)-Date.now()) / 1000 / 60 / 60) + " hours " + Math.floor((Date.parse(data.data.endsAt)-Date.now()) / 1000 / 60) + " minutes remaining");
    listingEnds.classList.add('text-lg', 'font-semibold', 'text-black', 'dark:text-white');

    const bidButton = document.createElement('button');
    listingInfo.appendChild(bidButton);
    bidButton.innerText = 'Bid';
    bidButton.classList.add('bg-blue-500', 'hover:bg-blue-700', 'text-white', 'font-bold', 'py-2', 'px-4', 'rounded', 'mt-4');
    bidButton.addEventListener('click', function() {
        alert("Ty for bid");
    });
}

getSingleListing();

