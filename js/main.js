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

// PROFILE TAB SWITCHING
function showProfileTab(tab, btn) {
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
    // 1. Session check & authentication protection
    const currentUser = JSON.parse(localStorage.getItem('thola_user'));
    const isDashboard = document.body.classList.contains('dashboard-page');
    const isProfile = document.body.classList.contains('profile-page');

    if ((isDashboard || isProfile) && !currentUser) {
        // Not logged in, redirect to login
        alert('Please log in to access this page.');
        window.location.href = 'login.html';
        return;
    }

    // 2. Customizations for Dashboard
    if (isDashboard && currentUser) {
        // Customize welcome greeting
        const welcomeTitle = document.querySelector('.welcome-text h2');
        if (welcomeTitle) {
            welcomeTitle.innerHTML = `Welcome back, ${currentUser.name} &#128075;`;
        }
        
        // Customize navbar Profile link
        const profileLink = document.querySelector('.login-link');
        if (profileLink) {
            profileLink.innerHTML = `&#128100; ${currentUser.name}`;
        }
    }

    // 3. Customizations for Profile
    if (isProfile && currentUser) {
        // Set dynamic user fields
        const profileName = document.getElementById('profileName');
        const profileEmail = document.getElementById('profileEmail');
        const profileAvatar = document.getElementById('profileAvatar');

        if (profileName) {
            profileName.innerHTML = `${currentUser.name} <span class="profile-verified">&#10003; Verified Provider</span>`;
        }
        if (profileEmail) {
            profileEmail.innerText = currentUser.email;
        }
        if (profileAvatar) {
            // Get initials
            const names = currentUser.name.split(' ');
            const initials = names.map(n => n.charAt(0)).join('').toUpperCase().substring(0, 2);
            profileAvatar.innerText = initials || 'U';
        }

        // Log out handler
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                localStorage.removeItem('thola_user');
                alert('You have logged out successfully.');
                window.location.href = 'login.html';
            });
        }
    }

    // 4. Dashboard listeners
main
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

