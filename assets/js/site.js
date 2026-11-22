(() => {
  'use strict';

  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];
  const menuButton = $('#menu-toggle');
  const mobileMenu = $('#mobile-menu');
  const bookingDialog = $('#booking-dialog');
  const buildDialog = $('#build-dialog');
  const inquiryForm = $('#inquiry-form');
  const bookingForm = $('#booking-form');
  const serviceSelect = $('[name="service"]', inquiryForm);

  $('#year').textContent = String(new Date().getFullYear());

  function setMenu(open) {
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    mobileMenu.classList.toggle('is-open', open);
    mobileMenu.inert = !open;
    document.body.classList.toggle('menu-open', open);
  }
  menuButton.addEventListener('click', () => setMenu(menuButton.getAttribute('aria-expanded') !== 'true'));
  $$('a, button', mobileMenu).forEach(el => el.addEventListener('click', () => setMenu(false)));

  $$('.nav-trigger').forEach(trigger => {
    trigger.addEventListener('click', event => {
      event.stopPropagation();
      const parent = trigger.closest('.nav-dropdown');
      const wasOpen = parent.classList.contains('is-open');
      $$('.nav-dropdown').forEach(d => { d.classList.remove('is-open'); $('.nav-trigger', d).setAttribute('aria-expanded', 'false'); });
      parent.classList.toggle('is-open', !wasOpen);
      trigger.setAttribute('aria-expanded', String(!wasOpen));
    });
  });
  document.addEventListener('click', event => {
    if (!event.target.closest('.nav-dropdown')) {
      $$('.nav-dropdown').forEach(d => { d.classList.remove('is-open'); $('.nav-trigger', d).setAttribute('aria-expanded', 'false'); });
    }
  });
  document.addEventListener('keydown', event => {
    if (event.key !== 'Escape') return;
    setMenu(false);
    $$('.nav-dropdown').forEach(d => { d.classList.remove('is-open'); $('.nav-trigger', d).setAttribute('aria-expanded', 'false'); });
  });

  function openDialog(dialog) {
    if (dialog.open) return;
    dialog.showModal();
    document.body.classList.add('dialog-open');
  }
  [bookingDialog, buildDialog].forEach(dialog => {
    dialog.addEventListener('close', () => document.body.classList.remove('dialog-open'));
    dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
    $$('[data-close-dialog]', dialog).forEach(button => button.addEventListener('click', () => dialog.close()));
  });

  $$('[data-open-booking]').forEach(button => button.addEventListener('click', () => openDialog(bookingDialog)));

  // Selecting a package fills out the real HTML form, rather than being a dead-end button.
  $$('[data-package]').forEach(button => {
    button.addEventListener('click', () => {
      const packageName = button.dataset.package;
      const found = [...serviceSelect.options].find(option => option.value === packageName);
      if (found) serviceSelect.value = packageName;
      if (buildDialog.open) buildDialog.close();
      if (bookingDialog.open) bookingDialog.close();
      setMenu(false);
      $('#contact').scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
      window.setTimeout(() => $('#inquiry-form [name="name"]').focus({ preventScroll: true }), 320);
    });
  });

  const allButton = $('#view-all-builds');
  allButton.addEventListener('click', () => {
    const expanded = allButton.getAttribute('aria-expanded') === 'true';
    $('#extra-builds').hidden = expanded;
    allButton.setAttribute('aria-expanded', String(!expanded));
    allButton.innerHTML = expanded ? 'VIEW ALL BUILDS <span aria-hidden="true">→</span>' : 'SHOW LESS <span aria-hidden="true">↑</span>';
  });

  const buildInfo = {
    mustang: { name: 'MUSTANG GT', image: 'assets/img/mustang.webp', alt: 'Blue Ford Mustang GT', power: '+412 HP', focus: 'STREET / TRACK', description: 'A muscular street-to-circuit concept built around confident throttle response, stronger midrange pull and repeatable performance when it matters.' },
    supra: { name: 'GR SUPRA', image: 'assets/img/supra.webp', alt: 'White Toyota GR Supra', power: '+528 HP', focus: 'POWER / FLOW', description: 'A focused six-cylinder performance concept combining calibration, airflow and heat management for a balanced, responsive package.' },
    gtr: { name: 'GT-R R35', image: 'assets/img/gtr.webp', alt: 'Purple Nissan GT-R R35', power: '+720 HP', focus: 'HIGH OUTPUT', description: 'A bold high-output concept with upgraded supporting hardware, careful calibration and a commitment to usable, controlled power.' },
    wrx: { name: 'WRX STI', image: 'assets/img/wrx.webp', alt: 'Light blue Subaru WRX STI', power: '+382 HP', focus: 'GRIP / RESPONSE', description: 'An all-wheel-drive concept pairing sharp engine response with a versatile setup for winding roads and weekend motorsport.' }
  };
  $$('[data-build]').forEach(card => card.addEventListener('click', () => {
    const item = buildInfo[card.dataset.build];
    if (!item) return;
    $('#build-dialog-title').textContent = item.name;
    $('#build-dialog-image').src = item.image;
    $('#build-dialog-image').alt = item.alt;
    $('#build-dialog-description').textContent = item.description;
    $('#build-dialog-power').textContent = item.power;
    $('#build-dialog-focus').textContent = item.focus;
    openDialog(buildDialog);
  }));

  async function copyText(value, button) {
    const original = button.textContent;
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(value);
      } else {
        const temp = document.createElement('textarea');
        temp.value = value;
        temp.style.position = 'fixed';
        temp.style.opacity = '0';
        document.body.append(temp);
        temp.select();
        if (!document.execCommand('copy')) throw new Error('Copy failed');
        temp.remove();
      }
      button.textContent = 'COPIED ✓';
    } catch {
      button.textContent = 'SELECT TEXT ABOVE TO COPY';
    }
    window.setTimeout(() => { button.textContent = original; }, 2700);
  }

  inquiryForm.addEventListener('submit', event => {
    event.preventDefault();
    if (!inquiryForm.reportValidity()) return;
    const data = new FormData(inquiryForm);
    const summary = ['APEX MOTORSPORTS - CONCEPT INQUIRY', `Name: ${data.get('name')}`, `Email: ${data.get('email')}`, `Vehicle: ${data.get('vehicle')}`, `Service: ${data.get('service')}`, `Goals: ${data.get('goals') || 'Not provided'}`].join('\n');
    $('#inquiry-summary').textContent = summary;
    $('#form-result').hidden = false;
    $('#form-result').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });
  $('#copy-inquiry').addEventListener('click', event => copyText($('#inquiry-summary').textContent, event.currentTarget));

  // Use the browser's local date, not a hard-coded calendar date.
  const now = new Date();
  const localToday = [now.getFullYear(), String(now.getMonth() + 1).padStart(2,'0'), String(now.getDate()).padStart(2,'0')].join('-');
  const bookingDate = $('[name="date"]', bookingForm);
  bookingDate.min = localToday;
  bookingDate.value = localToday;
  let bookingText = '';
  bookingForm.addEventListener('submit', event => {
    event.preventDefault();
    if (!bookingForm.reportValidity()) return;
    const data = new FormData(bookingForm);
    const date = new Date(`${data.get('date')}T12:00:00`);
    const dateLabel = Number.isNaN(date.getTime()) ? String(data.get('date')) : date.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    const time = $('[name="time"]', bookingForm);
    const timeLabel = time.options[time.selectedIndex].text;
    bookingText = `APEX MOTORSPORTS - DEMO SESSION REQUEST\nSession: ${data.get('session')}\nPreferred date: ${dateLabel}\nPreferred time: ${timeLabel}\nVehicle: ${data.get('vehicle')}`;
    $('#booking-summary').textContent = `${data.get('session')} · ${dateLabel} at ${timeLabel} · ${data.get('vehicle')}`;
    $('#booking-result').hidden = false;
    $('#booking-result').scrollIntoView({ behavior:'smooth', block:'nearest' });
  });
  $('#copy-booking').addEventListener('click', event => copyText(bookingText, event.currentTarget));

  // Keep the current navigation marker meaningful as the user scrolls.
  if ('IntersectionObserver' in window && matchMedia('(min-width: 800px)').matches) {
    const navLinks = $$('.desktop-nav a.nav-link');
    const sectionIds = ['home','tuning','builds','services','about','contact'];
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        navLinks.forEach(link => link.classList.toggle('is-active', link.getAttribute('href') === `#${entry.target.id}`));
      });
    }, {rootMargin:'-25% 0px -65% 0px'});
    sectionIds.forEach(id => { const el = document.getElementById(id); if (el) observer.observe(el); });
  }
})();
