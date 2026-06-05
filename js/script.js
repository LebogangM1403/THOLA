document.addEventListener('DOMContentLoaded', () => {
  const toggleBtn = document.getElementById('theme-toggle');
  
  // Apply saved preference immediately on load and set matching tooltip text
  

  // Toggle theme on click
  toggleBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    
    if (document.body.classList.contains('dark-mode')) {
      localStorage.setItem('theme', 'dark');
      
    } else {
      localStorage.setItem('theme', 'light');
      
    }
  });
});
