'use strict';

document.addEventListener('DOMContentLoaded', function () {

  /* ============================================================
     HAMBURGER MENU
     ============================================================ */
  var hamburger = document.querySelector('.nav-hamburger');
  var navLinks = document.querySelector('.nav-links');

  if (hamburger && navLinks) {

    // Toggle menu open/close
    hamburger.addEventListener('click', function (e) {
      e.stopPropagation();
      var isOpen = navLinks.classList.contains('open');

      if (isOpen) {
        navLinks.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      } else {
        navLinks.classList.add('open');
        hamburger.classList.add('open');
        hamburger.setAttribute('aria-expanded', 'true');
      }
    });

    // Close when a nav link is tapped
    var links = navLinks.querySelectorAll('a');
    links.forEach(function (link) {
      link.addEventListener('click', function () {
        navLinks.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });

    // Close when tapping anywhere outside the navbar
    document.addEventListener('click', function (e) {
      var navbar = document.querySelector('.navbar');
      if (navbar && !navbar.contains(e.target)) {
        navLinks.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      }
    });

    // Close when tapping outside on touch devices
    document.addEventListener('touchstart', function (e) {
      var navbar = document.querySelector('.navbar');
      if (navbar && !navbar.contains(e.target)) {
        navLinks.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ============================================================
     SCROLL-TO-TOP BUTTON — fade in/out
     ============================================================ */
  var topArrow = document.querySelector('.top-arrow');
  if (topArrow) {
    topArrow.style.transition = 'opacity 0.3s ease';
    topArrow.style.opacity = '0';

    window.addEventListener('scroll', function () {
      topArrow.style.opacity = window.scrollY > 300 ? '1' : '0';
    });
  }

  /* ============================================================
     DOWNLOAD APP BUTTON
     ============================================================ */
  var downloadBtns = document.querySelectorAll('.btn-download');
  downloadBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      alert('The Pharmanect app is coming soon!');
    });
  });

  /* ============================================================
     CONTACT FORM — basic validation
     ============================================================ */
  var sendBtn = document.querySelector('.btn-send');
  if (sendBtn) {
    sendBtn.addEventListener('click', function () {
      var inputs = document.querySelectorAll('.form-input');
      var textarea = document.querySelector('.form-textarea');
      var valid = true;

      inputs.forEach(function (input) {
        if (!input.value.trim()) {
          input.style.borderColor = '#e53e3e';
          valid = false;
        } else {
          input.style.borderColor = '';
        }
      });

      if (textarea && !textarea.value.trim()) {
        textarea.style.borderColor = '#e53e3e';
        valid = false;
      } else if (textarea) {
        textarea.style.borderColor = '';
      }

      if (!valid) {
        alert('Please fill in all fields before sending.');
        return;
      }

      sendBtn.textContent = 'Sending...';
      sendBtn.disabled = true;

      setTimeout(function () {
        sendBtn.textContent = 'Send Message';
        sendBtn.disabled = false;
        inputs.forEach(function (i) { i.value = ''; });
        if (textarea) textarea.value = '';
        alert('Message sent! We will get back to you soon.');
      }, 1500);
    });
  }

  /* ============================================================
     PRESCRIPTION NOTE — character counter
     ============================================================ */
  var noteText = document.getElementById('noteText');
  var charCount = document.getElementById('charCount');
  if (noteText && charCount) {
    noteText.removeAttribute('oninput');
    noteText.addEventListener('input', function () {
      var len = noteText.value.length;
      charCount.textContent = len + '/300';
      charCount.style.color = len >= 270 ? '#e53e3e' : '#aaa';
    });
  }

  /* ============================================================
     ADD TO CART — products page
     ============================================================ */
  var cartBtns = document.querySelectorAll('.btn-cart');
  cartBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var card = btn.closest('.product-card');
      var name = card ? card.querySelector('.product-name') : null;
      var productName = name ? name.textContent : 'Product';

      btn.textContent = 'Added ✓';
      btn.style.backgroundColor = '#2d6a1f';

      setTimeout(function () {
        btn.textContent = 'Add to Cart';
        btn.style.backgroundColor = '';
      }, 1500);
    });
  });

  /* ============================================================
     PRODUCTS SEARCH
     ============================================================ */
  var productSearchInput = document.querySelector('.filters-bar .search-bar input');
  var productSearchBtn = document.querySelector('.filters-bar .search-bar button');
  var productCards = document.querySelectorAll('.product-card');

  function runProductSearch() {
    var query = productSearchInput ? productSearchInput.value.trim().toLowerCase() : '';
    productCards.forEach(function (card) {
      var nameEl = card.querySelector('.product-name');
      var catEl = card.querySelector('.product-category');
      var name = nameEl ? nameEl.textContent.toLowerCase() : '';
      var cat = catEl ? catEl.textContent.toLowerCase() : '';
      card.style.display = (!query || name.includes(query) || cat.includes(query)) ? '' : 'none';
    });
  }

  if (productSearchInput) {
    productSearchInput.addEventListener('input', runProductSearch);
  }
  if (productSearchBtn) {
    productSearchBtn.addEventListener('click', runProductSearch);
  }

  /* ============================================================
     CATEGORY FILTER — sidebar links
     ============================================================ */
  var catLinks = document.querySelectorAll('.cat-link');
  catLinks.forEach(function (link) {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      catLinks.forEach(function (l) { l.classList.remove('active'); });
      link.classList.add('active');

      var selected = link.textContent.trim().toLowerCase();
      productCards.forEach(function (card) {
        var catEl = card.querySelector('.product-category');
        var cat = catEl ? catEl.textContent.trim().toLowerCase() : '';
        card.style.display = (selected === 'all categories' || cat.includes(selected)) ? '' : 'none';
      });
    });
  });

  /* ============================================================
     PRICE RANGE SLIDER
     ============================================================ */
  var slider = document.querySelector('.price-slider');
  var applyBtn = document.querySelector('.btn-filter');
  var priceLabel = document.querySelector('.price-labels span:last-child');

  if (slider && priceLabel) {
    slider.addEventListener('input', function () {
      priceLabel.textContent = 'KSh ' + Number(slider.value).toLocaleString() + '+';
    });
  }

  if (slider && applyBtn) {
    applyBtn.addEventListener('click', function () {
      var max = Number(slider.value);
      productCards.forEach(function (card) {
        var priceEl = card.querySelector('.product-price');
        var price = priceEl ? parseFloat(priceEl.textContent.replace(/[^0-9.]/g, '')) : 0;
        card.style.display = price <= max ? '' : 'none';
      });
    });
  }

});