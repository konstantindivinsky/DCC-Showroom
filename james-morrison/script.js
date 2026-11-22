(() => {
  'use strict';

  const header = document.querySelector('.site-header');
  const menuToggle = document.querySelector('.menu-toggle');
  const mobileNav = document.getElementById('mobile-navigation');
  const navLinks = [...document.querySelectorAll('.desktop-nav .nav-link')];

  function setMenuOpen(open) {
    header.classList.toggle('menu-open', open);
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.setAttribute('aria-label', open ? 'Close navigation menu' : 'Open navigation menu');
    mobileNav.inert = !open;
  }

  menuToggle.addEventListener('click', () => setMenuOpen(!header.classList.contains('menu-open')));
  mobileNav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setMenuOpen(false)));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && header.classList.contains('menu-open')) {
      setMenuOpen(false);
      menuToggle.focus();
    }
  });
  document.addEventListener('click', event => {
    if (header.classList.contains('menu-open') && !header.contains(event.target)) setMenuOpen(false);
  });
  window.addEventListener('resize', () => {
    if (window.innerWidth > 1050) setMenuOpen(false);
  });

  const sectionIds = ['top','about','experience','insights','contact'];
  const sections = sectionIds.map(id => document.getElementById(id)).filter(Boolean);
  let scrollUpdatePending = false;
  function updateActiveNav() {
    const cutoff = window.scrollY + Math.min(window.innerHeight * .35, 220);
    let active = 'top';
    for (const section of sections) {
      if (section.offsetTop <= cutoff) active = section.id;
    }
    navLinks.forEach(link => {
      const isActive = link.getAttribute('href') === '#' + active;
      link.classList.toggle('is-active', isActive);
      if (isActive) link.setAttribute('aria-current','location');
      else link.removeAttribute('aria-current');
    });
    scrollUpdatePending = false;
  }
  window.addEventListener('scroll', () => {
    if (!scrollUpdatePending) {
      scrollUpdatePending = true;
      window.requestAnimationFrame(updateActiveNav);
    }
  }, { passive: true });
  updateActiveNav();

  const introductionDialog = document.getElementById('introduction-dialog');
  const articleDialog = document.getElementById('article-dialog');
  const narrationButton = document.getElementById('narration-button');
  const canSpeak = 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;
  let isSpeaking = false;

  function stopNarration() {
    if (canSpeak) window.speechSynthesis.cancel();
    isSpeaking = false;
    narrationButton.innerHTML = '<span aria-hidden="true">▶</span> LISTEN TO INTRODUCTION';
  }
  if (!canSpeak) {
    narrationButton.hidden = true;
    introductionDialog.querySelector('.dialog-note').textContent = 'Read the written one-minute introduction above.';
  } else {
    narrationButton.addEventListener('click', () => {
      if (isSpeaking) {
        stopNarration();
        return;
      }
      stopNarration();
      const utterance = new SpeechSynthesisUtterance(document.getElementById('introduction-text').textContent.trim());
      utterance.rate = .93;
      utterance.pitch = 1;
      utterance.onend = stopNarration;
      utterance.onerror = stopNarration;
      isSpeaking = true;
      narrationButton.innerHTML = '<span aria-hidden="true">■</span> STOP NARRATION';
      window.speechSynthesis.speak(utterance);
    });
  }
  document.querySelector('[data-open-intro]').addEventListener('click', () => introductionDialog.showModal());
  introductionDialog.addEventListener('close', stopNarration);

  const articleContent = {
    clarity: {
      title: 'Why Operational Clarity Is a Competitive Advantage',
      paragraphs: [
        'The most effective organizations have more than a strong vision. They have a shared understanding of how work gets done, where decisions are made, and what progress actually looks like.',
        'Operational clarity starts with asking practical questions. Which measures reflect real performance? What is slowing teams down? Where are responsibilities unclear? Leaders who address these questions create more room for people to do meaningful work.',
        'Clarity is not about adding layers of process. It is about removing the friction that distracts from the mission, setting clear priorities, and making it easier for everyone to move in the same direction.'
      ]
    },
    teams: {
      title: 'Building Teams That Own the Outcome',
      paragraphs: [
        'The strongest teams are not simply groups of talented individuals. They are people who understand the destination, trust one another, and take responsibility for the collective result.',
        'Leaders help create those conditions through clear expectations, consistent communication, and an environment in which ideas and concerns can be raised openly. Accountability grows when people have both the context and the autonomy to act.',
        'A healthy performance culture takes attention over time. When leaders invest in the development of their teams, success becomes less dependent on any one person and more deeply embedded in the organization.'
      ]
    },
    growth: {
      title: 'Sustainable Growth Requires More Than Momentum',
      paragraphs: [
        'Growth is exciting, but an upward trend by itself does not tell the full story. Lasting value comes from the ability to support new demand without losing sight of quality, culture, or financial discipline.',
        'Sustainable growth asks leaders to consider the capacity behind the numbers. Do teams have the tools and resources they need? Are processes scalable? Can the organization adapt when conditions change?',
        'The objective is not growth at any cost. It is to build an organization that becomes more capable as it grows, with thoughtful choices today creating more opportunity tomorrow.'
      ]
    }
  };

  document.querySelectorAll('.insight-open').forEach(button => {
    button.addEventListener('click', () => {
      const article = articleContent[button.dataset.article];
      if (!article) return;
      document.getElementById('article-title').textContent = article.title;
      const body = document.getElementById('article-body');
      body.replaceChildren(...article.paragraphs.map(paragraph => {
        const p = document.createElement('p');
        p.textContent = paragraph;
        return p;
      }));
      articleDialog.showModal();
    });
  });
  document.querySelectorAll('[data-close-dialog]').forEach(button => {
    button.addEventListener('click', () => button.closest('dialog').close());
  });
  for (const dialog of [introductionDialog, articleDialog]) {
    dialog.addEventListener('click', event => {
      if (event.target === dialog) dialog.close();
    });
  }

  const form = document.getElementById('contact-form');
  const feedback = document.getElementById('form-feedback');
  form.addEventListener('submit', event => {
    event.preventDefault();
    feedback.hidden = false;
    feedback.classList.remove('error');
    if (!form.checkValidity()) {
      feedback.classList.add('error');
      feedback.textContent = 'Please provide your name, a valid email address, and a message.';
      form.reportValidity();
      return;
    }
    feedback.textContent = 'Preview complete. This demonstration form is not connected to an inbox, so no message was sent or stored.';
    feedback.scrollIntoView({block:'nearest',behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});
  });
  document.getElementById('copyright-year').textContent = String(new Date().getFullYear());
})();
