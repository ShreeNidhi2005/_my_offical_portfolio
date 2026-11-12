/* =========================================================
   script.js - Interactive features for the portfolio
   Runs after the HTML is loaded, so every element exists.
   ========================================================= */
document.addEventListener('DOMContentLoaded', () => {

  /* 1. FOOTER YEAR: always shows the current year */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* 2. NAVBAR BACKGROUND and BACK-TO-TOP BUTTON: change when the user scrolls */
  const navbar = document.getElementById('navbar');
  const backToTop = document.getElementById('backToTop');

  const handleScroll = () => {
    const y = window.scrollY;
    navbar.classList.toggle('scrolled', y > 40);
    backToTop.classList.toggle('show', y > 500);
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // run once on load in case the page starts scrolled

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* 3. MOBILE MENU: open/close with the hamburger button */
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('nav-links');

  const setMenuOpen = (isOpen) => {
    navLinks.classList.toggle('open', isOpen);
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    menuToggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
    menuToggle.innerHTML = isOpen
      ? '<i class="fa-solid fa-xmark" aria-hidden="true"></i>'
      : '<i class="fa-solid fa-bars" aria-hidden="true"></i>';
  };

  menuToggle.addEventListener('click', () => {
    setMenuOpen(!navLinks.classList.contains('open'));
  });

  // Close the menu after the user picks a link
  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => setMenuOpen(false));
  });

  // Keyboard users can press Escape to close the menu
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && navLinks.classList.contains('open')) {
      setMenuOpen(false);
      menuToggle.focus();
    }
  });

  /* 4. ACTIVE NAVIGATION HIGHLIGHT: underline the link for the section on screen */
  const sections = document.querySelectorAll('main section[id]');
  const navAnchors = document.querySelectorAll('.nav-links a');

  const spy = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        navAnchors.forEach((anchor) => {
          anchor.classList.toggle('active', anchor.getAttribute('href') === '#' + entry.target.id);
        });
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px' }); // a section counts as active when it crosses the middle of the screen

  sections.forEach((section) => spy.observe(section));

  /* 5. SCROLL REVEAL: fade elements in as they enter the screen */
  const revealElements = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target); // animate only once
      }
    });
  }, { threshold: 0.15 });

  revealElements.forEach((el) => revealObserver.observe(el));

  /* 6. CONTACT FORM VALIDATION */
  // const form = document.getElementById('contactForm');
  // const statusEl = document.getElementById('formStatus');

  // if (form) {
    // Each rule has a test and the message to show when the test fails
    // const rules = {
    //   name: {
    //     test: (v) => v.trim().length >= 2,
    //     message: 'Please enter your name (at least 2 characters).'
    //   },
    //   email: {
    //     test: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()),
    //     message: 'Please enter a valid email address.'
    //   },
    //   subject: {
    //     test: (v) => v.trim().length >= 3,
    //     message: 'Subject must be at least 3 characters.'
    //   },
    //   message: {
    //     test: (v) => v.trim().length >= 10,
    //     message: 'Message must be at least 10 characters.'
    //   }
    // };

    // Checks one field, shows or clears its error text, and returns true if valid
    // const validateField = (name) => {
    //   const field = form.querySelector(`[name="${name}"]`);
    //   const errorEl = document.getElementById(`${name}-error`);
    //   const isValid = rules[name].test(field.value);

    //   field.setAttribute('aria-invalid', String(!isValid));
    //   errorEl.textContent = isValid ? '' : rules[name].message;
    //   return isValid;
    // };

    // Object.keys(rules).forEach((name) => {
    //   const field = form.querySelector(`[name="${name}"]`);
    //   // Check when the user leaves a field, and re-check while they fix an error
    //   field.addEventListener('blur', () => validateField(name));
    //   field.addEventListener('input', () => {
    //     if (field.getAttribute('aria-invalid') === 'true') validateField(name);
    //   });
    // });

    // form.addEventListener('submit', (event) => {
    //   event.preventDefault(); // stop the page from reloading

      // Validate every field (map runs all checks, then every() confirms all passed)
      // const allValid = Object.keys(rules).map(validateField).every(Boolean);

      // if (!allValid) {
      //   statusEl.textContent = 'Please fix the highlighted fields.';
      //   statusEl.className = 'form-status failure';
      //   form.querySelector('[aria-invalid="true"]').focus();
      //   return;
      // }

      // NOTE: There is no backend here, so the message is not actually sent.
      // To send real emails, replace this block with a request to Formspree,
      // Netlify Forms, EmailJS or your own server (see README instructions).
  //     statusEl.textContent = 'Thanks! Your message looks good. Connect a form service to deliver it.';
  //     statusEl.className = 'form-status success';
  //     form.reset();
  //     Object.keys(rules).forEach((name) => {
  //       form.querySelector(`[name="${name}"]`).removeAttribute('aria-invalid');
  //     });
  //   });
  // }


  
  /* 6. CONTACT FORM VALIDATION + FORMSPREE EMAIL DELIVERY */

  const form = document.getElementById('contactForm');
  const statusEl = document.getElementById('formStatus');

  if (form) {
    const submitBtn = form.querySelector('button[type="submit"]');

    // Validation rules
    const rules = {
      name: {
        test: (v) => v.trim().length >= 2,
        message: 'Please enter your name (at least 2 characters).'
      },
      email: {
        
        test: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()),
        message: 'Please enter a valid email address.'
      },
      subject: {
        test: (v) => v.trim().length >= 3,
        message: 'Subject must be at least 3 characters.'
      },
      message: {
        test: (v) => v.trim().length >= 10,
        message: 'Message must be at least 10 characters.'
      }
    };

    // Validate individual fields
    const validateField = (name) => {
      const field = form.querySelector(`[name="${name}"]`);
      const errorEl = document.getElementById(`${name}-error`);

      const isValid = rules[name].test(field.value);

      field.setAttribute('aria-invalid', String(!isValid));
      errorEl.textContent = isValid ? '' : rules[name].message;

      return isValid;
    };

    // Validate while typing and when leaving a field
    Object.keys(rules).forEach((name) => {
      const field = form.querySelector(`[name="${name}"]`);

      field.addEventListener('blur', () => validateField(name));

      field.addEventListener('input', () => {
        if (field.getAttribute('aria-invalid') === 'true') {
          validateField(name);
        }
      });
    });

    // Submit form to Formspree
    form.addEventListener('submit', async (event) => {
      event.preventDefault();

      statusEl.textContent = '';

      // Check all fields
      const allValid = Object.keys(rules)
        .map(validateField)
        .every(Boolean);

      if (!allValid) {
        statusEl.textContent = 'Please fix the highlighted fields.';
        statusEl.className = 'form-status failure';

        form.querySelector('[aria-invalid="true"]').focus();
        return;
      }

      // Prevent multiple submissions
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending...';

      try {
        const response = await fetch(form.action, {
          method: 'POST',
          body: new FormData(form),
          headers: {
            'Accept': 'application/json'
          }
        });

        if (response.ok) {
          statusEl.textContent =
            'Thank you! Your message has been sent successfully.';

          statusEl.className = 'form-status success';

          // Clear form after successful submission
          form.reset();

          Object.keys(rules).forEach((name) => {
            const field = form.querySelector(`[name="${name}"]`);

            field.removeAttribute('aria-invalid');

            document.getElementById(`${name}-error`).textContent = '';
          });

        } else {
          const result = await response.json();

          statusEl.textContent =
            result.errors?.map(error => error.message).join(', ') ||
            'Unable to send your message. Please try again.';

          statusEl.className = 'form-status failure';
        }

      } catch (error) {
        statusEl.textContent =
          'Network error. Please check your internet connection and try again.';

        statusEl.className = 'form-status failure';

      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send Message';
      }
    });
  }


  /* 7. PLACEHOLDER LINKS: stop the page jumping when a [Add ...] link is clicked */
  document.querySelectorAll('.placeholder').forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      link.title = 'Replace this href in index.html with your real URL';
    });
  });
});
