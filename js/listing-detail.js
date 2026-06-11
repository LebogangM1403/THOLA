// Load listing from localStorage or URL
function loadListing() {
    const urlParams = new URLSearchParams(window.location.search);
    const listingId = urlParams.get('id');
    
    let listings = [
        ...JSON.parse(sessionStorage.getItem('session_listings') || '[]'),
        ...JSON.parse(localStorage.getItem('thola_listings') || '[]')
    ];
    
    const dummyListings = [
        {
            id: 'dummy-1',
            title: 'Professional House Cleaning',
            description: 'Thorough, reliable home and office cleaning in Johannesburg. Custom rates available.',
            price: '350',
            location: 'Gauteng, South Africa'
        },
        {
            id: 'dummy-2',
            title: 'Traditional Homemade Platters',
            description: 'Fresh traditional South African meals prepared daily. Free delivery within Cape Town.',
            price: '85',
            location: 'Western Cape, South Africa'
        },
        {
            id: 'dummy-3',
            title: 'High School Maths & Science Tutoring',
            description: 'University engineering student offering top-quality matric exam prep sessions.',
            price: '150',
            location: 'KwaZulu-Natal, South Africa'
        },
        {
            id: 'dummy-4',
            title: 'Fast Screen & Battery Replacements',
            description: 'On-site smartphone repairs. Original parts with 6-month warranty.',
            price: '600',
            location: 'Gauteng, South Africa'
        },
        {
            id: 'dummy-5',
            title: '6tuy Transport Services',
            description: 'Affordable and reliable local transport, moving, and delivery services across the province.',
            price: '150',
            location: 'Gauteng, South Africa'
        }
    ];

    let listing = listings.find(l => l.id == listingId) || dummyListings.find(l => l.id == listingId);
    
    // Fallback default if no listing found
    if (!listing) {
        listing = {
            title: "Professional House Cleaning",
            description: "Thorough home and office cleaning service. Eco-friendly products and reliable service.",
            price: "350",
            location: "Gauteng, South Africa",
            image: "https://via.placeholder.com/800x320/ffe6d5/0d1e3d?text=Cleaning+Service"
        };
    }

    document.getElementById('detailTitle').textContent = listing.title || "Service Title";
    document.getElementById('detailDescription').textContent = listing.description || "No description available.";
    document.getElementById('detailPrice').textContent = `R${listing.price || '350'}`;
    document.getElementById('detailLocation').textContent = listing.location || "South Africa";
    
    if (listing.image) {
        document.getElementById('detailImage').src = listing.image;
    }
}

function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.style.display = 'block';
    setTimeout(() => toast.style.display = 'none', 3000);
}

function contactSeller() {
    showToast("✅ Message sent to seller!");
    setTimeout(() => window.location.href = "chat.html", 1200);
}

function bookNow() {
    showToast("✅ Booking request sent!");
    setTimeout(() => window.location.href = "chat.html", 1200);
}

function makeOffer() {
    const offer = prompt("Enter your offer amount (R):");
    if (offer) {
        showToast(`💰 Offer of R${offer} sent!`);
        setTimeout(() => window.location.href = "chat.html", 1500);
    }
}

// Initialize
loadListing();