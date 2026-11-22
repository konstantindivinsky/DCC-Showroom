'use strict';

// Everything here runs locally. No analytics, remote scripts, or form backend.
const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const nav = $('#site-nav');
const menuButton = $('.menu-toggle');
const contactDialog = $('#contact-dialog');
const contactForm = $('#contact-form');
const contactResult = $('#form-result');
const contactPreview = $('#request-preview');
const articleDialog = $('#article-dialog');
const overviewDialog = $('#overview-dialog');
let lastDialogOpener = null;

$('#current-year').textContent = new Date().getFullYear();

function closeMenu() {
  nav.classList.remove('is-open');
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Open navigation');
}
menuButton.addEventListener('click', () => {
  const open = nav.classList.toggle('is-open');
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
});
$$('.site-nav a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape') closeMenu();
});
document.addEventListener('click', event => {
  if (nav.classList.contains('is-open') && !nav.contains(event.target) && !menuButton.contains(event.target)) closeMenu();
});

// Keep active nav styling in sync with the page being viewed.
const navLinks = $$('.site-nav .nav-link');
const sections = ['home', 'services', 'results', 'contact', 'about', 'insights']
  .map(id => document.getElementById(id)).filter(Boolean);
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    const candidates = entries.filter(entry => entry.isIntersecting);
    if (!candidates.length) return;
    candidates.sort((a, b) => b.intersectionRatio - a.intersectionRatio);
    const sectionId = candidates[0].target.id === 'contact' ? 'results' : candidates[0].target.id;
    navLinks.forEach(link => link.classList.toggle('is-active', link.getAttribute('href') === `#${sectionId}`));
  }, { rootMargin: '-16% 0px -43% 0px', threshold: [0, .15, .35, .55] });
  sections.forEach(section => observer.observe(section));
}

function showDialog(dialog, opener = document.activeElement) {
  if (dialog.open) return;
  lastDialogOpener = opener;
  closeMenu();
  dialog.showModal();
}
function hideDialog(dialog) {
  if (dialog.open) dialog.close();
}
$$('dialog').forEach(dialog => {
  $$('[data-close-dialog]', dialog).forEach(button => button.addEventListener('click', () => hideDialog(dialog)));
  dialog.addEventListener('click', event => {
    // Only clicking the native backdrop closes it, not its contents.
    if (event.target === dialog) hideDialog(dialog);
  });
  dialog.addEventListener('close', () => {
    if (lastDialogOpener && lastDialogOpener.isConnected && typeof lastDialogOpener.focus === 'function') lastDialogOpener.focus();
    lastDialogOpener = null;
  });
});

function openContact(service, opener) {
  if (!contactResult.hidden) {
    contactForm.reset();
    contactResult.hidden = true;
    contactForm.hidden = false;
  }
  if (service) $('#service-select').value = service;
  if (articleDialog.open) hideDialog(articleDialog);
  // Defer until the other modal is fully closed.
  queueMicrotask(() => showDialog(contactDialog, opener));
}
$$('[data-open-contact]').forEach(button => button.addEventListener('click', () => openContact('', button)));
$$('[data-service]').forEach(card => card.addEventListener('click', () => openContact(card.dataset.service, card)));

let latestRequest = '';
contactForm.addEventListener('submit', event => {
  event.preventDefault();
  if (!contactForm.reportValidity()) return;
  const fields = new FormData(contactForm);
  const normalize = value => String(value || '').trim();
  latestRequest = [
    'Consultation request for Morgan Reeves',
    '',
    `Name: ${normalize(fields.get('name'))}`,
    `Email: ${normalize(fields.get('email'))}`,
    `Company: ${normalize(fields.get('company')) || '(not provided)'}`,
    `Service: ${normalize(fields.get('service'))}`,
    '',
    'Goals and challenges:',
    normalize(fields.get('message'))
  ].join('\n');
  contactPreview.textContent = latestRequest;
  contactForm.hidden = true;
  contactResult.hidden = false;
  $('#copy-request').textContent = 'Copy Request';
  $('#copy-request').focus();
});
$('#edit-request').addEventListener('click', () => {
  contactResult.hidden = true;
  contactForm.hidden = false;
  contactForm.querySelector('input').focus();
});
$('#copy-request').addEventListener('click', async () => {
  const button = $('#copy-request');
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(latestRequest);
    } else {
      const copyArea = document.createElement('textarea');
      copyArea.value = latestRequest;
      copyArea.style.position = 'fixed';
      copyArea.style.opacity = '0';
      document.body.append(copyArea);
      copyArea.select();
      if (!document.execCommand('copy')) throw new Error('Copy unavailable');
      copyArea.remove();
    }
    button.textContent = 'Copied to Clipboard';
  } catch (_) {
    button.textContent = 'Select text above to copy';
    contactPreview.focus();
  }
});

const articles = {
  roadmap: {
    category: 'Technology Strategy',
    title: 'Why Your Technology Roadmap Should Start With Business Goals',
    body: `
      <p>A technology roadmap is most useful when it describes business progress, not merely a shopping list of systems. Start with the outcomes you need: faster service, fewer manual handoffs, clearer information, more reliable operations, or room to grow.</p>
      <h3>Find the friction first</h3>
      <p>Ask where work slows down, where information gets re-entered, and which tools your team works around rather than with. A few focused conversations often reveal more useful priorities than a long list of product features.</p>
      <h3>Connect each investment to a result</h3>
      <p>For every initiative, identify an owner, a reasonable timeframe, and a way to tell whether it worked. Some changes produce immediate savings. Others reduce risk or create the capacity for future growth. Both can be valuable when the tradeoffs are clear.</p>
      <p>The right roadmap is practical, understandable, and flexible enough to evolve with the business.</p>`
  },
  security: {
    category: 'IT & Security Advisory',
    title: 'Security That Supports Growth, Not Just Compliance',
    body: `
      <p>Strong security should make a business more resilient without making everyday work needlessly difficult. The goal is to manage the risks that matter most while keeping teams productive.</p>
      <h3>Build around real-world exposure</h3>
      <p>Begin with basics: reliable backups, appropriate access controls, multifactor authentication, prompt updates, and a documented response plan. The right sequence depends on the systems, data, and obligations your business actually has.</p>
      <h3>Make good practices easy to follow</h3>
      <p>Security is stronger when people understand it. Explain the why, simplify the process, and avoid adding controls that encourage workarounds. Review your approach as the business adopts new tools, hires people, or adds locations.</p>
      <p>Reducing risk is an ongoing business decision, not a box to check once a year.</p>`
  },
  cloud: {
    category: 'Cloud & Infrastructure',
    title: 'Cloud, On-Premises, or Both? Choose Based on What Matters',
    body: `
      <p>The best infrastructure is not always the newest or the most fashionable. It is the combination that delivers the reliability, control, speed, and cost structure your organization requires.</p>
      <h3>Look beyond the monthly bill</h3>
      <p>Compare the full lifecycle: equipment, administration, connectivity, support, backups, recovery, compliance, and the cost of an outage. Predictable workloads can have different economics from highly variable ones.</p>
      <h3>Plan for the way people work</h3>
      <p>Consider where the team operates, how applications integrate, how quickly you can recover, and what happens when internet access is disrupted. A hybrid approach can sometimes offer a sensible balance of flexibility and local control.</p>
      <p>Infrastructure decisions should follow the needs of the business, not the other way around.</p>`
  }
};
$$('[data-article]').forEach(card => card.addEventListener('click', () => {
  const article = articles[card.dataset.article];
  if (!article) return;
  $('#article-category').textContent = article.category;
  $('#article-dialog-title').textContent = article.title;
  $('#article-body').innerHTML = article.body;
  showDialog(articleDialog, card);
}));
$('[data-article-contact]').addEventListener('click', event => openContact('', event.currentTarget));

// A real, self-running, silent 60-second overview with pause and next controls.
const overviewSlides = [
  {title: 'Business First. Technology That Delivers.', text: 'Technology should solve problems, reduce friction, and open up what comes next.'},
  {title: 'A Clear Roadmap for Your Next Move.', text: 'Connect strategy, operations, security, and infrastructure to the goals that matter.'},
  {title: 'From Good Ideas to Measurable Progress.', text: 'Make smart decisions, move forward with confidence, and keep improving as you grow.'}
];
let overviewElapsed = 0;
let overviewLastTick = 0;
let overviewTimer = null;
let overviewPaused = false;
const overviewDuration = 60000;
function renderOverview() {
  const currentSlide = Math.min(2, Math.floor(overviewElapsed / 20000));
  const slide = overviewSlides[currentSlide];
  $('#overview-dialog-title').textContent = slide.title;
  $('#overview-copy').textContent = slide.text;
  $('#overview-slide-label').textContent = `${String(currentSlide + 1).padStart(2,'0')} / 03`;
  $('#overview-progress-fill').style.width = `${overviewElapsed / overviewDuration * 100}%`;
  $('.overview__progress').setAttribute('aria-valuenow', String(Math.round(overviewElapsed / overviewDuration * 100)));
  $('#overview-pause').textContent = overviewElapsed >= overviewDuration ? 'Replay' : overviewPaused ? 'Resume' : 'Pause';
  $('#overview-next').textContent = overviewElapsed >= overviewDuration ? 'Restart ↻' : 'Next →';
}
function stopOverview() {
  if (overviewTimer !== null) window.clearInterval(overviewTimer);
  overviewTimer = null;
}
function startOverview() {
  stopOverview();
  overviewElapsed = 0;
  overviewPaused = false;
  overviewLastTick = performance.now();
  renderOverview();
  overviewTimer = window.setInterval(() => {
    const now = performance.now();
    if (!overviewPaused && overviewElapsed < overviewDuration) {
      overviewElapsed = Math.min(overviewDuration, overviewElapsed + (now - overviewLastTick));
      if (overviewElapsed === overviewDuration) overviewPaused = true;
      renderOverview();
    }
    overviewLastTick = now;
  }, 100);
}
$('#overview-launch').addEventListener('click', event => {
  showDialog(overviewDialog, event.currentTarget);
  startOverview();
});
$('#overview-pause').addEventListener('click', () => {
  if (overviewElapsed >= overviewDuration) {
    startOverview();
  } else {
    overviewPaused = !overviewPaused;
    overviewLastTick = performance.now();
    renderOverview();
  }
});
$('#overview-next').addEventListener('click', () => {
  if (overviewElapsed >= overviewDuration) {
    startOverview();
  } else {
    overviewElapsed = Math.min(overviewDuration, (Math.floor(overviewElapsed / 20000) + 1) * 20000);
    if (overviewElapsed === overviewDuration) overviewPaused = true;
    overviewLastTick = performance.now();
    renderOverview();
  }
});
overviewDialog.addEventListener('close', stopOverview);
