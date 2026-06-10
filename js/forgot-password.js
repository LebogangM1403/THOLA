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
            const requestForm = document.getElementById('request-form'),
                  otpForm = document.getElementById('otp-form'),
                  passwordForm = document.getElementById('password-form'),
                  requestCard = document.getElementById('request-card'),
                  otpCard = document.getElementById('otp-card'),
                  passwordCard = document.getElementById('password-card'),
                  requestError = document.getElementById('request-error'),
                  otpError = document.getElementById('otp-error'),
                  passwordError = document.getElementById('password-error'),
                  otpSubtitle = document.getElementById('otp-subtitle'),
                  resendOtpLink = document.getElementById('resend-otp-link'),
                  requestSubmit = document.getElementById('request-submit'),
                  otpSubmit = document.getElementById('otp-submit'),
                  passwordSubmit = document.getElementById('password-submit');

            let userEmail = '', userName = '', generatedOtp = '';

            // Init EmailJS
            if (typeof EMAILJS_PUBLIC_KEY !== 'undefined' && EMAILJS_PUBLIC_KEY) {
                emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
            }

            // Helpers
            async function hashPassword(p) {
                const e = new TextEncoder(),
                      d = e.encode(p),
                      h = await crypto.subtle.digest('SHA-256', d),
                      a = Array.from(new Uint8Array(h));
                return a.map(b => b.toString(16).padStart(2, '0')).join('');
            }

            function getDatabase() {
                const d = localStorage.getItem('thola_database');
                return d ? JSON.parse(d) : [];
            }

            function saveDatabase(u) {
                localStorage.setItem('thola_database', JSON.stringify(u));
            }

            // Step 1: Submit email
            requestForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                requestError.style.display = 'none';
                userEmail = document.getElementById('email').value.trim().toLowerCase();

                const users = getDatabase();
                const matchedUser = users.find(u => u.email.toLowerCase() === userEmail);

                if (!matchedUser) {
                    requestError.innerText = 'No account found with this email address.';
                    requestError.style.display = 'block';
                    return;
                }

                userName = matchedUser.name;

                if (typeof EMAILJS_PUBLIC_KEY === 'undefined' || EMAILJS_PUBLIC_KEY.includes('your_public_key')) {
                    requestError.innerText = 'Please configure your EmailJS API keys in js/credentials.js';
                    requestError.style.display = 'block';
                    return;
                }

                requestSubmit.disabled = true;
                requestSubmit.innerText = 'Sending Code...';
                generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();

                const templateId = typeof EMAILJS_RESET_TEMPLATE_ID !== 'undefined' ? EMAILJS_RESET_TEMPLATE_ID : EMAILJS_TEMPLATE_ID;

                try {
                    emailjs.send(EMAILJS_SERVICE_ID, templateId, {
                        to_name: userName,
                        to_email: userEmail,
                        email: userEmail,
                        user_email: userEmail,
                        otp_code: generatedOtp,
                        otp: generatedOtp,
                        code: generatedOtp,
                        message: generatedOtp
                    }).then(() => {
                        otpSubtitle.innerHTML = `We sent a 6-digit recovery code to <strong style="color:#ff6600;">${userEmail}</strong>`;
                        requestCard.style.display = 'none';
                        otpCard.style.display = 'block';
                        requestSubmit.disabled = false;
                        requestSubmit.innerText = 'Send Recovery Code';
                    }).catch(err => {
                        requestError.innerText = 'Failed to send code: ' + (err.text || JSON.stringify(err));
                        requestError.style.display = 'block';
                        requestSubmit.disabled = false;
                        requestSubmit.innerText = 'Send Recovery Code';
                    });
                } catch (err) {
                    requestError.innerText = 'EmailJS connection error.';
                    requestError.style.display = 'block';
                    requestSubmit.disabled = false;
                    requestSubmit.innerText = 'Send Recovery Code';
                }
            });

            // Step 2: Submit OTP
            otpForm.addEventListener('submit', (e) => {
                e.preventDefault();
                otpError.style.display = 'none';
                const otpVal = document.getElementById('otp').value.trim();

                otpSubmit.disabled = true;
                otpSubmit.innerText = 'Verifying...';

                if (otpVal !== generatedOtp) {
                    otpError.innerText = 'Invalid verification code.';
                    otpError.style.display = 'block';
                    otpSubmit.disabled = false;
                    otpSubmit.innerText = 'Verify Code';
                    return;
                }

                otpCard.style.display = 'none';
                passwordCard.style.display = 'block';
                otpSubmit.disabled = false;
                otpSubmit.innerText = 'Verify Code';
            });

            // Step 3: Set new password
            passwordForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                passwordError.style.display = 'none';

                const newPass = document.getElementById('new-password').value;
                const confirmPass = document.getElementById('confirm-password').value;

                if (newPass.length < 6) {
                    passwordError.innerText = 'Password must be at least 6 characters long.';
                    passwordError.style.display = 'block';
                    return;
                }

                if (newPass !== confirmPass) {
                    passwordError.innerText = 'Passwords do not match.';
                    passwordError.style.display = 'block';
                    return;
                }

                passwordSubmit.disabled = true;
                passwordSubmit.innerText = 'Updating...';

                try {
                    const hashed = await hashPassword(newPass);
                    const users = getDatabase();
                    const userIndex = users.findIndex(u => u.email.toLowerCase() === userEmail);

                    if (userIndex === -1) {
                        passwordError.innerText = 'Account lookup error.';
                        passwordError.style.display = 'block';
                        return;
                    }

                    users[userIndex].password = hashed;
                    saveDatabase(users);

                    alert('Password updated successfully! Please log in with your new password.');
                    window.location.href = 'login.html';
                } catch (err) {
                    passwordError.innerText = 'Failed to save new password.';
                    passwordError.style.display = 'block';
                } finally {
                    passwordSubmit.disabled = false;
                    passwordSubmit.innerText = 'Update Password';
                }
            });

            resendOtpLink.addEventListener('click', async (e) => {
                e.preventDefault();
                otpError.style.display = 'none';

                if (resendOtpLink.classList.contains('disabled')) return;

                resendOtpLink.classList.add('disabled');
                resendOtpLink.innerText = 'Resending...';

                const users = getDatabase();
                const matchedUser = users.find(u => u.email.toLowerCase() === userEmail);

                if (!matchedUser) {
                    otpError.innerText = 'Account lookup error. Please try again.';
                    otpError.style.display = 'block';
                    resendOtpLink.classList.remove('disabled');
                    resendOtpLink.innerText = 'Resend Code';
                    return;
                }

                generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
                const templateId = typeof EMAILJS_RESET_TEMPLATE_ID !== 'undefined' ? EMAILJS_RESET_TEMPLATE_ID : EMAILJS_TEMPLATE_ID;

                try {
                    emailjs.send(EMAILJS_SERVICE_ID, templateId, {
                        to_name: userName,
                        to_email: userEmail,
                        email: userEmail,
                        user_email: userEmail,
                        otp_code: generatedOtp,
                        otp: generatedOtp,
                        code: generatedOtp,
                        message: generatedOtp
                    }).then(() => {
                        otpError.innerText = '✅ A new recovery code has been sent!';
                        otpError.style.display = 'block';
                        otpError.style.color = '#22c55e'; // Success green

                        setTimeout(() => {
                            otpError.style.display = 'none';
                            otpError.style.color = '#ff3333'; // Reset to red
                        }, 5000);

                        resendOtpLink.classList.remove('disabled');
                        resendOtpLink.innerText = 'Resend Code';
                    }).catch(err => {
                        otpError.innerText = 'Failed to send code: ' + (err.text || JSON.stringify(err));
                        otpError.style.display = 'block';
                        resendOtpLink.classList.remove('disabled');
                        resendOtpLink.innerText = 'Resend Code';
                    });
                } catch (err) {
                    otpError.innerText = 'EmailJS connection error.';
                    otpError.style.display = 'block';
                    resendOtpLink.classList.remove('disabled');
                    resendOtpLink.innerText = 'Resend Code';
                }
            });
        });