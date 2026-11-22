/* Taco Riot | fully static, dependency-free interactive design concept */
'use strict';

const menu = {
  tacos: [
    { id:'al-pastor', name:'AL PASTOR RIOT', price:4.50, tag:'FAN FAVORITE', description:'Marinated pork, grilled pineapple, red onion, cilantro and riot sauce.' },
    { id:'birria', name:'THE BIRRIA BOMB', price:5.25, tag:'DIP IT', description:'Slow-braised beef, melted cheese, onion, cilantro and rich consommé.' },
    { id:'street-chicken', name:'STREET CHICKEN', price:4.75, tag:'A CLASSIC', description:'Chargrilled chicken, salsa verde, shredded cabbage and a squeeze of lime.' },
    { id:'cauli', name:'CAULI POWER', price:4.50, tag:'PLANT POWER', description:'Crispy cauliflower, chipotle crema, pickled onions and fresh herbs.' }
  ],
  burritos: [
    { id:'california', name:'CALIFORNIA CRUNCH', price:12.50, tag:'LOADED', description:'Carne asada, crispy fries, cheese, pico de gallo and avocado crema.' },
    { id:'chicken-burrito', name:'CHICKEN RIOT WRAP', price:11.50, tag:'ALL THE GOOD STUFF', description:'Grilled chicken, cilantro rice, black beans, cheese and smoky sauce.' },
    { id:'veggie-burrito', name:'GREEN MACHINE', price:10.50, tag:'VEGGIE', description:'Roasted vegetables, rice, beans, guac and tomatillo salsa.' }
  ],
  quesadillas: [
    { id:'cheese-quesa', name:'MELTDOWN', price:9.50, tag:'CHEESE PLEASE', description:'Golden griddled tortilla packed with three cheeses and salsa.' },
    { id:'steak-quesa', name:'STEAK ATTACK', price:12.00, tag:'BIG FLAVOR', description:'Grilled steak, sizzling peppers and a serious amount of melted cheese.' },
    { id:'mushroom-quesa', name:'WILD THING', price:10.00, tag:'VEGGIE', description:'Garlic mushrooms, pepper jack, scallions and chipotle aioli.' }
  ],
  bowls: [
    { id:'riot-bowl', name:'THE RIOT BOWL', price:12.75, tag:'NO TORTILLA NEEDED', description:'Cilantro rice, black beans, salsa, corn, avocado and your choice of protein.' },
    { id:'veggie-bowl', name:'COLOR EXPLOSION', price:11.25, tag:'PLANT POWER', description:'Roasted vegetables, fresh greens, pico, lime rice and citrus dressing.' }
  ],
  sides: [
    { id:'cali-fries', name:'CALI FRIES', price:6.50, tag:'EXTRA CRISPY', description:'Golden fries covered in queso, crema, salsa and chopped cilantro.' },
    { id:'chips-guac', name:'CHIPS & GUAC', price:5.50, tag:'DIP DIP HOORAY', description:'Fresh tortilla chips and chunky house-style guacamole.' },
    { id:'street-corn', name:'STREET CORN', price:4.75, tag:'CROWD FAVORITE', description:'Charred sweet corn, cotija, chili-lime mayo and tajín.' }
  ],
  drinks: [
    { id:'agua-fresca', name:'PINK RIOT FRESCA', price:4.25, tag:'ICE COLD', description:'Fruity, bright and poured over plenty of ice.' },
    { id:'limeade', name:'ELECTRIC LIMEADE', price:3.75, tag:'ZING!', description:'Tart lime and a sweet little kick.' },
    { id:'soda', name:'FOUNTAIN DRINK', price:2.99, tag:'THE CLASSIC', description:'Pick a cold, fizzy favorite.' }
  ]
};
const extras = {
  'riot-combo':{id:'riot-combo',name:'RIOT COMBO',price:14.99,description:'Two tacos, Cali fries and a drink.'},
  'riot-tee':{id:'riot-tee',name:'RIOT TEE',price:25,description:'Black Taco Riot logo tee.'},
  'riot-cap':{id:'riot-cap',name:'CROWN CAP',price:20,description:'Black cap with yellow crown.'}
};
const productIndex = Object.fromEntries([...Object.values(menu).flat(),...Object.values(extras)].map(i=>[i.id,i]));
const $ = (s,root=document)=>root.querySelector(s);
const $$ = (s,root=document)=>[...root.querySelectorAll(s)];
const currency = value => new Intl.NumberFormat('en-US',{style:'currency',currency:'USD'}).format(value);
const safe = str => String(str).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let cart = {};
try { const old = JSON.parse(localStorage.getItem('taco-riot-demo-cart')||'{}'); cart = Object.fromEntries(Object.entries(old).filter(([id,q])=>productIndex[id]&&Number.isInteger(q)&&q>0&&q<=99)); } catch { cart={}; }
let mode = 'pickup';
let activePanel = null;
let returnFocus = null;
let toastTimer;

function toast(message){
  const box=$('#toast'); box.textContent=message; box.classList.add('show'); clearTimeout(toastTimer);
  toastTimer=setTimeout(()=>box.classList.remove('show'),3600);
}
function saveCart(){try{localStorage.setItem('taco-riot-demo-cart',JSON.stringify(cart));}catch{}}
function count(){return Object.values(cart).reduce((a,b)=>a+b,0)}
function subtotal(){return Object.entries(cart).reduce((sum,[id,q])=>sum+productIndex[id].price*q,0)}
function renderCart(){
  const container=$('#cart-items');
  const n=count();
  $('#cart-count').textContent=n;
  $('[data-open-cart]').setAttribute('aria-label',`Open shopping cart, ${n} item${n===1?'':'s'}`);
  $('#cart-subtotal').textContent=currency(subtotal());
  if(!n){container.innerHTML='<div class="empty-cart"><b>NOTHING IN HERE. YET.</b><p>Your taco situation needs immediate attention.</p><button type="button" data-go-menu>SEE THE MENU ➜</button></div>';}
  else{container.innerHTML=Object.entries(cart).map(([id,q])=>{
    const item=productIndex[id];
    return `<div class="cart-line"><div><h3>${safe(item.name)}</h3><p>${safe(item.description)}</p><div class="qty-tools"><button type="button" data-qty="${id}" data-delta="-1" aria-label="Remove one ${safe(item.name)}">−</button><strong>${q}</strong><button type="button" data-qty="${id}" data-delta="1" aria-label="Add one ${safe(item.name)}">+</button></div></div><strong class="cart-price">${currency(item.price*q)}</strong></div>`;
  }).join('');}
}
function addItem(id){if(!productIndex[id])return;cart[id]=Math.min(99,(cart[id]||0)+1);saveCart();renderCart();toast(`${productIndex[id].name} ADDED TO YOUR RIOT CART!`)}
function changeQty(id,delta){if(!cart[id])return;cart[id]+=delta;if(cart[id]<=0)delete cart[id];cart[id]&&=Math.min(99,cart[id]);saveCart();renderCart()}
function renderMenu(category='tacos'){
  if(!menu[category])return;
  $$('#menu-tabs [data-tab]').forEach(btn=>{const selected=btn.dataset.tab===category;btn.classList.toggle('active',selected);btn.setAttribute('aria-selected',String(selected));});
  $('#food-list').innerHTML=menu[category].map(item=>`<article class="food-card"><span class="food-tag">${safe(item.tag)}</span><h3>${safe(item.name)}</h3><p>${safe(item.description)}</p><strong class="food-price">${currency(item.price)}</strong><button class="add-food" type="button" data-add-food="${safe(item.id)}" aria-label="Add ${safe(item.name)} to cart">ADD TO CART +</button></article>`).join('');
}
function openPanel(name){
  closePanel(false);
  returnFocus=document.activeElement;
  activePanel=name;
  $('#drawer-backdrop').hidden=false;
  document.body.style.overflow='hidden';
  if(name==='cart'){$('#cart-drawer').hidden=false;renderCart();$('#cart-drawer [data-close-panel]').focus();}
  if(name==='merch'){$('#merch-modal').hidden=false;$('#merch-modal [data-close-panel]').focus();}
}
function closePanel(restoreFocus=true){
  $('#cart-drawer').hidden=true;$('#merch-modal').hidden=true;$('#drawer-backdrop').hidden=true;document.body.style.overflow='';activePanel=null;
  if(restoreFocus&&returnFocus&&typeof returnFocus.focus==='function')returnFocus.focus();
}
function chooseMode(next){
  mode=next;
  $$('[data-mode]').forEach(b=>b.classList.toggle('selected',b.dataset.mode===mode));
  const notes={pickup:'Pickup selected for your demo order.',delivery:'Delivery selected. Address and delivery coverage would be confirmed in a live store.',catering:'Catering selected. A live site would collect the event date, guest count and location.'};
  $('#order-type-note').textContent=notes[mode];
}
function closeNav(){const nav=$('#main-nav');nav.classList.remove('nav-open');$('.mobile-toggle').setAttribute('aria-expanded','false');$('.mobile-toggle').setAttribute('aria-label','Open menu')}
function navigateMenu(category){renderMenu(category);closeNav();$('#full-menu').scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});}

$('#year').textContent=new Date().getFullYear();
renderMenu();renderCart();

document.addEventListener('click',event=>{
  const target=event.target;
  const navToggle=target.closest('.mobile-toggle');
  if(navToggle){const open=$('#main-nav').classList.toggle('nav-open');navToggle.setAttribute('aria-expanded',String(open));navToggle.setAttribute('aria-label',open?'Close menu':'Open menu');return;}
  if(target.closest('[data-open-cart], [data-open-order]')){closeNav();openPanel('cart');return;}
  if(target.closest('[data-open-merch]')){closeNav();openPanel('merch');return;}
  if(target.closest('[data-close-panel]')||target.closest('#drawer-backdrop')){closePanel();return;}
  const tab=target.closest('[data-tab]');if(tab){renderMenu(tab.dataset.tab);return;}
  const category=target.closest('[data-category]');if(category){navigateMenu(category.dataset.category);return;}
  const add=target.closest('[data-add-food]');if(add){addItem(add.dataset.addFood);return;}
  if(target.closest('[data-add-combo]')){addItem('riot-combo');return;}
  if(target.closest('[data-add-special]')){addItem('al-pastor');return;}
  const merch=target.closest('[data-add-merch]');if(merch){addItem(merch.dataset.addMerch==='tee'?'riot-tee':'riot-cap');return;}
  const qty=target.closest('[data-qty]');if(qty){changeQty(qty.dataset.qty,Number(qty.dataset.delta));return;}
  const modeButton=target.closest('[data-mode]');if(modeButton){chooseMode(modeButton.dataset.mode);return;}
  const orderOption=target.closest('[data-order-mode]');if(orderOption){chooseMode(orderOption.dataset.orderMode);openPanel('cart');return;}
  if(target.closest('[data-go-menu]')){closePanel();navigateMenu('tacos');return;}
  if(target.closest('#checkout-button')){toast('DEMO ONLY! NO REAL PAYMENT OR ORDER IS PLACED.');return;}
  const eventButton=target.closest('[data-event]');if(eventButton){toast(`${eventButton.dataset.event.toUpperCase()} IS A SAMPLE EVENT. NO RSVP WAS SENT.`);return;}
  if(target.closest('[data-notify]')){toast('LOCATION UPDATES ARE A DEMO FEATURE. NO SIGNUP WAS SUBMITTED.');return;}
  const like=target.closest('[data-like]');if(like){const liked=like.getAttribute('aria-pressed')==='true';like.setAttribute('aria-pressed',String(!liked));like.firstChild.textContent=liked?'♡ ':'♥ ';return;}
  if(target.closest('[data-nav]'))closeNav();
});

document.addEventListener('keydown',event=>{
  if(event.key==='Escape'){if(activePanel)closePanel();else closeNav();}
  if(event.key==='Tab'&&activePanel){
    const panel=activePanel==='cart'?$('#cart-drawer'):$('#merch-modal');
    const focusable=$$('button:not(:disabled), a[href], input:not(:disabled)',panel).filter(el=>el.offsetParent!==null);
    if(!focusable.length)return;
    const first=focusable[0],last=focusable[focusable.length-1];
    if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}
    else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}
  }
});
