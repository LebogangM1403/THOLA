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

            // Check if registration was successful
            if (sessionStorage.getItem('thola_reg_success') === '1') {
                sessionStorage.removeItem('thola_reg_success');
                
                // Show a modern banner on the card
                const successBanner = document.createElement('div');
                successBanner.className = 'success-msg';
                successBanner.style.backgroundColor = 'rgba(34, 197, 94, 0.1)';
                successBanner.style.color = '#4ade80';
                successBanner.style.border = '1px solid rgba(34, 197, 94, 0.25)';
                successBanner.style.padding = '14px';
                successBanner.style.borderRadius = '10px';
                successBanner.style.fontSize = '14px';
                successBanner.style.fontWeight = '600';
                successBanner.style.textAlign = 'center';
                successBanner.style.marginBottom = '20px';
                successBanner.style.backdropFilter = 'blur(8px)';
                successBanner.innerText = '✅ Account created successfully! Please log in below.';
                
                loginForm.parentNode.insertBefore(successBanner, loginForm);
                
                // Standard window alert
                alert('Account created successfully! You can now log in.');
            }

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