/* ================================================
   Awimax Energy Limited — Main JavaScript
   ================================================ */

(function () {
  'use strict';

  /* -----------------------------------------------
     Mobile Navigation
  ----------------------------------------------- */
  const toggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (toggle && navLinks) {
    toggle.addEventListener('click', function () {
      const open = navLinks.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open);
      toggle.querySelectorAll('span').forEach((s, i) => {
        if (open) {
          if (i === 0) s.style.transform = 'translateY(7px) rotate(45deg)';
          if (i === 1) s.style.opacity = '0';
          if (i === 2) s.style.transform = 'translateY(-7px) rotate(-45deg)';
        } else {
          s.style.transform = '';
          s.style.opacity = '';
        }
      });
    });

    // Close nav on outside click
    document.addEventListener('click', function (e) {
      if (!e.target.closest('.site-header')) {
        navLinks.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.querySelectorAll('span').forEach(s => {
          s.style.transform = '';
          s.style.opacity = '';
        });
      }
    });

    // Close on link click (mobile)
    navLinks.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        navLinks.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.querySelectorAll('span').forEach(s => {
          s.style.transform = '';
          s.style.opacity = '';
        });
      });
    });
  }

  /* -----------------------------------------------
     Active nav link
  ----------------------------------------------- */
  (function () {
    const current = location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-links a').forEach(a => {
      const href = a.getAttribute('href');
      if (href && (href === current || href === './' + current)) {
        a.closest('li') && a.closest('li').classList.add('active');
      }
    });
  })();

  /* -----------------------------------------------
     Hero Slider
  ----------------------------------------------- */
  const slides = document.querySelectorAll('.hero-slide');
  const dots   = document.querySelectorAll('.hero-dot');
  let current  = 0;
  let timer    = null;

  function showSlide(n) {
    slides.forEach((s, i) => s.classList.toggle('active', i === n));
    dots.forEach((d, i)   => d.classList.toggle('active', i === n));
    current = n;
  }

  function nextSlide() {
    showSlide((current + 1) % slides.length);
  }

  function startTimer() {
    timer = setInterval(nextSlide, 5000);
  }

  if (slides.length > 1) {
    showSlide(0);
    startTimer();

    dots.forEach((dot, i) => {
      dot.addEventListener('click', () => {
        clearInterval(timer);
        showSlide(i);
        startTimer();
      });
    });
  } else if (slides.length === 1) {
    slides[0].classList.add('active');
  }

  /* -----------------------------------------------
     Gallery Lightbox
  ----------------------------------------------- */
  const lightbox = document.querySelector('.lightbox');

  if (lightbox) {
    const lbImg     = lightbox.querySelector('.lightbox-img');
    const lbCaption = lightbox.querySelector('.lightbox-caption');
    const lbClose   = lightbox.querySelector('.lightbox-close');
    const lbPrev    = lightbox.querySelector('.lightbox-prev');
    const lbNext    = lightbox.querySelector('.lightbox-next');
    const items     = Array.from(document.querySelectorAll('.gallery-item[data-full]'));
    let lbIndex     = 0;

    function openLightbox(i) {
      lbIndex = i;
      const item = items[i];
      lbImg.src = item.dataset.full;
      lbCaption.textContent = item.dataset.caption || '';
      lightbox.classList.add('open');
      document.body.style.overflow = 'hidden';
      lbImg.focus();
    }

    function closeLightbox() {
      lightbox.classList.remove('open');
      document.body.style.overflow = '';
    }

    function showLbPrev() {
      lbIndex = (lbIndex - 1 + items.length) % items.length;
      openLightbox(lbIndex);
    }

    function showLbNext() {
      lbIndex = (lbIndex + 1) % items.length;
      openLightbox(lbIndex);
    }

    items.forEach((item, i) => {
      item.addEventListener('click', () => openLightbox(i));
      item.setAttribute('role', 'button');
      item.setAttribute('tabindex', '0');
      item.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openLightbox(i); }
      });
    });

    if (lbClose) lbClose.addEventListener('click', closeLightbox);
    if (lbPrev)  lbPrev.addEventListener('click', showLbPrev);
    if (lbNext)  lbNext.addEventListener('click', showLbNext);

    lightbox.addEventListener('click', e => {
      if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener('keydown', e => {
      if (!lightbox.classList.contains('open')) return;
      if (e.key === 'Escape')    closeLightbox();
      if (e.key === 'ArrowLeft') showLbPrev();
      if (e.key === 'ArrowRight') showLbNext();
    });
  }

  /* -----------------------------------------------
     Gallery Filters
  ----------------------------------------------- */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  if (filterBtns.length) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', function () {
        filterBtns.forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        const filter = this.dataset.filter;
        galleryItems.forEach(item => {
          if (filter === 'all' || item.dataset.category === filter) {
            item.style.display = '';
          } else {
            item.style.display = 'none';
          }
        });
      });
    });
  }

  /* -----------------------------------------------
     Contact Form (Formspree/mailto fallback)
  ----------------------------------------------- */
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', async function (e) {
      const action = contactForm.getAttribute('action') || '';
      if (!action.includes('formspree')) {
        // mailto fallback — let default behavior work
        return;
      }
      e.preventDefault();
      const btn     = contactForm.querySelector('[type="submit"]');
      const success = document.querySelector('.form-success');
      btn.disabled  = true;
      btn.textContent = 'Sending…';

      try {
        const res = await fetch(action, {
          method: 'POST',
          body: new FormData(contactForm),
          headers: { Accept: 'application/json' }
        });
        if (res.ok) {
          contactForm.reset();
          if (success) success.style.display = 'block';
          btn.textContent = 'Sent!';
        } else {
          btn.textContent = 'Error — try again';
          btn.disabled = false;
        }
      } catch (_) {
        btn.textContent = 'Error — try again';
        btn.disabled = false;
      }
    });
  }

  /* -----------------------------------------------
     Lazy Image Loading (native fallback)
  ----------------------------------------------- */
  if ('loading' in HTMLImageElement.prototype) {
    document.querySelectorAll('img[data-src]').forEach(img => {
      img.src = img.dataset.src;
    });
  } else {
    // Simple IntersectionObserver fallback
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          io.unobserve(img);
        }
      });
    });
    document.querySelectorAll('img[data-src]').forEach(img => io.observe(img));
  }

  /* -----------------------------------------------
     Sticky header shadow on scroll
  ----------------------------------------------- */
  const header = document.querySelector('.site-header');
  if (header) {
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          header.style.boxShadow = window.scrollY > 10
            ? '0 2px 20px rgba(0,0,0,.15)'
            : '0 2px 12px rgba(0,0,0,.10)';
          ticking = false;
        });
        ticking = true;
      }
    });
  }

})();
