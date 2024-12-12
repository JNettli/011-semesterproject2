import { singleListing } from '../constants.js'

// Get single listing and display it
async function getSingleListing() {
    const urlParams = new URLSearchParams(window.location.search);
    const listingId = urlParams.get('listingId');
    const response = await fetch(singleListing + listingId + `?_seller=true`);
    const data = await response.json();
    console.log(data);
    
    const listingBox = document.getElementById('listing');
    listingBox.classList.add('flex');
    const listing = data.data;
    
    const listingDiv = document.createElement('div');
    listingBox.appendChild(listingDiv);
    listingDiv.classList.add('bg-white', 'dark:bg-gray-800', 'p-4', 'rounded', 'mb-4', 'w-[54rem]');
    
    const listingImage = document.createElement('img');
    listingDiv.appendChild(listingImage);
    listingImage.src = listing.media[0]?.url || 'https://bitsofco.de/img/Qo5mfYDE5v-350.png';
    listingImage.alt = listing.media[0]?.alt || 'Nice image';
    listingImage.classList.add('max-h-64', 'object-cover', 'rounded', 'mx-auto', 'mb-4');
    
    const bidArea = document.createElement('div');
    bidArea.classList.add('flex', 'max-w-xl', 'mx-auto', 'justify-center');
    listingDiv.appendChild(bidArea);

    const bidInput = document.createElement('input');
    bidArea.appendChild(bidInput);
    bidInput.classList.add('text-black', 'bg-gray-50', 'p-2', 'border-black', 'border-2', 'rounded', 'my-4');
    bidInput.placeholder = 'Enter bid amount';

    const bidInputCurrency = document.createElement('p');
    bidArea.appendChild(bidInputCurrency);
    bidInputCurrency.innerText = '🪙';
    bidInputCurrency.classList.add('text-2xl', 'mt-5');

    const bidButton = document.createElement('button');
    bidArea.appendChild(bidButton);
    bidButton.innerText = 'Bid';
    bidButton.classList.add('bg-blue-500', 'hover:bg-blue-700', 'text-white', 'font-bold', 'py-2', 'px-4', 'rounded', 'my-4', 'ml-8', 'w-32');
    bidButton.addEventListener('click', function() {
        alert("Ty for bid");
    });

    const mainListingBox = document.createElement('div');
    mainListingBox.classList.add('flex', 'flex-row-reverse', 'max-w-3xl', 'justify-around', 'mx-auto');
    const listingSellerInfoBox = document.createElement('div');

    listingDiv.appendChild(mainListingBox);
    mainListingBox.appendChild(listingSellerInfoBox);

    const listingInfo = document.createElement('div');
    mainListingBox.appendChild(listingInfo);
    listingInfo.classList.add('flex', 'flex-col', 'overflow-hidden');

    const listingTitle = document.createElement('h1');
    listingInfo.appendChild(listingTitle);
    listingTitle.innerText = listing.title;
    document.title = `${listing.title} | BidBlitz`;
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
    listingEnds.innerText = (Math.floor((Date.parse(data.data.endsAt)-Date.now()) / 1000 / 60 / 60 / 24) + " days " + Math.floor((Date.parse(data.data.endsAt)-Date.now()) / 1000 / 60 / 60 % 60) + " hours " + Math.floor((Date.parse(data.data.endsAt)-Date.now()) / 1000 / 60 % 60) + " minutes remaining");
    listingEnds.classList.add('text-lg', 'font-semibold', 'text-black', 'dark:text-white');

    const listingSellerCreatedBy = document.createElement('p');
    listingSellerInfoBox.appendChild(listingSellerCreatedBy);
    listingSellerCreatedBy.innerText = 'Created by: ';

    const listingSellerInfo = document.createElement('a');
    listingSellerInfoBox.appendChild(listingSellerInfo);
    listingSellerInfo.innerText = `${listing.seller.name}`;
    listingSellerInfo.href = `/profile/?userId=${listing.seller.name}`;
    listingSellerInfo.classList.add('text-lg', 'font-semibold', 'text-black', 'dark:text-white');

    if(listing.seller.name === localStorage.getItem('userName')) {
        const deleteButton = document.createElement('button');
        const editButton = document.createElement('button');
        bidButton.classList.add('hidden');
        bidInput.classList.add('hidden');
        bidInputCurrency.classList.add('hidden');
        bidArea.appendChild(editButton);
        editButton.innerText = 'Edit';
        editButton.classList.add('bg-blue-500', 'hover:bg-blue-700', 'text-white', 'font-bold', 'py-2', 'px-4', 'rounded', 'my-4', 'w-32');
        editButton.addEventListener('click', function() {
            window.location.href = `/listing/edit/?listingId=${listingId}`;
        });
        bidArea.appendChild(deleteButton);
        deleteButton.innerText = 'Delete';
        deleteButton.classList.add('bg-red-500', 'hover:bg-red-700', 'text-white', 'font-bold', 'py-2', 'px-4', 'rounded', 'my-4', 'ml-8', 'w-32');
        deleteButton.addEventListener('click', async function() {
            if(confirm('Are you sure you want to delete this listing?') == true) {
                const response = await fetch(singleListing + listingId, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        'X-Noroff-API-Key': '78ddf18d-7d41-498d-939d-195c2b76f939'
                    },
                });
                if (response.ok) {
                    alert('Listing deleted!\nRedirecting you to home page!');
                    window.location.href = '/';
                }
            } else {
                alert('Listing not deleted :)');
            }
        });
    }

}

getSingleListing();

