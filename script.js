/* ═══════════════════════════════════════════════════════════════
   CRAVE – THE URBAN CAFÉ – MAIN JAVASCRIPT FILE
   ═══════════════════════════════════════════════════════════════ */

// Initialize on DOM Load
document.addEventListener('DOMContentLoaded', function() {
  initNavigation();
  initMobileMenu();
  initNavScroll();
  initScrollAnimations();
  initGallery();
  initCookieConsent();
});

/* ────────────────────────────────────────────────────────────
   NAVIGATION & PAGE ROUTING
   ──────────────────────────────────────────────────────────── */

function initNavigation() {
  const navLinks = document.querySelectorAll('.nav-links a');
  
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      updateActiveNavLink(this);
      const page = this.getAttribute('href');
      navigateToPage(page);
    });
  });

  // Handle Contact Us button
  const contactBtn = document.querySelector('.nav-contact');
  if (contactBtn) {
    contactBtn.addEventListener('click', function(e) {
      e.preventDefault();
      const phone = '0777757283';
      window.location.href = `tel:${phone}`;
    });
  }
}

function updateActiveNavLink(activeLink) {
  const navLinks = document.querySelectorAll('.nav-links a');
  navLinks.forEach(link => link.classList.remove('active'));
  activeLink.classList.add('active');
}

function navigateToPage(page) {
  // For demo, show page is loading (in production, use AJAX or router)
  window.location.href = page;
}

/* ────────────────────────────────────────────────────────────
   NAVBAR SCROLL SHRINK
   ──────────────────────────────────────────────────────────── */

function initNavScroll() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;
  window.addEventListener('scroll', function() {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });
}

/* ────────────────────────────────────────────────────────────
   MOBILE MENU & HAMBURGER
   ──────────────────────────────────────────────────────────── */

function initMobileMenu() {
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileLinks = document.querySelectorAll('.mobile-nav-links a');

  if (!hamburger) return;

  // Toggle menu on hamburger click
  hamburger.addEventListener('click', function(e) {
    e.stopPropagation();
    hamburger.classList.toggle('active');
    mobileMenu.classList.toggle('active');
  });

  // Close menu when a link is clicked
  mobileLinks.forEach(link => {
    link.addEventListener('click', function() {
      hamburger.classList.remove('active');
      mobileMenu.classList.remove('active');
    });
  });

  // Close menu when clicking outside
  document.addEventListener('click', function(e) {
    if (!e.target.closest('.navbar')) {
      hamburger.classList.remove('active');
      mobileMenu.classList.remove('active');
    }
  });

  // Close menu on resize to desktop view
  window.addEventListener('resize', function() {
    if (window.innerWidth > 768) {
      hamburger.classList.remove('active');
      mobileMenu.classList.remove('active');
    }
  });
}

/* ────────────────────────────────────────────────────────────
   SCROLL ANIMATIONS
   ──────────────────────────────────────────────────────────── */

function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, { threshold: 0.1 });

  // Observe elements for scroll animations
  const animatedElements = document.querySelectorAll(
    '.special-card, .review-card, .gallery-item, .value-card, .space-card'
  );

  animatedElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });
}

/* ────────────────────────────────────────────────────────────
   GALLERY GRID + LIGHTBOX
   ──────────────────────────────────────────────────────────── */

function initGallery() {
  const tiles = document.querySelectorAll('.gallery-item');
  tiles.forEach(tile => {
    tile.addEventListener('click', function() {
      const img = this.querySelector('img');
      if (img) openImageModal(img.src);
    });
  });
}

/* ────────────────────────────────────────────────────────────
   COOKIE CONSENT
   ──────────────────────────────────────────────────────────── */

function initCookieConsent() {
  const banner = document.getElementById('cookieBanner');
  if (!banner) return;
  // Already accepted? Stay hidden.
  if (localStorage.getItem('craveCookieConsent') === 'accepted') return;
  // Slide it in gently after a short delay so it doesn't jump on load.
  setTimeout(() => banner.classList.add('show'), 1400);
}

function acceptCookies() {
  const banner = document.getElementById('cookieBanner');
  localStorage.setItem('craveCookieConsent', 'accepted');
  if (!banner) return;
  banner.classList.remove('show');
  banner.classList.add('hiding');
  setTimeout(() => { banner.style.display = 'none'; }, 500);
}

// Toggle hidden gallery tiles (See More / See Less)
function toggleGallery(btn) {
  const grid = document.getElementById('galleryGrid');
  if (!grid) return;
  const expanded = grid.classList.toggle('expanded');
  btn.classList.toggle('open', expanded);
  btn.querySelector('.more-text').textContent = expanded ? 'See Less' : 'See More';
}

function openImageModal(src) {
  // Create modal
  const modal = document.createElement('div');
  modal.className = 'image-modal';
  modal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0,0,0,0.95);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    cursor: pointer;
    animation: fadeIn 0.3s ease;
  `;

  const img = document.createElement('img');
  img.src = src;
  img.style.cssText = `
    max-width: 90%;
    max-height: 90%;
    border-radius: 8px;
    animation: zoomIn 0.4s ease;
  `;

  modal.appendChild(img);
  document.body.appendChild(modal);

  // Close modal on click
  modal.addEventListener('click', function() {
    this.style.animation = 'fadeOut 0.3s ease';
    setTimeout(() => this.remove(), 300);
  });

  // Close on ESC key
  const escHandler = (e) => {
    if (e.key === 'Escape' && document.querySelector('.image-modal')) {
      document.querySelector('.image-modal').remove();
      document.removeEventListener('keydown', escHandler);
    }
  };
  document.addEventListener('keydown', escHandler);
}

/* Add animations to CSS */
if (!document.getElementById('carousel-animations')) {
  const style = document.createElement('style');
  style.id = 'carousel-animations';
  style.textContent = `
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes fadeOut {
      from { opacity: 1; }
      to { opacity: 0; }
    }
    @keyframes zoomIn {
      from { transform: scale(0.9); opacity: 0; }
      to { transform: scale(1); opacity: 1; }
    }
  `;
  document.head.appendChild(style);
}

/* ────────────────────────────────────────────────────────────
   FORM HANDLING
   ──────────────────────────────────────────────────────────── */

function submitForm(e) {
  e.preventDefault();
  const successMsg = document.getElementById('successMsg');
  if (successMsg) {
    successMsg.style.display = 'block';
    setTimeout(() => {
      successMsg.style.display = 'none';
      e.target.reset();
    }, 6000);
  }
}

/* ────────────────────────────────────────────────────────────
   MENU TAB SWITCHING
   ──────────────────────────────────────────────────────────── */

function switchMenu(tab, categoryId) {
  document.querySelectorAll('.menu-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.menu-category').forEach(c => c.classList.remove('active'));
  tab.classList.add('active');
  
  const category = document.getElementById('menu-' + categoryId);
  if (category) {
    category.classList.add('active');
  }
}

/* ────────────────────────────────────────────────────────────
   UTILITIES
   ──────────────────────────────────────────────────────────── */

// Smooth scroll to section
function scrollToSection(sectionId) {
  const section = document.getElementById(sectionId);
  if (section) {
    section.scrollIntoView({ behavior: 'smooth' });
  }
}

// Get current page from URL
function getCurrentPage() {
  return window.location.pathname.split('/').pop() || 'index.html';
}

// Phone number formatting
function formatPhoneNumber(input) {
  const cleaned = input.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`;
  }
  return input;
}

// Email validation
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

// Log analytics event (ready for integration with Google Analytics)
function logEvent(eventName, eventData = {}) {
  console.log(`Event: ${eventName}`, eventData);
  // TODO: Add Google Analytics integration
  // gtag('event', eventName, eventData);
}
