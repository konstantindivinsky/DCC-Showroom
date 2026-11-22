(() => {
  'use strict';

  const navToggle = document.querySelector('.mobile-menu-toggle');
  const mainNav = document.querySelector('.main-nav');
  const closeNav = () => {
    mainNav.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', 'Open navigation');
  };
  navToggle.addEventListener('click', () => {
    const open = mainNav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(open));
    navToggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  });
  mainNav.querySelectorAll('a, button').forEach(link => link.addEventListener('click', closeNav));
  document.addEventListener('click', event => {
    if (mainNav.classList.contains('open') && !event.target.closest('.site-header')) closeNav();
  });

  let currentModal = null;
  let focusBeforeModal = null;
  const modalNames = new Set(['full-menu', 'wine', 'private', 'reservations']);
  const openModal = name => {
    if (!modalNames.has(name)) return;
    if (currentModal) closeModal(false);
    else focusBeforeModal = document.activeElement;
    currentModal = document.getElementById(`dialog-${name}`);
    currentModal.hidden = false;
    document.body.classList.add('modal-open');
    requestAnimationFrame(() => {
      const first = currentModal.querySelector('.modal-close');
      if (first) first.focus();
    });
  };
  const closeModal = (returnFocus = true) => {
    if (!currentModal) return;
    currentModal.hidden = true;
    document.body.classList.remove('modal-open');
    currentModal = null;
    if (returnFocus && focusBeforeModal && typeof focusBeforeModal.focus === 'function') focusBeforeModal.focus();
  };

  document.querySelectorAll('[data-modal]').forEach(el => el.addEventListener('click', () => openModal(el.dataset.modal)));
  document.querySelectorAll('[data-close-modal]').forEach(el => el.addEventListener('click', () => closeModal()));
  document.querySelectorAll('[data-switch-modal]').forEach(el => el.addEventListener('click', () => openModal(el.dataset.switchModal)));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') { closeModal(); closeNav(); }
    if (event.key !== 'Tab' || !currentModal) return;
    const candidates = Array.from(currentModal.querySelectorAll('button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), a[href]')).filter(node => node.offsetParent !== null);
    if (!candidates.length) return;
    const first = candidates[0], last = candidates[candidates.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  });

  const menuData = {
    antipasti: [
      ['Burrata del Casale', 'Creamy burrata, heirloom tomatoes, fresh basil, extra-virgin olive oil'],
      ['Fiori di Zucca Ripieni', 'Delicate squash blossoms stuffed with ricotta and lemon', '16'],
      ['Antipasto della Casa', 'A little of everything, served to share']
    ],
    primi: [
      ['Pappardelle al Ragù', 'Slow-braised beef, red wine, Parmigiano'],
      ['Risotto ai Funghi', 'Carnaroli rice, wild mushrooms, Parmigiano, truffle oil', '28'],
      ['Gnocchi al Pomodoro', 'Pillowy potato gnocchi and a slow-cooked tomato sauce']
    ],
    secondi: [
      ['Tagliata di Manzo', 'Grilled sliced beef, arugula, aged balsamico'],
      ['Branzino al Forno', 'Mediterranean sea bass, roasted tomatoes and olives', '32'],
      ['Pollo al Limone', 'Golden roast chicken with lemon and fresh herbs']
    ],
    dolci: [
      ['Tiramisù della Casa', 'A classic, the way Nonna made it'],
      ['Panna Cotta', 'Silky vanilla cream and seasonal fruit'],
      ['Affogato', 'Espresso poured over vanilla gelato']
    ]
  };
  const menuItems = document.getElementById('menu-items');
  const renderMenu = category => {
    menuItems.replaceChildren();
    menuData[category].forEach(([name, description, price]) => {
      const article = document.createElement('article'); article.className = 'menu-item';
      const line = document.createElement('div'); line.className = 'menu-item-title';
      const h3 = document.createElement('h3'); h3.textContent = name; line.append(h3);
      if (price) { const tag = document.createElement('span'); tag.textContent = price; line.append(tag); }
      const p = document.createElement('p'); p.textContent = description;
      article.append(line, p); menuItems.append(article);
    });
  };
  const tabs = Array.from(document.querySelectorAll('[data-menu-tab]'));
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => { t.classList.toggle('active', t === tab); t.setAttribute('aria-selected', String(t === tab)); });
      renderMenu(tab.dataset.menuTab);
    });
    tab.addEventListener('keydown', event => {
      if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return;
      event.preventDefault();
      tabs[(index + (event.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length].click();
      tabs[(index + (event.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length].focus();
    });
  });
  renderMenu('antipasti');

  const reservationForm = document.getElementById('reservation-form');
  const reservationDate = document.getElementById('reservation-date');
  const localToday = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  reservationDate.min = localToday();
  reservationForm.addEventListener('submit', event => {
    event.preventDefault();
    if (!reservationForm.reportValidity()) return;
    const details = new FormData(reservationForm);
    const dateText = new Date(`${details.get('date')}T12:00:00`).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
    const name = String(details.get('name')).trim();
    const guests = String(details.get('guests'));
    const time = String(details.get('time'));
    const note = String(details.get('notes')).trim();
    document.getElementById('reservation-summary').textContent = `${name}, your sample request is for ${guests} on ${dateText} at ${time}.${note ? ` Note: ${note}` : ''}`;
    reservationForm.hidden = true;
    document.getElementById('reservation-result').hidden = false;
    document.getElementById('edit-request').focus();
  });
  document.getElementById('edit-request').addEventListener('click', () => {
    document.getElementById('reservation-result').hidden = true;
    reservationForm.hidden = false;
    reservationDate.focus();
  });
})();
