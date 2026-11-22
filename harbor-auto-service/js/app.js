(() => {
  'use strict';
  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => Array.from(document.querySelectorAll(selector));
  const serviceNames = {
    oil: 'Oil Change & Maintenance', brakes: 'Brake Service', engine: 'Engine Diagnostics',
    battery: 'Battery & Electrical', tires: 'Tires & Alignment', climate: 'Heating & A/C Service',
    repair: 'General Repair'
  };

  const serviceSelect = $('#service-select');
  const dateInput = $('#preferred-date');
  const timeSelect = $('#preferred-time');
  const bookingForm = $('#booking-form');
  const feedback = $('#form-feedback');
  const dialog = $('#booking-dialog');
  const summary = $('#booking-summary');
  let detailsText = '';

  // Calculate local calendar date without UTC timezone shifts.
  function localISODate(date) {
    const pad = (n) => String(n).padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
  }

  function formatDate(dateString) {
    const [y, m, d] = dateString.split('-').map(Number);
    return new Date(y, m - 1, d).toLocaleDateString('en-US', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });
  }

  function timeLabel(minutes) {
    const hours24 = Math.floor(minutes / 60);
    const minutesPart = minutes % 60;
    return `${hours24 % 12 || 12}:${String(minutesPart).padStart(2, '0')} ${hours24 >= 12 ? 'PM' : 'AM'}`;
  }

  const today = localISODate(new Date());
  dateInput.min = today;
  dateInput.setAttribute('aria-describedby', 'form-feedback');

  function buildTimeSlots() {
    const previous = timeSelect.value;
    timeSelect.replaceChildren(new Option('Preferred Time', ''));
    if (!dateInput.value) return;
    const [year, month, day] = dateInput.value.split('-').map(Number);
    const weekday = new Date(year, month - 1, day).getDay();
    if (weekday === 0) {
      timeSelect.add(new Option('Closed Sundays', '', true, true));
      feedback.textContent = 'The shop is closed on Sundays. Please choose another date.';
      return;
    }
    if (feedback.textContent.includes('closed on Sundays')) feedback.textContent = '';
    const end = weekday === 6 ? 13 * 60 : 17 * 60 + 30;
    for (let mins = 8 * 60; mins < end; mins += 30) {
      const label = timeLabel(mins);
      timeSelect.add(new Option(label, label));
    }
    if ([...timeSelect.options].some(option => option.value === previous)) timeSelect.value = previous;
  }
  dateInput.addEventListener('change', buildTimeSlots);

  function selectService(id, scroll = true) {
    if (!serviceNames[id]) return;
    serviceSelect.value = id;
    $$('.service-tile').forEach((tile) => {
      const active = tile.dataset.service === id;
      tile.classList.toggle('is-selected', active);
      tile.setAttribute('aria-pressed', String(active));
    });
    feedback.textContent = `${serviceNames[id]} selected. Choose your preferred date and time.`;
    if (scroll) {
      $('#book').scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'center' });
      window.setTimeout(() => dateInput.focus({ preventScroll: true }), 350);
    }
  }
  $$('.service-tile').forEach(tile => {
    tile.setAttribute('aria-pressed', 'false');
    tile.addEventListener('click', () => selectService(tile.dataset.service));
  });
  serviceSelect.addEventListener('change', () => {
    $$('.service-tile').forEach(tile => {
      const active = tile.dataset.service === serviceSelect.value;
      tile.classList.toggle('is-selected', active);
      tile.setAttribute('aria-pressed', String(active));
    });
    feedback.textContent = '';
  });

  const dropdownButton = $('#services-menu-button');
  const dropdown = $('#services-menu');
  function closeDropdown() { dropdown.hidden = true; dropdownButton.setAttribute('aria-expanded', 'false'); }
  dropdownButton.addEventListener('click', () => {
    dropdown.hidden = !dropdown.hidden;
    dropdownButton.setAttribute('aria-expanded', String(!dropdown.hidden));
  });
  document.addEventListener('click', (event) => { if (!event.target.closest('.nav-services')) closeDropdown(); });
  $$('.dropdown a[data-service-link]').forEach(link => link.addEventListener('click', event => {
    event.preventDefault();
    closeDropdown();
    selectService(link.dataset.serviceLink);
  }));
  $$('.dropdown a').forEach(link => link.addEventListener('click', closeDropdown));

  const menuToggle = $('#menu-toggle');
  const mobileNav = $('#mobile-nav');
  function closeMobileNav() { mobileNav.hidden = true; menuToggle.setAttribute('aria-expanded', 'false'); menuToggle.setAttribute('aria-label', 'Open navigation menu'); menuToggle.querySelector('use').setAttribute('href', '#i-menu'); }
  menuToggle.addEventListener('click', () => {
    const isOpen = mobileNav.hidden;
    mobileNav.hidden = !isOpen;
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    menuToggle.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');
    menuToggle.querySelector('use').setAttribute('href', isOpen ? '#i-close' : '#i-menu');
  });
  $$('.mobile-nav a').forEach(link => link.addEventListener('click', closeMobileNav));
  window.addEventListener('resize', () => { if (window.innerWidth > 850) closeMobileNav(); });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') { closeDropdown(); closeMobileNav(); }
  });

  const pricingButton = $('#full-pricing-button');
  const pricingSection = $('#full-pricing');
  pricingButton.addEventListener('click', () => {
    const expand = pricingSection.hidden;
    pricingSection.hidden = !expand;
    pricingButton.setAttribute('aria-expanded', String(expand));
    pricingButton.firstChild.textContent = expand ? 'HIDE FULL SERVICE PRICING ' : 'VIEW FULL SERVICE PRICING ';
    if (expand) pricingSection.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
  });

  bookingForm.addEventListener('submit', event => {
    event.preventDefault();
    const service = serviceNames[serviceSelect.value];
    if (!service) { feedback.textContent = 'Please select the service you need.'; serviceSelect.focus(); return; }
    if (!dateInput.value || dateInput.value < localISODate(new Date())) { feedback.textContent = 'Please choose an upcoming date.'; dateInput.focus(); return; }
    const [year, month, day] = dateInput.value.split('-').map(Number);
    if (new Date(year, month - 1, day).getDay() === 0) { feedback.textContent = 'The shop is closed on Sundays. Please choose another date.'; dateInput.focus(); return; }
    if (!timeSelect.value) { feedback.textContent = 'Please choose a preferred time.'; timeSelect.focus(); return; }
    const date = formatDate(dateInput.value);
    const time = timeSelect.value;
    detailsText = `Harbor Auto Service | Demo appointment request\nService: ${service}\nPreferred date: ${date}\nPreferred time: ${time}\n\nDemo only. No appointment has been submitted or reserved.`;
    const values = [['Service', service], ['Date', date], ['Time', time], ['Status', 'Preview only, not submitted']];
    summary.replaceChildren();
    values.forEach(([label, value]) => {
      const dt = document.createElement('dt'); dt.textContent = label;
      const dd = document.createElement('dd'); dd.textContent = value;
      summary.append(dt, dd);
    });
    feedback.textContent = '';
    $('#copy-feedback').textContent = '';
    if (typeof dialog.showModal === 'function') dialog.showModal(); else dialog.setAttribute('open', '');
  });
  function closeDialog() { dialog.close(); }
  $('#close-dialog').addEventListener('click', closeDialog);
  $('#edit-booking').addEventListener('click', () => { closeDialog(); serviceSelect.focus(); });
  dialog.addEventListener('click', event => { if (event.target === dialog) closeDialog(); });
  $('#copy-summary').addEventListener('click', async () => {
    try {
      if (navigator.clipboard && window.isSecureContext) await navigator.clipboard.writeText(detailsText);
      else {
        const textarea = document.createElement('textarea');
        textarea.value = detailsText;
        textarea.style.position = 'fixed'; textarea.style.opacity = '0';
        document.body.append(textarea); textarea.select();
        const ok = document.execCommand('copy'); textarea.remove();
        if (!ok) throw new Error('Clipboard unavailable');
      }
      $('#copy-feedback').textContent = 'Request details copied. This is not a confirmed appointment.';
    } catch {
      $('#copy-feedback').textContent = 'Clipboard unavailable here. You can select and copy the details above.';
    }
  });
})();
