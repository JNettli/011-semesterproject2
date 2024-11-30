// API Constants
const APIbase = 'https://v2.api.noroff.dev/';
const headerKey = "78ddf18d-7d41-498d-939d-195c2b76f939";

// Authentication
const loginRequest = `${APIbase}auth/login`;
const registerRequest = `${APIbase}auth/register`;

// Profile constants
const profileRequest = `${APIbase}auction/profiles/`;
const auctionRequest = `${APIbase}auctions`;
const bidRequest = `${APIbase}bids`;

const constants = {
    APIbase,
    headerKey,
    loginRequest,
    registerRequest,
    profileRequest,
    auctionRequest,
    bidRequest,
}

export default constants;