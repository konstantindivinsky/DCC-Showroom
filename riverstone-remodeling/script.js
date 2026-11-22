(() => {
  'use strict';
  document.getElementById('year').textContent = String(new Date().getFullYear());

  // Mobile menu: close on navigation, Escape, and desktop resize.
  const mobileToggle = document.querySelector('.mobile-nav-toggle');
  const mobileNav = document.getElementById('mobile-nav');
  function closeMobile() {
    mobileNav.hidden = true;
    mobileToggle.setAttribute('aria-expanded', 'false');
    mobileToggle.setAttribute('aria-label', 'Open navigation');
    mobileToggle.innerHTML = '<svg class="icon"><use href="#i-menu"/></svg>';
  }
  mobileToggle.addEventListener('click', () => {
    const shouldOpen = mobileNav.hidden;
    mobileNav.hidden = !shouldOpen;
    mobileToggle.setAttribute('aria-expanded', String(shouldOpen));
    mobileToggle.setAttribute('aria-label', shouldOpen ? 'Close navigation' : 'Open navigation');
    mobileToggle.innerHTML = `<svg class="icon"><use href="#i-${shouldOpen ? 'x' : 'menu'}"/></svg>`;
  });
  mobileNav.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMobile));
  window.addEventListener('resize', () => { if (window.innerWidth > 1060) closeMobile(); });

  // Remodeling Services dropdown with outside-click dismissal.
  const dropBtn = document.querySelector('.nav-drop-toggle');
  const dropPanel = document.querySelector('.nav-drop-panel');
  function closeDrop() { dropPanel.classList.remove('open'); dropBtn.setAttribute('aria-expanded', 'false'); }
  dropBtn.addEventListener('click', () => {
    const open = dropPanel.classList.toggle('open');
    dropBtn.setAttribute('aria-expanded', String(open));
  });
  dropPanel.querySelectorAll('a').forEach(a => a.addEventListener('click', closeDrop));
  document.addEventListener('pointerdown', ev => { if (!ev.target.closest('.nav-drop')) closeDrop(); });
  document.addEventListener('keydown', ev => { if (ev.key === 'Escape') { closeMobile(); closeDrop(); } });

  // Accessible before/after interaction: drag, click, arrows, Home and End.
  const comparison = document.getElementById('comparison');
  const handle = document.getElementById('comparison-handle');
  const before = comparison.querySelector('.compare-before');
  let split = 50;
  let dragging = false;
  function setSplit(value) {
    split = Math.max(5, Math.min(95, value));
    comparison.style.setProperty('--split', `${split}%`);
    handle.setAttribute('aria-valuenow', String(Math.round(split)));
    handle.setAttribute('aria-valuetext', `${Math.round(split)} percent before photo`);
  }
  function syncComparisonWidth() {
    before.style.width = `${comparison.getBoundingClientRect().width}px`;
  }
  function pointerSplit(ev) {
    const rect = comparison.getBoundingClientRect();
    setSplit((ev.clientX - rect.left) / rect.width * 100);
  }
  comparison.addEventListener('pointerdown', ev => {
    if (ev.pointerType === 'mouse' && ev.button !== 0) return;
    dragging = true;
    comparison.setPointerCapture(ev.pointerId);
    pointerSplit(ev);
  });
  comparison.addEventListener('pointermove', ev => { if (dragging) pointerSplit(ev); });
  comparison.addEventListener('pointerup', () => { dragging = false; });
  comparison.addEventListener('pointercancel', () => { dragging = false; });
  handle.addEventListener('keydown', ev => {
    let next = split;
    if (ev.key === 'ArrowLeft' || ev.key === 'ArrowDown') next -= ev.shiftKey ? 10 : 5;
    else if (ev.key === 'ArrowRight' || ev.key === 'ArrowUp') next += ev.shiftKey ? 10 : 5;
    else if (ev.key === 'Home') next = 5;
    else if (ev.key === 'End') next = 95;
    else return;
    ev.preventDefault();
    setSplit(next);
  });
  window.addEventListener('resize', syncComparisonWidth);
  syncComparisonWidth();
  setSplit(50);

  // This showroom uses a local summary preview, not an actual form submission.
  const dialog = document.getElementById('project-dialog');
  const form = document.getElementById('project-form');
  const result = document.getElementById('form-result');
  const serviceSelect = document.getElementById('form-service');
  const summary = document.getElementById('project-summary');
  const feedback = document.getElementById('copy-feedback');
  function openProject(service = '') {
    if (service) serviceSelect.value = service;
    if (!dialog.open) dialog.showModal();
    closeMobile(); closeDrop();
  }
  document.querySelectorAll('.open-project').forEach(button => {
    button.addEventListener('click', () => openProject());
  });
  document.querySelectorAll('[data-service]').forEach(button => {
    button.addEventListener('click', () => openProject(button.dataset.service));
  });
  document.querySelectorAll('[data-service-target]').forEach(link => {
    link.addEventListener('click', () => {
      document.querySelectorAll('.service-card').forEach(card => card.classList.toggle('service-highlight', card.dataset.service === link.dataset.serviceTarget));
    });
  });
  document.getElementById('close-dialog').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', ev => { if (ev.target === dialog) dialog.close(); });
  dialog.addEventListener('close', () => {
    form.reset(); form.hidden = false; result.hidden = true;
    summary.textContent = ''; feedback.textContent = '';
  });
  form.addEventListener('submit', ev => {
    ev.preventDefault();
    if (!form.reportValidity()) return;
    const details = new FormData(form);
    const fields = [
      ['Name', 'name'], ['Email', 'email'], ['Phone', 'phone'], ['City', 'city'],
      ['Project type', 'service'], ['Timing', 'timeline'], ['Project notes', 'details']
    ];
    summary.textContent = 'RIVERSTONE PROJECT REQUEST (DEMO)\n\n' + fields.map(([label, field]) => `${label}: ${String(details.get(field) || 'Not provided').trim()}`).join('\n');
    form.hidden = true;
    result.hidden = false;
    feedback.textContent = '';
    dialog.scrollTo({top:0,behavior:'smooth'});
  });
  document.getElementById('edit-request').addEventListener('click', () => {
    result.hidden = true;
    form.hidden = false;
  });
  document.getElementById('copy-summary').addEventListener('click', async () => {
    const value = summary.textContent;
    try {
      if (navigator.clipboard && window.isSecureContext) await navigator.clipboard.writeText(value);
      else {
        const temp = document.createElement('textarea'); temp.value = value;
        temp.style.position = 'fixed'; temp.style.opacity = '0';
        document.body.appendChild(temp); temp.select();
        const copied = document.execCommand('copy'); temp.remove();
        if (!copied) throw new Error('Copy unavailable');
      }
      feedback.textContent = 'Summary copied to clipboard.';
    } catch (_) {
      feedback.textContent = 'Copy not available in this browser. Select the summary text above to copy.';
    }
  });
})();
