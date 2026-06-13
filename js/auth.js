/* -------------------------------------------------------------
   AUTHENTICATION PAGES JAVASCRIPT - WAVE & ZEN RETREATS
   ------------------------------------------------------------- */

document.addEventListener('DOMContentLoaded', () => {
  initAuthTheme();
  initAuthDirection();
  initAuthFormValidation();
  initAuthAnimations();
});

function initAuthAnimations() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const visual = document.querySelector('.auth-visual');
  const card = document.querySelector('.auth-card');
  const brand = document.querySelector('.auth-brand');

  if (visual) {
    visual.setAttribute('data-aos', 'fade-right');
    visual.setAttribute('data-aos-duration', '1500');
  }

  if (card) {
    card.setAttribute('data-aos', 'fade-left');
    card.setAttribute('data-aos-duration', '1500');
    card.setAttribute('data-aos-delay', '100');
  }

  if (brand) {
    brand.setAttribute('data-aos', 'fade-up');
    brand.setAttribute('data-aos-duration', '1300');
  }

  if (!document.querySelector('link[href*="aos.css"]')) {
    const aosCss = document.createElement('link');
    aosCss.rel = 'stylesheet';
    aosCss.href = 'https://cdn.jsdelivr.net/npm/aos@2.3.4/dist/aos.css';
    document.head.appendChild(aosCss);
  }

  const startAos = () => {
    if (typeof AOS === 'undefined') return;
    AOS.init({
      duration: 1400,
      easing: 'ease-out-cubic',
      once: false,
      mirror: true,
      offset: 40,
      anchorPlacement: 'top-bottom'
    });
  };

  if (!document.querySelector('script[src*="/aos"]')) {
    const aosJs = document.createElement('script');
    aosJs.src = 'https://cdn.jsdelivr.net/npm/aos@2.3.4/dist/aos.js';
    aosJs.defer = true;
    aosJs.onload = startAos;
    document.body.appendChild(aosJs);
  } else {
    startAos();
  }
}

/* Initialize themes on Auth views */
function initAuthTheme() {
  const savedTheme = localStorage.getItem('theme') || 'light';
  setAuthTheme(savedTheme);
  
  // Theme switcher in auth pages
  const themeToggle = document.querySelector('.theme-toggle-btn');
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
      setAuthTheme(nextTheme);
    });
  }
}

function setAuthTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);

  const themeToggle = document.querySelector('.theme-toggle-btn');
  const icon = themeToggle?.querySelector('.theme-toggle-icon');
  const switchingToLight = theme === 'dark';

  if (!themeToggle || !icon) return;

  themeToggle.setAttribute('aria-label', switchingToLight ? 'Switch to light theme' : 'Switch to dark theme');
  themeToggle.setAttribute('title', switchingToLight ? 'Light theme' : 'Dark theme');
  themeToggle.setAttribute('aria-pressed', String(theme === 'dark'));
  icon.setAttribute('viewBox', '0 0 24 24');
  icon.innerHTML = switchingToLight
    ? `
      <circle cx="12" cy="8" r="3.25"></circle>
      <path d="M12 2.25v1.25M5.1 5.1l.9.9M18.9 5.1l-.9.9M3.25 10.5H4.5M19.5 10.5h1.25"></path>
      <path d="M3 15.25c2.1-1.65 4.2-1.65 6.3 0s4.2 1.65 6.3 0 4.2-1.65 5.4-.7"></path>
      <path d="M3 19c2.1-1.65 4.2-1.65 6.3 0s4.2 1.65 6.3 0 4.2-1.65 5.4-.7"></path>
    `
    : `
      <path d="M15.8 3.35a7.2 7.2 0 1 0 4.35 10.95 6.35 6.35 0 0 1-4.35-10.95Z"></path>
      <path d="m18.8 3.1.35.85.85.35-.85.35-.35.85-.35-.85-.85-.35.85-.35.35-.85Z"></path>
      <path d="M3 17.15c2.1-1.65 4.2-1.65 6.3 0s4.2 1.65 6.3 0 4.2-1.65 5.4-.7"></path>
      <path d="M4.5 20.35c1.7-1 3.4-1 5.1 0s3.4 1 5.1 0 3.4-1 4.8-.35"></path>
    `;
}

/* Initialize layouts on Auth views */
function initAuthDirection() {
  const savedDir = localStorage.getItem('dir') || 'ltr';
  document.documentElement.setAttribute('dir', savedDir);
  
  // Direction switcher in auth pages
  const dirToggle = document.querySelector('.dir-toggle-btn');
  if (dirToggle) {
    dirToggle.addEventListener('click', () => {
      const currentDir = document.documentElement.getAttribute('dir') || 'ltr';
      const nextDir = currentDir === 'ltr' ? 'rtl' : 'ltr';
      document.documentElement.setAttribute('dir', nextDir);
      localStorage.setItem('dir', nextDir);
      
      const label = dirToggle.querySelector('.dir-toggle-label');
      if (label) label.textContent = nextDir === 'ltr' ? 'RTL' : 'LTR';
    });
    
    const label = dirToggle.querySelector('.dir-toggle-label');
    if (label) label.textContent = savedDir === 'ltr' ? 'RTL' : 'LTR';
  }
}

/* Form inputs checks & Feedback */
function initAuthFormValidation() {
  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');
  const forgotPasswordForm = document.getElementById('forgot-password-form');
  
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const email = document.getElementById('login-email').value.trim();
      const password = document.getElementById('login-password').value;
      
      if (!email || !password) {
        showAuthAlert(loginForm, 'Please fill in both email and password fields.', 'error');
        return;
      }

      if (!isValidEmail(email)) {
        showAuthAlert(loginForm, 'Please enter a valid email address.', 'error');
        return;
      }
      
      showAuthAlert(loginForm, 'Signed in successfully. Redirecting...', 'success');
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 1500);
    });
  }
  
  if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const firstName = document.getElementById('register-firstname').value.trim();
      const lastName = document.getElementById('register-lastname').value.trim();
      const email = document.getElementById('register-email').value.trim();
      const password = document.getElementById('register-password').value;
      const confirmPassword = document.getElementById('register-confirm-password').value;
      const terms = document.getElementById('register-terms').checked;
      
      if (!firstName || !lastName || !email || !password || !confirmPassword) {
        showAuthAlert(registerForm, 'All fields are mandatory.', 'error');
        return;
      }

      if (!isValidEmail(email)) {
        showAuthAlert(registerForm, 'Please enter a valid email address.', 'error');
        return;
      }

      if (password.length < 8) {
        showAuthAlert(registerForm, 'Password must contain at least 8 characters.', 'error');
        return;
      }

      if (password !== confirmPassword) {
        showAuthAlert(registerForm, 'Passwords do not match.', 'error');
        return;
      }
      
      if (!terms) {
        showAuthAlert(registerForm, 'You must agree to the Terms & Conditions.', 'error');
        return;
      }
      
      showAuthAlert(registerForm, 'Registration successful! Preparing your account...', 'success');
      setTimeout(() => {
        window.location.href = 'login.html';
      }, 1500);
    });
  }

  if (forgotPasswordForm) {
    forgotPasswordForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const email = document.getElementById('forgot-email').value.trim();
      if (!isValidEmail(email)) {
        showAuthAlert(forgotPasswordForm, 'Please enter a valid email address.', 'error');
        return;
      }

      showAuthAlert(forgotPasswordForm, 'Reset instructions have been sent to your email.', 'success');
    });
  }

  // Social buttons simulator
  const socialButtons = document.querySelectorAll('.auth-social-btn');
  socialButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const provider = btn.textContent.trim();
      const parentForm = btn.closest('form') || document.querySelector('.auth-form') || document.body;
      showAuthAlert(parentForm, `Connecting with ${provider}...`, 'success');
      setTimeout(() => {
        showAuthAlert(parentForm, `Successfully authenticated via ${provider}! Redirecting...`, 'success');
        setTimeout(() => {
          window.location.href = 'index.html';
        }, 1200);
      }, 1000);
    });
  });
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showAuthAlert(form, message, type) {
  const existingAlert = document.querySelector('.auth-alert');
  if (existingAlert) {
    existingAlert.remove();
  }
  
  const alert = document.createElement('div');
  alert.className = `auth-alert alert-${type}`;
  alert.setAttribute('role', type === 'success' ? 'status' : 'alert');
  alert.textContent = message;
  document.body.appendChild(alert);

  window.setTimeout(() => alert.remove(), 4000);
}
