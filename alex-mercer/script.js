'use strict';
const projects = {
  rivermark: {
    title: 'Rivermark Skincare',
    category: 'Brand launch & campaign',
    image: 'assets/rivermark-skincare.jpg',
    imageAlt: 'Amber skincare product photographed in a natural setting',
    description: 'A quiet, confident identity for a skincare brand with nature at its center. The concept pairs considered packaging, atmospheric photography, and a cohesive launch story across physical and digital touchpoints.',
    services: ['Brand strategy', 'Art direction', 'Launch campaign', 'Packaging']
  },
  traverse: {
    title: 'Traverse Outdoors',
    category: 'Multi-channel campaign',
    image: 'assets/traverse-outdoors.jpg',
    imageAlt: 'Outdoor adventurer on a mountain overlook',
    description: 'An adventure-led creative platform designed to bring an outdoor audience closer to the places they love. The visual direction combines a bold campaign idea with location photography and a consistent voice across channels.',
    services: ['Creative direction', 'Campaign concept', 'Digital', 'Photography direction']
  },
  alder: {
    title: 'The Alder Room',
    category: 'Brand & experience design',
    image: 'assets/alder-room.jpg',
    imageAlt: 'Fine-dining presentation on a ceramic plate',
    description: 'A refined hospitality identity inspired by the restaurant’s dedication to craft. An understated visual language extends from menus and print materials to the digital experience, making every detail feel intentional.',
    services: ['Brand identity', 'Hospitality', 'Experience design', 'Digital']
  }
};
const nav = document.getElementById('site-nav');
const menuToggle = document.getElementById('menu-toggle');
const navLinks = [...nav.querySelectorAll('a')];
function closeMenu() {
  nav.classList.remove('open');
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-label', 'Open navigation');
}
menuToggle.addEventListener('click', () => {
  const opening = !nav.classList.contains('open');
  nav.classList.toggle('open', opening);
  menuToggle.setAttribute('aria-expanded', String(opening));
  menuToggle.setAttribute('aria-label', opening ? 'Close navigation' : 'Open navigation');
});
navLinks.forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('click', e => {
  if (!nav.contains(e.target) && !menuToggle.contains(e.target)) closeMenu();
});
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });
window.addEventListener('resize', () => { if (window.innerWidth > 700) closeMenu(); });
const dialog = document.getElementById('project-dialog');
const dialogImage = document.getElementById('dialog-image');
const dialogTitle = document.getElementById('dialog-title');
const dialogType = document.getElementById('dialog-type');
const dialogText = document.getElementById('dialog-text');
const serviceList = document.getElementById('dialog-services');
let lastOpenButton = null;
document.querySelectorAll('[data-project]').forEach(button => {
  button.addEventListener('click', () => {
    const project = projects[button.dataset.project];
    if (!project) return;
    lastOpenButton = button;
    dialogImage.src = project.image;
    dialogImage.alt = project.imageAlt;
    dialogTitle.textContent = project.title;
    dialogType.textContent = 'Selected Work / ' + project.category;
    dialogText.textContent = project.description;
    serviceList.replaceChildren(...project.services.map(service => {
      const chip = document.createElement('span');
      chip.textContent = service;
      return chip;
    }));
    dialog.showModal();
  });
});
document.getElementById('dialog-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('close', () => { lastOpenButton?.focus(); });
const socialDialog = document.getElementById('social-dialog');
document.querySelectorAll('[data-social]').forEach(button => {
  button.addEventListener('click', () => {
    document.getElementById('social-dialog-title').textContent = button.dataset.social + ' profile';
    socialDialog.showModal();
  });
});
document.getElementById('social-dialog-close').addEventListener('click', () => socialDialog.close());
document.getElementById('social-dialog-done').addEventListener('click', () => socialDialog.close());
for (const modal of [dialog, socialDialog]) {
  modal.addEventListener('click', e => {
    if (e.target === modal) modal.close();
  });
}
const markers = [
  { target: document.getElementById('work'), link: nav.querySelector('a[href="#work"]') },
  { target: document.getElementById('about'), link: nav.querySelector('a[href="#about"]') },
  { target: document.getElementById('timeline'), link: nav.querySelector('a[href="#timeline"]') },
  { target: document.getElementById('contact'), link: nav.querySelector('a[href="#contact"]') }
];
let rafPending = false;
function updateActiveNav() {
  const y = window.scrollY + Math.min(window.innerHeight * .33, 220);
  let active = markers[0];
  for (const item of markers) if (item.target.getBoundingClientRect().top + window.scrollY <= y) active = item;
  navLinks.forEach(a => { a.classList.toggle('active', a === active.link); if (a === active.link) a.setAttribute('aria-current', 'location'); else a.removeAttribute('aria-current'); });
  rafPending = false;
}
window.addEventListener('scroll', () => { if (!rafPending) { rafPending = true; requestAnimationFrame(updateActiveNav); } }, { passive: true });
window.addEventListener('load', updateActiveNav);
document.getElementById('year').textContent = new Date().getFullYear();
