function openModal()  { document.getElementById('postModal').classList.add('open'); }
        function closeModal() { document.getElementById('postModal').classList.remove('open'); }

        document.getElementById('postModal').addEventListener('click', function(e) {
            if (e.target === this) closeModal();
        });

        /* Greet the logged-in user by first name */
        (function() {
            const user = JSON.parse(localStorage.getItem('thola_user') || 'null')
                      || JSON.parse(localStorage.getItem('tholaProfile') || 'null');
            if (user && user.name) {
                const firstName = user.name.trim().split(' ')[0];
                document.getElementById('heroUserName').textContent = firstName;
            }
        })();