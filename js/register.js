// ─── Helper: toggle password visibility ───────────────────────────────────────
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

    // ── Element refs ────────────────────────────────────────────────────────────
    const registerForm   = document.getElementById('register-form');
    const otpForm        = document.getElementById('otp-form');
    const registerCard   = document.getElementById('register-card');
    const otpCard        = document.getElementById('otp-card');
    const registerError  = document.getElementById('register-error');
    const otpError       = document.getElementById('otp-error');
    const otpSubtitle    = document.getElementById('otp-subtitle');
    const resendOtpLink  = document.getElementById('resend-otp-link');
    const registerSubmit = document.getElementById('register-submit');
    const otpSubmit      = document.getElementById('otp-submit');
    const pwInput        = document.getElementById('password');
    const confirmInput   = document.getElementById('confirm-password');
    const matchMsg       = document.getElementById('match-msg');
    const strengthFill   = document.getElementById('pw-strength-fill');
    const strengthLabel  = document.getElementById('pw-strength-label');

    // Rule elements
    const ruleLen   = document.getElementById('rule-len');
    const ruleUpper = document.getElementById('rule-upper');
    const ruleLower = document.getElementById('rule-lower');
    const ruleNum   = document.getElementById('rule-num');
    const ruleSym   = document.getElementById('rule-sym');

    let userEmail = '', userName = '', userPassword = '', generatedOtp = '';

    // ── EmailJS init ─────────────────────────────────────────────────────────────
    if (typeof EMAILJS_PUBLIC_KEY !== 'undefined' && EMAILJS_PUBLIC_KEY) {
        emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
    }

    // ── Crypto helper ────────────────────────────────────────────────────────────
    async function hashPassword(p) {
        const e = new TextEncoder(), d = e.encode(p);
        const h = await crypto.subtle.digest('SHA-256', d);
        return Array.from(new Uint8Array(h)).map(b => b.toString(16).padStart(2, '0')).join('');
    }

    // ── LocalStorage helpers ─────────────────────────────────────────────────────
    function getDatabase() {
        const d = localStorage.getItem('thola_database');
        return d ? JSON.parse(d) : [];
    }
    function saveDatabase(u) {
        localStorage.setItem('thola_database', JSON.stringify(u));
    }

    // ── Password rules ────────────────────────────────────────────────────────────
    const RULES = {
        len:   v => v.length >= 8,
        upper: v => /[A-Z]/.test(v),
        lower: v => /[a-z]/.test(v),
        num:   v => /[0-9]/.test(v),
        sym:   v => /[^A-Za-z0-9]/.test(v),
    };

    function checkRule(el, passes) {
        if (passes) {
            el.classList.add('pass');
            el.classList.remove('fail');
        } else {
            el.classList.add('fail');
            el.classList.remove('pass');
        }
    }

    function updateStrength(pw) {
        const score = Object.values(RULES).filter(fn => fn(pw)).length;
        const pct   = (score / 5) * 100;

        strengthFill.style.width = pct + '%';

        const levels = ['', 'Very Weak', 'Weak', 'Fair', 'Strong', 'Very Strong'];
        const colors = ['', '#ef4444', '#f97316', '#eab308', '#22c55e', '#16a34a'];
        strengthFill.style.backgroundColor = colors[score] || '#e2e8f0';
        strengthLabel.textContent  = pw.length ? levels[score] : '';
        strengthLabel.style.color  = colors[score] || '#94a3b8';

        // Individual rule feedback
        checkRule(ruleLen,   RULES.len(pw));
        checkRule(ruleUpper, RULES.upper(pw));
        checkRule(ruleLower, RULES.lower(pw));
        checkRule(ruleNum,   RULES.num(pw));
        checkRule(ruleSym,   RULES.sym(pw));

        return score;
    }

    function checkMatch() {
        const pw  = pwInput.value;
        const cpw = confirmInput.value;
        if (!cpw) { matchMsg.style.display = 'none'; return; }
        matchMsg.style.display = 'block';
        if (pw === cpw) {
            matchMsg.textContent  = '✓ Passwords match';
            matchMsg.style.color  = '#22c55e';
        } else {
            matchMsg.textContent  = '✗ Passwords do not match';
            matchMsg.style.color  = '#ef4444';
        }
    }

    // ── Live listeners ────────────────────────────────────────────────────────────
    pwInput.addEventListener('input', () => {
        updateStrength(pwInput.value);
        checkMatch();
    });
    confirmInput.addEventListener('input', checkMatch);

    // ── Step 1 – Register form submit ─────────────────────────────────────────────
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        registerError.style.display = 'none';

        userName     = document.getElementById('name').value.trim();
        userEmail    = document.getElementById('email').value.trim().toLowerCase();
        userPassword = pwInput.value;
        const confirmPw = confirmInput.value;

        // --- Password strength check ---
        const score = updateStrength(userPassword);
        if (score < 5) {
            registerError.innerText = 'Your password does not meet all requirements. Please check the checklist above.';
            registerError.style.display = 'block';
            return;
        }

        // --- Password match check ---
        if (userPassword !== confirmPw) {
            registerError.innerText = 'Passwords do not match. Please re-enter.';
            registerError.style.display = 'block';
            return;
        }

        // --- Duplicate email check ---
        const users = getDatabase();
        if (users.some(u => u.email.toLowerCase() === userEmail)) {
            registerError.innerText = 'Email address already registered.';
            registerError.style.display = 'block';
            return;
        }

        // --- EmailJS config check ---
        if (typeof EMAILJS_PUBLIC_KEY === 'undefined' || EMAILJS_PUBLIC_KEY.includes('your_public_key')) {
            registerError.innerText = 'Please configure your EmailJS API keys in js/credentials.js';
            registerError.style.display = 'block';
            return;
        }

        registerSubmit.disabled  = true;
        registerSubmit.innerText = 'Sending OTP…';

        generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();

        const expiryDate = new Date(Date.now() + 15 * 60 * 1000);
        const expiryTime = expiryDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        try {
            emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
                to_name: userName,
                to_email: userEmail,
                email: userEmail,
                user_email: userEmail,
                otp_code: generatedOtp,
                otp: generatedOtp,
                code: generatedOtp,
                message: generatedOtp,
                expiry_time: expiryTime,
                company_name: 'THOLA',
                app_name: 'THOLA',
                valid_minutes: '15'
            }).then(() => {
                otpSubtitle.innerHTML = `We sent a 6-digit code to <strong style="color:#ff6600;">${userEmail}</strong>`;
                registerCard.style.display = 'none';
                otpCard.style.display      = 'block';
                registerSubmit.disabled    = false;
                registerSubmit.innerText   = 'Get Verification Code';
            }).catch(err => {
                registerError.innerText      = 'Failed to send OTP: ' + (err.text || JSON.stringify(err));
                registerError.style.display  = 'block';
                registerSubmit.disabled      = false;
                registerSubmit.innerText     = 'Get Verification Code';
            });
        } catch (err) {
            registerError.innerText      = 'EmailJS connection error.';
            registerError.style.display  = 'block';
            registerSubmit.disabled      = false;
            registerSubmit.innerText     = 'Get Verification Code';
        }
    });

    // ── Step 2 – OTP verify & create account ────────────────────────────────────
    otpForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        otpError.style.display = 'none';

        const otpVal = document.getElementById('otp').value.trim();
        otpSubmit.disabled  = true;
        otpSubmit.innerText = 'Verifying…';

        if (otpVal !== generatedOtp) {
            otpError.innerText      = 'Invalid verification code. Please try again.';
            otpError.style.display  = 'block';
            otpSubmit.disabled      = false;
            otpSubmit.innerText     = 'Verify & Create Account';
            return;
        }

        try {
            const hp    = await hashPassword(userPassword);
            const users = getDatabase();
            users.push({ name: userName, email: userEmail, password: hp, registeredAt: new Date().toISOString() });
            saveDatabase(users);

            // ✅ Flag for login page to show success alert
            sessionStorage.setItem('thola_reg_success', '1');

            // Redirect to login
            window.location.href = 'login.html';

        } catch (err) {
            otpError.innerText      = 'Error saving account. Please try again.';
            otpError.style.display  = 'block';
        } finally {
            otpSubmit.disabled  = false;
            otpSubmit.innerText = 'Verify & Create Account';
        }
    });

    // ── Resend OTP ───────────────────────────────────────────────────────────────
    resendOtpLink.addEventListener('click', async (e) => {
        e.preventDefault();
        otpError.style.display = 'none';
        if (resendOtpLink.classList.contains('disabled')) return;

        resendOtpLink.classList.add('disabled');
        resendOtpLink.innerText = 'Resending…';

        generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();

        const expiryDate = new Date(Date.now() + 15 * 60 * 1000);
        const expiryTime = expiryDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        try {
            emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
                to_name: userName,
                to_email: userEmail,
                email: userEmail,
                user_email: userEmail,
                otp_code: generatedOtp,
                otp: generatedOtp,
                code: generatedOtp,
                message: generatedOtp,
                expiry_time: expiryTime,
                company_name: 'THOLA',
                app_name: 'THOLA',
                valid_minutes: '15'
            }).then(() => {
                otpError.innerText     = '✅ A new verification code has been sent!';
                otpError.style.display = 'block';
                otpError.style.color   = '#22c55e';
                setTimeout(() => {
                    otpError.style.display = 'none';
                    otpError.style.color   = '#ff3333';
                }, 5000);
                resendOtpLink.classList.remove('disabled');
                resendOtpLink.innerText = 'Resend Code';
            }).catch(err => {
                otpError.innerText     = 'Failed to send code: ' + (err.text || JSON.stringify(err));
                otpError.style.display = 'block';
                resendOtpLink.classList.remove('disabled');
                resendOtpLink.innerText = 'Resend Code';
            });
        } catch (err) {
            otpError.innerText     = 'EmailJS connection error.';
            otpError.style.display = 'block';
            resendOtpLink.classList.remove('disabled');
            resendOtpLink.innerText = 'Resend Code';
        }
    });
});