import { profileRequest, headerKey, checkLogin } from '../constants.js';

checkLogin();

function getUserProfileInfo(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}
const userProfileId = getUserProfileInfo('userId');
document.title = `${userProfileId}'s Bid Blitz Profile`;

const itemsPerPage = 10;
let currentPage = 1;
let sortBy = "created";
let ascDesc = "desc";
let endedBool = false;

async function getSingleProfile() {
    const response = await fetch(`${profileRequest}${userProfileId}`, {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'X-Noroff-API-Key': headerKey,
        },
    });
    const userProfile = document.querySelector('#user-profile');
    userProfile.innerHTML = '';
    
    const json = await response.json();
    const profile = json.data;

    const profileImageDiv = document.createElement('div');
    userProfile.appendChild(profileImageDiv);
    const profileBanner = document.createElement('img');
    profileBanner.src = profile.banner.url;
    profileBanner.alt = profile.banner.alt;
    profileImageDiv.appendChild(profileBanner);
    profileBanner.classList.add('w-[48rem]', 'h-72', 'object-cover', 'mb-4', 'absolute', 'top-16', 'left-1/2', 'transform', '-translate-x-1/2', 'border-x-8', 'border-gray-100', 'dark:border-neutral-900');
    
    const profileImage = document.createElement('img');
    profileImage.src = profile.avatar.url;
    profileImage.alt = profile.avatar.alt;
    profileImageDiv.appendChild(profileImage);
    profileImage.classList.add('w-40', 'h-40', 'md:mt-12', 'md:w-60', 'md:h-60', 'rounded-full', 'object-cover', 'border-2', 'border-black', 'dark:border-white', 'mt-32', 'relative', 'ml-auto', 'mr-auto', 'md:top-10');

    const profileInformationBox = document.createElement('div');
    userProfile.appendChild(profileInformationBox);
    profileInformationBox.classList.add('bg-white', 'dark:bg-gray-800', 'p-6', 'rounded', 'flex', 'justify-between', 'mt-[-1rem]');

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
    hiddenProfileInfo.classList.add('w-40');
    profileInformationBox.appendChild(hiddenProfileInfo);

    const listingsOfProfile = await fetch(`${profileRequest}${userProfileId}/listings?limit=${itemsPerPage}&_bids=true&page=${currentPage}&sort=${sortBy}&sortOrder=${ascDesc}&_active=${endedBool}`, {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'X-Noroff-API-Key': headerKey,
        },
    });

    const listingsJson = await listingsOfProfile.json();
    const listings = listingsJson.data;

    const listingBox = document.createElement('div');
    listingBox.classList.add('flex', 'flex-col', 'gap-4', 'mt-4');
    userProfile.appendChild(listingBox);

    const newListingButton = document.createElement('button');
    newListingButton.innerText = 'Create New Listing';
    newListingButton.classList.add('bg-blue-500', 'hover:bg-blue-700', 'text-white', 'font-bold', 'py-2', 'px-4', 'rounded', 'hidden');
    newListingButton.addEventListener('click', () => {
        window.location.href = '/listing/create/';
    });
    listingBox.appendChild(newListingButton);

    const winsBox = document.createElement('div');
    winsBox.classList.add('w-full', 'flex', 'flex-col');
    const checkWins = document.createElement('button');
    checkWins.innerText = 'Check Wins';
    checkWins.classList.add('bg-green-700', 'hover:bg-green-600', 'text-white', 'font-bold', 'py-2', 'px-4', 'rounded', 'hidden');
    checkWins.addEventListener('click', async () => {
        const wins = await fetch(`${profileRequest}${userProfileId}/wins`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'X-Noroff-API-Key': headerKey,
            }
        });
        const winsJson = await wins.json();
        const winsArray = winsJson.data;

        if(winsArray.length > 0) {
            listingBox.innerHTML = '';
            const backToProfile = document.createElement('button');
            backToProfile.innerText = 'Back to Profile';
            backToProfile.classList.add('bg-blue-500', 'hover:bg-blue-700', 'text-white', 'font-bold', 'py-2', 'px-4', 'rounded');
            backToProfile.addEventListener('click', () => {
                window.location.href = `/profile/?userId=${userProfileId}`;
            });
            listingBox.appendChild(backToProfile);
            winsArray.forEach(win => {
                const winDiv = document.createElement('div');
                winDiv.classList.add('bg-white', 'dark:bg-gray-800', 'p-6', 'rounded', 'flex', 'justify-between', 'mt-4');
                listingBox.appendChild(winDiv);
                
                const winImage = document.createElement('img');
                win.media.push({url: 'https://via.placeholder.com/150', alt: 'Nice image'});
                winImage.src = win.media[0]?.url || 'https://via.placeholder.com/150';
                winImage.alt = win.media[0]?.alt || 'Nice image';
                winImage.classList.add('w-48', 'h-48', 'object-cover', 'rounded', 'mr-4');
                winDiv.appendChild(winImage);
        
                const winInfo = document.createElement('div');
                winInfo.classList.add('flex', 'flex-col', 'w-full', 'overflow-hidden');
                winDiv.appendChild(winInfo);
        
                const winTitle = document.createElement('h4');
                winTitle.innerText = win.title;
                winTitle.classList.add('text-2xl', 'font-bold', 'text-black', 'dark:text-white', 'text-clip');
                winInfo.appendChild(winTitle);
        
                const winDescription = document.createElement('p');
                winDescription.innerText = win.description;
                winDescription.classList.add('text-lg', 'text-black', 'dark:text-white');
                winInfo.appendChild(winDescription);
        
                const winPrice = document.createElement('p');
                if(win.bids.length > 0) {
                    const allBidsSorted = win.bids.sort((a, b) => b.amount - a.amount);
                    const lastBid = allBidsSorted.slice()[0].amount;
                    winPrice.innerText = `Winning Bid: ${lastBid} 🪙`;
                    winPrice.classList.add('text-lg', 'font-semibold', 'text-black', 'dark:text-white', 'mt-auto');
                } else {
                    winPrice.innerText = `There are currently no bids on this listing!`;
                    winPrice.classList.add('text-lg', 'font-semibold', 'text-black', 'dark:text-white', 'mt-auto');
                }
                winInfo.appendChild(winPrice);
        
                const winButton = document.createElement('button');
                winButton.innerText = 'View Listing';
                winButton.classList.add('bg-blue-500', 'hover:bg-blue-700', 'text-white', 'font-bold', 'py-2', 'px-4', 'rounded', 'mt-4');
                winButton.addEventListener('click', () => {
                    window.location.href = `/listing/?listingId=${win.id}`;
                });
                winInfo.appendChild(winButton);
                if(Math.floor(Date.parse(win.endsAt))-Date.now() < 0) {
                    winDiv.classList.add('border-4', 'border-red-500', 'dark:border-red-400');
                    winPrice.innerText = `This listing has ended!`;
                    winPrice.classList.add('text-red-500', 'dark:text-red-400')
                }
            });
        } else {
            const noWins = document.createElement('p');
            noWins.innerText = 'No wins found.';
            noWins.classList.add('text-lg', 'font-semibold', 'text-red-500', 'dark:text-red-400', 'self-center', 'mt-2');
            winsBox.appendChild(noWins);
            setTimeout(() => {
                noWins.innerText = '';
        }, 2500);
        }
        
    });
    winsBox.appendChild(checkWins);
    listingBox.appendChild(winsBox);

    const filterDiv = document.createElement('div');
    filterDiv.classList.add('self-center', 'mt-4', 'w-full', 'max-w-3xl', 'flex', 'flex-col');
    listingBox.appendChild(filterDiv);

    const filterOptionBox = document.createElement('div');
    filterOptionBox.classList.add('flex', 'gap-4', 'self-center');
    filterDiv.appendChild(filterOptionBox);

    const filterOptionLeft = document.createElement('div');
    filterOptionLeft.classList.add('flex', 'flex-col');
    filterOptionBox.appendChild(filterOptionLeft);

    const filterOptionRight = document.createElement('div');
    filterOptionRight.classList.add('flex', 'flex-col');
    filterOptionBox.appendChild(filterOptionRight);

    const filterLabelLeft = document.createElement('label');
    filterLabelLeft.innerText = 'Sort:';
    filterOptionLeft.appendChild(filterLabelLeft);

    const filterSelectLeft = document.createElement('select');
    filterSelectLeft.id = 'sortBy';
    filterSelectLeft.classList.add('w-60', 'p-2', 'rounded', 'border', 'border-gray-300', 'dark:border-gray-700', 'text-black');
    filterOptionLeft.appendChild(filterSelectLeft);

    const filterOption1 = document.createElement('option');
    filterOption1.value = 'created';
    filterOption1.innerText = 'When Listing were created';
    filterSelectLeft.appendChild(filterOption1);

    const filterOption2 = document.createElement('option');
    filterOption2.value = 'endsAt';
    filterOption2.innerText = 'Time Left for Listing';
    filterSelectLeft.appendChild(filterOption2);

    const filterLabelRight = document.createElement('label');
    filterLabelRight.innerText = 'Sort Order:';
    filterOptionRight.appendChild(filterLabelRight);

    const filterSelectRight = document.createElement('select');
    filterSelectRight.id = 'sortByAscDesc';
    filterSelectRight.classList.add('w-60', 'p-2', 'rounded', 'border', 'border-gray-300', 'dark:border-gray-700', 'text-black');
    filterOptionRight.appendChild(filterSelectRight);

    const filterOption3 = document.createElement('option');
    filterOption3.value = 'desc';
    filterOption3.innerText = 'Last to First';
    filterSelectRight.appendChild(filterOption3);
    
    const filterOption4 = document.createElement('option');
    filterOption4.value = 'asc';
    filterOption4.innerText = 'First to Last';
    filterSelectRight.appendChild(filterOption4);
    
    const filterEndedBox = document.createElement('div');
    filterEndedBox.classList.add('flex', 'gap-2', 'self-center', 'mt-4');
    filterDiv.appendChild(filterEndedBox);

    const filterEndedLabel = document.createElement('label');
    filterEndedLabel.innerText = 'Hide Ended Listings:';
    filterEndedBox.appendChild(filterEndedLabel);

    const filterEnded = document.createElement('input');
    filterEnded.type = 'checkbox';
    filterEnded.id = 'filterEnded';
    filterEnded.checked = endedBool;
    filterEndedBox.appendChild(filterEnded);

    const filterButton = document.createElement('button');
    filterButton.innerText = 'Apply Filters';
    filterButton.id = 'startFilter';
    filterButton.classList.add('bg-blue-500', 'hover:bg-blue-700', 'text-white', 'font-bold', 'py-2', 'px-8', 'rounded', 'mt-4', 'self-center');
    filterButton.addEventListener("click", () => {
        ascDesc = document.querySelector("#sortByAscDesc").value;
        sortBy = document.querySelector("#sortBy").value;
        endedBool = document.querySelector("#filterEnded").checked;
        const url = new URL(window.location);
        url.searchParams.set("sortOrder", ascDesc);
        url.searchParams.set("sort", sortBy);
        window.history.pushState({}, "", url);
        getFilterValues();
        getSingleProfile();
    });
    filterDiv.appendChild(filterButton);

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
            listing.media.push({url: 'https://via.placeholder.com/150', alt: 'Nice image'});
            listingImage.src = listing.media[0]?.url || 'https://via.placeholder.com/150';
            listingImage.alt = listing.media[0]?.alt || 'Nice image';
            listingImage.classList.add('w-48', 'h-48', 'object-cover', 'rounded', 'mr-4');
            listingDiv.appendChild(listingImage);

    
            const listingInfo = document.createElement('div');
            listingInfo.classList.add('flex', 'flex-col', 'w-full', 'overflow-hidden');
            listingDiv.appendChild(listingInfo);
    
            const listingTitle = document.createElement('h4');
            listingTitle.innerText = listing.title;
            listingTitle.classList.add('text-2xl', 'font-bold', 'text-black', 'dark:text-white', 'text-clip');
            listingInfo.appendChild(listingTitle);
    
            const listingDescription = document.createElement('p');
            listingDescription.innerText = listing.description;
            listingDescription.classList.add('text-lg', 'text-black', 'dark:text-white');
            listingInfo.appendChild(listingDescription);
    
            const listingPrice = document.createElement('p');
            if(listing.bids.length > 0) {
                const allBidsSorted = listing.bids.sort((a, b) => b.amount - a.amount);
                const lastBid = allBidsSorted.slice()[0].amount;
                listingPrice.innerText = `Current Bid: ${lastBid} 🪙`;
                listingPrice.classList.add('text-lg', 'font-semibold', 'text-black', 'dark:text-white', 'mt-auto');
            } else {
                listingPrice.innerText = `There are currently no bids on this listing!`;
                listingPrice.classList.add('text-lg', 'font-semibold', 'text-black', 'dark:text-white', 'mt-auto');
            }
            listingInfo.appendChild(listingPrice);
    
            const listingButton = document.createElement('button');
            listingButton.innerText = 'View Listing';
            listingButton.classList.add('bg-blue-500', 'hover:bg-blue-700', 'text-white', 'font-bold', 'py-2', 'px-4', 'rounded', 'mt-4');
            listingButton.addEventListener('click', () => {
                window.location.href = `/listing/?listingId=${listing.id}`;
            });
            listingInfo.appendChild(listingButton);
            if(Math.floor(Date.parse(listing.endsAt))-Date.now() < 0) {
                listingDiv.classList.add('border-4', 'border-red-500', 'dark:border-red-400');
                listingPrice.innerText = `This listing has ended!`;
                listingPrice.classList.add('text-red-500', 'dark:text-red-400')
            }
        });
        const paginationBox = document.querySelector('#pagination');
        paginationBox.classList.add('flex', 'gap-2')
        paginationBox.innerHTML = '';
        const totalPages = listingsJson.meta.pageCount;
        
        if(currentPage > 1) {
            const prevButtonBox = document.createElement('div');
            const prevButton = document.createElement('button');
            prevButton.innerText = "<-";
            prevButton.addEventListener('click', () => {
                currentPage--;
                updateURL();
                getSingleProfile();
            });
            prevButton.classList.add('text-black', 'dark:text-white', 'text-xl', 'font-black');
            paginationBox.appendChild(prevButtonBox);
            prevButtonBox.appendChild(prevButton);
        }
        const currentPageDisplay = document.createElement('div');
        currentPageDisplay.innerText = `Current Page: ${currentPage}`;
        currentPageDisplay.classList.add('text-black', 'dark:text-white', 'mt-1');
        paginationBox.appendChild(currentPageDisplay);
        
        if(currentPage < totalPages) {
            const nextButtonBox = document.createElement('div');
            const nextButton = document.createElement('button');
            nextButton.innerText = "->";
            nextButton.addEventListener('click', () => {
                currentPage++;
                updateURL();
                getSingleProfile();
            });
            nextButton.classList.add('text-black', 'dark:text-white', 'text-xl', 'font-black');
            paginationBox.appendChild(nextButtonBox);
            nextButtonBox.appendChild(nextButton);
            getCurrentPageFromURL();
        }
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
        checkWins.classList.remove('hidden');
    }
}

// Function to get current filter values from URL
function getFilterValues() {
    const urlParams = new URLSearchParams(window.location.search);
    const sortOrder = urlParams.get("sortOrder");
    const sort = urlParams.get("sort");
    if (sortOrder) {
      ascDesc = sortOrder;
    }
    if (sort) {
      sortBy = sort;
    }
}

// Function to update the URL with the current page
function updateURL() {
    const url = new URL(window.location);
    url.searchParams.set('page', currentPage);
    window.history.pushState({}, '', url); // Update the URL without reloading the page
}

// Function to get the current page from the URL
function getCurrentPageFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    const page = urlParams.get('page');
    if (page) {
        currentPage = parseInt(page, 10);
    }
}

getSingleProfile();