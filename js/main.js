// DASHBOARD 
let currentTab = 'all';

function filterByTab(tab, btn) {
    currentTab = tab;
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const titles = {
        all: 'Listings Near You',
        skill: 'Skills Only',
        goods: 'Goods Only',
        near: 'Near Me'
    };
    document.getElementById('listingsTitle').textContent = titles[tab] || 'Listings Near You';
    filterListings();
}

function filterListings() {
    const search = document.getElementById('searchInput').value.toLowerCase();
    const category = document.getElementById('categoryFilter').value;
    const province = document.getElementById('provinceFilter').value;
    const cards = document.querySelectorAll('.listing-card');
    let visible = 0;

    cards.forEach(card => {
        const type = card.dataset.type;
        const cat = card.dataset.category;
        const prov = card.dataset.province;
        const near = card.dataset.near;
        const text = card.innerText.toLowerCase();

        let show = true;

        if (currentTab === 'skill' && type !== 'skill') show = false;
        if (currentTab === 'goods' && type !== 'goods') show = false;
        if (currentTab === 'near' && near !== 'true') show = false;
        if (search && !text.includes(search)) show = false;
        if (category && cat !== category) show = false;
        if (province && prov !== province) show = false;

        card.classList.toggle('hidden', !show);
        if (show) visible++;
    });

    document.getElementById('listingsCount').textContent = `Showing ${visible} listing${visible !== 1 ? 's' : ''}`;
    document.getElementById('noResults').classList.toggle('visible', visible === 0);
}

// PROFILE 
function showTab(tab, btn) {
    document.querySelectorAll('.profile-tab').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    document.getElementById('tab-listings').style.display = 'none';
    document.getElementById('tab-reviews').style.display = 'none';
    document.getElementById('tab-history').style.display = 'none';
    document.getElementById('tab-' + tab).style.display = 'block';
}

// INITIALIZE 
document.addEventListener('DOMContentLoaded', () => {
    // Dashboard listeners
    const searchInput = document.getElementById('searchInput');
    const categoryFilter = document.getElementById('categoryFilter');
    const provinceFilter = document.getElementById('provinceFilter');

    if (searchInput) searchInput.addEventListener('input', filterListings);
    if (categoryFilter) categoryFilter.addEventListener('change', filterListings);
    if (provinceFilter) provinceFilter.addEventListener('change', filterListings);

    // Tab buttons for dashboard
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => filterByTab(btn.dataset.tab, btn));
    });
});