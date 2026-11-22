'use strict';

// Set to an actual business email before launch to enable a mailto submission.
// When blank, the showroom operates as a safe, no-backend inquiry demo.
const CONTACT_EMAIL = '';

const nav = document.getElementById('site-nav');
const menuButton = document.querySelector('.menu-toggle');
const navLinks = nav.querySelectorAll('a');

function closeMenu(restoreFocus = false) {
  nav.classList.remove('is-open');
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Open navigation');
  document.body.classList.remove('menu-open');
  if (restoreFocus) menuButton.focus();
}
menuButton.addEventListener('click', () => {
  const opening = menuButton.getAttribute('aria-expanded') !== 'true';
  nav.classList.toggle('is-open', opening);
  menuButton.setAttribute('aria-expanded', String(opening));
  menuButton.setAttribute('aria-label', opening ? 'Close navigation' : 'Open navigation');
  document.body.classList.toggle('menu-open', opening);
});
navLinks.forEach(link => link.addEventListener('click', () => closeMenu()));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && nav.classList.contains('is-open')) closeMenu(true);
});
document.addEventListener('click', event => {
  if (nav.classList.contains('is-open') && !nav.contains(event.target) && !menuButton.contains(event.target)) closeMenu();
});
window.matchMedia('(min-width: 801px)').addEventListener('change', event => {
  if (event.matches) closeMenu();
});

document.getElementById('year').textContent = String(new Date().getFullYear());

const filterButtons = [...document.querySelectorAll('.filter-button')];
const projectCards = [...document.querySelectorAll('.project-card')];
const status = document.getElementById('portfolio-status');
let activeFilter = 'all';

function applyFilter(category) {
  activeFilter = category;
  filterButtons.forEach(button => {
    const selected = button.dataset.filter === category;
    button.classList.toggle('is-active', selected);
    button.setAttribute('aria-pressed', String(selected));
  });
  let count = 0;
  projectCards.forEach(card => {
    const show = category === 'all' || card.dataset.category === category;
    card.hidden = !show;
    if (show) count += 1;
  });
  const label = filterButtons.find(button => button.dataset.filter === category)?.textContent.trim() || 'all';
  status.textContent = `Showing ${count} ${count === 1 ? 'concept' : 'concepts'} in ${label}.`;
}
filterButtons.forEach(button => button.addEventListener('click', () => applyFilter(button.dataset.filter)));
document.querySelectorAll('[data-filter-target]').forEach(link => {
  link.addEventListener('click', () => applyFilter(link.dataset.filterTarget));
});

const projects = [
  { title:'The Heritage Kitchen', category:'Kitchens & Living Spaces', image:'assets/warm-kitchen.webp', alt:'Marble island and warm wood kitchen', description:'A palette of rich timber, luminous natural stone, and warm brass creates a welcoming center for everyday gatherings. The materials do the talking, and the architecture gives them room to breathe.' },
  { title:'The Limestone Retreat', category:'Bathrooms & Wellness', image:'assets/travertine-bath.webp', alt:'Limestone-clad bath with freestanding tub', description:'A restorative sanctuary in soft stone, warm light, and sculptural forms. Deliberately simple details allow this space to feel serene without sacrificing personality.' },
  { title:'The Gathering Room', category:'Living Spaces', image:'assets/living-room.webp', alt:'Exposed-beam living room and natural stone fireplace', description:'A luminous living space balanced between grand architecture and intimate comfort. Textural textiles and an honest stone fireplace create the kind of room people naturally gravitate toward.' },
  { title:'The Material Edit', category:'Custom Craftsmanship', image:'assets/craftsmanship.webp', alt:'Natural stone and custom walnut cabinetry detail', description:'A closer look at the decisions that make a space distinct: the silhouette of a brass pull, a carefully chosen timber grain, and the beautifully imperfect edge of natural stone.' },
  { title:'The Modern Heirloom', category:'Kitchens & Living Spaces', image:'assets/hero-kitchen.webp', alt:'Dark bespoke kitchen with waterfall marble island', description:'A considered contrast of dramatic dark joinery and expressive marble. Warm wood, greenery, and quiet metallic accents bring balance to a thoroughly modern kitchen.' },
  { title:'The Stillwater Bath', category:'Bathrooms & Wellness', image:'assets/spa-bath.webp', alt:'Freestanding tub near black-framed garden windows', description:'A serene balance of contemporary fittings, natural textures, and long views toward the garden. An everyday place to slow down, restored by the details you can feel.' }
];

const projectDialog = document.getElementById('project-dialog');
const dialogImage = document.getElementById('dialog-image');
const dialogTitle = document.getElementById('dialog-title');
const dialogCategory = document.getElementById('dialog-category');
const dialogDescription = document.getElementById('dialog-description');
const dialogCount = document.getElementById('dialog-count');
let currentProject = 0;
let lastProjectTrigger = null;

function showProject(index) {
  currentProject = (index + projects.length) % projects.length;
  const project = projects[currentProject];
  dialogImage.src = project.image;
  dialogImage.alt = project.alt;
  dialogTitle.textContent = project.title;
  dialogCategory.textContent = project.category;
  dialogDescription.textContent = project.description;
  dialogCount.textContent = `${String(currentProject + 1).padStart(2,'0')} / ${String(projects.length).padStart(2,'0')}`;
}
document.querySelectorAll('.project-open').forEach(button => {
  button.addEventListener('click', () => {
    lastProjectTrigger = button;
    showProject(Number(button.dataset.project));
    projectDialog.showModal();
    document.body.style.overflow = 'hidden';
  });
});
function closeDialog() {
  projectDialog.close();
}
document.getElementById('dialog-close').addEventListener('click', closeDialog);
document.getElementById('dialog-prev').addEventListener('click', () => showProject(currentProject - 1));
document.getElementById('dialog-next').addEventListener('click', () => showProject(currentProject + 1));
projectDialog.addEventListener('click', event => { if (event.target === projectDialog) closeDialog(); });
projectDialog.addEventListener('close', () => {
  document.body.style.overflow = '';
  if (lastProjectTrigger && !lastProjectTrigger.closest('[hidden]')) lastProjectTrigger.focus();
});
document.addEventListener('keydown', event => {
  if (!projectDialog.open) return;
  if (event.key === 'ArrowLeft') { event.preventDefault(); showProject(currentProject - 1); }
  if (event.key === 'ArrowRight') { event.preventDefault(); showProject(currentProject + 1); }
});

const inquiryForm = document.getElementById('inquiry-form');
const inquiryResult = document.getElementById('inquiry-result');
const inquiryPreview = document.getElementById('inquiry-preview');
const copyStatus = document.getElementById('copy-status');
let formattedInquiry = '';

inquiryForm.addEventListener('submit', event => {
  event.preventDefault();
  if (!inquiryForm.reportValidity()) return;
  const details = new FormData(inquiryForm);
  formattedInquiry = [
    'Riverstone Studio | Project Inquiry',
    '',
    `Name: ${details.get('name')}`,
    `Email: ${details.get('email')}`,
    `Project type: ${details.get('type')}`,
    `Ideal timeline: ${details.get('timeline')}`,
    '',
    'Project vision:',
    String(details.get('message'))
  ].join('\n');

  if (CONTACT_EMAIL.trim()) {
    const subject = encodeURIComponent('New Riverstone Studio project inquiry');
    window.location.href = `mailto:${encodeURIComponent(CONTACT_EMAIL.trim())}?subject=${subject}&body=${encodeURIComponent(formattedInquiry)}`;
    return;
  }
  inquiryPreview.textContent = formattedInquiry;
  copyStatus.textContent = '';
  inquiryForm.hidden = true;
  inquiryResult.hidden = false;
  inquiryResult.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'center' });
});

document.getElementById('copy-inquiry').addEventListener('click', async () => {
  try {
    if (!navigator.clipboard?.writeText) throw new Error('Clipboard API unavailable');
    await navigator.clipboard.writeText(formattedInquiry);
    copyStatus.textContent = 'Inquiry copied to your clipboard.';
  } catch {
    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(inquiryPreview);
    selection.removeAllRanges();
    selection.addRange(range);
    copyStatus.textContent = 'Text selected. Use Copy from your browser menu.';
  }
});
document.getElementById('edit-inquiry').addEventListener('click', () => {
  inquiryResult.hidden = true;
  inquiryForm.hidden = false;
  inquiryForm.querySelector('input').focus();
});
