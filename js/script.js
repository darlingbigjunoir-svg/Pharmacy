
'use strict';

/* ============================================================
   UTILITY HELPERS
   ============================================================ */

const $ = (selector, context = document) => context.querySelector(selector);
const $$ = (selector, context = document) => [...context.querySelectorAll(selector)];

function debounce(fn, delay = 300) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

function showToast(message, type = 'success') {
  const existing = $('.pharmanect-toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = `pharmanect-toast pharmanect-toast--${type}`;
  toast.setAttribute('role', 'alert');
  toast.setAttribute('aria-live', 'polite');
  toast.innerHTML = `
    <span class="pharmanect-toast__icon">${type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ'}</span>
    <span class="pharmanect-toast__message">${message}</span>
  `;

  Object.assign(toast.style, {
    position: 'fixed',
    bottom: '80px',
    right: '30px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    background: type === 'success' ? '#1a56db' : type === 'error' ? '#e53e3e' : '#2d3748',
    color: '#fff',
    padding: '12px 20px',
    borderRadius: '8px',
    fontSize: '14px',
    fontFamily: 'Poppins, sans-serif',
    boxShadow: '0 4px 16px rgba(0,0,0,0.18)',
    zIndex: '9999',
    opacity: '0',
    transform: 'translateY(12px)',
    transition: 'opacity 0.3s ease, transform 0.3s ease',
    maxWidth: '320px',
  });

  document.body.appendChild(toast);

  requestAnimationFrame(() => {
    toast.style.opacity = '1';
    toast.style.transform = 'translateY(0)';
  });

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(12px)';
    toast.addEventListener('transitionend', () => toast.remove(), { once: true });
  }, 3500);
}


/* ============================================================
   CART — shared state (session only)
   ============================================================ */

const Cart = (() => {
  let items = [];

  function getItems() { return [...items]; }
  function getCount() { return items.reduce((sum, i) => sum + i.qty, 0); }

  function add(name, price) {
    const existing = items.find(i => i.name === name);
    if (existing) {
      existing.qty += 1;
    } else {
      items.push({ name, price, qty: 1 });
    }
    _updateBadge();
    showToast(`${name} added to cart`);
  }

  function _updateBadge() {
    $$('.cart-badge').forEach(el => {
      el.textContent = getCount();
      el.style.display = getCount() > 0 ? 'inline-flex' : 'none';
    });
  }

  return { getItems, getCount, add };
})();


/* ============================================================
   NAVBAR — scroll shadow + mobile toggle
   ============================================================ */

function initNavbar() {
  const header = $('header');
  if (!header) return;

  // Scroll shadow
  const onScroll = () => {
    header.style.boxShadow = window.scrollY > 10
      ? '0 2px 12px rgba(0,0,0,0.08)'
      : 'none';
  };
  window.addEventListener('scroll', onScroll, { passive: true });

  // Mobile hamburger (inject if viewport is narrow and button absent)
  const navbar = $('.navbar');
  const navLinks = $('.nav-links');
  if (!navbar || !navLinks) return;

  if (!$('.nav-hamburger')) {
    const btn = document.createElement('button');
    btn.className = 'nav-hamburger';
    btn.setAttribute('aria-label', 'Toggle navigation');
    btn.setAttribute('aria-expanded', 'false');
    btn.innerHTML = '<span></span><span></span><span></span>';

    Object.assign(btn.style, {
      display: 'none',
      flexDirection: 'column',
      gap: '5px',
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      padding: '4px',
    });

    $$('span', btn).forEach(s => Object.assign(s.style, {
      display: 'block', width: '22px', height: '2px', background: '#1a56db', borderRadius: '2px',
    }));

    navbar.appendChild(btn);

    const mq = window.matchMedia('(max-width: 768px)');
    const handleMQ = (e) => {
      btn.style.display = e.matches ? 'flex' : 'none';
      if (!e.matches) {
        navLinks.style.display = '';
        btn.setAttribute('aria-expanded', 'false');
      }
    };
    mq.addEventListener('change', handleMQ);
    handleMQ(mq);

    btn.addEventListener('click', () => {
      const isOpen = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!isOpen));
      Object.assign(navLinks.style, {
        display: isOpen ? 'none' : 'flex',
        flexDirection: 'column',
        position: 'absolute',
        top: '100%',
        left: '0',
        right: '0',
        background: '#fff',
        padding: '16px 24px',
        borderBottom: '1px solid #eee',
        zIndex: '100',
      });
    });
  }
}


/* ============================================================
   SCROLL-TO-TOP BUTTON
   ============================================================ */

function initScrollToTop() {
  const btn = $('.top-arrow');
  if (!btn) return;

  const toggle = () => {
    btn.style.opacity = window.scrollY > 300 ? '1' : '0';
    btn.style.pointerEvents = window.scrollY > 300 ? 'auto' : 'none';
  };

  btn.style.transition = 'opacity 0.3s ease';
  btn.style.opacity = '0';
  btn.style.pointerEvents = 'none';

  window.addEventListener('scroll', toggle, { passive: true });
}


/* ============================================================
   DOWNLOAD APP BUTTON — (all pages)
   ============================================================ */

function initDownloadBtn() {
  $$('.btn-download').forEach(btn => {
    btn.addEventListener('click', () => {
      showToast('The Pharmanect app is coming soon!', 'info');
    });
  });
}


/* ============================================================
   HOME PAGE
   ============================================================ */

function initHomePage() {
  if (!$('.hero')) return;

  // Hero search
  const heroSearchBtn = $('.hero .search-bar button');
  const heroSearchInput = $('.hero .search-bar input');

  if (heroSearchBtn && heroSearchInput) {
    const handleHeroSearch = () => {
      const query = heroSearchInput.value.trim();
      if (query) {
        window.location.href = `pharmacies.html?q=${encodeURIComponent(query)}`;
      } else {
        heroSearchInput.focus();
        heroSearchInput.style.borderColor = '#e53e3e';
        setTimeout(() => (heroSearchInput.style.borderColor = ''), 1500);
      }
    };

    heroSearchBtn.addEventListener('click', handleHeroSearch);
    heroSearchInput.addEventListener('keydown', e => {
      if (e.key === 'Enter') handleHeroSearch();
    });
  }

  // CTA banner — upload prescription
  const ctaBtn = $('.btn-cta');
  if (ctaBtn) {
    ctaBtn.addEventListener('click', () => {
      window.location.href = 'pharmacies.html';
    });
  }

  // Feature cards — subtle entrance animation on scroll
  _animateOnScroll('.card');
}


/* ============================================================
   ABOUT PAGE
   ============================================================ */

function initAboutPage() {
  if (!$('.about-section')) return;
  _animateOnScroll('.mvv-card');
  _animateOnScroll('.team-card');
}


/* ============================================================
   CONTACT PAGE
   ============================================================ */

function initContactPage() {
  const form = $('.contact-form-box');
  if (!form) return;

  const inputs = $$('.form-input', form);
  const textarea = $('.form-textarea', form);
  const sendBtn = $('.btn-send', form);

  // Inline validation helpers
  function validateEmail(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }
  function setError(el, msg) {
    el.style.borderColor = '#e53e3e';
    let err = el.nextElementSibling;
    if (!err || !err.classList.contains('field-error')) {
      err = document.createElement('p');
      err.className = 'field-error';
      Object.assign(err.style, { fontSize: '12px', color: '#e53e3e', marginTop: '-10px', marginBottom: '12px' });
      el.insertAdjacentElement('afterend', err);
    }
    err.textContent = msg;
  }
  function clearError(el) {
    el.style.borderColor = '';
    const err = el.nextElementSibling;
    if (err && err.classList.contains('field-error')) err.remove();
  }

  inputs.forEach(input => {
    input.addEventListener('input', () => clearError(input));
    input.addEventListener('blur', () => {
      if (!input.value.trim()) setError(input, 'This field is required.');
      else if (input.type === 'email' && !validateEmail(input.value.trim())) setError(input, 'Enter a valid email address.');
      else clearError(input);
    });
  });

  sendBtn.addEventListener('click', () => {
    let valid = true;

    inputs.forEach(input => {
      if (!input.value.trim()) {
        setError(input, 'This field is required.');
        valid = false;
      } else if (input.type === 'email' && !validateEmail(input.value.trim())) {
        setError(input, 'Enter a valid email address.');
        valid = false;
      } else {
        clearError(input);
      }
    });

    if (!textarea.value.trim()) {
      textarea.style.borderColor = '#e53e3e';
      valid = false;
    } else {
      textarea.style.borderColor = '';
    }

    if (!valid) {
      showToast('Please fill in all required fields.', 'error');
      return;
    }

    // Simulate submission
    sendBtn.disabled = true;
    sendBtn.textContent = 'Sending…';

    setTimeout(() => {
      sendBtn.disabled = false;
      sendBtn.textContent = 'Send Message';
      inputs.forEach(i => (i.value = ''));
      textarea.value = '';
      showToast('Message sent! We'll get back to you soon.');
    }, 1500);
  });
}


/* ============================================================
   PHARMACIES / UPLOAD PRESCRIPTION PAGE
   ============================================================ */

function initPharmaciesPage() {
  if (!$('.main-content')) return;

  // Character counter (already wired via inline oninput, but we add it cleanly here)
  const noteTextarea = $('#noteText');
  const charCount = $('#charCount');
  if (noteTextarea && charCount) {
    noteTextarea.removeAttribute('oninput'); // remove inline handler
    noteTextarea.addEventListener('input', () => {
      const len = noteTextarea.value.length;
      charCount.textContent = `${len}/300`;
      charCount.style.color = len >= 270 ? '#e53e3e' : '#aaa';
    });
  }

  // Pharmacy search
  const searchInput = $('.section-box .search-bar input');
  const searchBtn = $('.section-box .search-bar button');
  if (searchBtn && searchInput) {
    searchBtn.addEventListener('click', () => {
      const q = searchInput.value.trim();
      if (!q) {
        showToast('Please enter a pharmacy name or location.', 'error');
        searchInput.focus();
      } else {
        showToast(`Searching for "${q}"…`, 'info');
      }
    });
    searchInput.addEventListener('keydown', e => {
      if (e.key === 'Enter') searchBtn.click();
    });
  }

  // File upload area
  const uploadArea = $('.upload-area');
  const browseBtn = $('.btn-browse');
  if (uploadArea && browseBtn) {
    // Hidden file input
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.jpg,.jpeg,.png,.pdf';
    fileInput.multiple = true;
    fileInput.style.display = 'none';
    document.body.appendChild(fileInput);

    browseBtn.addEventListener('click', () => fileInput.click());

    fileInput.addEventListener('change', () => {
      _handleFileSelection(fileInput.files, uploadArea);
    });

    // Drag and drop
    ['dragover', 'dragenter'].forEach(evt => {
      uploadArea.addEventListener(evt, e => {
        e.preventDefault();
        uploadArea.style.borderColor = '#1a56db';
        uploadArea.style.background = '#eef3ff';
      });
    });

    ['dragleave', 'dragend'].forEach(evt => {
      uploadArea.addEventListener(evt, () => {
        uploadArea.style.borderColor = '#93b4f5';
        uploadArea.style.background = '#fafbff';
      });
    });

    uploadArea.addEventListener('drop', e => {
      e.preventDefault();
      uploadArea.style.borderColor = '#93b4f5';
      uploadArea.style.background = '#fafbff';
      _handleFileSelection(e.dataTransfer.files, uploadArea);
    });
  }

  // Submit
  const submitBtn = $('.btn-submit');
  if (submitBtn) {
    submitBtn.addEventListener('click', () => {
      const hasPharmacy = searchInput && searchInput.value.trim();
      const hasFiles = $$('.upload-file-tag', uploadArea).length > 0;

      if (!hasPharmacy) {
        showToast('Please select a pharmacy before submitting.', 'error');
        return;
      }
      if (!hasFiles) {
        showToast('Please upload at least one prescription.', 'error');
        return;
      }

      submitBtn.disabled = true;
      submitBtn.textContent = 'Submitting…';

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Submit Prescription';
        showToast('Prescription submitted! The pharmacy will review your order.');
        // Clear state
        if (noteTextarea) noteTextarea.value = '';
        if (charCount) charCount.textContent = '0/300';
        $$('.upload-file-tag', uploadArea).forEach(t => t.remove());
        const uploadTitle = $('.upload-title', uploadArea);
        if (uploadTitle) uploadTitle.textContent = 'Drop your prescription here';
      }, 1800);
    });
  }
}

function _handleFileSelection(files, uploadArea) {
  const MAX_SIZE_MB = 10;
  const allowed = ['image/jpeg', 'image/png', 'application/pdf'];
  const valid = [...files].filter(f => {
    if (!allowed.includes(f.type)) {
      showToast(`${f.name}: unsupported format.`, 'error');
      return false;
    }
    if (f.size > MAX_SIZE_MB * 1024 * 1024) {
      showToast(`${f.name} exceeds 10 MB limit.`, 'error');
      return false;
    }
    return true;
  });

  if (!valid.length) return;

  // Remove existing tags first to avoid duplication on re-upload
  $$('.upload-file-tag', uploadArea).forEach(t => t.remove());

  // Update heading
  const title = $('.upload-title', uploadArea);
  if (title) title.textContent = `${valid.length} file${valid.length > 1 ? 's' : ''} selected`;

  valid.forEach(file => {
    const tag = document.createElement('span');
    tag.className = 'upload-file-tag';
    Object.assign(tag.style, {
      display: 'inline-flex', alignItems: 'center', gap: '6px',
      background: '#e8efff', color: '#1a56db', borderRadius: '4px',
      padding: '4px 10px', fontSize: '12px', margin: '4px 2px',
    });
    tag.textContent = file.name;

    const remove = document.createElement('button');
    remove.textContent = '×';
    Object.assign(remove.style, {
      background: 'none', border: 'none', cursor: 'pointer',
      color: '#1a56db', fontSize: '15px', lineHeight: '1', padding: '0',
    });
    remove.setAttribute('aria-label', `Remove ${file.name}`);
    remove.addEventListener('click', () => tag.remove());
    tag.appendChild(remove);

    uploadArea.appendChild(tag);
  });

  showToast(`${valid.length} file${valid.length > 1 ? 's' : ''} ready to upload.`);
}


/* ============================================================
   PRODUCTS PAGE
   ============================================================ */

function initProductsPage() {
  if (!$('.products-grid')) return;

  // Add to cart
  $$('.btn-cart').forEach(btn => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.product-card');
      const name = $('.product-name', card)?.textContent?.trim() ?? 'Product';
      const priceText = $('.product-price', card)?.textContent?.trim() ?? '0';
      const price = parseFloat(priceText.replace(/[^0-9.]/g, '')) || 0;
      Cart.add(name, price);

      // Button feedback
      btn.textContent = 'Added ✓';
      btn.style.background = '#2d6a1f';
      setTimeout(() => {
        btn.textContent = 'Add to Cart';
        btn.style.background = '';
      }, 1500);
    });
  });

  // Category sidebar filter
  const catLinks = $$('.cat-link');
  const productCards = $$('.product-card');

  catLinks.forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      catLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');

      const selected = link.textContent.trim().toLowerCase();

      productCards.forEach(card => {
        const category = $('.product-category', card)?.textContent?.trim().toLowerCase() ?? '';
        const visible = selected === 'all categories' || category.includes(selected.replace(/[^a-z ]/g, ''));
        card.style.display = visible ? '' : 'none';
      });
    });
  });

  // Also sync dropdown categories with sidebar
  const catDropdown = $$('.dropdown')[0];
  if (catDropdown) {
    catDropdown.addEventListener('change', () => {
      const val = catDropdown.value.trim().toLowerCase();
      const matchingLink = catLinks.find(l => l.textContent.trim().toLowerCase() === val);
      if (matchingLink) matchingLink.click();
    });
  }

  // Sort dropdown
  const sortDropdown = $$('.dropdown')[1];
  if (sortDropdown) {
    sortDropdown.addEventListener('change', () => {
      const grid = $('.products-grid');
      if (!grid) return;
      const cards = $$('.product-card', grid);
      const val = sortDropdown.value;

      cards.sort((a, b) => {
        const priceA = parseFloat($('.product-price', a)?.textContent?.replace(/[^0-9.]/g, '') ?? 0);
        const priceB = parseFloat($('.product-price', b)?.textContent?.replace(/[^0-9.]/g, '') ?? 0);
        if (val.includes('Low to High')) return priceA - priceB;
        if (val.includes('High to Low')) return priceB - priceA;
        return 0;
      });

      cards.forEach(card => grid.appendChild(card));
    });
  }

  // Price slider
  const slider = $('.price-slider');
  const applyBtn = $('.btn-filter');
  if (slider && applyBtn) {
    const priceLabels = $$('.price-labels span');

    slider.addEventListener('input', () => {
      if (priceLabels[1]) priceLabels[1].textContent = `KSh ${Number(slider.value).toLocaleString()}+`;
    });

    applyBtn.addEventListener('click', () => {
      const max = Number(slider.value);
      productCards.forEach(card => {
        const price = parseFloat($('.product-price', card)?.textContent?.replace(/[^0-9.]/g, '') ?? 0);
        card.style.display = price <= max ? '' : 'none';
      });
      showToast(`Showing products up to KSh ${max.toLocaleString()}`);
    });
  }

  // Product search
  const searchInput = $('.filters-bar .search-bar input');
  const searchBtn = $('.filters-bar .search-bar button');

  const runSearch = debounce(() => {
    const q = searchInput.value.trim().toLowerCase();
    productCards.forEach(card => {
      const name = $('.product-name', card)?.textContent?.toLowerCase() ?? '';
      const cat = $('.product-category', card)?.textContent?.toLowerCase() ?? '';
      card.style.display = (!q || name.includes(q) || cat.includes(q)) ? '' : 'none';
    });
  }, 250);

  if (searchInput) searchInput.addEventListener('input', runSearch);
  if (searchBtn) searchBtn.addEventListener('click', runSearch);

  // Entrance animation
  _animateOnScroll('.product-card');
}


/* ============================================================
   SHARED — scroll-triggered entrance animation
   ============================================================ */

function _animateOnScroll(selector) {
  const elements = $$(selector);
  if (!elements.length) return;

  elements.forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = `opacity 0.45s ease ${i * 0.07}s, transform 0.45s ease ${i * 0.07}s`;
  });

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  elements.forEach(el => observer.observe(el));
}


/* ============================================================
   PARSE URL QUERY — pre-fill search from homepage
   ============================================================ */

function initQueryPrefill() {
  const params = new URLSearchParams(window.location.search);
  const q = params.get('q');
  if (!q) return;

  const inputs = $$('input[type="text"]');
  inputs.forEach(input => {
    if (input.placeholder && input.placeholder.toLowerCase().includes('search')) {
      input.value = decodeURIComponent(q);
    }
  });
}


/* ============================================================
   ACTIVE NAV LINK — auto-detect based on filename
   ============================================================ */

function initActiveNavLink() {
  const page = window.location.pathname.split('/').pop() || 'index.html';
  $$('.nav-links a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === page || (page === '' && href === 'index.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}


/* ============================================================
   BOOTSTRAP — run on DOMContentLoaded
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  initActiveNavLink();
  initNavbar();
  initScrollToTop();
  initDownloadBtn();
  initQueryPrefill();

  // Page-specific
  initHomePage();
  initAboutPage();
  initContactPage();
  initPharmaciesPage();
  initProductsPage();
});