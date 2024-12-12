// API Constants
export const APIbase = 'https://v2.api.noroff.dev/';
export const headerKey = "78ddf18d-7d41-498d-939d-195c2b76f939";

// Authentication
export const loginRequest = `${APIbase}auth/login`;
export const registerRequest = `${APIbase}auth/register`;

// Profile constants
export const profileRequest = `${APIbase}auction/profiles/`;
export const bidRequest = `${APIbase}bids`;

// Listing constants
export const allListings = `${APIbase}auction/listings`;
export const singleListing = `${APIbase}auction/listings/`;

export function checkLogin() {
    if (!localStorage.getItem('token')) {
        alert('You need to be logged in to access this page.');
        window.location.href = '/login';
    }
}