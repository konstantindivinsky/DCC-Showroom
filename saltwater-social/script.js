(() => {
  'use strict';
  const qs = (selector, root = document) => root.querySelector(selector);
  const qsa = (selector, root = document) => [...root.querySelectorAll(selector)];
  const navToggle = qs('.mobile-nav-toggle');
  const nav = qs('#mainNav');
  const dialogs = qsa('dialog');
  const closeNav = () => {
    nav.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', 'Open menu');
  };
  navToggle.addEventListener('click', () => {
    const open = navToggle.getAttribute('aria-expanded') !== 'true';
    navToggle.setAttribute('aria-expanded', String(open));
    navToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    nav.classList.toggle('is-open', open);
  });
  qsa('.main-nav a').forEach(link => link.addEventListener('click', closeNav));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeNav(); });
  document.addEventListener('click', e => {
    if (!nav.contains(e.target) && !navToggle.contains(e.target)) closeNav();
  });

  // All modal interfaces are local-only demonstrations, with no server requests.
  dialogs.forEach(dialog => {
    qsa('[data-close-modal]', dialog).forEach(button => button.addEventListener('click', () => dialog.close()));
    dialog.addEventListener('click', e => {
      const box = dialog.getBoundingClientRect();
      if (e.clientX < box.left || e.clientX > box.right || e.clientY < box.top || e.clientY > box.bottom) dialog.close();
    });
  });
  const show = dialog => { if (!dialog.open) dialog.showModal(); };
  const menuDialog = qs('#menuDialog');
  const menuItems = qs('#menuItems');
  const menu = {
    mains: [
      ['Dayboat Catch', 'Chef’s seasonal selection, charred lemon, market vegetables', 'MP'],
      ['Butter-Poached Lobster', 'Sweet corn, herbs, drawn butter, tender fingerlings', '48'],
      ['Crispy-Skin Striped Bass', 'Summer beans, preserved lemon, coastal herb vinaigrette', '38'],
      ['Harbor Fish & Chips', 'Beer-battered local fish, sea salt fries, house tartar', '27']
    ],
    raw: [
      ['Local Oysters', 'Daily selection, house mignonette, cocktail sauce', 'MP'],
      ['Littleneck Clams', 'Chilled on the half shell with lemon', '18'],
      ['Shrimp Cocktail', 'Jumbo chilled shrimp, spicy cocktail sauce', '21'],
      ['The Harbor Tower', 'Oysters, shrimp, clams, and chef’s market selections', 'MP']
    ],
    small: [
      ['Crab & Corn Fritters', 'Old Bay aioli, lemon, tender herbs', '19'],
      ['Heirloom Tomato Salad', 'Whipped ricotta, basil, sherry vinaigrette', '17'],
      ['New England Chowder', 'Clams, smoked bacon, oyster crackers', '15'],
      ['Little Gem Caesar', 'White anchovy, parmesan, sourdough crumbs', '16']
    ],
    drinks: [
      ['The Saltwater Martini', 'Gin or vodka, coastal botanicals, lemon twist', '18'],
      ['Harbor Spritz', 'Bitter orange, sparkling wine, soda, citrus', '17'],
      ['Summer Tide', 'White rum, cucumber, lime, fresh mint', '17'],
      ['Sunset Paloma', 'Blanco tequila, pink grapefruit, sea salt', '18']
    ]
  };
  const renderMenu = category => {
    qsa('.menu-tab').forEach(tab => {
      const active = tab.dataset.tab === category;
      tab.classList.toggle('is-active', active);
      tab.setAttribute('aria-selected', String(active));
    });
    menuItems.replaceChildren();
    menu[category].forEach(([name, description, price]) => {
      const article = document.createElement('article');
      article.className = 'menu-item';
      const header = document.createElement('div');
      header.className = 'menu-item-top';
      const heading = document.createElement('h3');
      heading.textContent = name;
      const priceNode = document.createElement('span');
      priceNode.className = 'price';
      priceNode.textContent = price === 'MP' ? 'MP' : '$' + price;
      header.append(heading, priceNode);
      const details = document.createElement('p');
      details.textContent = description;
      article.append(header, details);
      menuItems.append(article);
    });
  };
  qsa('[data-open-menu]').forEach(button => button.addEventListener('click', e => {
    e.preventDefault();
    closeNav();
    renderMenu(button.dataset.menuTab || 'mains');
    show(menuDialog);
  }));
  qsa('.menu-tab').forEach(tab => tab.addEventListener('click', () => renderMenu(tab.dataset.tab)));
  qsa('[data-dialog-link]').forEach(link => link.addEventListener('click', () => menuDialog.close()));
  renderMenu('mains');

  const dateInput = qs('#reserveDate');
  const today = new Date();
  const localISO = date => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  dateInput.min = localISO(today);
  const tomorrow = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
  dateInput.value = localISO(tomorrow);
  qs('#reservationForm').addEventListener('submit', e => {
    e.preventDefault();
    const [year, month, day] = dateInput.value.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    const dateText = date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
    const guests = qs('#reserveGuests');
    const time = qs('#reserveTime');
    qs('#bookingSummary').textContent = `${dateText}  ·  ${guests.options[guests.selectedIndex].text}  ·  ${time.options[time.selectedIndex].text}`;
    show(qs('#bookingDialog'));
  });
  qs('#editBooking').addEventListener('click', () => {
    qs('#bookingDialog').close();
    qs('#reserveDate').focus();
  });

  const eventDialog = qs('#eventDialog');
  qs('#eventButton').addEventListener('click', () => show(eventDialog));
  qs('#eventForm').addEventListener('submit', e => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const result = qs('#eventResult');
    result.replaceChildren();
    const heading = document.createElement('h3');
    heading.textContent = 'An Occasion to Remember';
    const description = document.createElement('p');
    description.textContent = `Thanks, ${String(data.get('name')).trim()}. This preview demonstrates an inquiry for ${data.get('guests')} guests. No information has been sent or stored.`;
    const reset = document.createElement('button');
    reset.type = 'button';
    reset.className = 'button button-outline';
    reset.textContent = 'Start Another Inquiry';
    reset.addEventListener('click', () => {
      qs('#eventForm').reset();
      qs('#eventForm').hidden = false;
      result.hidden = true;
    });
    result.append(heading, description, reset);
    qs('#eventForm').hidden = true;
    result.hidden = false;
  });
  eventDialog.addEventListener('close', () => {
    qs('#eventForm').hidden = false;
    qs('#eventResult').hidden = true;
    qs('#eventForm').reset();
  });

  qsa('.gallery-item').forEach(item => item.addEventListener('click', () => {
    const full = qs('#galleryFull');
    full.src = item.dataset.image;
    full.alt = qs('img', item).alt;
    qs('#galleryCaption').textContent = item.dataset.caption;
    show(qs('#galleryDialog'));
  }));
  qs('#year').textContent = new Date().getFullYear();
})();
