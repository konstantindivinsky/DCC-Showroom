'use strict';

const menuToggle = document.querySelector('#menuToggle');
const siteNav = document.querySelector('#siteNav');
const scheduleDialog = document.querySelector('#scheduleDialog');
const compareDialog = document.querySelector('#compareDialog');
const bookingForm = document.querySelector('#bookingForm');
const requestResult = document.querySelector('#requestResult');
const requestSummary = document.querySelector('#requestSummary');
const copyStatus = document.querySelector('#copyStatus');
const requestedService = document.querySelector('#requestedService');
const selectedPlan = document.querySelector('#selectedPlan');

// Use a menu that works with touch, mouse, keyboard and Escape.
function closeMenu() {
  siteNav.classList.remove('is-open');
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-label', 'Open navigation');
}
menuToggle.addEventListener('click', () => {
  const isOpen = siteNav.classList.toggle('is-open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
  menuToggle.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
});
siteNav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape') closeMenu();
});
document.addEventListener('click', event => {
  if (event.target.closest('.nav-dropdown')) return;
  document.querySelectorAll('.nav-dropdown[open]').forEach(dropdown => { dropdown.open = false; });
});

const today = new Date();
const localDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
document.querySelector('#bookingDate').min = localDate;
document.querySelector('#year').textContent = String(today.getFullYear());

function openDialog(dialog) {
  closeMenu();
  if (typeof dialog.showModal === 'function') dialog.showModal();
  else dialog.setAttribute('open', '');
}
function closeDialog(dialog) {
  if (typeof dialog.close === 'function') dialog.close();
  else dialog.removeAttribute('open');
}

function openSchedule({ service = '', plan = '' } = {}) {
  bookingForm.hidden = false;
  requestResult.hidden = true;
  copyStatus.textContent = '';
  if (service) requestedService.value = service;
  if (plan) {
    selectedPlan.value = plan;
    requestedService.value = 'Maintenance plan consultation';
  }
  openDialog(scheduleDialog);
}
document.querySelectorAll('[data-open-schedule]').forEach(button => {
  button.addEventListener('click', () => openSchedule({ service: button.dataset.service || '' }));
});
document.querySelectorAll('[data-select-plan]').forEach(button => {
  button.addEventListener('click', () => openSchedule({ plan: button.dataset.selectPlan }));
});
document.querySelector('#compareTrigger').addEventListener('click', () => openDialog(compareDialog));
document.querySelectorAll('[data-compare-select]').forEach(button => {
  button.addEventListener('click', () => {
    closeDialog(compareDialog);
    openSchedule({ plan: button.dataset.compareSelect });
  });
});
document.querySelectorAll('[data-close-dialog]').forEach(button => {
  button.addEventListener('click', () => closeDialog(button.closest('dialog')));
});
[scheduleDialog, compareDialog].forEach(dialog => {
  dialog.addEventListener('click', event => { if (event.target === dialog) closeDialog(dialog); });
});

// Display one easy-to-read plan on phones, all three plans on desktop.
const planTabs = document.querySelectorAll('[data-plan-tab]');
const planCards = document.querySelectorAll('[data-plan]');
planTabs.forEach(tab => tab.addEventListener('click', () => {
  const activePlan = tab.dataset.planTab;
  planTabs.forEach(button => {
    const active = button === tab;
    button.classList.toggle('active', active);
    button.setAttribute('aria-pressed', String(active));
  });
  planCards.forEach(card => card.classList.toggle('active', card.dataset.plan === activePlan));
}));

bookingForm.addEventListener('submit', event => {
  event.preventDefault();
  if (!bookingForm.reportValidity()) return;
  const form = new FormData(bookingForm);
  const lines = [
    'FLEETLINE SERVICE CO. - DEMO REQUEST',
    'This is an example only. No request has been sent.',
    '',
    `Contact: ${form.get('name')}`,
    `Company: ${form.get('company')}`,
    `Phone: ${form.get('phone')}`,
    `Fleet size: ${form.get('fleet')}`,
    `Service: ${form.get('service')}`,
    `Preferred date: ${form.get('date') || 'Not specified'}`,
    ...(form.get('plan') ? [`Plan: ${form.get('plan')}`] : []),
    `Additional details: ${form.get('notes') || 'None'}`
  ];
  requestSummary.textContent = lines.join('\n');
  bookingForm.hidden = true;
  requestResult.hidden = false;
  document.querySelector('#copyRequest').focus();
});

document.querySelector('#copyRequest').addEventListener('click', async () => {
  const text = requestSummary.textContent;
  try {
    if (!navigator.clipboard?.writeText) throw new Error('Clipboard API unavailable');
    await navigator.clipboard.writeText(text);
    copyStatus.textContent = 'Request summary copied.';
  } catch {
    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(requestSummary);
    selection.removeAllRanges();
    selection.addRange(range);
    copyStatus.textContent = 'Summary selected. Use Copy in your browser.';
  }
});
document.querySelector('#newRequest').addEventListener('click', () => {
  bookingForm.reset();
  selectedPlan.value = '';
  requestResult.hidden = true;
  bookingForm.hidden = false;
  bookingForm.querySelector('input').focus();
});