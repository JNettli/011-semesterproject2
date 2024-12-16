import { headerKey, singleListing, showError } from '../constants.js';

// Get single listing and display it
async function getSingleListing() {
	const urlParams = new URLSearchParams(window.location.search);
	const listingId = urlParams.get('listingId');
	const response = await fetch(singleListing + listingId + `?_seller=true&_bids=true`);
	const data = await response.json();

	const listingBox = document.getElementById('listing');
	listingBox.classList.add('flex', 'md:w-2/3', 'max-w-4xl', 'w-full', 'px-4');
	const listing = data.data;

	const listingDiv = document.createElement('div');
	listingBox.appendChild(listingDiv);
	listingDiv.classList.add('bg-white', 'dark:bg-gray-800', 'p-4', 'rounded', 'mb-4', 'w-full');

	const listingImage = document.createElement('img');
	listingDiv.appendChild(listingImage);
	listingImage.src = listing.media[0]?.url || 'https://bitsofco.de/img/Qo5mfYDE5v-350.png';
	listingImage.alt = listing.media[0]?.alt || 'Nice image';
	listingImage.classList.add('max-h-64', 'object-cover', 'rounded', 'mx-auto', 'mb-4');

	const bidArea = document.createElement('form');
	bidArea.classList.add('flex', 'max-w-xl', 'mx-auto', 'justify-center');
	listingDiv.appendChild(bidArea);

	const bidInput = document.createElement('input');
	bidInput.type = 'number';
	bidInput.min = '0';
	bidArea.appendChild(bidInput);
	bidInput.classList.add('text-black', 'bg-gray-50', 'p-2', 'border-black', 'border-2', 'rounded', 'my-4');
	bidInput.placeholder = 'Enter bid amount';

	const bidInputCurrency = document.createElement('p');
	bidArea.appendChild(bidInputCurrency);
	bidInputCurrency.innerText = '🪙';
	bidInputCurrency.classList.add('text-2xl', 'mt-5');

	const bidButton = document.createElement('button');
	bidArea.appendChild(bidButton);
	bidButton.type = 'submit';
	bidButton.innerText = 'Bid';
	bidButton.classList.add('bg-blue-500', 'hover:bg-blue-700', 'text-white', 'font-bold', 'py-2', 'px-4', 'rounded', 'my-4', 'ml-8', 'w-32');
	bidButton.addEventListener('click', async (e) => {
		e.preventDefault();
		if (Number(bidInput.value) <= Number(localStorage.getItem('credits'))) {
			if (Number(bidInput.value) > Number(listing._count.bids) || Number(bidInput.value) > 0) {
				confirm('Are you sure you want to bid on this listing?');

				if (userConfirmed) {
					async function makeBid() {
						const apires = await fetch(singleListing + listingId + '/bids', {
							method: 'POST',
							headers: {
								'Content-Type': 'application/json',
								Authorization: `Bearer ${localStorage.getItem('token')}`,
								'X-Noroff-API-Key': headerKey,
							},
							body: JSON.stringify({
								amount: Number(bidInput.value),
							}),
						});
						if (apires.ok) {
							showError(
								bidButton,
								`Success!\nYou have put a bid of ${bidInput.value} on this listing!\nRefreshing the page...`
							);
							setTimeout(() => {
								window.location.href = `/listing/?listingId=${listingId}`;
							}, 1000);
						} else {
							const apidata = await apires.json();
							showError(bidButton, 'You need to put a number higher than the lowest bid!');
						}
					}
					makeBid();
				}
			} else {
				showError(bidButton, 'You need to put a number higher than the lowest bid!');
			}
		} else {
			showError(bidButton, 'You cannot bid more than you have credits!');
		}
	});

	if (localStorage.getItem('token') === null) {
		bidArea.innerText = 'You need to be logged in to bid!';
		bidArea.classList.add('text-red-500', 'dark:text-red-400', 'my-8');
	}

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

	const listingBidPrice = document.createElement('p');
	listingBidPrice.classList.add('text-lg', 'font-bold', 'text-black', 'dark:text-white', 'mt-8');
	if (listing.bids.length > 0) {
		const allBidsSorted = listing.bids.sort((a, b) => b.amount - a.amount);
		const lastBid = allBidsSorted.slice()[0].amount;
		listingBidPrice.innerText = `Current Bid: ${lastBid} 🪙`;
		const listingTotalBidders = document.createElement('p');
		listingInfo.appendChild(listingTotalBidders);
		listingTotalBidders.innerText = `Total Bidders: ${listing._count.bids}`;
		listingTotalBidders.classList.add('text-lg', 'font-semibold', 'text-black', 'dark:text-white', 'mb-8');
	} else {
		listingBidPrice.innerText = `There are currently no bids on this listing!`;
	}
	listingInfo.appendChild(listingBidPrice);

	const listingEnds = document.createElement('p');
	listingInfo.appendChild(listingEnds);

	const listingTimeToEnd = document.createElement('p');
	listingInfo.appendChild(listingTimeToEnd);
	listingTimeToEnd.classList.add('text-lg', 'font-bold', 'text-red-500', 'dark:text-red-400');

	const listingSellerCreatedBy = document.createElement('p');
	listingSellerInfoBox.appendChild(listingSellerCreatedBy);
	listingSellerCreatedBy.innerText = 'Created by: ';

	const listingSellerInfo = document.createElement('a');
	listingSellerInfoBox.appendChild(listingSellerInfo);
	listingSellerInfo.innerText = `${listing.seller.name}`;
	listingSellerInfo.href = `/profile/?userId=${listing.seller.name}`;
	listingSellerInfo.classList.add('text-lg', 'font-semibold', 'text-black', 'dark:text-white');

	if (listing.seller.name === localStorage.getItem('userName')) {
		const deleteButton = document.createElement('button');
		const editButton = document.createElement('button');
		bidButton.classList.add('hidden');
		bidInput.classList.add('hidden');
		bidInputCurrency.classList.add('hidden');
		bidArea.appendChild(editButton);
		editButton.innerText = 'Edit';
		editButton.classList.add('bg-blue-500', 'hover:bg-blue-700', 'text-white', 'font-bold', 'py-2', 'px-4', 'rounded', 'my-4', 'w-32'
		);
		editButton.addEventListener('click', (e) => {
			e.preventDefault();
			window.location.href = `/listing/edit/?listingId=${listingId}`;
		});
		bidArea.appendChild(deleteButton);
		deleteButton.innerText = 'Delete';
		deleteButton.classList.add('bg-red-500', 'hover:bg-red-700', 'text-white', 'font-bold', 'py-2', 'px-4', 'rounded', 'my-4', 'ml-8', 'w-32'
		);
		deleteButton.addEventListener('click', async () => {
			if (confirm('Are you sure you want to delete this listing?') == true) {
				const response = await fetch(singleListing + listingId, {
					method: 'DELETE',
					headers: {
						Authorization: `Bearer ${localStorage.getItem('token')}`,
						'X-Noroff-API-Key': headerKey,
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

	const lastSellersBox = document.createElement('div');
	listingDiv.appendChild(lastSellersBox);
	lastSellersBox.classList.add('flex', 'flex-col');
	const lastSellerParagraph = document.createElement('p');
	lastSellersBox.appendChild(lastSellerParagraph);
	lastSellerParagraph.classList.add('mt-8', 'font-bold', 'text-lg', 'self-center');
	lastSellerParagraph.innerText = 'All bidders:';

	if (Math.floor(Date.parse(listing.endsAt)) - Date.now() < 0) {
		listingDiv.classList.add('border-4', 'border-red-500');
		listingBidPrice.classList.add('hidden');
		listingTimeToEnd.innerText = `This listing has ended!`;
		listingTimeToEnd.classList.add('mt-8', 'text-xl', 'text-red-500', 'dark:text-red-400');
		bidArea.classList.add('hidden');
		lastSellersBox.classList.add('hidden');
	} else {
		listingEnds.innerText = 'Listing will end in: ';
		listingTimeToEnd.innerText =
			Math.floor((Date.parse(data.data.endsAt) - Date.now()) / 1000 / 60 / 60 / 24) +
			' days ' +
			Math.floor(((Date.parse(data.data.endsAt) - Date.now()) / 1000 / 60 / 60) % 60) +
			' hours ' +
			Math.floor(((Date.parse(data.data.endsAt) - Date.now()) / 1000 / 60) % 60) +
			' minutes remaining';
		listingEnds.classList.add('text-lg', 'font-semibold', 'text-black', 'dark:text-white');
	}

	listing.bids.sort((a, b) => b.amount - a.amount);

	listing.bids.forEach((bidder) => {
		const bidderName = bidder.bidder.name;
		const bidderAvatar = bidder.bidder.avatar.url;
		const bidAmount = bidder.amount;

		const bidderBox = document.createElement('div');
		lastSellersBox.appendChild(bidderBox);
		bidderBox.classList.add('flex', 'my-2', 'border-2', 'border-gray-400', 'dark:border-neutral-500', 'rounded-lg', 'p-2', 'w-64', 'self-center'
		);

		const avatarAnchorBox = document.createElement('a');
		bidderBox.appendChild(avatarAnchorBox);
		const avatarBox = document.createElement('img');
		avatarAnchorBox.appendChild(avatarBox);
		avatarBox.src = bidderAvatar;
		avatarBox.classList.add('h-16', 'w-16', 'rounded-full', 'mr-2', 'border-2', 'border-gray-400', 'dark:border-neutral-500'
		);
		avatarAnchorBox.href = `/profile/?userId=${bidder.bidder.name}`;

		const leftSideBidBox = document.createElement('div');
		leftSideBidBox.classList.add('my-auto');
		bidderBox.appendChild(leftSideBidBox);

		const bidAmountBox = document.createElement('p');
		leftSideBidBox.appendChild(bidAmountBox);
		bidAmountBox.innerText = `Bid: ${bidAmount} 🪙`;

		const nameOfBidder = document.createElement('a');
		nameOfBidder.innerText = bidderName;
		nameOfBidder.href = `/profile/?userId=${bidder.bidder.name}`;
		leftSideBidBox.appendChild(nameOfBidder);
		nameOfBidder.classList.add('font-semibold');
	});
}

getSingleListing();
