// ============================================
// SYNORA - Auth Handler
// Version: 4.0 - CLEAN - No Loop
// ============================================

// ============================================
// URL PARAMETER CHECK (Verification/Reset)
// ============================================
(async function checkUrlParams() {
  const urlParams = new URLSearchParams(window.location.search);
  const verifyToken = urlParams.get('verify');
  const resetToken = urlParams.get('reset');
  
  // Email Verification
  if (verifyToken) {
    console.log('🔐 Verification token found...');
    try {
      const response = await fetch(`http://localhost:5000/api/auth/verify/${verifyToken}`);
      const data = await response.json();
      
      if (response.ok && data.success) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.history.replaceState({}, document.title, window.location.pathname);
        alert('✅ E-Mail bestätigt! Du kannst dich jetzt einloggen.');
        setTimeout(() => openModal('loginModal'), 1000);
      } else {
        alert('❌ Verifizierung fehlgeschlagen: ' + (data.error || 'Unbekannter Fehler'));
      }
    } catch (error) {
      alert('❌ Verbindungsfehler');
    }
    return;
  }
  
  // Password Reset
  if (resetToken) {
    window.resetPasswordToken = resetToken;
    document.addEventListener('DOMContentLoaded', () => openModal('resetPasswordModal'));
    return;
  }
  
  // ============================================
  // KEIN AUTO-REDIRECT MEHR!
  // User muss sich manuell einloggen
  // ============================================
  console.log('✅ SYNORA Auth v4.0 ready - No auto-redirect');
})();

// ============================================
// MODAL FUNCTIONS
// ============================================
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
  }
}

function switchModal(fromModal, toModal) {
  closeModal(fromModal);
  setTimeout(() => openModal(toModal), 100);
}

window.addEventListener('click', (e) => {
  if (e.target.classList.contains('modal')) {
    e.target.style.display = 'none';
    document.body.style.overflow = 'auto';
  }
});

window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal').forEach(modal => {
      modal.style.display = 'none';
    });
    document.body.style.overflow = 'auto';
  }
});

// ============================================
// REGISTRATION
// ============================================
async function handleRegister(event) {
  event.preventDefault();
  
  const firstname = document.getElementById('regFirstname')?.value || document.getElementById('registerFirstname')?.value;
  const lastname = document.getElementById('regLastname')?.value || document.getElementById('registerLastname')?.value;
  const email = document.getElementById('regEmail')?.value || document.getElementById('registerEmail')?.value;
  const password = document.getElementById('regPassword')?.value || document.getElementById('registerPassword')?.value;
  const birthdate = document.getElementById('regBirthdate')?.value || document.getElementById('registerBirthdate')?.value;
  const terms = document.getElementById('regTerms')?.checked || document.getElementById('registerTerms')?.checked;
  
  if (!firstname || !lastname || !email || !password) {
    showNotification('Bitte fülle alle Felder aus', 'error');
    return;
  }
  
  if (!terms) {
    showNotification('Bitte akzeptiere die Nutzungsbedingungen', 'error');
    return;
  }
  
  const submitBtn = event.target.querySelector('button[type="submit"]');
  if (submitBtn) {
    submitBtn.textContent = 'Wird erstellt...';
    submitBtn.disabled = true;
  }
  
  try {
    const response = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ firstname, lastname, email, password, birthdate, terms })
    });
    
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Registrierung fehlgeschlagen');
    
    showNotification('Registrierung erfolgreich! Prüfe deine E-Mails.', 'success');
    closeModal('registerModal');
    
    setTimeout(() => {
      openModal('loginModal');
      const loginEmail = document.getElementById('loginEmail');
      if (loginEmail) loginEmail.value = email;
    }, 500);
    
  } catch (error) {
    showNotification(error.message, 'error');
  } finally {
    if (submitBtn) {
      submitBtn.textContent = 'Registrieren';
      submitBtn.disabled = false;
    }
  }
}

// ============================================
// LOGIN
// ============================================
async function handleLogin(event) {
  event.preventDefault();
  
  const email = document.getElementById('loginEmail')?.value;
  const password = document.getElementById('loginPassword')?.value;
  
  if (!email || !password) {
    showNotification('Bitte E-Mail und Passwort eingeben', 'error');
    return;
  }
  
  const submitBtn = event.target.querySelector('button[type="submit"]');
  if (submitBtn) {
    submitBtn.textContent = 'Anmelden...';
    submitBtn.disabled = true;
  }
  
  try {
    const response = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Login fehlgeschlagen');
    
    // SPEICHERN FÜR REACT
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify({
      name: data.user?.name || data.user?.firstname || email.split('@')[0],
      email: data.user?.email || email,
      id: data.user?.id || data.user?._id
    }));
    
    console.log('✅ Login OK - Token gespeichert');
    showNotification('Login erfolgreich!', 'success');
    
    // DIREKT ZUM CHAT - OHNE DELAY
    window.location.replace('http://localhost:3000');
    
  } catch (error) {
    showNotification(error.message, 'error');
  } finally {
    if (submitBtn) {
      submitBtn.textContent = 'Anmelden';
      submitBtn.disabled = false;
    }
  }
}

// ============================================
// FORGOT PASSWORD
// ============================================
async function handleForgotPassword(event) {
  event.preventDefault();
  
  const email = document.getElementById('forgotEmail')?.value;
  if (!email) {
    showNotification('Bitte E-Mail eingeben', 'error');
    return;
  }
  
  try {
    await fetch('http://localhost:5000/api/auth/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    
    showNotification('Reset-E-Mail gesendet!', 'success');
    closeModal('forgotModal');
  } catch (error) {
    showNotification('Fehler beim Senden', 'error');
  }
}

// ============================================
// NOTIFICATION
// ============================================
function showNotification(message, type = 'info') {
  const existing = document.querySelector('.synora-notification');
  if (existing) existing.remove();
  
  const colors = { success: '#10b981', error: '#ef4444', info: '#3b82f6' };
  const notification = document.createElement('div');
  notification.className = 'synora-notification';
  notification.innerHTML = `<span>${message}</span><button onclick="this.parentElement.remove()">&times;</button>`;
  notification.style.cssText = `position:fixed;top:100px;right:20px;padding:15px 20px;border-radius:8px;background:${colors[type]};color:white;font-weight:500;z-index:10000;display:flex;align-items:center;gap:15px;box-shadow:0 4px 20px rgba(0,0,0,0.3);`;
  
  document.body.appendChild(notification);
  setTimeout(() => notification.remove(), 5000);
}

// ============================================
// INIT
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  document.querySelector('#registerModal form')?.addEventListener('submit', handleRegister);
  document.querySelector('#loginModal form')?.addEventListener('submit', handleLogin);
  document.querySelector('#forgotModal form')?.addEventListener('submit', handleForgotPassword);
  
  document.querySelectorAll('.get-started-btn, .try-synora-btn, [data-action="register"]').forEach(btn => {
    btn.addEventListener('click', (e) => { e.preventDefault(); openModal('registerModal'); });
  });
  
  document.querySelectorAll('.login-btn, [data-action="login"]').forEach(btn => {
    btn.addEventListener('click', (e) => { e.preventDefault(); openModal('loginModal'); });
  });
});

window.openModal = openModal;
window.closeModal = closeModal;
window.switchModal = switchModal;
window.handleRegister = handleRegister;
window.handleLogin = handleLogin;
window.handleForgotPassword = handleForgotPassword;
window.showNotification = showNotification;

console.log('✅ SYNORA Auth v4.0 loaded');