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
  // Build the list of gallery images so we can navigate / swipe between them
  const galleryImgs = Array.from(document.querySelectorAll('.gallery-tile img'));
  const sources = galleryImgs.map(i => i.getAttribute('src'));
  let index = sources.indexOf(src);
  if (index === -1) { sources.length = 0; sources.push(src); index = 0; }

  const modal = document.createElement('div');
  modal.className = 'image-modal';
  modal.innerHTML = `
    <button class="im-close" aria-label="Close">&times;</button>
    <button class="im-nav im-prev" aria-label="Previous">&#10094;</button>
    <img class="im-img" src="${sources[index]}" alt="">
    <button class="im-nav im-next" aria-label="Next">&#10095;</button>
    <div class="im-counter"></div>
  `;
  document.body.appendChild(modal);
  document.body.style.overflow = 'hidden';

  const imgEl = modal.querySelector('.im-img');
  const counter = modal.querySelector('.im-counter');
  const multiple = sources.length > 1;
  modal.querySelector('.im-prev').style.display = multiple ? '' : 'none';
  modal.querySelector('.im-next').style.display = multiple ? '' : 'none';

  function render() {
    imgEl.style.animation = 'none';
    void imgEl.offsetWidth;            // restart animation
    imgEl.style.animation = 'zoomIn 0.35s ease';
    imgEl.src = sources[index];
    counter.textContent = multiple ? `${index + 1} / ${sources.length}` : '';
  }
  function go(step) {
    index = (index + step + sources.length) % sources.length;
    render();
  }
  function close() {
    modal.style.animation = 'fadeOut 0.3s ease';
    document.body.style.overflow = '';
    document.removeEventListener('keydown', onKey);
    setTimeout(() => modal.remove(), 280);
  }

  render();

  // Controls
  modal.querySelector('.im-close').addEventListener('click', e => { e.stopPropagation(); close(); });
  modal.querySelector('.im-prev').addEventListener('click', e => { e.stopPropagation(); go(-1); });
  modal.querySelector('.im-next').addEventListener('click', e => { e.stopPropagation(); go(1); });
  imgEl.addEventListener('click', e => e.stopPropagation());
  // Click backdrop closes
  modal.addEventListener('click', close);

  // Keyboard
  function onKey(e) {
    if (e.key === 'Escape') close();
    else if (e.key === 'ArrowLeft' && multiple) go(-1);
    else if (e.key === 'ArrowRight' && multiple) go(1);
  }
  document.addEventListener('keydown', onKey);

  // Swipe (touch)
  let startX = 0, startY = 0, swiping = false;
  imgEl.addEventListener('touchstart', e => {
    startX = e.touches[0].clientX; startY = e.touches[0].clientY; swiping = true;
  }, { passive: true });
  imgEl.addEventListener('touchend', e => {
    if (!swiping) return;
    swiping = false;
    const dx = e.changedTouches[0].clientX - startX;
    const dy = e.changedTouches[0].clientY - startY;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) && multiple) {
      go(dx < 0 ? 1 : -1);
    }
  }, { passive: true });
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
