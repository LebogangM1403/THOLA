/* ── DEFAULT PROFILE DATA ── */
const defaultProfile = {
    name:     'Lebogang Thola',
    email:    'lebo@thola.co.za',
    age:      24,
    address:  '123 Block A, Soweto',
    location: 'Gauteng, South Africa',
    role:     'Lister',
    skills:   ['House Cleaning', 'Tutoring', 'Phone Repairs']
};

/* ── TOAST ── */
function showToast(msg) {
    const t = document.getElementById('toast');
    t.textContent = msg;
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 2800);
}

/* ── LOAD PROFILE ── */
function loadProfile() {
    const stored = JSON.parse(localStorage.getItem('tholaProfile') || 'null');
    const auth   = JSON.parse(localStorage.getItem('thola_user')   || 'null');
    const p      = stored || { ...defaultProfile, name: auth?.name || defaultProfile.name, email: auth?.email || defaultProfile.email };

    document.getElementById('profileNameDisplay').innerHTML = p.name + ' <span class="profile-verified">&#10003; Verified</span>';
    document.getElementById('profileNameSide').textContent  = p.name;
    document.getElementById('profileEmail').textContent     = p.email;
    document.getElementById('profileAge').textContent       = p.age ? p.age + ' years' : '—';
    document.getElementById('profileAddress').textContent   = p.address || '—';
    document.getElementById('profileLocationDisplay').textContent = '📍 ' + (p.location || 'South Africa');
    document.getElementById('profileLocationSide').textContent    = p.location || '—';
    document.getElementById('profileRole').textContent      = p.role || '—';

    /* Avatar initials */
    const avatarEl = document.getElementById('profileAvatar');
    const savedAvatar = localStorage.getItem('tholaAvatar');
    if (savedAvatar) {
        avatarEl.innerHTML = `<img src="${savedAvatar}">`;
    } else {
        const initials = p.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0,2);
        avatarEl.textContent = initials || 'U';
    }

    renderSkills(p.skills || []);
}

/* ── SKILLS ── */
function renderSkills(skills) {
    const container = document.getElementById('skillsList');
    container.innerHTML = '';
    skills.forEach(skill => {
        const tag = document.createElement('span');
        tag.className = 'skill-tag';
        tag.innerHTML = skill + ' <span class="skill-remove" onclick="removeSkill(this, \'' + skill + '\')">✕</span>';
        container.appendChild(tag);
    });
}

function removeSkill(el, skill) {
    const p = JSON.parse(localStorage.getItem('tholaProfile') || 'null') || defaultProfile;
    p.skills = p.skills.filter(s => s !== skill);
    localStorage.setItem('tholaProfile', JSON.stringify(p));
    renderSkills(p.skills);
    showToast('Skill removed');
}

document.getElementById('addSkillBtn').addEventListener('click', () => {
    const skill = prompt('Enter a new skill:');
    if (skill && skill.trim()) {
        const p = JSON.parse(localStorage.getItem('tholaProfile') || 'null') || defaultProfile;
        if (!p.skills.includes(skill.trim())) {
            p.skills.push(skill.trim());
            localStorage.setItem('tholaProfile', JSON.stringify(p));
            renderSkills(p.skills);
            showToast('Skill added!');
        }
    }
});

/* ── EDIT MODAL ── */
document.getElementById('editBtn').addEventListener('click', () => {
    const p = JSON.parse(localStorage.getItem('tholaProfile') || 'null') || defaultProfile;
    document.getElementById('editName').value     = p.name;
    document.getElementById('editEmail').value    = p.email;
    document.getElementById('editAge').value      = p.age;
    document.getElementById('editAddress').value  = p.address;
    document.getElementById('editLocation').value = p.location;
    document.getElementById('editRole').value     = p.role;
    document.getElementById('editModal').classList.add('open');
});

function closeEditModal() {
    document.getElementById('editModal').classList.remove('open');
}

document.getElementById('editModal').addEventListener('click', function(e) {
    if (e.target === this) closeEditModal();
});

function saveProfile() {
    const existing = JSON.parse(localStorage.getItem('tholaProfile') || 'null') || defaultProfile;
    const p = {
        ...existing,
        name:     document.getElementById('editName').value.trim(),
        email:    document.getElementById('editEmail').value.trim(),
        age:      parseInt(document.getElementById('editAge').value) || existing.age,
        address:  document.getElementById('editAddress').value.trim(),
        location: document.getElementById('editLocation').value.trim(),
        role:     document.getElementById('editRole').value,
    };
    localStorage.setItem('tholaProfile', JSON.stringify(p));
    localStorage.setItem('thola_user', JSON.stringify({ name: p.name, email: p.email }));
    loadProfile();
    closeEditModal();
    showToast('✅ Profile updated!');
}

/* ── AVATAR UPLOAD ── */
document.getElementById('profileAvatar').addEventListener('click', () => {
    document.getElementById('avatarUpload').click();
});

document.getElementById('avatarUpload').addEventListener('change', function(e) {
    if (e.target.files[0]) {
        const reader = new FileReader();
        reader.onload = ev => {
            document.getElementById('profileAvatar').innerHTML = `<img src="${ev.target.result}">`;
            localStorage.setItem('tholaAvatar', ev.target.result);
            showToast('✅ Photo updated!');
        };
        reader.readAsDataURL(e.target.files[0]);
    }
});

/* ── LOGOUT ── */
document.getElementById('logoutBtn').addEventListener('click', () => {
    if (confirm('Are you sure you want to log out?')) {
        localStorage.removeItem('thola_user');
        sessionStorage.removeItem('session_listings');
        window.location.href = 'index.html';
    }
});

/* ── TAB SWITCHING ── */
function showProfileTab(tab, btn) {
    document.querySelectorAll('.tab-pane').forEach(p => p.style.display = 'none');
    document.getElementById('tab-' + tab).style.display = 'block';
    document.querySelectorAll('.profile-tab').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
}

/* ── INIT ── */
loadProfile();