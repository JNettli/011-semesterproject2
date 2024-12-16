import { allListings } from '../constants.js'

const searchBar = document.querySelector('#search-bar');

searchBar.addEventListener('keydown', (e) => {
    if(e.key === 'Enter') {
        e.preventDefault();
        const query = searchBar.value;

        if(query) {
            search(query)
        }
    }
})

async function search(query) {
    const res = await fetch(allListings + "/search?q=" + query);
    const data = await res.json();

    window.location.href = `/search?q=${query}`;
}
