(() => {
  'use strict';

  // This website is a static, interactive showroom demonstration.
  // No appointment data is transmitted, saved to a server, or sent to a real practice.
  const year = document.getElementById('current-year');
  if (year) year.textContent = String(new Date().getFullYear());

  const menuToggle = document.getElementById('menu-toggle');
  const mobileNav = document.getElementById('mobile-nav');
  const closeMenu = () => {
    mobileNav.hidden = true;
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Open navigation');
    menuToggle.querySelector('use').setAttribute('href', '#icon-menu');
  };
  menuToggle.addEventListener('click', () => {
    const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
    mobileNav.hidden = isOpen;
    menuToggle.setAttribute('aria-expanded', String(!isOpen));
    menuToggle.setAttribute('aria-label', isOpen ? 'Open navigation' : 'Close navigation');
    menuToggle.querySelector('use').setAttribute('href', isOpen ? '#icon-menu' : '#icon-close');
  });
  mobileNav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  window.addEventListener('resize', () => { if (window.innerWidth > 1100) closeMenu(); });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !mobileNav.hidden) closeMenu();
  });

  const links = Array.from(document.querySelectorAll('.desktop-nav .nav-link'));
  const sections = ['home', 'services', 'about', 'patients', 'resources']
    .map(id => document.getElementById(id)).filter(Boolean);
  const updateActive = () => {
    let active = 'home';
    const offset = 155;
    for (const section of sections) {
      if (section.getBoundingClientRect().top <= offset) active = section.id;
    }
    links.forEach(link => {
      const selected = link.getAttribute('href') === '#' + active;
      link.classList.toggle('is-active', selected);
      if (selected) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  };
  window.addEventListener('scroll', updateActive, {passive: true});
  updateActive();

  const testimonials = [
    {quote: '“Dr. Marshall takes the time to really listen and looks at the whole picture. I feel healthier, more balanced, and truly cared for.”', author: '— A. Carter, Patient'},
    {quote: '“The atmosphere is welcoming, and the approach makes you feel like a partner in your own well-being.”', author: '— J. Rivera, Patient'},
    {quote: '“I appreciate having the time to ask questions and talk about what matters to me.”', author: '— M. Lewis, Patient'}
  ];
  let slide = 0;
  const quote = document.getElementById('testimonial-quote');
  const author = document.getElementById('testimonial-author');
  const dots = [...document.querySelectorAll('[data-slide]')];
  const showTestimonial = index => {
    slide = (index + testimonials.length) % testimonials.length;
    quote.textContent = testimonials[slide].quote;
    author.textContent = testimonials[slide].author;
    dots.forEach((dot, i) => {
      dot.classList.toggle('is-active', i === slide);
      dot.setAttribute('aria-pressed', String(i === slide));
    });
  };
  document.getElementById('testimonial-prev').addEventListener('click', () => showTestimonial(slide - 1));
  document.getElementById('testimonial-next').addEventListener('click', () => showTestimonial(slide + 1));
  dots.forEach(dot => dot.addEventListener('click', () => showTestimonial(Number(dot.dataset.slide))));

  const dialog = document.getElementById('booking-dialog');
  const form = document.getElementById('booking-form');
  const formPanel = document.getElementById('booking-form-panel');
  const successPanel = document.getElementById('booking-success-panel');
  const preview = document.getElementById('request-preview');
  const copyStatus = document.getElementById('copy-status');
  const date = document.getElementById('booking-date');
  let formattedRequest = '';

  const formatDate = value => {
    if (!value) return 'Flexible';
    const [year, month, day] = value.split('-');
    return `${month}/${day}/${year}`;
  };
  const openBooking = () => {
    closeMenu();
    form.reset();
    date.min = new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 10);
    formPanel.hidden = false;
    successPanel.hidden = true;
    copyStatus.textContent = '';
    formattedRequest = '';
    if (typeof dialog.showModal === 'function') dialog.showModal();
    else dialog.setAttribute('open', '');
  };
  const closeBooking = () => {
    if (typeof dialog.close === 'function') dialog.close();
    else dialog.removeAttribute('open');
  };
  document.querySelectorAll('[data-book]').forEach(button => button.addEventListener('click', openBooking));
  document.getElementById('dialog-close').addEventListener('click', closeBooking);
  document.getElementById('done-booking').addEventListener('click', closeBooking);
  dialog.addEventListener('click', event => { if (event.target === dialog) closeBooking(); });
  dialog.addEventListener('close', () => { form.reset(); formattedRequest = ''; });

  form.addEventListener('submit', event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    const line = (key, display) => `${display}: ${String(data.get(key) || '').trim() || 'Not provided'}`;
    formattedRequest = [
      'RIVERSIDE WELLNESS - APPOINTMENT REQUEST DEMO',
      '',
      line('name', 'Name'),
      line('email', 'Email'),
      line('phone', 'Phone'),
      line('service', 'Care interest'),
      `Preferred date: ${formatDate(String(data.get('date') || ''))}`,
      line('message', 'Additional notes'),
      '',
      'SHOWROOM DEMONSTRATION ONLY - NOT SENT OR SCHEDULED.'
    ].join('\n');
    preview.textContent = formattedRequest;
    formPanel.hidden = true;
    successPanel.hidden = false;
    successPanel.querySelector('h2').focus?.();
  });
  document.getElementById('copy-request').addEventListener('click', async () => {
    if (!formattedRequest) return;
    try {
      await navigator.clipboard.writeText(formattedRequest);
      copyStatus.textContent = 'Copied to clipboard.';
    } catch {
      copyStatus.textContent = 'Clipboard access is unavailable in this browser. You can select and copy the preview above.';
    }
  });
})();
