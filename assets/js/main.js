/* ==========================================================================
   MATHEW BANDARA — site interactions
   --------------------------------------------------------------------------
   CONFIGURE YOUR DETAILS HERE  (search for "CONFIGURE" in the README)
   Every value below is intentionally empty. Nothing is invented.
   Until an email / WhatsApp number / endpoint is added, the page shows clearly
   marked placeholders and the form validates locally without sending.
   ========================================================================== */

const SITE_CONFIG = {
  // Public email address, e.g. "hello@mathewbandara.com"
  email: "",

  // WhatsApp number in international format, digits only, e.g. "94771234567"
  whatsapp: "",
  whatsappMessage: "Hello Mathew, I would like to discuss a project.",

  // HTTPS endpoint that accepts JSON POST requests (Formspree, Basin, your own API).
  // This is required for the contact form to actually deliver messages.
  formEndpoint: "",

  // Profile URLs — add a full https:// link to activate each icon.
  socials: {
    instagram: "",
    facebook: "",
    youtube: "",
    linkedin: ""
  }
};

(() => {
  'use strict';

  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  /* -----------------------------------------------------------------------
     Scroll locking (menu + dialogs)
     ----------------------------------------------------------------------- */
  let scrollLocks = 0;
  let previousPaddingRight = '';

  function lockScroll() {
    scrollLocks += 1;
    if (scrollLocks > 1) return;
    const gap = window.innerWidth - document.documentElement.clientWidth;
    previousPaddingRight = document.documentElement.style.paddingRight;
    if (gap > 0) document.documentElement.style.paddingRight = `${gap}px`;
    document.documentElement.classList.add('is-locked');
  }

  function unlockScroll() {
    scrollLocks = Math.max(0, scrollLocks - 1);
    if (scrollLocks > 0) return;
    document.documentElement.classList.remove('is-locked');
    document.documentElement.style.paddingRight = previousPaddingRight;
  }

  /* -----------------------------------------------------------------------
     Header: scrolled state, progress bar, active navigation
     ----------------------------------------------------------------------- */
  const header = $('#site-header');
  const progressBar = $('[data-scroll-progress]');
  const navLinks = $$('[data-nav-link]');
  const sectionMap = [
    ['home', 'home'],
    ['intro', 'home'],
    ['services', 'services'],
    ['signature', 'services'],
    ['gallery', 'gallery'],
    ['contact', null]
  ];

  function getScrollTop() {
    return window.scrollY || document.documentElement.scrollTop;
  }

  function updateNavState() {
    const scrolled = getScrollTop() > 16;
    if (header) header.classList.toggle('is-scrolled', scrolled);

    const doc = document.documentElement;
    const max = doc.scrollHeight - window.innerHeight;
    if (progressBar) {
      const ratio = max > 0 ? Math.min(1, Math.max(0, getScrollTop() / max)) : 0;
      progressBar.style.transform = `scaleX(${ratio})`;
    }

    const probe = getScrollTop() + (header ? header.offsetHeight : 76) + 110;
    let activeId = 'home';
    for (const [id, navId] of sectionMap) {
      const section = document.getElementById(id);
      if (section && section.offsetTop <= probe) activeId = navId;
    }
    navLinks.forEach((link) => {
      if (link.dataset.navLink === activeId) {
        link.setAttribute('aria-current', 'page');
      } else {
        link.removeAttribute('aria-current');
      }
    });
  }

  let scrollQueued = false;
  function onScroll() {
    if (scrollQueued) return;
    scrollQueued = true;
    window.requestAnimationFrame(() => {
      updateNavState();
      updateToTop();
      scrollQueued = false;
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  updateNavState();

  /* -----------------------------------------------------------------------
     Mobile navigation
     ----------------------------------------------------------------------- */
  const menuToggle = $('.menu-toggle');
  const mobileMenu = $('[data-mobile-menu]');
  const brandLink = $('.site-header .brand');
  const mainEl = $('#main');
  const footerEl = $('.site-footer');
  const desktopQuery = window.matchMedia('(min-width: 1025px)');
  let menuOpen = false;

  function menuFocusables() {
    if (!mobileMenu || !menuToggle) return [];
    return [menuToggle, ...$$('a[href], button:not([disabled])', mobileMenu)].filter(
      (el) => el.offsetParent !== null
    );
  }

  function openMenu() {
    if (!menuOpen) {
      menuOpen = true;
      mobileMenu.classList.add('is-open');
      mobileMenu.dataset.open = 'true';
      menuToggle.setAttribute('aria-expanded', 'true');
      menuToggle.setAttribute('aria-label', 'Close menu');
      if (mainEl) mainEl.inert = true;
      if (footerEl) footerEl.inert = true;
      if (brandLink) brandLink.inert = true;
      lockScroll();
      const firstLink = $('a[href]', mobileMenu);
      if (firstLink) window.setTimeout(() => firstLink.focus({ preventScroll: true }), 260);
    }
  }

  function closeMenu({ restoreFocus = true } = {}) {
    if (!menuOpen) return;
    menuOpen = false;
    mobileMenu.classList.remove('is-open');
    mobileMenu.dataset.open = 'false';
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Open menu');
    if (mainEl) mainEl.inert = false;
    if (footerEl) footerEl.inert = false;
    if (brandLink) brandLink.inert = false;
    unlockScroll();
    if (restoreFocus) menuToggle.focus({ preventScroll: true });
  }

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', () => {
      if (menuOpen) closeMenu();
      else openMenu();
    });

    $$('[data-mobile-link]', mobileMenu).forEach((link) => {
      link.addEventListener('click', () => closeMenu({ restoreFocus: false }));
    });

    // Safety: close if a link is activated by keyboard and the menu state lingers.
    document.addEventListener('keydown', (event) => {
      if (!menuOpen) return;
      if (event.key === 'Escape') {
        event.preventDefault();
        closeMenu();
        return;
      }
      if (event.key !== 'Tab') return;
      const items = menuFocusables();
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    });

    desktopQuery.addEventListener('change', (event) => {
      if (event.matches) closeMenu({ restoreFocus: false });
    });
  }

  /* -----------------------------------------------------------------------
     Scroll reveals
     ----------------------------------------------------------------------- */
  const revealItems = $$('.reveal');
  if ('IntersectionObserver' in window && !prefersReducedMotion.matches) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 }
    );
    revealItems.forEach((item) => revealObserver.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add('is-visible'));
  }

  /* -----------------------------------------------------------------------
     Back-to-top button
     ----------------------------------------------------------------------- */
  const toTop = $('[data-to-top]');
  function updateToTop() {
    if (!toTop) return;
    toTop.hidden = getScrollTop() < 720;
  }
  if (toTop) {
    toTop.addEventListener('click', () => {
      const behavior = prefersReducedMotion.matches ? 'auto' : 'smooth';
      window.scrollTo({ top: 0, behavior });
      const brand = $('.site-header .brand');
      if (brand) window.setTimeout(() => brand.focus({ preventScroll: true }), 400);
    });
  }
  updateToTop();

  /* -----------------------------------------------------------------------
     Current year
     ----------------------------------------------------------------------- */
  $$('[data-current-year]').forEach((el) => {
    el.textContent = String(new Date().getFullYear());
  });

  /* -----------------------------------------------------------------------
     Contact configuration: email, WhatsApp, socials, setup note
     ----------------------------------------------------------------------- */
  const emailEl = $('[data-contact-email]');
  const whatsappEl = $('[data-contact-whatsapp]');
  const setupNote = $('[data-setup-note]');

  if (emailEl) {
    if (SITE_CONFIG.email) {
      const link = document.createElement('a');
      link.href = `mailto:${SITE_CONFIG.email}`;
      link.textContent = SITE_CONFIG.email;
      emailEl.textContent = '';
      emailEl.appendChild(link);
      emailEl.classList.remove('is-placeholder');
    } else {
      emailEl.textContent = 'Not configured yet';
      emailEl.classList.add('is-placeholder');
    }
  }

  if (whatsappEl) {
    const digits = String(SITE_CONFIG.whatsapp || '').replace(/\D/g, '');
    if (digits) {
      const link = document.createElement('a');
      const query = SITE_CONFIG.whatsappMessage
        ? `?text=${encodeURIComponent(SITE_CONFIG.whatsappMessage)}`
        : '';
      link.href = `https://wa.me/${digits}${query}`;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.textContent = `+${digits}`;
      whatsappEl.textContent = '';
      whatsappEl.appendChild(link);
      whatsappEl.classList.remove('is-placeholder');
    } else {
      whatsappEl.textContent = 'Not configured yet';
      whatsappEl.classList.add('is-placeholder');
    }
  }

  let missingSocials = 0;
  Object.entries(SITE_CONFIG.socials).forEach(([network, url]) => {
    const item = $(`[data-social="${network}"]`);
    if (!item) return;
    const isValid = typeof url === 'string' && /^https?:\/\/\S+/i.test(url);
    if (!isValid) {
      missingSocials += 1;
      item.setAttribute('title', `${item.dataset.label} — link not configured yet`);
      return;
    }
    const link = document.createElement('a');
    link.href = url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.className = item.className;
    link.dataset.social = network;
    link.title = `${item.dataset.label} (opens in a new tab)`;
    while (item.firstChild) link.appendChild(item.firstChild);
    const newTab = document.createElement('span');
    newTab.className = 'sr-only';
    newTab.textContent = ' (opens in a new tab)';
    link.appendChild(newTab);
    item.replaceWith(link);
  });

  const socialNote = $('.footer__social-note');
  if (socialNote) socialNote.hidden = missingSocials === 0;

  if (setupNote) {
    const incomplete =
      !SITE_CONFIG.email ||
      !SITE_CONFIG.whatsapp ||
      !/^https:\/\/\S+/.test(SITE_CONFIG.formEndpoint) ||
      missingSocials > 0;
    setupNote.hidden = !incomplete;
  }

  /* -----------------------------------------------------------------------
     Dialogs: service details
     ----------------------------------------------------------------------- */
  const serviceDialog = $('#service-dialog');
  const serviceBody = $('[data-service-body]');
  let serviceTrigger = null;

  function openServiceDialog(key, trigger) {
    const template = document.getElementById(`tpl-service-${key}`);
    if (!serviceDialog || !serviceBody || !template) return;
    serviceTrigger = trigger || null;
    serviceBody.replaceChildren(template.content.cloneNode(true));
    if (serviceDialog.open) serviceDialog.close();
    serviceDialog.showModal();
    lockScroll();
  }

  if (serviceDialog) {
    serviceDialog.addEventListener('close', () => {
      unlockScroll();
      serviceBody.replaceChildren();
      if (serviceTrigger && document.contains(serviceTrigger)) {
        serviceTrigger.focus({ preventScroll: true });
      }
      serviceTrigger = null;
    });
    serviceDialog.addEventListener('click', (event) => {
      if (event.target === serviceDialog) serviceDialog.close();
    });
  }

  $$('[data-service]').forEach((button) => {
    button.addEventListener('click', () => openServiceDialog(button.dataset.service, button));
  });

  /* -----------------------------------------------------------------------
     Project lightbox
     ----------------------------------------------------------------------- */
  const projectDialog = $('#project-dialog');
  const galleryCards = $$('[data-gallery]');
  const lightbox = {
    image: $('[data-lightbox-image]'),
    source: $('[data-lightbox-source]'),
    title: $('[data-lightbox-title]'),
    category: $('[data-lightbox-category]'),
    description: $('[data-lightbox-description]'),
    index: $('[data-lightbox-index]'),
    total: $('[data-lightbox-total]'),
    media: $('[data-lightbox-media]')
  };
  let projectIndex = 0;
  let projectTrigger = null;
  let liveRegion = null;

  if (projectDialog) {
    liveRegion = document.createElement('p');
    liveRegion.className = 'sr-only';
    liveRegion.setAttribute('aria-live', 'polite');
    projectDialog.appendChild(liveRegion);

    projectDialog.addEventListener('close', () => {
      unlockScroll();
      if (projectTrigger && document.contains(projectTrigger)) {
        projectTrigger.focus({ preventScroll: true });
      }
      projectTrigger = null;
    });
    projectDialog.addEventListener('click', (event) => {
      if (event.target === projectDialog) projectDialog.close();
    });
    projectDialog.addEventListener('keydown', (event) => {
      const target = event.target;
      if (target.closest('audio, video, input, select, textarea')) return;
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        showProject(projectIndex - 1);
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        showProject(projectIndex + 1);
      }
    });
  }

  function mediaPlaceholder(type, hint) {
    if (!lightbox.media) return;
    if (!type) {
      lightbox.media.hidden = true;
      lightbox.media.replaceChildren();
      return;
    }
    const isAudio = type === 'audio';
    const label = isAudio ? 'Audio sample slot' : 'Video preview slot';
    const icon = isAudio ? 'i-sound' : 'i-video';
    const fallback = hint || (isAudio ? 'assets/media/your-sample.mp3' : 'assets/media/your-reel.mp4');

    lightbox.media.hidden = false;
    lightbox.media.innerHTML = `
      <span class="media-slot__icon" aria-hidden="true">
        <svg class="icon" focusable="false"><use href="#${icon}"/></svg>
      </span>
      <div>
        <p class="media-slot__title">${label} — not added yet</p>
        <p class="media-slot__copy">
          Add your media at <code>${fallback}</code>, then connect it to this item
          with the <code>data-media-src</code> attribute in <code>index.html</code>.
          The player appears here automatically.
        </p>
      </div>`;
  }

  function renderMedia(button) {
    if (!lightbox.media) return;
    const type = button.dataset.mediaType;
    const src = button.dataset.mediaSrc;
    const hint = button.dataset.mediaHint;
    if (!type) {
      lightbox.media.hidden = true;
      lightbox.media.replaceChildren();
      return;
    }
    if (!src) {
      mediaPlaceholder(type, hint);
      return;
    }
    lightbox.media.hidden = false;
    lightbox.media.replaceChildren();
    if (type === 'audio') {
      const audio = document.createElement('audio');
      audio.controls = true;
      audio.preload = 'metadata';
      audio.src = src;
      audio.setAttribute('aria-label', 'Project audio sample');
      lightbox.media.appendChild(audio);
    } else {
      const video = document.createElement('video');
      video.controls = true;
      video.preload = 'metadata';
      video.playsInline = true;
      video.setAttribute('aria-label', 'Project video preview');
      const source = document.createElement('source');
      source.src = src;
      source.type = src.endsWith('.webm') ? 'video/webm' : 'video/mp4';
      video.appendChild(source);
      lightbox.media.appendChild(video);
    }
  }

  function showProject(index) {
    if (!galleryCards.length || !projectDialog) return;
    const total = galleryCards.length;
    projectIndex = (index + total) % total;
    const button = galleryCards[projectIndex];
    const data = button.dataset;

    if (lightbox.image) {
      const fallbackImage = data.image || '';
      lightbox.image.src = fallbackImage;
      lightbox.image.alt = data.imageAlt || '';
      lightbox.image.decoding = 'async';
    }
    if (lightbox.source) {
      if (data.imageWebp) {
        lightbox.source.srcset = data.imageWebp;
        lightbox.source.type = 'image/webp';
      } else {
        lightbox.source.removeAttribute('srcset');
      }
    }
    if (lightbox.title) lightbox.title.textContent = data.title || '';
    if (lightbox.category) {
      const category = data.category || '';
      lightbox.category.textContent = category ? `Selected work · ${category}` : 'Selected work';
    }
    if (lightbox.description) lightbox.description.textContent = data.description || '';
    if (lightbox.index) lightbox.index.textContent = String(projectIndex + 1).padStart(2, '0');
    if (lightbox.total) lightbox.total.textContent = String(total).padStart(2, '0');
    renderMedia(button);

    if (liveRegion) {
      liveRegion.textContent = `Project ${projectIndex + 1} of ${total}: ${data.title || ''}`;
    }
    if (lightbox.body) lightbox.body.scrollTop = 0;
  }

  galleryCards.forEach((button, index) => {
    button.addEventListener('click', () => {
      projectTrigger = button;
      showProject(index);
      if (projectDialog && !projectDialog.open) {
        projectDialog.showModal();
        lockScroll();
      }
    });
  });

  const prevButton = $('[data-lightbox-prev]');
  const nextButton = $('[data-lightbox-next]');
  if (prevButton) prevButton.addEventListener('click', () => showProject(projectIndex - 1));
  if (nextButton) nextButton.addEventListener('click', () => showProject(projectIndex + 1));

  /* -----------------------------------------------------------------------
     Close buttons (shared by dialogs)
     ----------------------------------------------------------------------- */
  document.addEventListener('click', (event) => {
    const closer = event.target.closest('[data-close-dialog]');
    if (!closer) return;
    const dialog = closer.closest('dialog');
    if (!dialog) return;
    const hash = closer.tagName === 'A' ? closer.getAttribute('href') : null;
    if (hash && hash.startsWith('#')) event.preventDefault();
    dialog.close();
    if (hash) {
      const target = document.querySelector(hash);
      if (target) {
        const behavior = prefersReducedMotion.matches ? 'auto' : 'smooth';
        window.setTimeout(() => target.scrollIntoView({ behavior, block: 'start' }), 40);
      }
    }
  });

  /* -----------------------------------------------------------------------
     Service → contact form hand-off
     ----------------------------------------------------------------------- */
  const serviceSelect = $('#service');
  const contactFormSection = $('#contact-form');

  document.addEventListener('click', (event) => {
    const requester = event.target.closest('[data-request-service]');
    if (!requester) return;
    const service = requester.dataset.requestService || '';
    const dialog = requester.closest('dialog');
    if (dialog) dialog.close();
    if (serviceSelect) {
      const matching = Array.from(serviceSelect.options).find(
        (option) => option.value === service
      );
      if (matching) serviceSelect.value = service;
    }
    if (contactFormSection) {
      const behavior = prefersReducedMotion.matches ? 'auto' : 'smooth';
      window.setTimeout(() => {
        contactFormSection.scrollIntoView({ behavior, block: 'start' });
        if (serviceSelect) serviceSelect.focus({ preventScroll: true });
      }, 120);
    }
  });

  /* -----------------------------------------------------------------------
     Contact form: accessible validation + honest delivery states
     ----------------------------------------------------------------------- */
  const form = $('[data-contact-form]');
  const summary = $('[data-error-summary]');
  const statusEl = $('[data-form-status]');
  const submitButton = $('.contact-form__submit');
  const fields = {
    name: { input: $('#name'), error: $('[data-error-for="name"]') },
    email: { input: $('#email'), error: $('[data-error-for="email"]') },
    service: { input: $('#service'), error: $('[data-error-for="service"]') },
    details: { input: $('#details'), error: $('[data-error-for="details"]') }
  };

  const messages = {
    name: 'Please enter your name.',
    emailRequired: 'Please enter your email address.',
    emailInvalid: 'Please enter a valid email address (for example, you@example.com).',
    service: 'Please select the service you are interested in.',
    details: 'Please add a few details about your project.'
  };

  function setFieldError(key, message) {
    const field = fields[key];
    if (!field || !field.input) return;
    if (message) {
      field.input.setAttribute('aria-invalid', 'true');
      if (field.error) field.error.textContent = message;
    } else {
      field.input.removeAttribute('aria-invalid');
      if (field.error) field.error.textContent = '';
    }
  }

  function clearSummary() {
    if (!summary) return;
    summary.hidden = true;
    summary.replaceChildren();
  }

  function clearStatus() {
    if (!statusEl) return;
    statusEl.hidden = true;
    statusEl.textContent = '';
    statusEl.classList.remove('form-status--error', 'form-status--info');
  }

  function validate() {
    const errors = [];
    const name = fields.name.input;
    const email = fields.email.input;
    const service = fields.service.input;
    const details = fields.details.input;

    const nameValue = name.value.trim();
    if (!nameValue) {
      errors.push(['name', messages.name]);
    }

    const emailValue = email.value.trim();
    if (!emailValue) {
      errors.push(['email', messages.emailRequired]);
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(emailValue)) {
      errors.push(['email', messages.emailInvalid]);
    }

    if (!service.value) {
      errors.push(['service', messages.service]);
    }

    const detailsValue = details.value.trim();
    if (!detailsValue) {
      errors.push(['details', messages.details]);
    } else if (detailsValue.length < 10) {
      errors.push(['details', 'Please add a little more detail (at least 10 characters).']);
    }

    Object.keys(fields).forEach((key) => {
      const found = errors.find(([field]) => field === key);
      setFieldError(key, found ? found[1] : '');
    });

    if (errors.length && summary) {
      summary.replaceChildren();
      const intro = document.createElement('p');
      intro.textContent = `Please check ${errors.length === 1 ? 'this field' : 'these fields'} before sending:`;
      const list = document.createElement('ul');
      errors.forEach(([key, message]) => {
        const li = document.createElement('li');
        const link = document.createElement('a');
        link.href = `#${fields[key].input.id}`;
        link.textContent = message;
        link.addEventListener('click', (event) => {
          event.preventDefault();
          fields[key].input.focus();
        });
        li.appendChild(link);
        list.appendChild(li);
      });
      summary.append(intro, list);
      summary.hidden = false;
      summary.focus();
    } else {
      clearSummary();
    }

    return errors.length === 0;
  }

  Object.entries(fields).forEach(([key, field]) => {
    if (!field.input) return;
    const handler = () => {
      setFieldError(key, '');
      if (summary && !summary.hidden) {
        const remaining = Object.entries(fields).some(([innerKey, innerField]) => {
          if (innerKey === key) return false;
          return innerField.input && innerField.input.getAttribute('aria-invalid') === 'true';
        });
        if (!remaining) clearSummary();
      }
    };
    field.input.addEventListener('input', handler);
    field.input.addEventListener('change', handler);
  });

  function showStatus(message, variant = '') {
    if (!statusEl) return;
    statusEl.textContent = message;
    statusEl.className = 'form-status';
    if (variant) statusEl.classList.add(`form-status--${variant}`);
    statusEl.hidden = false;
  }

  async function submitToEndpoint(payload) {
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 20000);
    try {
      const response = await fetch(SITE_CONFIG.formEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload),
        signal: controller.signal
      });
      return response.ok;
    } finally {
      window.clearTimeout(timeout);
    }
  }

  if (form) {
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      clearStatus();

      const honeypot = form.querySelector('[name="company-website"]');
      if (honeypot && honeypot.value) return;

      if (!validate()) return;

      const payload = {
        name: fields.name.input.value.trim(),
        email: fields.email.input.value.trim(),
        service: fields.service.input.value,
        message: fields.details.input.value.trim(),
        page: window.location.href
      };

      const endpointIsValid = /^https:\/\/\S+/.test(SITE_CONFIG.formEndpoint);

      if (!endpointIsValid) {
        showStatus(
          'This form is fully designed and validated, but message delivery has not been configured yet. Add an HTTPS form endpoint in assets/js/main.js to start receiving enquiries. Nothing has been sent.',
          'info'
        );
        return;
      }

      if (submitButton) {
        submitButton.disabled = true;
        submitButton.classList.add('is-loading');
      }
      showStatus('Sending your message…', 'info');

      try {
        const sent = await submitToEndpoint(payload);
        if (sent) {
          showStatus(
            `Thank you, ${payload.name}. Your message has been sent — I’ll be in touch as soon as possible.`
          );
          form.reset();
          Object.keys(fields).forEach((key) => setFieldError(key, ''));
          clearSummary();
        } else {
          showStatus(
            'The message could not be sent right now. Please try again in a moment or contact me directly.',
            'error'
          );
        }
      } catch (error) {
        showStatus(
          'The message could not be sent (the connection may have failed). Please try again, or contact me directly.',
          'error'
        );
      } finally {
        if (submitButton) {
          submitButton.disabled = false;
          submitButton.classList.remove('is-loading');
        }
        if (statusEl) {
          statusEl.focus?.({ preventScroll: true });
        }
      }
    });
  }

  /* -----------------------------------------------------------------------
     "Get in touch" shortcut: focus the first form field
     ----------------------------------------------------------------------- */
  const focusFormLink = $('[data-focus-form]');
  if (focusFormLink) {
    focusFormLink.addEventListener('click', () => {
      const firstField = $('#name');
      if (firstField) {
        window.setTimeout(() => firstField.focus({ preventScroll: true }), 650);
      }
    });
  }

  /* -----------------------------------------------------------------------
     Reduced motion changes at runtime
     ----------------------------------------------------------------------- */
  function handleMotionPreference() {
    if (prefersReducedMotion.matches) {
      revealItems.forEach((item) => item.classList.add('is-visible'));
    }
  }
  if (typeof prefersReducedMotion.addEventListener === 'function') {
    prefersReducedMotion.addEventListener('change', handleMotionPreference);
  }
})();
