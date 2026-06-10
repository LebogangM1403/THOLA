// ===================== REGISTRATION LOGIC =====================
let userEmail = '', userName = '', userPassword = '', generatedOtp = '';

const registerForm = document.getElementById('register-form');
const otpForm = document.getElementById('otp-form');
const registerCard = document.getElementById('register-card');
const otpCard = document.getElementById('otp-card');
const registerError = document.getElementById('register-error');
const otpError = document.getElementById('otp-error');
const otpSubtitle = document.getElementById('otp-subtitle');

function getDatabase() {
    return JSON.parse(localStorage.getItem('thola_database') || '[]');
}

function saveDatabase(users) {
    localStorage.setItem('thola_database', JSON.stringify(users));
}

registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    registerError.textContent = '';

    userName = document.getElementById('name').value.trim();
    userEmail = document.getElementById('email').value.trim().toLowerCase();
    userPassword = document.getElementById('password').value;

    if (userPassword.length < 6) {
        registerError.textContent = 'Password must be at least 6 characters';
        return;
    }

    // Check if email exists
    const users = getDatabase();
    if (users.some(u => u.email.toLowerCase() === userEmail)) {
        registerError.textContent = 'This email is already registered';
        return;
    }

    const submitBtn = document.getElementById('register-submit');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending code...';

    generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();

    // Try to send email (EmailJS)
    try {
        if (typeof emailjs !== 'undefined' && EMAILJS_PUBLIC_KEY) {
            await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
                to_name: userName,
                to_email: userEmail,
                otp_code: generatedOtp
            });
        } else {
            console.log("EmailJS not configured - using demo mode");
        }

        otpSubtitle.innerHTML = `Code sent to <strong>${userEmail}</strong>`;
        registerCard.style.display = 'none';
        otpCard.style.display = 'block';
    } catch (err) {
        console.error(err);
        registerError.textContent = 'Failed to send code. Please try again.';
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Get Verification Code';
    }
});

otpForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    otpError.textContent = '';

    const enteredOtp = document.getElementById('otp').value.trim();

    if (enteredOtp !== generatedOtp) {
        otpError.textContent = 'Incorrect verification code';
        return;
    }

    const submitBtn = document.getElementById('otp-submit');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Creating account...';

    try {
        const hashedPassword = await hashPassword(userPassword); // using your existing function or simple hash

        const users = getDatabase();
        users.push({
            name: userName,
            email: userEmail,
            password: hashedPassword,
            role: "Lister",
            registeredAt: new Date().toISOString()
        });

        saveDatabase(users);

        alert('✅ Account created successfully!');
        window.location.href = 'login.html';
    } catch (err) {
        otpError.textContent = 'Error creating account. Please try again.';
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Verify & Create Account';
    }
});

document.getElementById('resend-otp-link').addEventListener('click', (e) => {
    e.preventDefault();
    registerCard.style.display = 'block';
    otpCard.style.display = 'none';
});

// Simple password hash (fallback)
async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hash = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2,'0')).join('');
}