/* ── Dummy listings (mirrors the cards in dashboard.html) ─────────────── */
const DUMMY_LISTINGS = [
    {
        id: 'dummy-1',
        type: 'skill',
        category: 'cleaning',
        title: 'Professional House Cleaning',
        description: 'Thorough, reliable home and office cleaning in Johannesburg. Custom rates available.',
        price: 350,
        priceUnit: 'session',
        seller: 'Thabo M.',
        location: 'Gauteng',
        rating: 4.8,
        verified: true,
        near: true
    },
    {
        id: 'dummy-2',
        type: 'goods',
        category: 'food',
        title: 'Traditional Homemade Platters',
        description: 'Fresh traditional South African meals prepared daily. Free delivery within Cape Town.',
        price: 85,
        priceUnit: 'platter',
        seller: 'Naledi S.',
        location: 'Western Cape',
        rating: 4.9,
        verified: true,
        near: false
    },
    {
        id: 'dummy-3',
        type: 'skill',
        category: 'tutoring',
        title: 'High School Maths & Science Tutoring',
        description: 'University engineering student offering top-quality matric exam prep sessions.',
        price: 150,
        priceUnit: 'hour',
        seller: 'Sipho K.',
        location: 'KwaZulu-Natal',
        rating: 4.7,
        verified: true,
        near: true
    },
    {
        id: 'dummy-4',
        type: 'skill',
        category: 'repairs',
        title: 'Fast Screen & Battery Replacements',
        description: 'On-site smartphone repairs. Original parts with 6-month warranty.',
        price: 600,
        priceUnit: 'device',
        seller: 'Lebo T.',
        location: 'Gauteng',
        rating: 4.9,
        verified: true,
        near: false
    },
    {
        id: 'dummy-5',
        type: 'skill',
        category: 'transport',
        title: '6tuy Transport Services',
        description: 'Affordable and reliable local transport, moving, and delivery services across the province.',
        price: 150,
        priceUnit: 'trip',
        seller: 'Kabelo M.',
        location: 'Gauteng',
        rating: 4.7,
        verified: true,
        near: true
    }
];

/* ── Build card HTML ──────────────────────────────────────────────────── */
function buildCard(listing) {
    const badge = listing.type === 'skill' ? 'Skill' : 'Goods';
    const badgeCls = listing.type === 'goods' ? 'goods' : '';
    const icon = listing.type === 'skill' ? '🛠️' : '📦';
    const verifiedBadge = listing.verified
        ? `<span class="verified-badge">&#10003; Verified</span>` : '';

    return `
        <div class="listing-card" data-id="${listing.id}">
            <a href="listing-detail.html?id=${listing.id}" class="card-view-link" aria-label="View listing"></a>
            <div class="card-top">
                <span class="category-badge ${badgeCls}">${badge}</span>
                <div class="card-icon">${icon}</div>
            </div>
            <h4 class="card-title">${listing.title}</h4>
            <p class="card-description">${listing.description.substring(0, 120)}${listing.description.length > 120 ? '…' : ''}</p>
            <div class="card-price">R${listing.price} <span>/ ${listing.priceUnit || 'unit'}</span></div>
            <div class="card-seller">
                <div class="seller-avatar">${listing.seller.split(' ').map(w => w[0]).join('').substring(0, 2)}</div>
                <div class="seller-info">
                    <div class="seller-name">${listing.seller} ${verifiedBadge}</div>
                    <div class="seller-location">&#128205; ${listing.location}</div>
                </div>
                <div class="star-rating">&#9733; ${listing.rating}</div>
            </div>
            <div class="card-actions">
                <button class="btn-book" onclick="window.location.href='listing-detail.html'">View Details</button>
                <button class="btn-offer" onclick="window.location.href='chat.html'">Contact</button>
            </div>
        </div>`;
}

/* ── Merge dummy + session + localStorage listings ────────────────────── */
function getAllListings() {
    const sessionStored = JSON.parse(sessionStorage.getItem('session_listings') || '[]');
    const localStored = JSON.parse(localStorage.getItem('thola_listings') || '[]');
    return [...sessionStored, ...DUMMY_LISTINGS, ...localStored];
}

/* search function */
function performSearch() {
    const query = document.getElementById('mainSearch').value.toLowerCase().trim();
    const container = document.getElementById('searchResults');
    const noResults = document.getElementById('noSearchResults');
    const countEl = document.getElementById('resultCount');
    const titleEl = document.getElementById('searchTitle');

    container.innerHTML = '';

    if (!query) {
        countEl.style.display = 'none';
        countEl.textContent = '';
        noResults.style.display = 'none';
        titleEl.textContent = 'Search Results';
        return;
    }

    const filtered = getAllListings().filter(l =>
        l.title?.toLowerCase().includes(query) ||
        l.description?.toLowerCase().includes(query) ||
        l.category?.toLowerCase().includes(query) ||
        l.location?.toLowerCase().includes(query) ||
        l.seller?.toLowerCase().includes(query)
    );

    countEl.style.display = 'inline-flex';
    countEl.textContent = `${filtered.length} result${filtered.length !== 1 ? 's' : ''} found`;
    titleEl.textContent = `Results for "${query}"`;

    if (filtered.length === 0) {
        noResults.style.display = 'flex';
        return;
    }

    noResults.style.display = 'none';
    filtered.forEach(l => { container.innerHTML += buildCard(l); });
}

/* ── Event listeners ──────────────────────────────────────────────────── */
document.getElementById('mainSearch').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') performSearch();
});

let _searchTimeout;
document.getElementById('mainSearch').addEventListener('input', () => {
    clearTimeout(_searchTimeout);
    _searchTimeout = setTimeout(performSearch, 350);
});