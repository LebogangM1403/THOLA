/* ── Image Preview ────────────────────────────────────────────────── */
const uploadArea   = document.getElementById('uploadArea');
const imageUpload  = document.getElementById('imageUpload');
const imagePreview = document.getElementById('imagePreview');

uploadArea.addEventListener('click', () => imageUpload.click());

imageUpload.addEventListener('change', function(e) {
    if (e.target.files[0]) {
        const reader = new FileReader();
        reader.onload = ev => {
            imagePreview.src = ev.target.result;
            imagePreview.style.display = 'block';
        };
        reader.readAsDataURL(e.target.files[0]);
    }
});

/* ── Type icons ───────────────────────────────────────────────────── */
const TYPE_ICONS = {
    skill: '🛠️', goods: '📦', job: '💼', request: '🙋'
};

/* ── Form Submit — save to sessionStorage (session only) ─────────── */
document.getElementById('postForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const user = JSON.parse(localStorage.getItem('thola_user') || '{}');
    const name = user.name || 'You';
    const initials = name.trim().split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase();

    const type     = document.getElementById('listingType').value;
    const category = document.getElementById('category').value.trim();
    const title    = document.getElementById('title').value.trim();
    const desc     = document.getElementById('description').value.trim();
    const price    = document.getElementById('price').value;
    const location = document.getElementById('location').value.trim();

    const listing = {
        id:          'session-' + Date.now(),
        type,
        category:    category.toLowerCase(),
        title,
        description: desc,
        price:       Number(price),
        priceUnit:   type === 'goods' ? 'item' : 'session',
        seller:      name,
        sellerInitials: initials,
        location,
        province:    location.toLowerCase().includes('eastern') ? 'eastern-cape'
                   : location.toLowerCase().includes('western') ? 'western-cape'
                   : location.toLowerCase().includes('northern') ? 'northern-cape'
                   : location.toLowerCase().includes('kzn') || location.toLowerCase().includes('natal') ? 'kzn'
                   : location.toLowerCase().includes('free') ? 'free-state'
                   : location.toLowerCase().includes('limpopo') ? 'limpopo'
                   : location.toLowerCase().includes('mpumalanga') ? 'mpumalanga'
                   : location.toLowerCase().includes('north west') ? 'north-west'
                   : 'gauteng',
        rating:      null,
        verified:    false,
        near:        false,
        icon:        TYPE_ICONS[type] || '📋',
        image:       imagePreview.src && imagePreview.src !== window.location.href ? imagePreview.src : null,
        postedAt:    new Date().toISOString(),
        session:     true   // flag: disappears on logout / reload
    };

    /* Save to sessionStorage — NOT localStorage */
    const existing = JSON.parse(sessionStorage.getItem('session_listings') || '[]');
    existing.unshift(listing);
    sessionStorage.setItem('session_listings', JSON.stringify(existing));

    /* Toast */
    const toast = document.getElementById('toast');
    toast.textContent = '✅ Listing posted! Redirecting to dashboard…';
    toast.style.display = 'block';
    toast.style.background = '#22c55e';

    this.reset();
    imagePreview.style.display = 'none';

    setTimeout(() => { window.location.href = 'dashboard.html'; }, 1400);
});