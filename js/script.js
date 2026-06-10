document.addEventListener('DOMContentLoaded', () => {
  const toggleBtn = document.getElementById('theme-toggle');
  
  // Apply saved preference immediately on load and set matching tooltip text
  if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark-mode');
    toggleBtn.setAttribute('title', 'Toggle Light Mode');
  } else {
    toggleBtn.setAttribute('title', 'Toggle Dark Mode');
  }

  // Toggle theme on click
  toggleBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    
    // Save state to local storage and dynamically update the hover text
    if (document.body.classList.contains('dark-mode')) {
      localStorage.setItem('theme', 'dark');
      toggleBtn.setAttribute('title', 'Toggle Light Mode');
    } else {
      localStorage.setItem('theme', 'light');
      toggleBtn.setAttribute('title', 'Toggle Dark Mode');
    }
  });
});
