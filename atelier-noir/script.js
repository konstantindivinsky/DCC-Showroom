(() => {
  'use strict';
  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));
  $('#year').textContent = new Date().getFullYear();

  // Mobile navigation is an actual navigable menu, not a cosmetic overlay.
  const navToggle = $('#nav-toggle');
  const nav = $('#site-nav');
  function closeNav() {
    nav.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', 'Open navigation');
  }
  navToggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
    navToggle.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
  });
  $$('#site-nav a').forEach(link => link.addEventListener('click', closeNav));
  document.addEventListener('keydown', event => { if (event.key === 'Escape') closeNav(); });
  document.addEventListener('click', event => {
    if (!nav.contains(event.target) && !navToggle.contains(event.target)) closeNav();
  });

  // Date inputs are constrained to today or later in the visitor's local time.
  function localISODate(date) {
    return [date.getFullYear(), String(date.getMonth() + 1).padStart(2, '0'), String(date.getDate()).padStart(2, '0')].join('-');
  }
  const today = localISODate(new Date());
  $('#quick-date').min = today;
  $('#booking-date').min = today;
  const quickForm = $('#quick-reservation');
  const bookingDialog = $('#booking-dialog');
  const bookingForm = $('#booking-form');
  const bookingContent = $('#booking-content');
  const confirmation = $('#booking-confirmation');
  let bookingLaunchControl = null;

  function openBooking(launcher, useQuickValues = false) {
    closeNav();
    bookingLaunchControl = launcher || document.activeElement;
    bookingContent.hidden = false;
    confirmation.hidden = true;
    if (useQuickValues) {
      $('#booking-date').value = $('#quick-date').value;
      $('#booking-guests').value = $('#quick-guests').value;
    }
    if (typeof bookingDialog.showModal === 'function') bookingDialog.showModal();
    else bookingDialog.setAttribute('open', '');
  }
  function closeBooking() {
    if (typeof bookingDialog.close === 'function') bookingDialog.close();
    else bookingDialog.removeAttribute('open');
    if (bookingLaunchControl && typeof bookingLaunchControl.focus === 'function') bookingLaunchControl.focus();
  }
  quickForm.addEventListener('submit', event => {
    event.preventDefault();
    if (!quickForm.reportValidity()) return;
    openBooking(quickForm.querySelector('button[type="submit"]'), true);
  });
  $$('[data-open-booking]').forEach(button => button.addEventListener('click', () => openBooking(button)));
  $$('[data-close-booking]').forEach(button => button.addEventListener('click', closeBooking));
  bookingDialog.addEventListener('click', event => {
    if (event.target === bookingDialog) closeBooking();
  });
  bookingForm.addEventListener('submit', event => {
    event.preventDefault();
    if (!bookingForm.reportValidity()) return;
    const data = new FormData(bookingForm);
    const date = new Date(`${data.get('date')}T12:00:00`);
    const dateLabel = Number.isNaN(date.getTime()) ? String(data.get('date')) : new Intl.DateTimeFormat(undefined, { month: 'long', day: 'numeric', year: 'numeric' }).format(date);
    const guests = Number(data.get('guests'));
    const firstName = String(data.get('name')).trim().split(/\s+/)[0];
    // textContent keeps form-entered text inert, with no HTML injection.
    $('#booking-summary').textContent = `${firstName}, your preview request is for ${guests} ${guests === 1 ? 'guest' : 'guests'} on ${dateLabel} at ${data.get('time')}.`;
    bookingContent.hidden = true;
    confirmation.hidden = false;
    $('.booking-confirmation .gold-button').focus();
  });

  // Accessible keyboard-aware sample menu tabs.
  const menuTabs = $$('[data-menu-tab]');
  function selectMenu(key, focus = false) {
    menuTabs.forEach(tab => {
      const active = tab.dataset.menuTab === key;
      tab.setAttribute('aria-selected', String(active));
      tab.tabIndex = active ? 0 : -1;
      if (focus && active) tab.focus();
    });
    $$('.menu-panel').forEach(panel => { panel.hidden = panel.id !== `panel-${key}`; });
  }
  menuTabs.forEach((tab, index) => {
    tab.addEventListener('click', () => selectMenu(tab.dataset.menuTab));
    tab.addEventListener('keydown', event => {
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      let next = index;
      if (event.key === 'ArrowRight') next = (index + 1) % menuTabs.length;
      if (event.key === 'ArrowLeft') next = (index - 1 + menuTabs.length) % menuTabs.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = menuTabs.length - 1;
      selectMenu(menuTabs[next].dataset.menuTab, true);
    });
  });

  // Image gallery opens and navigates locally, with keyboard controls.
  const galleryData = [
    { src: 'assets/interior.webp', alt: 'Warmly lit tables inside a private dining room', caption: 'A room designed for lingering.' },
    { src: 'assets/truffles.webp', alt: 'Black truffles on a neutral stone surface', caption: 'The quiet beauty of a single ingredient.' },
    { src: 'assets/radicchio.webp', alt: 'Deep magenta leaves of seasonal radicchio', caption: 'Color, texture, and the turning season.' },
    { src: 'assets/wine.webp', alt: 'Red wine being poured into a glass', caption: 'Every detail, considered.' }
  ];
  const galleryDialog = $('#gallery-dialog');
  let galleryIndex = 0;
  let galleryLauncher = null;
  function showGallery(index) {
    galleryIndex = (index + galleryData.length) % galleryData.length;
    const entry = galleryData[galleryIndex];
    $('#gallery-large').src = entry.src;
    $('#gallery-large').alt = entry.alt;
    $('#gallery-caption').textContent = entry.caption;
    $('#gallery-count').textContent = `${galleryIndex + 1} / ${galleryData.length}`;
  }
  $$('[data-gallery]').forEach(button => button.addEventListener('click', () => {
    galleryLauncher = button;
    showGallery(Number(button.dataset.gallery));
    galleryDialog.showModal();
  }));
  function closeGallery() {
    galleryDialog.close();
    if (galleryLauncher) galleryLauncher.focus();
  }
  $('#gallery-close').addEventListener('click', closeGallery);
  $('#gallery-previous').addEventListener('click', () => showGallery(galleryIndex - 1));
  $('#gallery-next').addEventListener('click', () => showGallery(galleryIndex + 1));
  galleryDialog.addEventListener('click', event => { if (event.target === galleryDialog) closeGallery(); });
  galleryDialog.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft') { event.preventDefault(); showGallery(galleryIndex - 1); }
    if (event.key === 'ArrowRight') { event.preventDefault(); showGallery(galleryIndex + 1); }
  });
})();