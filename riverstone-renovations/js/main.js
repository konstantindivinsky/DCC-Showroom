'use strict';

// Riverstone Home Renovations: self-contained interactive concept site.
// No data is sent to a server. All features work without dependencies.
(function () {
  const photos = document.getElementById('hero-photos');
  const comparison = document.getElementById('comparison-control');
  const compareRange = document.getElementById('compare-range');
  if (photos && comparison && compareRange) {
    const moveComparison = () => {
      const value = Math.max(35, Math.min(72, Number(compareRange.value)));
      photos.style.setProperty('--split', value + '%');
      comparison.style.setProperty('--handle', value + '%');
    };
    compareRange.addEventListener('input', moveComparison);
    moveComparison();
  }

  const toggle = document.querySelector('.mobile-menu-toggle');
  const mobileNav = document.getElementById('mobile-nav');
  function closeMenu() {
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open navigation');
    mobileNav.hidden = true;
  }
  if (toggle && mobileNav) {
    toggle.addEventListener('click', () => {
      const open = toggle.getAttribute('aria-expanded') !== 'true';
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
      mobileNav.hidden = !open;
    });
    mobileNav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && !mobileNav.hidden) closeMenu();
    });
    window.addEventListener('resize', () => { if (window.innerWidth > 950) closeMenu(); });
  }

  const filters = [...document.querySelectorAll('.filter-button')];
  const projects = [...document.querySelectorAll('.project-card')];
  const empty = document.getElementById('gallery-empty');
  function selectCategory(category) {
    const name = filters.some(button => button.dataset.filter === category) ? category : 'all';
    filters.forEach(button => {
      const active = button.dataset.filter === name;
      button.classList.toggle('active', active);
      button.setAttribute('aria-pressed', String(active));
    });
    let count = 0;
    projects.forEach(card => {
      const show = name === 'all' || card.dataset.category === name;
      card.hidden = !show;
      card.classList.toggle('project-featured', show && name === 'all' && card.dataset.project === 'kitchen');
      if (show) count++;
    });
    if (empty) empty.hidden = count !== 0;
  }
  filters.forEach(button => button.addEventListener('click', () => selectCategory(button.dataset.filter)));
  document.querySelectorAll('[data-category-link]').forEach(link => {
    link.addEventListener('click', () => selectCategory(link.dataset.categoryLink));
  });

  const projectData = {
    kitchen: {
      kicker: 'Kitchen Transformation / Concept 01',
      title: 'A Kitchen Reimagined',
      image: 'assets/kitchen-after.webp',
      alt: 'Dark cabinetry and stone countertop in a renovated kitchen',
      description: 'A dated, enclosed kitchen becomes a place to gather. Rich cabinetry, layered light, warm details, and an expansive stone island create a natural center for daily living.',
      details: ['Open, functional layout', 'Custom cabinetry', 'Layered lighting', 'Statement island']
    },
    bathroom: {
      kicker: 'Bathroom Renovation / Concept 02',
      title: 'A Private Retreat',
      image: 'assets/bathroom.webp',
      alt: 'Light-filled bathroom with freestanding tub',
      description: 'A calming bath retreat balances natural light, enduring materials, and moments of quiet luxury. A freestanding tub becomes the inviting focal point.',
      details: ['Spa-inspired setting', 'Natural light', 'Refined finishes']
    },
    living: {
      kicker: 'Living Spaces / Concept 03',
      title: 'Room to Gather',
      image: 'assets/living.webp',
      alt: 'Comfortable, open living room and dining area',
      description: 'A welcoming space rethought around connection, easy movement, and everyday comfort. A harmonious palette brings living and dining together.',
      details: ['Open flow', 'Welcoming finishes', 'Comfort-led design']
    },
    outdoor: {
      kicker: 'Outdoor Living / Concept 04',
      title: 'Beyond the Back Door',
      image: 'assets/outdoor.webp',
      alt: 'Covered outdoor cooking and entertaining space',
      description: 'The best rooms are not always indoors. A covered outdoor living area makes space for cooking, conversation, and enjoying the evenings longer.',
      details: ['Outdoor cooking', 'Covered entertaining', 'Warm architectural lighting']
    },
    exterior: {
      kicker: 'Whole-Home Renovation / Concept 05',
      title: 'Home, Transformed',
      image: 'assets/exterior.webp',
      alt: 'Beautifully updated home exterior at dusk',
      description: 'A whole-home approach brings the architecture, outdoor spaces, and interior details together into a consistent expression of home.',
      details: ['Whole-home vision', 'Architectural character', 'Cohesive finishes']
    }
  };
  const modal = document.getElementById('project-modal');
  const closeModalButton = document.getElementById('modal-close');
  let previousFocus = null;
  if (modal) {
    projects.forEach(button => button.addEventListener('click', () => {
      const data = projectData[button.dataset.project];
      if (!data) return;
      document.getElementById('modal-eyebrow').textContent = data.kicker;
      document.getElementById('modal-title').textContent = data.title;
      const image = document.getElementById('modal-image');
      image.src = data.image;
      image.alt = data.alt;
      document.getElementById('modal-description').textContent = data.description;
      const details = document.getElementById('modal-details');
      details.replaceChildren(...data.details.map(value => {
        const span = document.createElement('span'); span.textContent = value; return span;
      }));
      previousFocus = document.activeElement;
      modal.showModal();
      document.body.classList.add('modal-open');
      closeModalButton.focus();
    }));
    function closeModal() { if (modal.open) modal.close(); }
    closeModalButton.addEventListener('click', closeModal);
    modal.addEventListener('click', event => { if (event.target === modal) closeModal(); });
    modal.addEventListener('close', () => {
      document.body.classList.remove('modal-open');
      if (previousFocus && previousFocus.isConnected) previousFocus.focus();
    });
    document.getElementById('modal-cta').addEventListener('click', closeModal);
  }

  const year = document.getElementById('current-year');
  if (year) year.textContent = String(new Date().getFullYear());

  const form = document.getElementById('consult-form');
  const result = document.getElementById('form-result');
  const preview = document.getElementById('inquiry-preview');
  const copy = document.getElementById('copy-inquiry');
  if (form && result && preview && copy) {
    form.addEventListener('submit', event => {
      event.preventDefault();
      if (!form.reportValidity()) return;
      const fields = new FormData(form);
      const name = String(fields.get('name') || '').trim();
      const email = String(fields.get('email') || '').trim();
      const project = String(fields.get('project') || '').trim();
      const timeline = String(fields.get('timeline') || '').trim() || 'Not specified';
      const message = String(fields.get('message') || '').trim();
      if (!name || !email || !project || !message) {
        form.reportValidity(); return;
      }
      preview.value = `Riverstone Renovation Inquiry\n\nName: ${name}\nEmail: ${email}\nProject Type: ${project}\nTimeline: ${timeline}\n\nProject Vision:\n${message}`;
      result.hidden = false;
      copy.textContent = 'Copy Inquiry';
      result.scrollIntoView({behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'nearest'});
    });
    copy.addEventListener('click', async () => {
      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(preview.value);
        } else {
          preview.focus(); preview.select();
          if (!document.execCommand('copy')) throw new Error('Copy unavailable');
        }
        copy.textContent = 'Copied!';
      } catch {
        preview.focus(); preview.select();
        copy.textContent = 'Select the text above to copy';
      }
    });
  }
})();
