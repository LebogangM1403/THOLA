function performSearch() {
    const query = document.getElementById('mainSearch').value.toLowerCase().trim();
    const resultsContainer = document.getElementById('searchResults');
    const noResults = document.getElementById('noSearchResults');
    const countEl = document.getElementById('resultCount');

    resultsContainer.innerHTML = '';

    if (!query) {
        countEl.textContent = "Type to search";
        noResults.style.display = 'none';
        return;
    }

    const allListings = JSON.parse(localStorage.getItem('thola_listings') || '[]');

    const filtered = allListings.filter(listing => 
        listing.title?.toLowerCase().includes(query) ||
        listing.description?.toLowerCase().includes(query) ||
        listing.category?.toLowerCase().includes(query) ||
        listing.location?.toLowerCase().includes(query)
    );

    countEl.textContent = `${filtered.length} result${filtered.length !== 1 ? 's' : ''} found`;

    if (filtered.length === 0) {
        noResults.style.display = 'flex';
        return;
    }

    noResults.style.display = 'none';

    filtered.forEach(listing => {
        const cardHTML = `
            <div class="listing-card" data-id="${listing.id}">
                <a href="listing-detail.html?id=${listing.id}" class="card-view-link"></a>
                <div class="card-top">
                    <span class="category-badge">${listing.type === 'skill' ? 'Skill' : 'Goods'}</span>
                    <div class="card-icon">${listing.type === 'skill' ? '🛠️' : '📦'}</div>
                </div>
                <h4 class="card-title">${listing.title}</h4>
                <p class="card-description">${listing.description?.substring(0, 120)}...</p>
                <div class="card-price">R${listing.price}</div>
                <div class="card-seller">
                    <div class="seller-location">${listing.location || 'South Africa'}</div>
                </div>
            </div>
        `;
        resultsContainer.innerHTML += cardHTML;
    });
}

document.getElementById('mainSearch').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') performSearch();
});

let timeout;
document.getElementById('mainSearch').addEventListener('input', () => {
    clearTimeout(timeout);
    timeout = setTimeout(performSearch, 400);
});