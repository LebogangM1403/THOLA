// Image Preview
const uploadArea = document.getElementById('uploadArea');
const imageUpload = document.getElementById('imageUpload');
const imagePreview = document.getElementById('imagePreview');

uploadArea.addEventListener('click', () => imageUpload.click());

imageUpload.addEventListener('change', function(e) {
    if (e.target.files[0]) {
        const reader = new FileReader();
        reader.onload = function(ev) {
            imagePreview.src = ev.target.result;
            imagePreview.style.display = 'block';
        };
        reader.readAsDataURL(e.target.files[0]);
    }
});

// Form Submit - Save to localStorage
document.getElementById('postForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const listing = {
        id: Date.now(),
        type: document.getElementById('listingType').value,
        title: document.getElementById('title').value,
        description: document.getElementById('description').value,
        price: document.getElementById('price').value,
        location: document.getElementById('location').value,
        category: document.getElementById('category').value,
        image: imagePreview.src || null,
        date: new Date().toISOString(),
        views: 0,
        deals: 0
    };

    // Save to localStorage
    let listings = JSON.parse(localStorage.getItem('thola_listings') || '[]');
    listings.unshift(listing); // Add to beginning
    localStorage.setItem('thola_listings', JSON.stringify(listings));

    // Show success message
    const toast = document.getElementById('toast');
    toast.textContent = "✅ Listing posted successfully!";
    toast.style.display = 'block';
    toast.style.background = '#22c55e';

    // Reset form
    this.reset();
    imagePreview.style.display = 'none';

    // Redirect to dashboard after 1.5 seconds
    setTimeout(() => {
        window.location.href = 'dashboard.html';
    }, 1500);
});