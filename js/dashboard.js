/* ── Modal helpers ──────────────────────────────────────────────── */
function openModal() { document.getElementById('postModal').classList.add('open'); }
function closeModal() { document.getElementById('postModal').classList.remove('open'); }

document.getElementById('postModal').addEventListener('click', function (e) {
    if (e.target === this) closeModal();
});

/* ── Greet the logged-in user */
(function () {
    const user = JSON.parse(localStorage.getItem('thola_user') || 'null')
        || JSON.parse(localStorage.getItem('tholaProfile') || 'null');
    if (user && user.name) {
        const firstName = user.name.trim().split(' ')[0];
        const el = document.getElementById('heroUserName');
        if (el) el.textContent = firstName;
    }
})();

/* ── Build a card HTML string from a session listing */
function buildSessionCard(l) {
    const badgeCls = l.type === 'goods' ? 'goods' : '';
    const badge = l.type === 'goods' ? 'Goods' : l.type === 'job' ? 'Job' : l.type === 'request' ? 'Request' : 'Skill';
    const province = l.province || 'gauteng';
    const near = l.near ? 'true' : 'false';

    return `
    <div class="listing-card session-card" data-id="${l.id}"
         data-type="${l.type}" data-category="${l.category}"
         data-province="${province}" data-near="${near}">
        <a href="listing-detail.html?id=${l.id}" class="card-view-link" aria-label="View listing"></a>
        <div class="card-top">
            <span class="category-badge ${badgeCls}">${badge}</span>
            <div class="card-icon">${l.icon || '📋'}</div>
        </div>
        <h4 class="card-title">${l.title}</h4>
        <p class="card-description">${(l.description || '').substring(0, 120)}${l.description && l.description.length > 120 ? '…' : ''}</p>
        <div class="card-price">R${l.price} <span>/ ${l.priceUnit || 'session'}</span></div>
        <div class="card-seller">
            <div class="seller-avatar">${l.sellerInitials || 'ME'}</div>
            <div class="seller-info">
                <div class="seller-name">${l.seller} <span class="new-badge">New</span></div>
                <div class="seller-location">&#128205; ${l.location}</div>
            </div>
            <div class="star-rating">&#9733; New</div>
        </div>
        <div class="card-actions">
            <button class="btn-book" onclick="window.location.href='listing-detail.html?id=${l.id}'">View</button>
            <button class="btn-offer" onclick="window.location.href='chat.html'">Contact</button>
        </div>
    </div>`;
}

/* ── Inject session listings into the top of the grid*/
(function injectSessionListings() {
    const grid = document.getElementById('listingsGrid');
    if (!grid) return;

    const sessionListings = JSON.parse(sessionStorage.getItem('session_listings') || '[]');
    if (sessionListings.length === 0) return;

    sessionListings.forEach(l => {
        grid.insertAdjacentHTML('afterbegin', buildSessionCard(l));
    });

    /* Update the count label */
    const countEl = document.getElementById('listingsCount');
    if (countEl) {
        const total = grid.querySelectorAll('.listing-card').length;
        countEl.textContent = `Showing ${total} listing${total !== 1 ? 's' : ''}`;
    }
})();