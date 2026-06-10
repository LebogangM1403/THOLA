// Helper function for password visibility
        function togglePasswordVisibility(inputId, iconElement) {
            const input = document.getElementById(inputId);
            if (input.type === 'password') {
                input.type = 'text';
                iconElement.innerText = '🙈';
            } else {
                input.type = 'password';
                iconElement.innerText = '👁️';
            }
        }

        document.addEventListener('DOMContentLoaded', () => {
            const loginForm   = document.getElementById('login-form');
            const loginSubmit = document.getElementById('login-submit');
            const loginError  = document.getElementById('login-error');

            async function hashPassword(password) {
                const encoder    = new TextEncoder();
                const data       = encoder.encode(password);
                const hashBuffer = await crypto.subtle.digest('SHA-256', data);
                const hashArray  = Array.from(new Uint8Array(hashBuffer));
                return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
            }

            function getDatabase() {
                const localData = localStorage.getItem('thola_database');
                return localData ? JSON.parse(localData) : [];
            }

            loginForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                loginError.style.display = 'none';

                const email    = document.getElementById('email').value.trim().toLowerCase();
                const password = document.getElementById('password').value;

                loginSubmit.disabled  = true;
                loginSubmit.innerText = 'Logging in...';

                try {
                    const users = getDatabase();
                    const user  = users.find(u => u.email.toLowerCase() === email);

                    if (!user) {
                        loginError.innerText     = 'Invalid email or password.';
                        loginError.style.display = 'block';
                        loginSubmit.disabled     = false;
                        loginSubmit.innerText    = 'Log In';
                        return;
                    }

                    const inputHash = await hashPassword(password);
                    if (inputHash === user.password) {
                        localStorage.setItem('thola_user', JSON.stringify({ name: user.name, email: user.email }));
                        window.location.href = 'dashboard.html';
                    } else {
                        loginError.innerText     = 'Invalid email or password.';
                        loginError.style.display = 'block';
                    }
                } catch (err) {
                    loginError.innerText     = 'Error performing authentication. Please try again.';
                    loginError.style.display = 'block';
                    console.error(err);
                } finally {
                    loginSubmit.disabled  = false;
                    loginSubmit.innerText = 'Log In';
                }
            });
        });