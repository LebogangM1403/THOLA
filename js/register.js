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
            const registerForm=document.getElementById('register-form'),otpForm=document.getElementById('otp-form'),registerCard=document.getElementById('register-card'),otpCard=document.getElementById('otp-card'),registerError=document.getElementById('register-error'),otpError=document.getElementById('otp-error'),otpSubtitle=document.getElementById('otp-subtitle'),resendOtpLink=document.getElementById('resend-otp-link'),registerSubmit=document.getElementById('register-submit'),otpSubmit=document.getElementById('otp-submit');
            let userEmail='',userName='',userPassword='',generatedOtp='';
            if(typeof EMAILJS_PUBLIC_KEY!=='undefined'&&EMAILJS_PUBLIC_KEY){emailjs.init({publicKey:EMAILJS_PUBLIC_KEY});}
            async function hashPassword(p){const e=new TextEncoder(),d=e.encode(p),h=await crypto.subtle.digest('SHA-256',d),a=Array.from(new Uint8Array(h));return a.map(b=>b.toString(16).padStart(2,'0')).join('');}
            function getDatabase(){const d=localStorage.getItem('thola_database');return d?JSON.parse(d):[];}
            function saveDatabase(u){localStorage.setItem('thola_database',JSON.stringify(u));}
            registerForm.addEventListener('submit',async(e)=>{
                e.preventDefault();registerError.style.display='none';
                userName=document.getElementById('name').value.trim();
                userEmail=document.getElementById('email').value.trim().toLowerCase();
                userPassword=document.getElementById('password').value;
                const users=getDatabase();
                if(users.some(u=>u.email.toLowerCase()===userEmail)){registerError.innerText='Email address already registered';registerError.style.display='block';return;}
                if(typeof EMAILJS_PUBLIC_KEY==='undefined'||EMAILJS_PUBLIC_KEY.includes('your_public_key')){registerError.innerText='Please configure your EmailJS API keys in js/credentials.js';registerError.style.display='block';return;}
                registerSubmit.disabled=true;registerSubmit.innerText='Sending OTP...';
                generatedOtp=Math.floor(100000+Math.random()*900000).toString();
                try{emailjs.send(EMAILJS_SERVICE_ID,EMAILJS_TEMPLATE_ID,{to_name:userName,to_email:userEmail,email:userEmail,user_email:userEmail,otp_code:generatedOtp,otp:generatedOtp,code:generatedOtp,message:generatedOtp}).then(()=>{otpSubtitle.innerHTML=`We sent a 6-digit code to <strong style="color:#ff6600;">${userEmail}</strong>`;registerCard.style.display='none';otpCard.style.display='block';registerSubmit.disabled=false;registerSubmit.innerText='Get Verification Code';}).catch(err=>{registerError.innerText='Failed to send OTP: '+(err.text||JSON.stringify(err));registerError.style.display='block';registerSubmit.disabled=false;registerSubmit.innerText='Get Verification Code';});}catch(err){registerError.innerText='EmailJS connection error.';registerError.style.display='block';registerSubmit.disabled=false;registerSubmit.innerText='Get Verification Code';}
            });
            otpForm.addEventListener('submit',async(e)=>{
                e.preventDefault();otpError.style.display='none';
                const otpVal=document.getElementById('otp').value.trim();
                otpSubmit.disabled=true;otpSubmit.innerText='Verifying...';
                if(otpVal!==generatedOtp){otpError.innerText='Invalid verification code.';otpError.style.display='block';otpSubmit.disabled=false;otpSubmit.innerText='Verify & Create Account';return;}
                try{const hp=await hashPassword(userPassword),users=getDatabase();users.push({name:userName,email:userEmail,password:hp,registeredAt:new Date().toISOString()});saveDatabase(users);localStorage.setItem('thola_user',JSON.stringify({name:userName,email:userEmail}));window.location.href='dashboard.html';}catch(err){otpError.innerText='Error saving account info.';otpError.style.display='block';}finally{otpSubmit.disabled=false;otpSubmit.innerText='Verify & Create Account';}
            });
            resendOtpLink.addEventListener('click', async (e) => {
                e.preventDefault();
                otpError.style.display = 'none';

                if (resendOtpLink.classList.contains('disabled')) return;

                resendOtpLink.classList.add('disabled');
                resendOtpLink.innerText = 'Resending...';

                generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();

                try {
                    emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
                        to_name: userName,
                        to_email: userEmail,
                        email: userEmail,
                        user_email: userEmail,
                        otp_code: generatedOtp,
                        otp: generatedOtp,
                        code: generatedOtp,
                        message: generatedOtp
                    }).then(() => {
                        otpError.innerText = '✅ A new verification code has been sent!';
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