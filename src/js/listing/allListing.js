import { allListings } from '../constants.js';

const currentUrl = window.location.href;
const url = new URL(currentUrl);
const params = new URLSearchParams(url.search);
const searchQuery = params.get('q');

const itemsPerPage = 10;
let currentPage = 1;
let sortBy = 'endsAt';
let ascDesc = 'asc';

if (searchQuery != null) {
	async function getSearchedListings() {
		const response = await fetch(
			allListings +
				'/search?q=' +
				searchQuery +
				`&limit=${itemsPerPage}&_bids=true&_seller=true&_active=true&sort=${sortBy}&sortOrder=${ascDesc}&page=${currentPage}`
		);
		const data = await response.json();

		const listingBox = document.getElementById('listing-box');
		listingBox.innerHTML = '';
		if (data.data.length === 0) {
			if (localStorage.getItem('userName')) {
				newListing.classList.add('hidden');
			}
			listingBox.innerText = `Found no listings when searching for "${searchQuery}"\n\nTry searching something else!`;
			listingBox.classList.add('text-red-500', 'dark:text-red-400', 'text-center', 'mt-24', 'text-3xl', 'font-semibold');
			paginationBox.classList.add('hidden');
		}

		if (localStorage.getItem('userName')) {
			const newListing = document.createElement('button');
			newListing.innerText = 'Create New Listing';
			newListing.classList.add(
				'bg-blue-500',
				'hover:bg-blue-700',
				'text-white',
				'font-bold',
				'py-4',
				'px-4',
				'rounded',
				'mb-4',
				'w-full',
				'overflow-hidden'
			);
			newListing.addEventListener('click', () => {
				window.location.href = '/listing/create/';
			});
			listingBox.appendChild(newListing);
		}

		data.data.forEach((listing) => {
			const listingDiv = document.createElement('div');
			listingBox.appendChild(listingDiv);
			listingDiv.classList.add(
				'bg-white',
				'dark:bg-gray-800',
				'p-6',
				'rounded',
				'flex',
				'gap-8',
				'mb-4',
				'max-w-5xl',
				'relative',
				'z-0'
			);

			const listingId = listing.id;

			const listingImageAnchor = document.createElement('a');
			listingImageAnchor.href = `/listing/?listingId=${listingId}`;
			const listingImage = document.createElement('img');
			listingDiv.appendChild(listingImageAnchor);
			listingImageAnchor.appendChild(listingImage);
			listingImage.classList.add('w-48', 'h-48', 'object-cover', 'rounded');
			listingImage.src =
				listing.media[0]?.url || 'https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg';
			listingImage.alt = listing.media[0]?.alt || 'Nice image';

			const listingInfo = document.createElement('div');
			listingDiv.appendChild(listingInfo);
			listingInfo.classList.add('flex', 'flex-col', 'max-w-3xl', 'overflow-hidden');

			const listingTitle = document.createElement('a');
			listingTitle.href = `/listing/?listingId=${listingId}`;
			listingInfo.appendChild(listingTitle);
			listingTitle.innerText = listing.title;
			listingTitle.classList.add(
				'text-2xl',
				'font-bold',
				'text-black',
				'dark:text-white',
				'hover:text-blue-500',
				'dark:hover:text-blue-300'
			);

			const listingDescription = document.createElement('p');
			listingInfo.appendChild(listingDescription);
			listingDescription.innerText = listing.description;
			listingDescription.classList.add('text-lg', 'text-black', 'dark:text-white');

			const listingPrice = document.createElement('p');
			listingInfo.appendChild(listingPrice);
			listingPrice.classList.add('text-lg', 'font-bold', 'text-black', 'dark:text-white', 'mt-auto');
			if (listing.bids.length > 0) {
				const lastBid = listing.bids.slice(-1)[0].amount;
				listingPrice.innerText = `Current Bid: ${lastBid} 🪙`;
			} else {
				listingPrice.innerText = `There are currently no bids on this listing!`;
			}

			const listingEnds = document.createElement('p');
			listingInfo.appendChild(listingEnds);
			listingEnds.innerText =
				Math.floor((Date.parse(listing.endsAt) - Date.now()) / 1000 / 60 / 60 / 24) +
				' days ' +
				Math.floor(((Date.parse(listing.endsAt) - Date.now()) / 1000 / 60 / 60) % 24) +
				' hours ' +
				Math.floor(((Date.parse(listing.endsAt) - Date.now()) / 1000 / 60) % 60) +
				' minutes remaining';
			listingEnds.classList.add('text-lg', 'font-semibold', 'text-black', 'dark:text-white');

			if (Math.floor(Date.parse(listing.endsAt)) - Date.now() < 0) {
				listingEnds.classList.add('hidden');
				listingDiv.classList.add('border-4', 'border-red-500', 'dark:border-red-400');
				listingPrice.innerText = `This listing has ended!`;
				listingPrice.classList.add('text-red-500', 'dark:text-red-400');
			}

			const authorBox = document.createElement('div');
			listingInfo.appendChild(authorBox);
			authorBox.innerText = `Listed By: `;
			authorBox.classList.add('absolute', 'right-8', 'bottom-4', 'text-lg');
			const authorName = document.createElement('a');
			authorBox.appendChild(authorName);
			authorName.innerText = listing.seller.name;
			authorName.classList.add('font-bold');
			authorName.href = `/profile/?userId=${listing.seller.name}`;
		});

		const paginationBox = document.querySelector('#pagination');
		paginationBox.classList.add('flex', 'gap-2');
		paginationBox.innerHTML = '';

		const totalPages = data.meta.pageCount;

		if (currentPage > 1) {
			const prevButtonBox = document.createElement('div');
			const prevButton = document.createElement('button');
			prevButton.innerText = '<-';
			prevButton.addEventListener('click', () => {
				currentPage--;
				updateURL();
				getSearchedListings();
			});
			prevButton.classList.add('text-black', 'dark:text-white', 'text-xl', 'font-black');
			paginationBox.appendChild(prevButtonBox);
			prevButtonBox.appendChild(prevButton);
		}

		const currentPageDisplay = document.createElement('div');
		currentPageDisplay.innerText = `Current Page: ${currentPage}`;
		currentPageDisplay.classList.add('text-black', 'dark:text-white', 'mt-1');
		paginationBox.appendChild(currentPageDisplay);

		if (currentPage < totalPages) {
			const nextButtonBox = document.createElement('div');
			const nextButton = document.createElement('button');
			nextButton.innerText = '->';
			nextButton.addEventListener('click', () => {
				currentPage++;
				updateURL();
				getSearchedListings();
			});
			nextButton.classList.add('text-black', 'dark:text-white', 'text-xl', 'font-black');
			paginationBox.appendChild(nextButtonBox);
			nextButtonBox.appendChild(nextButton);
		}
		getCurrentPageFromURL();
	}
	getSearchedListings();

	// Check filter values and add to URL
	document.querySelector('#startFilter').addEventListener('click', () => {
		let ascDesc = document.querySelector('#sortByAscDesc').value;
		let sortBy = document.querySelector('#sortBy').value;
		const url = new URL(window.location);
		url.searchParams.set('sortOrder', ascDesc);
		url.searchParams.set('sort', sortBy);
		window.history.pushState({}, '', url);
		getFilterValues();
	});
} else {
	// Get all listings and display them
	async function getAllListings() {
		const response = await fetch(
			allListings +
				`?limit=${itemsPerPage}&_bids=true&_seller=true&_active=true&sort=${sortBy}&sortOrder=${ascDesc}&page=${currentPage}`
		);
		const data = await response.json();
		const listingBox = document.getElementById('listing-box');
		listingBox.innerHTML = '';

		if (localStorage.getItem('userName')) {
			const newListing = document.createElement('button');
			newListing.innerText = 'Create New Listing';
			newListing.classList.add(
				'bg-blue-500',
				'hover:bg-blue-700',
				'text-white',
				'font-bold',
				'py-4',
				'px-4',
				'rounded',
				'mb-4',
				'w-full',
				'overflow-hidden'
			);
			newListing.addEventListener('click', () => {
				window.location.href = '/listing/create/';
			});
			listingBox.appendChild(newListing);
		}

		data.data.forEach((listing) => {
			const listingDiv = document.createElement('div');
			listingBox.appendChild(listingDiv);
			listingDiv.classList.add(
				'bg-white',
				'dark:bg-gray-800',
				'p-6',
				'rounded',
				'flex',
				'gap-8',
				'mb-4',
				'max-w-5xl',
				'relative',
				'z-0'
			);

			const listingId = listing.id;

			const listingImageAnchor = document.createElement('a');
			listingImageAnchor.href = `/listing/?listingId=${listingId}`;
			const listingImage = document.createElement('img');
			listingDiv.appendChild(listingImageAnchor);
			listingImageAnchor.appendChild(listingImage);
			listingImage.classList.add('w-48', 'h-48', 'object-cover', 'rounded');
			listingImage.src =
				listing.media[0]?.url || 'https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg';
			listingImage.alt = listing.media[0]?.alt || 'Nice image';

			const listingInfo = document.createElement('div');
			listingDiv.appendChild(listingInfo);
			listingInfo.classList.add('flex', 'flex-col', 'max-w-3xl', 'overflow-hidden');

			const listingTitle = document.createElement('a');
			listingTitle.href = `/listing/?listingId=${listingId}`;
			listingInfo.appendChild(listingTitle);
			listingTitle.innerText = listing.title;
			listingTitle.classList.add(
				'text-2xl',
				'font-bold',
				'text-black',
				'dark:text-white',
				'hover:text-blue-500',
				'dark:hover:text-blue-300'
			);

			const listingDescription = document.createElement('p');
			listingInfo.appendChild(listingDescription);
			listingDescription.innerText = listing.description;
			listingDescription.classList.add('text-lg', 'text-black', 'dark:text-white');

			const listingPrice = document.createElement('p');
			listingInfo.appendChild(listingPrice);
			listingPrice.classList.add('text-lg', 'font-bold', 'text-black', 'dark:text-white', 'mt-auto');
			if (listing.bids.length > 0) {
				const lastBid = listing.bids.slice(-1)[0].amount;
				listingPrice.innerText = `Current Bid: ${lastBid} 🪙`;
			} else {
				listingPrice.innerText = `There are currently no bids on this listing!`;
			}

			const listingEnds = document.createElement('p');
			listingInfo.appendChild(listingEnds);
			listingEnds.innerText =
				Math.floor((Date.parse(listing.endsAt) - Date.now()) / 1000 / 60 / 60 / 24) +
				' days ' +
				Math.floor(((Date.parse(listing.endsAt) - Date.now()) / 1000 / 60 / 60) % 24) +
				' hours ' +
				Math.floor(((Date.parse(listing.endsAt) - Date.now()) / 1000 / 60) % 60) +
				' minutes remaining';
			listingEnds.classList.add('text-lg', 'font-semibold', 'text-black', 'dark:text-white');

			const authorBox = document.createElement('div');
			listingInfo.appendChild(authorBox);
			authorBox.innerText = `Listed By: `;
			authorBox.classList.add('absolute', 'right-8', 'bottom-4', 'text-lg');
			const authorName = document.createElement('a');
			authorBox.appendChild(authorName);
			authorName.innerText = listing.seller.name;
			authorName.classList.add('font-bold');
			if (!localStorage.getItem('token')) {
				authorName.href = '#';
				authorName.classList.add('error-link');
				document.querySelectorAll('.error-link').forEach((link) => {
					link.addEventListener('click', (e) => {
						e.preventDefault();
						const errorLink = document.createElement('div');
						errorLink.innerText = 'You need to log in to view profiles!';
						errorLink.classList.add(
							'text-red-500',
							'dark:text-red-400',
							'text-center',
							'mt-24',
							'text-xl',
							'font-semibold',
							'bg-white',
							'dark:bg-gray-800',
							'border-4',
							'border-red-500',
							'dark:border-red-400',
							'p-2',
							'rounded-xl',
							'absolute',
							'z-50'
						);

						const linkRect = link.getBoundingClientRect();
						errorLink.style.top = linkRect.top - 60 + 'px';
						errorLink.style.left = linkRect.left - 70 + 'px';

						document.body.appendChild(errorLink);

						setTimeout(() => {
							errorLink.remove();
						}, 1000);
					});
				});
			} else {
				authorName.href = `/profile/?userId=${listing.seller.name}`;
			}
		});
		const paginationBox = document.querySelector('#pagination');
		paginationBox.classList.add('flex', 'gap-2');
		paginationBox.innerHTML = '';

		const totalPages = data.meta.pageCount;

		if (currentPage > 1) {
			const prevButtonBox = document.createElement('div');
			const prevButton = document.createElement('button');
			prevButton.innerText = '<-';
			prevButton.addEventListener('click', () => {
				currentPage--;
				updateURL();
				getAllListings();
			});
			prevButton.classList.add('text-black', 'dark:text-white', 'text-xl', 'font-black');
			paginationBox.appendChild(prevButtonBox);
			prevButtonBox.appendChild(prevButton);
		}
		const currentPageDisplay = document.createElement('div');
		currentPageDisplay.innerText = `Current Page: ${currentPage}`;
		currentPageDisplay.classList.add('text-black', 'dark:text-white', 'mt-1');
		paginationBox.appendChild(currentPageDisplay);

		if (currentPage < totalPages) {
			const nextButtonBox = document.createElement('div');
			const nextButton = document.createElement('button');
			nextButton.innerText = '->';
			nextButton.addEventListener('click', () => {
				currentPage++;
				updateURL();
				getAllListings();
			});
			nextButton.classList.add('text-black', 'dark:text-white', 'text-xl', 'font-black');
			paginationBox.appendChild(nextButtonBox);
			nextButtonBox.appendChild(nextButton);
		}
	}
	getCurrentPageFromURL();
	getAllListings();
	if (!localStorage.getItem('token')) {
	}
	// Check filter values and add to URL
	document.querySelector('#startFilter').addEventListener('click', () => {
		ascDesc = document.querySelector('#sortByAscDesc').value;
		sortBy = document.querySelector('#sortBy').value;
		const url = new URL(window.location);
		url.searchParams.set('sortOrder', ascDesc);
		url.searchParams.set('sort', sortBy);
		window.history.pushState({}, '', url);
		getFilterValues();
		getAllListings();
	});
}

// Function to get current filter values from URL
function getFilterValues() {
	const urlParams = new URLSearchParams(window.location.search);
	const sortOrder = urlParams.get('sortOrder');
	const sort = urlParams.get('sort');
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
	window.history.pushState({}, '', url);
}

// Function to get the current page from the URL
function getCurrentPageFromURL() {
	const urlParams = new URLSearchParams(window.location.search);
	const page = urlParams.get('page');
	if (page) {
		currentPage = parseInt(page, 10);
	}
}
