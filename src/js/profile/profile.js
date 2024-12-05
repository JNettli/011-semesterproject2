import { profileRequest } from '../constants.js';

function getUserProfileInfo(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}
const userProfileId = getUserProfileInfo('userId');
document.title = `${userProfileId}'s Bid Blitz Profile`;


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
    const userProfile = document.querySelector('#user-profile');

    const profileImageDiv = document.createElement('div');
    userProfile.appendChild(profileImageDiv);
    const profileBanner = document.createElement('img');
    profileBanner.src = profile.banner.url;
    profileBanner.alt = profile.banner.alt;
    profileImageDiv.appendChild(profileBanner);
    profileBanner.classList.add('w-[48rem]', 'h-72', 'object-cover', 'mb-4', 'absolute', 'top-16', 'left-1/2', 'transform', '-translate-x-1/2');
    
    const profileImage = document.createElement('img');
    profileImage.src = profile.avatar.url;
    profileImage.alt = profile.avatar.alt;
    profileImageDiv.appendChild(profileImage);
    profileImage.classList.add('w-40', 'h-40', 'md:mt-28', 'md:w-60', 'md:h-60', 'rounded-full', 'object-cover', 'border-2', 'border-black', 'dark:border-white', 'mt-50', 'relative', 'ml-auto', 'mr-auto');

    const profileInformationBox = document.createElement('div');
    userProfile.appendChild(profileInformationBox);
    profileInformationBox.classList.add('bg-white', 'dark:bg-gray-800', 'p-6', 'rounded', 'flex', 'justify-between', 'mt-[-5rem]');

    const profileInfoLeft = document.createElement('div');
    profileInfoLeft.classList.add('flex', 'flex-col', 'md:w-xl');
    profileInformationBox.appendChild(profileInfoLeft);

    const profileName = document.createElement('h2');
    profileName.innerText = profile.name;
    profileName.classList.add('text-2xl', 'font-bold', 'text-black', 'dark:text-white');
    profileInfoLeft.appendChild(profileName);

    const profileEmail = document.createElement('p');
    profileEmail.innerText = profile.email;
    profileEmail.classList.add('text-sm', 'mb-4', 'text-gray-500', 'dark:text-gray-400');
    profileInfoLeft.appendChild(profileEmail);

    const profileBio = document.createElement('p');
    profileBio.innerText = profile.bio;
    profileBio.classList.add('text-lg', 'text-black', 'dark:text-white', 'max-w-2xl');
    profileInfoLeft.appendChild(profileBio);

    const profileListings = document.createElement('h3');
    profileListings.innerText = `Total Listings: ${profile._count.listings}`;
    profileListings.classList.add('text-lg', 'font-semibold', 'text-black', 'dark:text-white');
    profileInfoLeft.appendChild(profileListings);

    const hiddenProfileInfo = document.createElement('div');
    profileInformationBox.appendChild(hiddenProfileInfo);

    const listingsOfProfile = await fetch(`${profileRequest}${userProfileId}/listings`, {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'X-Noroff-API-Key': '78ddf18d-7d41-498d-939d-195c2b76f939',
        },
    });

    const listingsJson = await listingsOfProfile.json();

    const listings = listingsJson.data;
    console.log(listings);

    const listingBox = document.createElement('div');
    listingBox.classList.add('grid', 'grid-cols-1', 'gap-4');
    userProfile.appendChild(listingBox);
    
    const newListingButton = document.createElement('button');
    newListingButton.innerText = 'Create New Listing';
    newListingButton.classList.add('bg-blue-500', 'hover:bg-blue-700', 'text-white', 'font-bold', 'py-2', 'px-4', 'rounded', 'mt-4', 'hidden');
    newListingButton.addEventListener('click', function() {
        window.location.href = '/create-listing';
    });
    listingBox.appendChild(newListingButton);

    const listingBoxHeader = document.createElement('h3');
    listingBoxHeader.innerText = `${userProfileId}'s Listings:`;
    listingBoxHeader.classList.add('mt-4', 'text-lg', 'font-semibold', 'text-black', 'dark:text-white');
    listingBox.appendChild(listingBoxHeader);

    if(listings.length > 0) {
        listings.forEach(listing => {
            const listingDiv = document.createElement('div');
            listingDiv.classList.add('bg-white', 'dark:bg-gray-800', 'p-6', 'rounded', 'flex', 'justify-between');
            listingBox.appendChild(listingDiv);
            
            const listingImage = document.createElement('img');
            listingImage.src = listing.media[0].url;
            listingImage.alt = listing.media[0].alt;
            listingImage.classList.add('w-48', 'h-48', 'object-cover', 'rounded', 'mr-4');
            listingDiv.appendChild(listingImage);

    
            const listingInfo = document.createElement('div');
            listingDiv.appendChild(listingInfo);
    
            const listingTitle = document.createElement('h4');
            listingTitle.innerText = listing.title;
            listingTitle.classList.add('text-2xl', 'font-bold', 'text-black', 'dark:text-white');
            listingInfo.appendChild(listingTitle);
    
            const listingDescription = document.createElement('p');
            listingDescription.innerText = listing.description;
            listingDescription.classList.add('text-lg', 'text-black', 'dark:text-white');
            listingInfo.appendChild(listingDescription);
    
            const listingPrice = document.createElement('p');
            listingPrice.innerText = `Current Bid: ${listing._count.bids} 🪙`;
            listingPrice.classList.add('text-lg', 'font-semibold', 'text-black', 'dark:text-white');
            listingInfo.appendChild(listingPrice);
    
            const listingButton = document.createElement('button');
            listingButton.innerText = 'View Listing';
            listingButton.classList.add('bg-blue-500', 'hover:bg-blue-700', 'text-white', 'font-bold', 'py-2', 'px-4', 'rounded', 'mt-4');
            listingButton.addEventListener('click', function() {
                window.location.href = `/listing/?listingId=${listing.id}`;
            });
            listingInfo.appendChild(listingButton);
        });
    } else {
        const noListings = document.createElement('p');
        noListings.innerText = 'No listings found.';
        noListings.classList.add('text-lg', 'font-semibold', 'text-black', 'dark:text-white');
        listingBox.appendChild(noListings);
    }

    if(localStorage.getItem('userName') === userProfileId) {
        const profileWins = document.createElement('h3');
        profileWins.innerText = `Total Wins: ${profile._count.wins}`;
        profileWins.classList.add('text-lg', 'font-semibold', 'text-black', 'dark:text-white');
        hiddenProfileInfo.appendChild(profileWins);
        
        const profileCredits = document.createElement('p');
        profileCredits.innerText = `Credits: 🪙 ${profile.credits}`;
        profileCredits.classList.add('text-lg', 'font-semibold', 'text-black', 'dark:text-white');
        hiddenProfileInfo.appendChild(profileCredits);

        const editProfileButton = document.createElement('button');
        editProfileButton.innerText = 'Edit Profile';
        editProfileButton.classList.add('bg-blue-500', 'hover:bg-blue-700', 'text-white', 'font-bold', 'py-2', 'px-4', 'rounded', 'mt-4');
        editProfileButton.addEventListener('click', function() {
            window.location.href = `/profile/edit/?userId=${localStorage.getItem('userName')}`;
        });
        hiddenProfileInfo.appendChild(editProfileButton);
        newListingButton.classList.remove('hidden');
    }
}

getSingleProfile();