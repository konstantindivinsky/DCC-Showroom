(() => {
  'use strict';

  // Indicative concept ranges (USD). These are demo assumptions, not contractor pricing.
  const ROOMS = {
    kitchen: { label: 'Kitchen', low: 25000, high: 75000 },
    bathroom: { label: 'Bathroom', low: 15000, high: 40000 },
    living: { label: 'Living Room', low: 10000, high: 30000 },
    bedroom: { label: 'Bedroom', low: 7000, high: 22000 },
    basement: { label: 'Basement', low: 30000, high: 85000 },
    garage: { label: 'Garage', low: 12000, high: 45000 },
    addition: { label: 'Addition', low: 50000, high: 150000 },
    whole: { label: 'Whole Home', low: 80000, high: 250000 }
  };
  const STYLES = {
    modern: { label: 'Modern', multiplier: 1 },
    transitional: { label: 'Transitional', multiplier: 1.08 },
    traditional: { label: 'Traditional', multiplier: 1.12 }
  };
  const PROJECTS = [
    { title: 'Kitchen Remodel', room: 'kitchen', img: 'assets/images/kitchen.webp', description: 'Warm wood cabinetry, a generous island, and statement pendant lighting bring a welcoming sense of balance to this kitchen concept.' },
    { title: 'Bathroom Upgrade', room: 'bathroom', img: 'assets/images/bathroom.webp', description: 'A walk-in shower, soft stone tile, and thoughtful storage create a clean, calming bathroom concept.' },
    { title: 'Basement Renovation', room: 'basement', img: 'assets/images/basement.webp', description: 'An open family room with layered lighting and an inviting media space makes the lower level feel like part of the home.' }
  ];

  const money = value => '$' + Math.round(value).toLocaleString('en-US');
  const rangeText = (low, high) => `${money(low)} – ${money(high)}`;
  const selectedRooms = new Set(['kitchen']);
  let style = 'modern';
  let budgetMin = 25;
  let budgetMax = 75;
  let brief = '';
  let galleryOrder = 0;

  const $ = selector => document.querySelector(selector);
  const $$ = selector => [...document.querySelectorAll(selector)];
  const minInput = $('#budgetMin');
  const maxInput = $('#budgetMax');
  const estimateText = $('#estimateRange');
  const estimateDialog = $('#estimateDialog');
  const projectDialog = $('#projectDialog');
  const leadForm = $('#leadForm');

  function getEstimate() {
    let low = 0;
    let high = 0;
    for (const key of selectedRooms) {
      low += ROOMS[key].low;
      high += ROOMS[key].high;
    }
    low = Math.round(low * STYLES[style].multiplier / 1000) * 1000;
    high = Math.round(high * STYLES[style].multiplier / 1000) * 1000;
    return { low, high };
  }

  function saveSelections() {
    try { sessionStorage.setItem('riverdale-demo-planner', JSON.stringify({ rooms: [...selectedRooms], style, budgetMin, budgetMax })); } catch (_) { /* Storage is optional. */ }
  }

  function render() {
    $$('.room-option').forEach(btn => {
      const selected = selectedRooms.has(btn.dataset.room);
      btn.classList.toggle('selected', selected);
      btn.setAttribute('aria-pressed', String(selected));
    });
    $$('.style-option').forEach(btn => {
      const selected = btn.dataset.style === style;
      btn.classList.toggle('selected', selected);
      btn.setAttribute('aria-pressed', String(selected));
    });
    minInput.value = budgetMin;
    maxInput.value = budgetMax;
    $('#budgetOutput').textContent = rangeText(budgetMin * 1000, budgetMax * 1000);
    $('#rangeFill').style.left = `${(budgetMin - 10) / 140 * 100}%`;
    $('#rangeFill').style.right = `${100 - (budgetMax - 10) / 140 * 100}%`;
    minInput.style.zIndex = budgetMin > 105 ? '5' : '3';
    const { low, high } = getEstimate();
    estimateText.textContent = rangeText(low, high);
    const advisory = $('#budgetAdvisory');
    if (budgetMax * 1000 < low) {
      advisory.textContent = 'Your preferred budget may be below this scope’s typical planning range. We can help prioritize options.';
      advisory.hidden = false;
    } else {
      advisory.hidden = true;
    }
    saveSelections();
  }

  function chooseSingleRoom(room) {
    selectedRooms.clear();
    selectedRooms.add(room);
    render();
    $('#planner').scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  }

  function restore() {
    try {
      const stored = JSON.parse(sessionStorage.getItem('riverdale-demo-planner') || 'null');
      if (!stored) return;
      if (Array.isArray(stored.rooms)) {
        const valid = stored.rooms.filter(key => Object.hasOwn(ROOMS, key));
        if (valid.length) {
          selectedRooms.clear();
          valid.forEach(key => selectedRooms.add(key));
        }
      }
      if (Object.hasOwn(STYLES, stored.style)) style = stored.style;
      if (Number.isFinite(stored.budgetMin)) budgetMin = Math.max(10, Math.min(145, stored.budgetMin));
      if (Number.isFinite(stored.budgetMax)) budgetMax = Math.max(budgetMin + 5, Math.min(150, stored.budgetMax));
    } catch (_) { /* Fall back to screenshot defaults. */ }
  }

  $$('.room-option').forEach(btn => btn.addEventListener('click', () => {
    const room = btn.dataset.room;
    if (selectedRooms.has(room)) {
      if (selectedRooms.size === 1) return; // At least one room must remain selected.
      selectedRooms.delete(room);
    } else if (room === 'whole') {
      selectedRooms.clear();
      selectedRooms.add(room);
    } else {
      selectedRooms.delete('whole');
      selectedRooms.add(room);
    }
    render();
  }));
  $$('.style-option').forEach(btn => btn.addEventListener('click', () => {
    style = btn.dataset.style;
    render();
  }));

  minInput.addEventListener('input', () => {
    budgetMin = Math.min(Number(minInput.value), budgetMax - 5);
    render();
  });
  maxInput.addEventListener('input', () => {
    budgetMax = Math.max(Number(maxInput.value), budgetMin + 5);
    render();
  });

  const menuToggle = $('#menuToggle');
  const nav = $('#primaryNav');
  function closeMenu() {
    nav.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Open navigation');
    menuToggle.querySelector('use').setAttribute('href', '#i-menu');
  }
  menuToggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    menuToggle.querySelector('use').setAttribute('href', open ? '#i-x' : '#i-menu');
  });
  const servicesToggle = $('#servicesToggle');
  const dropdown = $('.nav-dropdown');
  function closeDropdown() {
    dropdown.classList.remove('open');
    servicesToggle.setAttribute('aria-expanded', 'false');
  }
  servicesToggle.addEventListener('click', () => {
    const open = dropdown.classList.toggle('open');
    servicesToggle.setAttribute('aria-expanded', String(open));
  });
  nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    closeMenu();
    closeDropdown();
  }));
  document.addEventListener('click', event => {
    if (!dropdown.contains(event.target)) closeDropdown();
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') { closeMenu(); closeDropdown(); }
  });
  window.addEventListener('resize', () => {
    if (window.innerWidth > 1050) closeMenu();
  });

  $$('.service-card').forEach(btn => btn.addEventListener('click', () => chooseSingleRoom(btn.dataset.chooseRoom)));

  function renderGallery() {
    const track = $('#galleryTrack');
    const items = [...track.children];
    for (let n = 0; n < PROJECTS.length; n++) {
      const projectIndex = (galleryOrder + n) % PROJECTS.length;
      const item = items.find(el => Number(el.dataset.project) === projectIndex);
      track.appendChild(item);
    }
    const viewport = $('.gallery-window');
    if (viewport.scrollLeft !== 0) viewport.scrollTo({ left: 0, behavior: 'instant' });
  }
  $('#galleryPrev').addEventListener('click', () => { galleryOrder = (galleryOrder - 1 + PROJECTS.length) % PROJECTS.length; renderGallery(); });
  $('#galleryNext').addEventListener('click', () => { galleryOrder = (galleryOrder + 1) % PROJECTS.length; renderGallery(); });

  function openDialog(dialog) {
    if (typeof dialog.showModal === 'function') dialog.showModal();
    else dialog.setAttribute('open', '');
  }
  function closeDialog(dialog) {
    if (typeof dialog.close === 'function') dialog.close();
    else dialog.removeAttribute('open');
  }
  function openEstimate() {
    const rooms = [...selectedRooms].map(key => ROOMS[key].label);
    $('#modalSummaryText').textContent = `${rooms.join(', ')} · ${STYLES[style].label} · Preferred budget ${rangeText(budgetMin * 1000, budgetMax * 1000)}`;
    const { low, high } = getEstimate();
    $('#modalEstimate').textContent = rangeText(low, high);
    $('#briefResult').hidden = true;
    leadForm.hidden = false;
    $('#copyFeedback').textContent = '';
    openDialog(estimateDialog);
  }
  $$('[data-open-estimate]').forEach(btn => btn.addEventListener('click', openEstimate));
  $('#closeDialog').addEventListener('click', () => closeDialog(estimateDialog));
  estimateDialog.addEventListener('click', event => { if (event.target === estimateDialog) closeDialog(estimateDialog); });

  leadForm.addEventListener('submit', event => {
    event.preventDefault();
    if (!leadForm.reportValidity()) return;
    const data = new FormData(leadForm);
    const { low, high } = getEstimate();
    brief = [
      'RIVERDALE HOME RENOVATIONS | PROJECT BRIEF (SHOWROOM DEMO)',
      '--------------------------------------------------------',
      `Contact: ${String(data.get('name') || '').trim()}`,
      `Email: ${String(data.get('email') || '').trim()}`,
      `Phone: ${String(data.get('phone') || '').trim() || 'Not provided'}`,
      `ZIP code: ${String(data.get('zip') || '').trim() || 'Not provided'}`,
      '',
      `Renovation areas: ${[...selectedRooms].map(key => ROOMS[key].label).join(', ')}`,
      `Preferred style: ${STYLES[style].label}`,
      `Preferred budget: ${rangeText(budgetMin * 1000, budgetMax * 1000)}`,
      `Preliminary planning range: ${rangeText(low, high)}`,
      `Timeline: ${data.get('timeline')}`,
      `Project notes: ${String(data.get('notes') || '').trim() || 'None'}`,
      '',
      'This project brief was generated by a static showroom demonstration.',
      'No data was transmitted or submitted to a contractor.',
      'All cost ranges are illustrative and are not contractor quotations.'
    ].join('\n');
    $('#briefText').textContent = brief;
    leadForm.hidden = true;
    $('#briefResult').hidden = false;
    $('#briefResult').scrollIntoView({ block: 'nearest' });
  });
  $('#editBrief').addEventListener('click', () => {
    $('#briefResult').hidden = true;
    leadForm.hidden = false;
  });
  $('#copyBrief').addEventListener('click', async () => {
    let success = false;
    try {
      if (navigator.clipboard && window.isSecureContext) { await navigator.clipboard.writeText(brief); success = true; }
    } catch (_) { /* Fallback below. */ }
    if (!success) {
      const text = document.createElement('textarea');
      text.value = brief;
      text.style.position = 'fixed'; text.style.opacity = '0';
      document.body.appendChild(text); text.focus(); text.select();
      try { success = document.execCommand('copy'); } catch (_) { success = false; }
      text.remove();
    }
    $('#copyFeedback').textContent = success ? 'Project brief copied.' : 'Copy unavailable in this browser. You can download the brief instead.';
  });
  $('#downloadBrief').addEventListener('click', () => {
    const file = new Blob([brief], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(file);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'riverdale-project-brief.txt';
    document.body.appendChild(link);
    link.click(); link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  });

  $$('.work-card').forEach(card => card.addEventListener('click', () => {
    const item = PROJECTS[Number(card.dataset.project)];
    $('#projectTitle').textContent = item.title;
    $('#projectDescription').textContent = item.description;
    $('#projectImage').src = item.img;
    $('#projectImage').alt = item.title + ' inspirational photograph';
    $('#planSimilar').dataset.room = item.room;
    openDialog(projectDialog);
  }));
  $('#closeProject').addEventListener('click', () => closeDialog(projectDialog));
  projectDialog.addEventListener('click', event => { if (event.target === projectDialog) closeDialog(projectDialog); });
  $('#planSimilar').addEventListener('click', event => {
    const room = event.currentTarget.dataset.room;
    closeDialog(projectDialog);
    chooseSingleRoom(room);
  });

  restore();
  render();
})();

