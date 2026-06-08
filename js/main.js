

/* ── 1. DUMMY DATA — pre-loaded users so login works ── */
const DUMMY_USERS = [
    { name: 'Lebogang Thola',  email: 'lebo@thola.co.za',  password: '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92', registeredAt: '2026-01-01T00:00:00.000Z' },
    { name: 'Thabo Mokoena',   email: 'thabo@thola.co.za', password: '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92', registeredAt: '2026-01-02T00:00:00.000Z' },
    { name: 'Demo User',       email: 'demo@thola.co.za',  password: '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92', registeredAt: '2026-01-03T00:00:00.000Z' }
];
/* All dummy accounts use password: 123456 */

function loadDummyData() {
    const existing = localStorage.getItem('thola_database');
    if (!existing || JSON.parse(existing).length === 0) {
        localStorage.setItem('thola_database', JSON.stringify(DUMMY_USERS));
    }
}

/* ── 2. THEME TOGGLE ── */
function initTheme() {
    const saved = localStorage.getItem('thola_theme') || 'light';
    document.documentElement.setAttribute('data-theme', saved);
    const knob = document.getElementById('themeKnob');
    if (knob) knob.textContent = saved === 'dark' ? '☀️' : '🌙';
}

function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme') || 'light';
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('thola_theme', next);
    const knob = document.getElementById('themeKnob');
    if (knob) knob.textContent = next === 'dark' ? '☀️' : '🌙';
}

/* ── 3. DASHBOARD FILTER — original code, unchanged ── */
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

/* ── 4. PROFILE TAB SWITCHING — fixed (was broken/nested) ── */
function showProfileTab(tab, btn) {
    document.querySelectorAll('.profile-tab').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById('tab-listings').style.display = 'none';
    document.getElementById('tab-reviews').style.display = 'none';
    document.getElementById('tab-history').style.display = 'none';
    document.getElementById('tab-' + tab).style.display = 'block';
}

/* ── 5. CHAT FUNCTIONS ── */
function sendMessage() {
    const input = document.getElementById('chatInput');
    if (!input || !input.value.trim()) return;
    const user = JSON.parse(localStorage.getItem('thola_user') || '{}');
    appendMessage(input.value.trim(), 'sent', user.name || 'You');
    input.value = '';
    setTimeout(() => {
        const replies = [
            'Thanks! Let me check my availability.',
            'That works. Can we confirm the price?',
            'I can do that. When would you like to schedule?',
            'Sure, I am available. What location suits you?',
            'Let me get back to you shortly.'
        ];
        appendMessage(replies[Math.floor(Math.random() * replies.length)], 'received', 'Provider');
    }, 1200);
}

function appendMessage(text, type, sender) {
    const container = document.getElementById('chatMessages');
    if (!container) return;
    const wrap = document.createElement('div');
    wrap.className = `message-wrap ${type}`;
    const bubble = document.createElement('div');
    bubble.className = `message-bubble ${type}`;
    bubble.textContent = text;
    const meta = document.createElement('div');
    meta.className = 'message-meta';
    const now = new Date();
    meta.textContent = `${sender} · ${now.getHours()}:${String(now.getMinutes()).padStart(2,'0')}`;
    wrap.appendChild(bubble);
    wrap.appendChild(meta);
    container.appendChild(wrap);
    container.scrollTop = container.scrollHeight;
}

function sendOffer() {
    const input = document.getElementById('offerInput');
    if (!input || !input.value.trim()) return;
    const amount = input.value.trim();
    appendMessage(`💰 Offer: R${amount}`, 'sent', 'You');
    input.value = '';
    setTimeout(() => appendMessage(`I received your offer of R${amount}. Let me consider.`, 'received', 'Provider'), 1000);
}

function acceptOffer()  { appendMessage('✅ Offer accepted! Looking forward to working with you.', 'received', 'Provider'); }
function declineOffer() { appendMessage('❌ Offer declined. Please make a new offer.', 'received', 'Provider'); }

/* ── 6. DOMCONTENTLOADED — original logic fixed ── */
document.addEventListener('DOMContentLoaded', () => {

    /* Always load dummy data first */
    loadDummyData();

    /* Init theme */
    initTheme();
    const themeBtn = document.getElementById('themeToggle');
    if (themeBtn) themeBtn.addEventListener('click', toggleTheme);

    /* Session check — original logic */
    const currentUser = JSON.parse(localStorage.getItem('thola_user') || 'null');
    const isDashboard = document.body.classList.contains('dashboard-page');
    const isProfile   = document.body.classList.contains('profile-page');
    const isChat      = document.body.dataset.page === 'chat';

    if ((isDashboard || isProfile || isChat) && !currentUser) {
        alert('Please log in to access this page.');
        window.location.href = 'login.html';
        return;
    }

    /* Dashboard customisations — original logic */
    if (isDashboard && currentUser) {
        const welcomeTitle = document.querySelector('.welcome-text h2');
        if (welcomeTitle) {
            welcomeTitle.innerHTML = `Welcome back, ${currentUser.name} &#128075;`;
        }
        const profileLink = document.querySelector('.login-link');
        if (profileLink) {
            profileLink.innerHTML = `&#128100; ${currentUser.name}`;
        }
    }

    /* Profile customisations — original logic */
    if (isProfile && currentUser) {
        const profileName     = document.getElementById('profileName');
        const profileEmail    = document.getElementById('profileEmail');
        const profileAvatar   = document.getElementById('profileAvatar');
        const profileNameSide = document.getElementById('profileNameSide');

        if (profileName) {
            profileName.innerHTML = `${currentUser.name} <span class="profile-verified">&#10003; Verified Provider</span>`;
        }
        if (profileNameSide) profileNameSide.textContent = currentUser.name;
        if (profileEmail)    profileEmail.innerText = currentUser.email || 'Not provided';
        if (profileAvatar) {
            const names = currentUser.name.split(' ');
            const initials = names.map(n => n.charAt(0)).join('').toUpperCase().substring(0, 2);
            profileAvatar.innerText = initials || 'U';
        }

        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                localStorage.removeItem('thola_user');
                alert('You have logged out successfully.');
                window.location.href = 'login.html';
            });
        }
    }

    /* Chat setup */
    if (isChat) {
        const chatInput = document.getElementById('chatInput');
        if (chatInput) {
            chatInput.addEventListener('keydown', e => {
                if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
            });
        }
        setTimeout(() => appendMessage('Hi! I saw your listing. Is it still available?', 'received', 'Provider'), 600);
    }

    /* Dashboard search/filter listeners — original logic */
    const searchInput    = document.getElementById('searchInput');
    const categoryFilter = document.getElementById('categoryFilter');
    const provinceFilter = document.getElementById('provinceFilter');

    if (searchInput)    searchInput.addEventListener('input', filterListings);
    if (categoryFilter) categoryFilter.addEventListener('change', filterListings);
    if (provinceFilter) provinceFilter.addEventListener('change', filterListings);

    /* Tab buttons — original logic */
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => filterByTab(btn.dataset.tab, btn));
    });

});