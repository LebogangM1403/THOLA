document.getElementById('reportForm').addEventListener('submit', function(e) {
    e.preventDefault();

    // Simple validation
    const description = document.getElementById('description').value.trim();
    if (description.length < 10) {
        alert("Please provide more details in the description.");
        return;
    }

    // Show success toast
    const toast = document.getElementById('toast');
    toast.style.display = 'block';

    // Reset form
    this.reset();

    // Auto hide toast and redirect after 2 seconds
    setTimeout(() => {
        toast.style.display = 'none';
        window.location.href = 'dashboard.html';
    }, 2200);
});