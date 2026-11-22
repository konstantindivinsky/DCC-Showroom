'use strict';

const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.primary-nav');
function closeMenu() { nav.classList.remove('open'); toggle.setAttribute('aria-expanded', 'false'); toggle.setAttribute('aria-label', 'Open navigation'); }
toggle.addEventListener('click', () => {
  const opened = nav.classList.toggle('open');
  toggle.setAttribute('aria-expanded', String(opened));
  toggle.setAttribute('aria-label', opened ? 'Close navigation' : 'Open navigation');
});
nav.addEventListener('click', (event) => { if (event.target.closest('a')) closeMenu(); });
document.addEventListener('keydown', (event) => { if (event.key === 'Escape') closeMenu(); });
document.addEventListener('click', (event) => { if (nav.classList.contains('open') && !event.target.closest('.site-header')) closeMenu(); });

const stories = {
  maplewood: {
    label: 'FEATURED RESTORATION · 1908 CRAFTSMAN', title: 'The Maplewood Residence',
    deck: 'An early twentieth-century Craftsman with a generous porch, intricate timberwork, and a new chapter of family life ahead.', image: 'assets/maplewood.jpg',
    alt: 'Restored Craftsman residence with stone porch and warm glowing windows',
    paragraphs: ['The spirit of the house was already there: handmade joinery, welcoming proportions, and a porch that belonged to the neighborhood. The design concept begins by honoring those original strengths.', 'Period-sensitive exterior details, quietly updated systems, and warm interior finishes bring the house into the present without disguising its age.', 'The goal is not to make a 1908 home look new. It is to help it feel wonderfully cared for, and wholly itself.']
  },
  hearth: {
    label: 'RESTORATION ARCHIVE · INTERIORS', title: 'The Hearth Room',
    deck: 'An inviting sitting room where original millwork and a carefully restored fireplace provide a center of gravity.', image: 'assets/fireplace.jpg',
    alt: 'Warm historic sitting room with marble fireplace, mirror, and leather armchair',
    paragraphs: ['A historic interior becomes compelling when the original details are allowed to lead. Here, the fireplace, built-in character, and traditional window proportions establish the language of the room.', 'Layered lighting, tactile textiles, and a restrained palette introduce comfort rather than competition.', 'The result feels collected across generations, not decorated in a weekend.']
  },
  details: {
    label: 'RESTORATION ARCHIVE · CRAFTSMANSHIP', title: 'Details Worth Keeping',
    deck: 'A celebration of the small things: old glass, honest timber, and the gentle patina of brass.', image: 'assets/wood-details.jpg',
    alt: 'Antique stained glass, brass door hardware, and warm carved woodwork',
    paragraphs: ['The most memorable features of an old house are not always its grandest. Often they are the waviness of original glass, a solid brass knob, or the unmistakable grain of an old-growth timber door.', 'We begin with the assumption that these elements deserve a second look before they are replaced.', 'Repair, careful refinishing, and sympathetic additions can retain an irreplaceable sense of place.']
  },
  materials: {
    label: 'THE STUDIO JOURNAL · MATERIAL STORIES', title: 'The beautiful irregularity of old wood',
    deck: 'Sometimes the things that look imperfect are the things that make a room feel most complete.', image: 'assets/staircase.jpg',
    alt: 'Carved historic hardwood staircase detail',
    paragraphs: ['Old wood has a language that newly milled boards rarely speak. Its subtle shifts in color, tiny marks, and softened edges record decades of everyday life.', 'Original flooring and millwork also give us information about how a house was designed and built. Before stripping, replacing, or concealing those elements, it is worth asking what a careful restoration could reveal.', 'The most satisfying renovations keep that material memory intact while making room for practical needs.']
  },
  reading: {
    label: 'THE STUDIO JOURNAL · HOUSE HISTORIES', title: 'Learning to read an old house',
    deck: 'Every old home leaves clues about what it was, how it changed, and what it might become.', image: 'assets/house-sketch.jpg',
    alt: 'Architectural drawing of an ornate historic house',
    paragraphs: ['Look at the lines of a staircase, the depth of a window casing, or a doorway that seems slightly out of place. Each can offer clues about the generations who shaped the house.', 'A sensitive renovation begins with observation. Which rooms belong to the original plan? Which details were added later? Where has the home already adapted to changing life?', 'Reading those clues helps new interventions feel like a natural continuation rather than an interruption.']
  },
  future: {
    label: 'THE STUDIO JOURNAL · DESIGN INSIGHTS', title: 'A thoughtful place for the new',
    deck: 'Contemporary comfort and historic character do not have to be opposites.', image: 'assets/floorplan.jpg',
    alt: 'Aged architectural plan drawing',
    paragraphs: ['A kitchen should work for the way people live today. Bathrooms, lighting, insulation, and mechanical systems should do the same. But thoughtful modernization does not demand that every room lose its identity.', 'A good design distinguishes between what needs to perform better and what already performs beautifully as architecture.', 'We make the new elements legible, useful, and calm, allowing the original house to remain the protagonist.']
  }
};

const dialog = document.querySelector('#story-dialog');
const dialogClose = document.querySelector('.dialog-close');
let lastTrigger = null;
function openStory(id, trigger) {
  const story = stories[id];
  if (!story) return;
  lastTrigger = trigger;
  document.querySelector('#story-label').textContent = story.label;
  document.querySelector('#story-title').textContent = story.title;
  document.querySelector('#story-deck').textContent = story.deck;
  const img = document.querySelector('#story-image');
  img.src = story.image; img.alt = story.alt;
  const body = document.querySelector('#story-body');
  body.replaceChildren(...story.paragraphs.map(text => { const p = document.createElement('p'); p.textContent = text; return p; }));
  if (!dialog.open) dialog.showModal();
  document.body.classList.add('dialog-open');
}
for (const trigger of document.querySelectorAll('[data-story]')) trigger.addEventListener('click', () => openStory(trigger.dataset.story, trigger));
dialogClose.addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
dialog.addEventListener('close', () => { document.body.classList.remove('dialog-open'); lastTrigger?.focus(); });
document.querySelector('#dialog-contact').addEventListener('click', () => dialog.close());

const inquiryForm = document.querySelector('#inquiry-form');
inquiryForm.addEventListener('submit', event => {
  event.preventDefault();
  if (!inquiryForm.reportValidity()) return;
  const values = new FormData(inquiryForm);
  const subject = `Historic Home Inquiry - ${String(values.get('name')).trim()}`;
  const body = `Name: ${String(values.get('name')).trim()}\nEmail: ${String(values.get('email')).trim()}\nLocation: ${String(values.get('location')).trim() || 'Not specified'}\n\nProject details:\n${String(values.get('message')).trim()}`;
  // No destination address is fabricated for this showroom concept.
  const mailto = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  document.querySelector('#form-status').textContent = 'Your email application will open with the inquiry prepared. Add the recipient before sending.';
  window.location.href = mailto;
});
