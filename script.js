/* ============================================================
   BRUTALIST PORTFOLIO — SCRIPT
   Vanilla ES6+ · Modular · Clean
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* --------------------------------------------------------
     1. PRELOADER
     -------------------------------------------------------- */
  const preloader    = document.getElementById('preloader');
  const counterEl    = document.querySelector('.preloader-counter');
  const preloaderBar = document.querySelector('.preloader-line');
  let count = 0;

  const preloaderInterval = setInterval(() => {
    count += Math.floor(Math.random() * 8) + 2;
    if (count >= 100) count = 100;
    if (counterEl) counterEl.textContent = count;
    if (preloaderBar) preloaderBar.style.setProperty('--progress', count + '%');
    if (preloaderBar) preloaderBar.querySelector('::after') || (preloaderBar.style.cssText += '');

    // Update the ::after width via a CSS variable approach
    if (preloaderBar) {
      preloaderBar.style.setProperty('width', '200px');
    }

    if (count >= 100) {
      clearInterval(preloaderInterval);
      setTimeout(() => {
        if (preloader) preloader.classList.add('hidden');
        document.body.style.overflow = 'auto';
        // Trigger reveal animations after preloader
        initRevealAnimations();
      }, 500);
    }
  }, 60);

  // Set the preloader bar fill via inline style update
  const styleSheet = document.createElement('style');
  document.head.appendChild(styleSheet);

  const updatePreloaderBar = () => {
    styleSheet.textContent = `.preloader-line::after { width: ${count}% !important; }`;
    if (count < 100) requestAnimationFrame(updatePreloaderBar);
  };
  updatePreloaderBar();

  // Prevent scroll during preload
  document.body.style.overflow = 'hidden';

  /* --------------------------------------------------------
     2. SCROLL PROGRESS
     -------------------------------------------------------- */
  const scrollProgress = document.querySelector('.scroll-progress');

  window.addEventListener('scroll', () => {
    if (!scrollProgress) return;
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress  = (scrollTop / docHeight) * 100;
    scrollProgress.style.width = progress + '%';
  });

  /* --------------------------------------------------------
     3. NAVBAR
     -------------------------------------------------------- */
  const navbar    = document.querySelector('.navbar');
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu   = document.querySelector('.nav-menu');
  const navLinks  = document.querySelectorAll('.nav-link');

  // Scroll class
  window.addEventListener('scroll', () => {
    if (navbar) {
      navbar.classList.toggle('scrolled', window.scrollY > 50);
    }
  });

  // Mobile toggle
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('active');
      navMenu.classList.toggle('open');
      document.body.style.overflow = navMenu.classList.contains('open') ? 'hidden' : 'auto';
    });
  }

  // Smooth scroll & close mobile menu
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href');
      const target   = document.querySelector(targetId);

      if (target) {
        const offsetTop = target.offsetTop - 70; // navbar height
        window.scrollTo({ top: offsetTop, behavior: 'smooth' });
      }

      // Close mobile menu
      if (navToggle && navMenu) {
        navToggle.classList.remove('active');
        navMenu.classList.remove('open');
        document.body.style.overflow = 'auto';
      }
    });
  });

  // Active section highlighting
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY + 100;

    sections.forEach(section => {
      const sectionTop    = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId     = section.getAttribute('id');
      const link          = document.querySelector(`.nav-link[href="#${sectionId}"]`);

      if (link) {
        if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      }
    });
  });

  /* --------------------------------------------------------
     4. SCROLL REVEAL (IntersectionObserver)
     -------------------------------------------------------- */
  function initRevealAnimations() {
    const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      });

      revealElements.forEach(el => observer.observe(el));
    } else {
      // Fallback: reveal all
      revealElements.forEach(el => el.classList.add('revealed'));
    }
  }

  /* --------------------------------------------------------
     5. PROJECT FILTERING
     -------------------------------------------------------- */
  const filterBtns   = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active state
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.classList.remove('hidden');
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });

  /* --------------------------------------------------------
     6. COUNTER ANIMATION
     -------------------------------------------------------- */
  const counters = document.querySelectorAll('.counter');

  function animateCounter(el) {
    const target   = parseInt(el.getAttribute('data-target'), 10);
    const suffix   = el.getAttribute('data-suffix') || '';
    const duration = 2000;
    const start    = performance.now();

    function update(now) {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const ease     = 1 - Math.pow(1 - progress, 3);
      const current  = Math.floor(target * ease);

      el.textContent = current + suffix;

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = target + suffix;
      }
    }

    requestAnimationFrame(update);
  }

  if ('IntersectionObserver' in window) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(counter => counterObserver.observe(counter));
  }

  /* --------------------------------------------------------
     7. TEXT SCRAMBLE EFFECT
     -------------------------------------------------------- */
  const scrambleElements = document.querySelectorAll('[data-scramble]');
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&*';

  scrambleElements.forEach(el => {
    const original = el.textContent;

    el.addEventListener('mouseenter', () => {
      let iterations = 0;
      const interval = setInterval(() => {
        el.textContent = original
          .split('')
          .map((char, i) => {
            if (char === ' ') return ' ';
            if (i < iterations) return original[i];
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join('');

        iterations += 1 / 2;

        if (iterations >= original.length) {
          clearInterval(interval);
          el.textContent = original;
        }
      }, 40);
    });
  });

  /* --------------------------------------------------------
     8. CURRENT TIME DISPLAY
     -------------------------------------------------------- */
  const timeDisplay = document.querySelector('.current-time');

  function updateTime() {
    if (!timeDisplay) return;
    const now = new Date();
    // Display in user's local timezone
    const hours   = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    timeDisplay.textContent = `${hours}:${minutes}:${seconds}`;
  }

  updateTime();
  setInterval(updateTime, 1000);

  /* --------------------------------------------------------
     9. CURRENT YEAR
     -------------------------------------------------------- */
  const yearEls = document.querySelectorAll('.current-year');
  yearEls.forEach(el => {
    el.textContent = new Date().getFullYear();
  });

  /* --------------------------------------------------------
     10. MAGNETIC HOVER ON BUTTONS
     -------------------------------------------------------- */
  const magneticElements = document.querySelectorAll('.filter-btn, .contact-email, .social-link');

  magneticElements.forEach(el => {
    el.addEventListener('mousemove', (e) => {
      const rect   = el.getBoundingClientRect();
      const x      = e.clientX - rect.left - rect.width / 2;
      const y      = e.clientY - rect.top - rect.height / 2;
      const factor = 0.3;

      el.style.transform = `translate(${x * factor}px, ${y * factor}px)`;
    });

    el.addEventListener('mouseleave', () => {
      el.style.transform = 'translate(0, 0)';
      el.style.transition = 'transform 0.4s ease';
    });

    el.addEventListener('mouseenter', () => {
      el.style.transition = 'none';
    });
  });

});
