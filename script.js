/* ═══════════════════════════════════════════════════════════════
   CRAVE – THE URBAN CAFÉ – MAIN JAVASCRIPT FILE
   ═══════════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', function () {
  initMobileMenu();
  initNavScroll();
  initScrollAnimations();
  initCookieConsent();
});

/* ────────────────────────────────────────────────────────────
   NAVBAR SCROLL SHRINK
   ──────────────────────────────────────────────────────────── */

function initNavScroll() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;
  window.addEventListener('scroll', function () {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });
}

/* ────────────────────────────────────────────────────────────
   MOBILE MENU & HAMBURGER
   ──────────────────────────────────────────────────────────── */

function initMobileMenu() {
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  if (!hamburger || !mobileMenu) return;

  const close = () => {
    hamburger.classList.remove('active');
    mobileMenu.classList.remove('active');
  };

  hamburger.addEventListener('click', function (e) {
    e.stopPropagation();
    hamburger.classList.toggle('active');
    mobileMenu.classList.toggle('active');
  });

  // Close when a menu link is tapped
  mobileMenu.querySelectorAll('.mobile-nav-links a').forEach(link => {
    link.addEventListener('click', close);
  });

  // Close when clicking outside the navbar
  document.addEventListener('click', function (e) {
    if (!e.target.closest('.navbar')) close();
  });

  // Close on resize to desktop
  window.addEventListener('resize', function () {
    if (window.innerWidth > 768) close();
  });
}

/* ────────────────────────────────────────────────────────────
   SCROLL REVEAL ANIMATIONS
   ──────────────────────────────────────────────────────────── */

function initScrollAnimations() {
  const targets = document.querySelectorAll(
    '.card-item, .review-card, .gallery-tile, .value-card, .story-block'
  );
  if (!targets.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  targets.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });
}

/* ────────────────────────────────────────────────────────────
   GALLERY – SEE MORE TOGGLE
   ──────────────────────────────────────────────────────────── */

function toggleGallery(btn) {
  const grid = document.getElementById('galleryGrid');
  if (!grid) return;
  const expanded = grid.classList.toggle('expanded');
  btn.classList.toggle('open', expanded);
  const label = btn.querySelector('.more-text');
  if (label) label.textContent = expanded ? 'See Less' : 'See More';
}

/* ────────────────────────────────────────────────────────────
   GALLERY LIGHTBOX (close / prev / next / swipe / keyboard)
   ──────────────────────────────────────────────────────────── */

function openImageModal(src) {
  // Collect all gallery images so we can navigate / swipe between them
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
  function onKey(e) {
    if (e.key === 'Escape') close();
    else if (e.key === 'ArrowLeft' && multiple) go(-1);
    else if (e.key === 'ArrowRight' && multiple) go(1);
  }

  render();

  modal.querySelector('.im-close').addEventListener('click', e => { e.stopPropagation(); close(); });
  modal.querySelector('.im-prev').addEventListener('click', e => { e.stopPropagation(); go(-1); });
  modal.querySelector('.im-next').addEventListener('click', e => { e.stopPropagation(); go(1); });
  imgEl.addEventListener('click', e => e.stopPropagation());
  modal.addEventListener('click', close);   // backdrop closes
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

// Inject lightbox animation keyframes once
if (!document.getElementById('lightbox-animations')) {
  const style = document.createElement('style');
  style.id = 'lightbox-animations';
  style.textContent = `
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes fadeOut { from { opacity: 1; } to { opacity: 0; } }
    @keyframes zoomIn { from { transform: scale(0.92); opacity: 0; } to { transform: scale(1); opacity: 1; } }
  `;
  document.head.appendChild(style);
}

/* ────────────────────────────────────────────────────────────
   COOKIE CONSENT
   ──────────────────────────────────────────────────────────── */

function initCookieConsent() {
  const banner = document.getElementById('cookieBanner');
  if (!banner) return;
  if (localStorage.getItem('craveCookieConsent') === 'accepted') return;
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
