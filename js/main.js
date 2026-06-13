/* -------------------------------------------------------------
   CORE JAVASCRIPT - WAVE & ZEN RETREATS
   ------------------------------------------------------------- */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Core Modules
  initTheme();
  initDirection();
  initNavigation();
  initTideDashboard();
  initBookingForm();
  initContactForm();
  initGalleryFilter();
  initLightbox();
  initFaqAccordion();
  initBookingSelector();
  initStatCounters();
  initEqualHeightTestimonials();
  initScrollReveal();
  initDestinationPanels();
  styleIcons();
  initBackToTop();
  initFooterIcons();
});

/* ==========================================
   1. THEME CONTROLLER (Dark / Light Theme)
   ========================================== */
function initTheme() {
  const themeToggleBtns = document.querySelectorAll('.theme-toggle-btn');
  
  // Check localStorage or preferred color scheme
  const savedTheme = localStorage.getItem('theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initialTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
  
  setTheme(initialTheme);
  
  themeToggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
      setTheme(nextTheme);
    });
  });
}

function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
  
  document.querySelectorAll('.theme-toggle-btn').forEach(btn => {
    const switchingToLight = theme === 'dark';
    const icon = btn.querySelector('.theme-toggle-icon');

    btn.setAttribute('aria-label', switchingToLight ? 'Switch to light theme' : 'Switch to dark theme');
    btn.setAttribute('title', switchingToLight ? 'Light theme' : 'Dark theme');
    btn.setAttribute('aria-pressed', String(theme === 'dark'));

    if (!icon) return;

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
  });
}

/* ==========================================
   2. DIRECTION CONTROLLER (LTR / RTL Switcher)
   ========================================== */
function initDirection() {
  const dirToggleBtns = document.querySelectorAll('.dir-toggle-btn');
  
  const savedDir = localStorage.getItem('dir') || 'ltr';
  setDirection(savedDir);
  
  dirToggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const currentDir = document.documentElement.getAttribute('dir') || 'ltr';
      const nextDir = currentDir === 'ltr' ? 'rtl' : 'ltr';
      setDirection(nextDir);
    });
  });
}

function setDirection(dir) {
  document.documentElement.setAttribute('dir', dir);
  localStorage.setItem('dir', dir);
  
  // Update LTR / RTL button labels
  const dirLabels = document.querySelectorAll('.dir-toggle-label');
  dirLabels.forEach(label => {
    label.textContent = dir === 'ltr' ? 'RTL' : 'LTR';
  });
}

/* ==========================================
   DESTINATION PANELS (Touch / Keyboard)
   ========================================== */
function initDestinationPanels() {
  const panels = Array.from(document.querySelectorAll('.destination-panel'));
  if (!panels.length) return;

  const mobileLayout = window.matchMedia('(max-width: 768px)');

  const setActivePanel = (selectedPanel) => {
    panels.forEach(panel => {
      const isActive = panel === selectedPanel;
      panel.classList.toggle('is-active', isActive);
      panel.setAttribute('aria-expanded', String(isActive));
    });
  };

  panels.forEach((panel, index) => {
    panel.setAttribute('tabindex', '0');
    panel.setAttribute('role', 'button');
    panel.setAttribute('aria-expanded', 'false');

    panel.addEventListener('click', event => {
      if (!mobileLayout.matches || event.target.closest('a')) return;
      setActivePanel(panel);
    });

    panel.addEventListener('keydown', event => {
      if (!mobileLayout.matches || !['Enter', ' '].includes(event.key)) return;
      event.preventDefault();
      setActivePanel(panel);
    });

    if (index === 0 && mobileLayout.matches) {
      setActivePanel(panel);
    }
  });

  mobileLayout.addEventListener('change', event => {
    if (event.matches) {
      setActivePanel(panels.find(panel => panel.classList.contains('is-active')) || panels[0]);
    } else {
      panels.forEach(panel => {
        panel.classList.remove('is-active');
        panel.setAttribute('aria-expanded', 'false');
      });
    }
  });
}

/* ==========================================
   3. NAVIGATION (Sticky, Mobile Drawer, Links)
   ========================================== */
function initNavigation() {
  const header = document.querySelector('.header');
  const hamburger = document.getElementById('hamburger-menu');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link, .dropdown-item');
  const dropdown = document.querySelector('.nav-dropdown');
  const dropdownToggle = document.querySelector('.dropdown-toggle');

  const setDropdownOpen = (open) => {
    if (!dropdown || !dropdownToggle) return;

    const dropdownList = dropdown.querySelector('.dropdown-menu-list');
    dropdown.classList.toggle('active', open);
    dropdownToggle.setAttribute('aria-expanded', String(open));

    if (dropdownList && window.innerWidth <= 1100) {
      dropdownList.style.maxHeight = open ? dropdownList.scrollHeight + 'px' : '0';
    } else if (dropdownList) {
      dropdownList.style.removeProperty('max-height');
    }
  };
  
  // Highlight current page active link dynamically
  const highlightCurrentLink = () => {
    const path = window.location.pathname;
    let currentPage = path.substring(path.lastIndexOf('/') + 1);
    if (!currentPage || currentPage === '/') {
      currentPage = 'index.html';
    }

    // Reset all active classes first to ensure no conflicting states
    navLinks.forEach(link => {
      link.classList.remove('active');
    });

    let matched = false;

    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href && href !== '#') {
        if (href === currentPage || currentPage.endsWith(href)) {
          link.classList.add('active');
          matched = true;
          // If it is a dropdown-item, make the parent dropdown-toggle active too
          if (link.classList.contains('dropdown-item')) {
            const parentToggle = link.closest('.nav-dropdown')?.querySelector('.dropdown-toggle');
            if (parentToggle) {
              parentToggle.classList.add('active');
            }
          }
        }
      }
    });

    // Fallback: if we are on the root or index.html and nothing matched yet
    if (!matched && (currentPage === 'index.html' || currentPage === '')) {
      const homeLink = document.getElementById('nav-home1');
      if (homeLink) homeLink.classList.add('active');
      const homeToggle = document.getElementById('nav-home');
      if (homeToggle) homeToggle.classList.add('active');
    }
  };

  highlightCurrentLink();
  
  // Sticky scroll class
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    
    // Highlight links on scroll
    spyScroll();
  });
  
  // Home dropdown is click-controlled on every screen size.
  if (dropdownToggle && dropdown) {
    dropdownToggle.setAttribute('aria-expanded', 'false');

    dropdownToggle.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      setDropdownOpen(!dropdown.classList.contains('active'));
    });
  }
  
  // Mobile drawer toggle
  if (hamburger && navMenu) {
    hamburger.addEventListener('click', (e) => {
      e.stopPropagation();
      hamburger.classList.toggle('active');
      navMenu.classList.toggle('active');
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!navMenu.contains(e.target) && !hamburger.contains(e.target)) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
      }
      
      // Close dropdown when clicking outside
      if (dropdown && !dropdown.contains(e.target)) {
        setDropdownOpen(false);
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && dropdown.classList.contains('active')) {
        setDropdownOpen(false);
        dropdownToggle.focus();
      }
    });
    
    // Close mobile menu on links click
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        if (link.classList.contains('dropdown-toggle')) {
          return;
        }
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        setDropdownOpen(false);
      });
    });

    window.addEventListener('resize', () => {
      setDropdownOpen(false);
    });
  }
}

function spyScroll() {
  const navLinks = document.querySelectorAll('.nav-link');
  // If nav links don't start with '#', we are on separate pages, so do not run scroll highlights!
  const hasHashLinks = Array.from(navLinks).some(link => {
    const href = link.getAttribute('href');
    return href && href.startsWith('#') && href.length > 1;
  });
  if (!hasHashLinks) return;

  const sections = document.querySelectorAll('section');
  const scrollPosition = window.scrollY + 100; // Offset for header height
  
  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;
    const sectionId = section.getAttribute('id');
    
    if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${sectionId}`) {
          link.classList.add('active');
        }
      });
    }
  });
}

/* ==========================================
   4. TIDE CONDITIONS CONTROLLER (Dashboard)
   ========================================== */
function initTideDashboard() {
  // We mock a realistic tide data dashboard and calculate lesson suitability index.
  const hours = ['06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00'];
  const baseTides = [1.2, 2.1, 2.8, 1.9, 0.9, 0.4, 1.1, 1.8]; // Wave swell heights in meters
  
  const tideChart = document.getElementById('tide-chart');
  if (!tideChart) return;
  
  tideChart.innerHTML = ''; // clear initial content
  
  // Render tide nodes dynamically
  hours.forEach((hour, index) => {
    const node = document.createElement('div');
    node.className = 'tide-hour-node';
    
    // Calculate relative height for graphic rendering (max height is 2.8m, let's map to max 100px)
    const heightPercent = (baseTides[index] / 3.0) * 100;
    
    node.innerHTML = `
      <div class="tide-bar" style="height: ${heightPercent}px;"></div>
      <span class="tide-hour-text">${hour}</span>
    `;
    tideChart.appendChild(node);
  });
  
  // Set random but realistic wind & temp details
  const swellValue = document.getElementById('swell-height');
  const windValue = document.getElementById('wind-dir');
  const waterTempValue = document.getElementById('water-temp');
  const scoreValue = document.getElementById('suitability-score');
  const labelValue = document.getElementById('suitability-label');
  
  if (swellValue && windValue && waterTempValue && scoreValue && labelValue) {
    swellValue.textContent = '2.4 m';
    windValue.textContent = '12 kts ESE';
    waterTempValue.textContent = '21°C / 70°F';
    scoreValue.textContent = '92';
    labelValue.textContent = 'Excellent for All Levels';
    labelValue.style.color = '#f59e0b';
  }
}

/* ==========================================
   5. BOOKING FORM HANDLER (Group Retreats)
   ========================================== */
function initBookingForm() {
  const form = document.getElementById('booking-form');
  if (!form) return;
  
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Validate inputs
    const packageType = document.getElementById('booking-package').value;
    const guestCount = document.getElementById('booking-guests').value;
    const date = document.getElementById('booking-date').value;
    const message = document.getElementById('booking-message').value;
    
    if (!packageType || !guestCount || !date) {
      showFormAlert(form, 'Please complete all required fields.', 'error');
      return;
    }
    
    // Perform mockup booking success action
    showFormAlert(
      form, 
      `Thank you! Your enquiry for the "${packageType}" with ${guestCount} guests on ${date} has been sent successfully. We will confirm availability within 24 hours.`, 
      'success'
    );
    form.reset();
  });
}

/* ==========================================
   6. CONTACT FORM HANDLER (General Enquiry)
   ========================================== */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;
  
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = document.getElementById('contact-name').value;
    const email = document.getElementById('contact-email').value;
    const phone = document.getElementById('contact-phone').value;
    const activity = document.getElementById('contact-activity').value;
    const message = document.getElementById('contact-message').value;
    
    if (!name || !email || !activity || !message) {
      showFormAlert(form, 'Please fill out all mandatory inputs.', 'error');
      return;
    }
    
    // Validate Email address format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showFormAlert(form, 'Please insert a valid email address.', 'error');
      return;
    }
    
    showFormAlert(
      form,
      `Hello ${name}! Thank you for getting in touch. Our team has received your enquiry regarding ${activity} and will contact you via email at ${email} soon.`,
      'success'
    );
    form.reset();
  });
}

function showFormAlert(form, message, type) {
  // Remove pre-existing alerts
  const existingAlert = form.querySelector('.form-alert');
  if (existingAlert) {
    existingAlert.remove();
  }
  
  const alert = document.createElement('div');
  alert.className = `form-alert alert-${type}`;
  alert.style.padding = '1rem';
  alert.style.marginTop = '1.5rem';
  alert.style.borderRadius = '8px';
  alert.style.fontWeight = '600';
  alert.style.fontSize = '0.95rem';
  
  if (type === 'success') {
    alert.style.backgroundColor = 'rgba(16, 185, 129, 0.15)';
    alert.style.color = '#10b981';
    alert.style.border = '1px solid #10b981';
  } else {
    alert.style.backgroundColor = 'rgba(239, 68, 68, 0.15)';
    alert.style.color = '#ef4444';
    alert.style.border = '1px solid #ef4444';
  }
  
  alert.textContent = message;
  form.appendChild(alert);
  
  // Auto dismiss alert after 8 seconds
  setTimeout(() => {
    alert.style.opacity = '0';
    alert.style.transition = 'opacity 0.5s ease';
    setTimeout(() => alert.remove(), 500);
  }, 8000);
}

/* ==========================================
   7. GALLERY PORTFOLIO FILTER
   ========================================== */
function initGalleryFilter() {
  const filterGroups = document.querySelectorAll('.gallery-filter-tabs, .gallery-filter');

  filterGroups.forEach(group => {
    const filterBtns = group.querySelectorAll('.filter-btn');
    const section = group.closest('section') || document;
    const isPackageFilter = group.classList.contains('package-filter-tabs');
    const filterItems = isPackageFilter
      ? section.querySelectorAll('.package-card[data-category]')
      : section.querySelectorAll('.gallery-item[data-category]:not(.package-card)');

    if (filterBtns.length === 0 || filterItems.length === 0) return;

    filterBtns.forEach(btn => {
      btn.addEventListener('click', event => {
        event.preventDefault();
        const filterValue = btn.getAttribute('data-filter') || 'all';

        filterBtns.forEach(filterBtn => {
          const isActive = filterBtn === btn;
          filterBtn.classList.toggle('active', isActive);
          filterBtn.setAttribute('aria-pressed', String(isActive));
        });

        filterItems.forEach(item => {
          const categories = (item.getAttribute('data-category') || '').split(/\s+/);
          const shouldShow = filterValue === 'all' || categories.includes(filterValue);

          item.classList.toggle('is-filtered-out', !shouldShow);
          item.hidden = !shouldShow;

          if (shouldShow && typeof item.animate === 'function') {
            item.animate(
              [
                { opacity: 0, transform: 'translateY(8px)' },
                { opacity: 1, transform: 'translateY(0)' }
              ],
              { duration: 260, easing: 'ease-out' }
            );
          }
        });

        if (typeof AOS !== 'undefined') {
          window.setTimeout(() => AOS.refreshHard(), 280);
        }
      });
    });
  });
}

/* ==========================================
   8. LIGHTBOX MODAL IMAGES
   ========================================== */
function initLightbox() {
  const galleryItems = document.querySelectorAll('.gallery-item:not(.package-card)');
  
  // Create lightbox markup programmatically if it doesn't exist
  if (galleryItems.length === 0) return;
  
  let lightbox = document.getElementById('lightbox-modal');
  if (!lightbox) {
    lightbox = document.createElement('div');
    lightbox.id = 'lightbox-modal';
    lightbox.className = 'lightbox';
    lightbox.innerHTML = `
      <div class="lightbox-close" aria-label="Close lightbox">&times;</div>
      <div class="lightbox-prev" aria-label="Previous image">&#10094;</div>
      <div class="lightbox-next" aria-label="Next image">&#10095;</div>
      <div class="lightbox-content">
        <img src="" alt="Client Session">
      </div>
    `;
    document.body.appendChild(lightbox);
  }
  
  const lightboxImg = lightbox.querySelector('img');
  const closeBtn = lightbox.querySelector('.lightbox-close');
  const prevBtn = lightbox.querySelector('.lightbox-prev');
  const nextBtn = lightbox.querySelector('.lightbox-next');
  
  let visibleItems = [];
  let currentIndex = 0;
  
  const updateLightbox = (index) => {
    if (visibleItems.length === 0) return;
    if (index < 0) {
      currentIndex = visibleItems.length - 1;
    } else if (index >= visibleItems.length) {
      currentIndex = 0;
    } else {
      currentIndex = index;
    }
    const targetItem = visibleItems[currentIndex];
    const imgSrc = targetItem.querySelector('img').getAttribute('src');
    const imgAlt = targetItem.querySelector('img').getAttribute('alt');
    lightboxImg.setAttribute('src', imgSrc);
    lightboxImg.setAttribute('alt', imgAlt || 'Client Session');
  };
  
  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      // Re-evaluate visible items to support active filters
      const itemScope = item.closest('.gallery-masonry-container, .gallery-grid') || document;
      visibleItems = Array.from(itemScope.querySelectorAll('.gallery-item')).filter(el => {
        return !el.hidden;
      });
      
      currentIndex = visibleItems.indexOf(item);
      if (currentIndex === -1) {
        visibleItems = [item];
        currentIndex = 0;
      }
      
      updateLightbox(currentIndex);
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });
  
  const closeLightbox = () => {
    lightbox.classList.remove('active');
    document.body.style.overflow = 'auto';
  };
  
  closeBtn.addEventListener('click', closeLightbox);
  
  prevBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    updateLightbox(currentIndex - 1);
  });
  
  nextBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    updateLightbox(currentIndex + 1);
  });
  
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox || e.target.classList.contains('lightbox-content')) {
      closeLightbox();
    }
  });
  
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') {
      closeLightbox();
    } else if (e.key === 'ArrowLeft') {
      updateLightbox(currentIndex - 1);
    } else if (e.key === 'ArrowRight') {
      updateLightbox(currentIndex + 1);
    }
  });
}

/* ==========================================
   9. FAQ ACCORDION
   ========================================== */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  if (faqItems.length === 0) return;

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    if (!question) return;

    question.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close all first
      faqItems.forEach(i => {
        i.classList.remove('active');
        const ans = i.querySelector('.faq-answer');
        if (ans) ans.style.maxHeight = null;
      });

      // Open clicked (unless it was already open)
      if (!isActive) {
        item.classList.add('active');
        const ans = item.querySelector('.faq-answer');
        if (ans) {
          ans.style.maxHeight = ans.scrollHeight + 40 + 'px';
        }
      }
    });
  });
}

/* ==========================================
   10. BOOKING CARD SELECTOR
   ========================================== */
function initBookingSelector() {
  const selectorCards = document.querySelectorAll('.booking-selector-card');
  if (selectorCards.length === 0) return;

  const packageSelect = document.getElementById('booking-package');

  selectorCards.forEach(card => {
    card.addEventListener('click', () => {
      // Toggle selected
      selectorCards.forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');

      // Auto-fill the booking form package select if present
      if (packageSelect) {
        const packageName = card.getAttribute('data-package') || '';
        const options = Array.from(packageSelect.options);
        const match = options.find(o => o.value === packageName);
        if (match) packageSelect.value = packageName;
      }
    });
  });
}

/* ==========================================
   11. ANIMATED STAT COUNTERS
   ========================================== */
function initStatCounters() {
  const statNumbers = document.querySelectorAll('.stat-number[data-target]');
  if (statNumbers.length === 0) return;

  const countUp = (el, target, duration = 1800) => {
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        start = target;
        clearInterval(timer);
      }
      el.textContent = Math.floor(start).toLocaleString();
    }, 16);
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-target'), 10);
        countUp(el, target);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.1 });

  statNumbers.forEach(el => observer.observe(el));
}

/* ==========================================
   12. EQUAL-HEIGHT HOME TESTIMONIAL CONTENT
   ========================================== */
function initEqualHeightTestimonials() {
  const section = document.getElementById('home-testimonials');
  if (!section) return;

  const cards = Array.from(section.querySelectorAll('.testimonial-card'));
  if (cards.length < 2) return;

  const equalize = () => {
    const groups = [
      cards.map(card => card.querySelector('.testimonial-quote')),
      cards.map(card => card.querySelector('.testimonial-location')),
      cards.map(card => card.querySelector('.testimonial-author'))
    ];

    groups.forEach(elements => {
      const validElements = elements.filter(Boolean);
      validElements.forEach(element => {
        element.style.height = 'auto';
        element.style.minHeight = '0';
      });

      if (window.innerWidth <= 480) return;

      const tallest = Math.ceil(
        Math.max(...validElements.map(element => element.getBoundingClientRect().height))
      );

      validElements.forEach(element => {
        element.style.height = `${tallest}px`;
        element.style.minHeight = `${tallest}px`;
      });
    });
  };

  let resizeTimer;
  const scheduleEqualize = () => {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(equalize, 120);
  };

  equalize();
  window.addEventListener('resize', scheduleEqualize);
  window.addEventListener('orientationchange', scheduleEqualize);

  if (document.fonts?.ready) {
    document.fonts.ready.then(equalize);
  }
}

/* ==========================================
   13. SCROLL REVEAL ANIMATIONS (Fade-up)
   ========================================== */
function initScrollReveal() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion) {
    document.documentElement.classList.add('reduce-motion');
    return;
  }

  const setAnimation = (element, animation = 'fade-up', delay = 0, duration = 1400) => {
    if (!element) return;
    element.setAttribute('data-aos', animation);
    element.setAttribute('data-aos-duration', String(duration));
    if (delay > 0) {
      element.setAttribute('data-aos-delay', String(delay));
    }
  };

  document.querySelectorAll('.section-header, .section-heading').forEach(element => {
    setAnimation(element, 'fade-up', 0, 1800);
  });

  document.querySelectorAll('.page-hero-content, #gallery-hero .mosaic-main, .hero-split-content').forEach(element => {
    setAnimation(element, 'fade-up', 0, 1500);
  });

  document.querySelectorAll('.hero-float-badge').forEach(element => {
    setAnimation(element, 'fade-up', 200, 1500);
  });

  document.querySelectorAll(
    'form, .form-card, .cta-banner-content, .about-cta, .avail-package, ' +
    '.promo-strip-content, .milestone-item, .faq-item, .tide-dashboard, ' +
    '.map-container, .contact-info-block'
  ).forEach(element => {
    setAnimation(element, 'fade-up', 0, 1400);
  });

  const gridSelectors = [
    '.grid-container',
    '.packages-grid',
    '.packages-card-grid',
    '.instructors-grid',
    '.gallery-grid',
    '.gallery-masonry-container',
    '.testimonial-grid',
    '.values-grid',
    '.grid-3-col',
    '.grid-2-col',
    '.quote-wall-inner',
    '.highlight-card-wrap',
    '.polaroid-strip',
    '.safety-zones-grid',
    '.surf-windows-row',
    '.contact-method-cards',
    '.about-values-grid',
    '.booking-selectors',
    '.availability-cards',
    '.included-strip',
    '.steps-row',
    '.itinerary-list'
  ];

  gridSelectors.forEach(gridSelector => {
    document.querySelectorAll(gridSelector).forEach(grid => {
      // Skip handled grids to avoid double animation overrides
      if (
        grid.classList.contains('services-grid') || 
        grid.classList.contains('grid-3-col') || 
        grid.classList.contains('grid-2-col') || 
        grid.classList.contains('values-grid')
      ) return;
      
      Array.from(grid.children).forEach((child, index) => {
        if (child.closest('.header')) return;
        const delay = Math.min((index + 1) * 100, 400);
        setAnimation(child, 'fade-up', delay, 1600);
      });
    });
  });

  // 3-Column Grids (Services and Experience Packages)
  document.querySelectorAll('.services-grid, .grid-3-col').forEach(grid => {
    const children = Array.from(grid.children);
    const isExperiences = grid.closest('#home2-experiences') !== null;
    children.forEach((child, index) => {
      if (child.closest('.header')) return;
      // Staggered slide from left, bottom, and right
      const animationType = index % 3 === 0 ? 'fade-right' : (index % 3 === 2 ? 'fade-left' : 'fade-up');
      const delay = (index % 3) * 150;
      const duration = isExperiences ? 2200 : 1600;
      setAnimation(child, animationType, delay, duration);
    });
  });

  // 2-Column Grids (Hero split, Co-founders cards, split pages content)
  document.querySelectorAll('.grid-2-col').forEach(grid => {
    const children = Array.from(grid.children);
    children.forEach((child, index) => {
      if (child.closest('.header')) return;
      const animationType = index % 2 === 0 ? 'fade-right' : 'fade-left';
      const delay = (index % 2) * 150;
      setAnimation(child, animationType, delay, 1600);
    });
  });

  // 4-Column Grids (Core Values)
  document.querySelectorAll('.values-grid').forEach(grid => {
    const children = Array.from(grid.children);
    children.forEach((child, index) => {
      if (child.closest('.header')) return;
      const delay = (index % 4) * 150;
      setAnimation(child, 'fade-up', delay, 1600);
    });
  });

  // Retreat Locations Accordion (Home 1 and Home 2)
  document.querySelectorAll('.destinations-accordion').forEach(accordion => {
    const children = Array.from(accordion.children);
    children.forEach((panel, index) => {
      const delay = index * 150;
      setAnimation(panel, 'fade-up', delay, 1800);
    });
  });

  document.querySelectorAll('.methodology-row').forEach(row => {
    const image = row.querySelector('.methodology-img');
    const content = row.querySelector('.methodology-content');
    setAnimation(image, 'fade-right', 0, 1500);
    setAnimation(content, 'fade-left', 100, 1500);
  });

  document.querySelectorAll('.about-split-home').forEach(split => {
    const children = Array.from(split.children);
    if (children.length >= 2) {
      setAnimation(children[0], 'fade-right', 0, 1500);
      setAnimation(children[1], 'fade-left', 100, 1500);
    }
  });

  document.querySelectorAll('.story-section').forEach(story => {
    const children = Array.from(story.children);
    if (children.length >= 2) {
      setAnimation(children[0], 'fade-right', 0, 1800);
      setAnimation(children[1], 'fade-left', 200, 1800);
    }
  });

  document.querySelectorAll('.hero-split').forEach(split => {
    const content = split.querySelector('.hero-split-content');
    const image = split.querySelector('.hero-split-image');
    setAnimation(image, 'fade-right', 0, 1500);
    setAnimation(content, 'fade-left', 100, 1500);
  });

  document.querySelectorAll('.instructor-spotlight, .featured-story-grid').forEach(split => {
    const image = split.querySelector('.spotlight-image-wrap, .featured-story-image');
    const content = split.querySelector('.spotlight-content, .featured-story-content');
    setAnimation(image, 'fade-right', 0, 1500);
    setAnimation(content, 'fade-left', 100, 1500);
  });

  document.querySelectorAll('.highlight-reel').forEach(reel => {
    const video = reel.querySelector('.video-placeholder');
    const quote = reel.querySelector('.highlight-quote-block');
    setAnimation(video, 'fade-right', 0, 1500);
    setAnimation(quote, 'fade-left', 100, 1500);
  });

  if (!document.querySelector('link[href*="aos.css"]')) {
    const aosCss = document.createElement('link');
    aosCss.rel = 'stylesheet';
    aosCss.href = 'https://cdn.jsdelivr.net/npm/aos@2.3.4/dist/aos.css';
    document.head.appendChild(aosCss);
  }

  const startAos = () => {
    if (typeof AOS === 'undefined') return;
    const isMobile = window.innerWidth <= 768;
    AOS.init({
      duration: 1600,
      easing: 'ease-out-cubic',
      once: false,
      mirror: true,
      offset: isMobile ? 80 : 150, // More pronounced scrolling trigger
      anchorPlacement: 'top-bottom',
      disableMutationObserver: false
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

/* ==========================================
   13. DYNAMIC MODERN ICON STYLER (SVG Replacer)
   ========================================== */
function styleIcons() {
  const SVGS = {
    wave: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12c.6-.4 1.2-.6 2-.6 1.5 0 2.5 1 4 1s2.5-1 4-1 2.5 1 4 1 2.5-1 4-1 .8.2 1.2.4"/><path d="M2 16c.6-.4 1.2-.6 2-.6 1.5 0 2.5 1 4 1s2.5-1 4-1 2.5 1 4 1 2.5-1 4-1 .8.2 1.2.4"/><path d="M2 8c.6-.4 1.2-.6 2-.6 1.5 0 2.5 1 4 1s2.5-1 4-1 2.5 1 4 1 2.5-1 4-1 .8.2 1.2.4"/></svg>`,
    wind: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 10h14c1.7 0 3-1.3 3-3s-1.3-3-3-3a3 3 0 0 0-3 3"/><path d="M2 14h18c1.7 0 3 1.3 3 3s-1.3 3-3 3a3 3 0 0 1-3-3"/><path d="M2 18h10c1.7 0 3-1.3 3-3s-1.3-3-3-3"/></svg>`,
    sun: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>`,
    star: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>`,
    pin: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>`,
    time: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
    plane: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-2-2h-3L9 3H4v3l4 3H3L1 8v4l2 1h5l3 5h5a2 2 0 0 0 2-2z"/></svg>`,
    car: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 1 13v3c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/></svg>`,
    check: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`,
    surfboard: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2C6.5 6 4 10 4 15c0 3.9 3.1 7 7 7s7-3.1 7-7c0-5-2.5-9-8-13z"/><path d="M12 2v20" stroke-width="1.25"/></svg>`,
    lotus: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10" stroke-width="1"/><path d="M12 7c-1 2-2 3-2 5s1 2 2 2 2 0 2-2-1-3-2-5z"/><path d="M8 12c0-1.5 1-2.5 2.5-2.5M16 12c0-1.5-1-2.5-2.5-2.5"/></svg>`,
    palm: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 22c0-4 1-7 3-10M12 22V10c0-2-1.5-4-3-4s-3 2-3 4c0 3 2.5 5.5 5.5 6"/></svg>`,
    leaf: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 22C12 22 22 12 22 2c-10 0-20 10-20 20z"/><path d="M9 15l6-6"/></svg>`
  };

  // 1. Process Certifications badge icons
  document.querySelectorAll('.cert-badge-icon').forEach(el => {
    const emoji = el.textContent.trim();
    if (emoji === '🏄') {
      el.innerHTML = `<span class="surfboard-badge">${SVGS.surfboard}</span>`;
    } else if (emoji === '🧘') {
      el.innerHTML = `<span class="organic-badge">${SVGS.lotus}</span>`;
    } else if (emoji === '🌊') {
      el.innerHTML = `<span class="beach-icon-badge">${SVGS.wave}</span>`;
    } else if (emoji === '🌿') {
      el.innerHTML = `<span class="organic-badge">${SVGS.leaf}</span>`;
    }
  });

  // 2. Process Current Surf Metrics
  document.querySelectorAll('.tide-metric-box > div').forEach(el => {
    const emoji = el.textContent.trim();
    if (emoji === '🌊') {
      el.className = 'beach-icon-badge';
      el.innerHTML = SVGS.wave;
      el.style.fontSize = ''; 
    } else if (emoji === '💨') {
      el.className = 'beach-icon-badge';
      el.innerHTML = SVGS.wind;
      el.style.fontSize = '';
      el.style.color = '#f59e0b';
    } else if (emoji === '🌡️') {
      el.className = 'beach-icon-badge';
      el.innerHTML = SVGS.sun;
      el.style.fontSize = '';
      el.style.color = '#10b981';
    } else if (emoji === '⭐') {
      el.className = 'beach-icon-badge';
      el.innerHTML = SVGS.star;
      el.style.fontSize = '';
      el.style.color = '#fff';
    }
  });

  // 3. Process Safety Zone Icons
  document.querySelectorAll('.safety-zone-icon').forEach(el => {
    const emoji = el.textContent.trim();
    let color = 'currentColor';
    if (emoji === '🟢' || emoji.includes('🟢')) color = '#10b981';
    else if (emoji === '🔵' || emoji.includes('🔵')) color = '#3b82f6';
    else if (emoji === '🟡' || emoji.includes('🟡')) color = '#f59e0b';
    else if (emoji === '🔴' || emoji.includes('🔴')) color = '#ef4444';
    
    el.innerHTML = `<span class="tide-circle-badge" style="color: ${color};">${SVGS.wave}</span>`;
  });

  // 4. Process Selector Checks
  document.querySelectorAll('.selector-check').forEach(el => {
    if (el.textContent.trim() === '✓') {
      el.innerHTML = SVGS.check;
    }
  });

  // 5. Contact Highlights (Time, Plane, Car, Map Pin)
  document.querySelectorAll('.map-pin-card > div, .surf-windows-row > div > div').forEach(el => {
    const emoji = el.textContent.trim();
    if (emoji === '📍') {
      el.className = 'beach-icon-badge';
      el.style.color = 'var(--coral-color)';
      el.innerHTML = SVGS.pin;
      el.style.fontSize = '';
    } else if (emoji === '🕐') {
      el.className = 'beach-icon-badge';
      el.innerHTML = SVGS.time;
      el.style.fontSize = '';
    } else if (emoji === '✈️') {
      el.className = 'beach-icon-badge';
      el.innerHTML = SVGS.plane;
      el.style.fontSize = '';
    } else if (emoji === '🚗') {
      el.className = 'beach-icon-badge';
      el.innerHTML = SVGS.car;
      el.style.fontSize = '';
    }
  });

  // 6. Generic Text Emojis in Headings and Content
  const headingElements = document.querySelectorAll('h1, h2, h3, h4, h5, .section-tag, .quote-instructor, .avail-package');
  headingElements.forEach(el => {
    let html = el.innerHTML;
    if (html.includes('🏄')) {
      html = html.replace(/🏄/g, `<span class="inline-beach-icon" style="color:var(--accent-color);display:inline-flex;margin-inline-end:0.35rem;vertical-align:middle;width:18px;height:18px;">${SVGS.surfboard}</span>`);
    }
    if (html.includes('🧘')) {
      html = html.replace(/🧘/g, `<span class="inline-beach-icon" style="color:var(--coral-color);display:inline-flex;margin-inline-end:0.35rem;vertical-align:middle;width:18px;height:18px;">${SVGS.lotus}</span>`);
    }
    if (html.includes('🌴')) {
      html = html.replace(/🌴/g, `<span class="inline-beach-icon" style="color:#10b981;display:inline-flex;margin-inline-end:0.35rem;vertical-align:middle;width:18px;height:18px;">${SVGS.palm}</span>`);
    }
    if (html.includes('🌊')) {
      html = html.replace(/🌊/g, `<span class="inline-beach-icon" style="color:var(--accent-color);display:inline-flex;margin-inline-end:0.35rem;vertical-align:middle;width:18px;height:18px;">${SVGS.wave}</span>`);
    }
    if (html.includes('⭐')) {
      html = html.replace(/⭐/g, `<span class="inline-beach-icon" style="color:#f59e0b;display:inline-flex;margin-inline-end:0.35rem;vertical-align:middle;width:18px;height:18px;">${SVGS.star}</span>`);
    }
    if (html.includes('📍')) {
      html = html.replace(/📍/g, `<span class="inline-beach-icon" style="color:var(--coral-color);display:inline-flex;margin-inline-end:0.35rem;vertical-align:middle;width:18px;height:18px;">${SVGS.pin}</span>`);
    }
    if (html.includes('🟢')) {
      html = html.replace(/🟢/g, `<span class="inline-beach-icon" style="color:#10b981;display:inline-flex;margin-inline-end:0.35rem;vertical-align:middle;width:18px;height:18px;">${SVGS.wave}</span>`);
    }
    el.innerHTML = html;
  });
}

/* ==========================================
   14. BACK-TO-TOP BUTTON CONTROLLER
   ========================================== */
function initBackToTop() {
  if (document.getElementById('back-to-top')) return;
  
  const btn = document.createElement('button');
  btn.id = 'back-to-top';
  btn.className = 'back-to-top-btn';
  btn.setAttribute('aria-label', 'Back to top');
  btn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 15 12 9 6 15"></polyline></svg>`;
  
  document.body.appendChild(btn);
  
  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  });
  
  btn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/* ==========================================
   15. DYNAMIC FOOTER ICONS INJECTOR
   ========================================== */
function initFooterIcons() {
  const SVGS = {
    info: `<svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24" style="margin-inline-end:0.55rem;vertical-align:middle;flex-shrink:0;color:var(--accent-color);"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>`,
    calendar: `<svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24" style="margin-inline-end:0.55rem;vertical-align:middle;flex-shrink:0;color:var(--accent-color);"><path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11z"/></svg>`,
    mail: `<svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24" style="margin-inline-end:0.55rem;vertical-align:middle;flex-shrink:0;color:var(--accent-color);"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>`,
    phone: `<svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24" style="margin-inline-end:0.55rem;vertical-align:middle;flex-shrink:0;color:var(--accent-color);"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>`
  };

  const contactLink = document.getElementById('footer-contact-link');
  if (contactLink && !contactLink.querySelector('svg')) {
    contactLink.innerHTML = SVGS.info + contactLink.innerHTML;
    contactLink.style.display = 'inline-flex';
    contactLink.style.alignItems = 'center';
  }

  const bookingLink = document.getElementById('footer-booking-link');
  if (bookingLink && !bookingLink.querySelector('svg')) {
    bookingLink.innerHTML = SVGS.calendar + bookingLink.innerHTML;
    bookingLink.style.display = 'inline-flex';
    bookingLink.style.alignItems = 'center';
  }

  const emailLink = document.getElementById('footer-email-link');
  if (emailLink && !emailLink.querySelector('svg')) {
    emailLink.innerHTML = SVGS.mail + emailLink.innerHTML;
    emailLink.style.display = 'inline-flex';
    emailLink.style.alignItems = 'center';
  }

  const phoneLink = document.getElementById('footer-phone-link');
  if (phoneLink && !phoneLink.querySelector('svg')) {
    phoneLink.innerHTML = SVGS.phone + phoneLink.innerHTML;
    phoneLink.style.display = 'inline-flex';
    phoneLink.style.alignItems = 'center';
  }
}
