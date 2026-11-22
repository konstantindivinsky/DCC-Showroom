(() => {
  'use strict';
  const menu = {
    'buttermilk-pancakes': {name:'Buttermilk Pancakes', price:12, emoji:'🥞'},
    'avocado-toast': {name:'Avocado Toast', price:12, emoji:'🥑'},
    'classic-breakfast': {name:'Classic Breakfast', price:14, emoji:'🍳'},
    'turkey-club': {name:'Turkey Club', price:14, emoji:'🥪'},
    'harvest-bowl': {name:'Harvest Bowl', price:15, emoji:'🥗'},
    'cafe-burger': {name:'Café Burger', price:15, emoji:'🍔'},
    'blueberry-pancakes': {name:'Blueberry Lemon Pancakes', price:14, emoji:'🥞'},
    'market-salad': {name:'Seasonal Market Salad', price:15, emoji:'🥗'},
    'breakfast-burrito': {name:'Breakfast Burrito', price:13, emoji:'🌯',desc:'Scrambled eggs, potatoes, cheddar, salsa verde'},
    'french-toast': {name:'Cinnamon French Toast', price:13, emoji:'🍞',desc:'Golden brioche, cinnamon sugar, maple syrup'},
    'tomato-soup': {name:'Tomato Basil Soup', price:9, emoji:'🥣',desc:'Slow-simmered tomatoes, basil, toasted sourdough'},
    'garden-sandwich': {name:'Garden Sandwich', price:13, emoji:'🥪',desc:'Cucumber, sprouts, tomato, hummus, multigrain'},
    'garden-salad': {name:'Garden Greens', price:12, emoji:'🥬',desc:'Tender greens, cucumber, tomatoes, house vinaigrette'},
    'latte': {name:'Café Latte', price:5, emoji:'☕',desc:'Double espresso with silky steamed milk'},
    'cold-brew': {name:'Cold Brew', price:5, emoji:'🧊',desc:'Slow steeped and served over ice'},
    'orange-juice': {name:'Fresh Orange Juice', price:5, emoji:'🍊',desc:'Bright, refreshing orange juice'},
    'hot-tea': {name:'Hot Tea', price:4, emoji:'🫖',desc:'A cozy cup from our tea selection'},
    'hash-browns': {name:'Hash Browns', price:5, emoji:'🥔',desc:'Crispy, golden, perfectly seasoned'},
    'side-fruit': {name:'Seasonal Fruit', price:6, emoji:'🍓',desc:'A fresh mix of seasonal favorites'},
    'toast': {name:'Sourdough Toast', price:4, emoji:'🍞',desc:'Warm toasted sourdough, butter and jam'},
    'muffin': {name:'Fresh-Baked Muffin', price:5, emoji:'🧁',desc:'Ask about our daily bakery flavor'}
  };
  const groups = {
    breakfast: {title:'More Breakfast Favorites',subtitle:'Easy mornings start here.', ids:['breakfast-burrito','french-toast']},
    lunch: {title:'More Lunch Favorites',subtitle:'Find your lunchtime happy place.', ids:['tomato-soup','garden-sandwich']},
    bowls: {title:'Bowls & Salads',subtitle:'Colorful, fresh and made with care.', ids:['harvest-bowl','market-salad','garden-salad']},
    drinks: {title:'Drinks',subtitle:'Something lovely in every cup.', ids:['latte','cold-brew','orange-juice','hot-tea']},
    sides: {title:'Sides & Bakery',subtitle:'Just one more little thing.', ids:['hash-browns','side-fruit','toast','muffin']}
  };
  const $ = (s,scope=document) => scope.querySelector(s);
  const $$ = (s,scope=document) => [...scope.querySelectorAll(s)];
  const money = n => '$' + n.toFixed(2);
  const showDialog = id => {const d=document.getElementById(id);if(d && !d.open)d.showModal()};
  const closeDialog = id => {const d=document.getElementById(id);if(d && d.open)d.close()};
  let cart = {};
  try {const saved=JSON.parse(localStorage.getItem('sunday-table-cart') || '{}');if(saved && typeof saved==='object' && !Array.isArray(saved))for(const [id,quantity] of Object.entries(saved))if(menu[id] && Number.isSafeInteger(quantity) && quantity>0 && quantity<=99)cart[id]=quantity;}catch(_){}
  let toastTimer;
  function notify(text){const el=$('#toast');el.textContent=text;el.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove('show'),2800)}
  function persist(){try{localStorage.setItem('sunday-table-cart',JSON.stringify(cart))}catch(_){} }
  function updateCounts(){const count=Object.values(cart).reduce((s,q)=>s+q,0);$$('.cart-count').forEach(el=>{el.textContent=String(count);el.hidden=!count});$('#cart-title-count').textContent=count?'('+count+')':''}
  function addItem(id){if(!menu[id])return;cart[id]=Math.min((cart[id]||0)+1,99);persist();updateCounts();renderCart();notify(menu[id].name+' added to your order');}
  function adjustQuantity(id,change){if(!menu[id])return;let next=(cart[id]||0)+change;if(next<=0)delete cart[id];else cart[id]=Math.min(next,99);persist();updateCounts();renderCart();}
  function renderCart(){
    const list=$('#cart-items');list.replaceChildren();const ids=Object.keys(cart);
    if(!ids.length){const empty=document.createElement('div');empty.className='empty-cart';empty.innerHTML='<span aria-hidden="true">☕</span><h3>Your basket is feeling hungry.</h3><p>Add something tasty from the menu to get started.</p><button type="button" id="browse-from-cart">Browse the menu</button>';list.append(empty);$('#browse-from-cart').addEventListener('click',()=>{closeDialog('order-dialog');$('#menu').scrollIntoView({behavior:'smooth'})});}
    else ids.forEach(id=>{
      const m=menu[id],row=document.createElement('div');row.className='cart-item';
      const emoji=document.createElement('span');emoji.className='item-emoji';emoji.textContent=m.emoji;emoji.setAttribute('aria-hidden','true');
      const info=document.createElement('div');info.className='cart-item-info';const title=document.createElement('h3');title.textContent=m.name;const price=document.createElement('p');price.textContent=money(m.price*cart[id]);info.append(title,price);
      const qty=document.createElement('div');qty.className='qty-controls';const minus=document.createElement('button');minus.type='button';minus.textContent='−';minus.setAttribute('aria-label','Remove one '+m.name);minus.addEventListener('click',()=>adjustQuantity(id,-1));const count=document.createElement('span');count.textContent=cart[id];const plus=document.createElement('button');plus.type='button';plus.textContent='+';plus.setAttribute('aria-label','Add one '+m.name);plus.addEventListener('click',()=>adjustQuantity(id,1));qty.append(minus,count,plus);row.append(emoji,info,qty);list.append(row);
    });
    $('#cart-total').textContent=money(ids.reduce((total,id)=>total+cart[id]*menu[id].price,0));$('#checkout-button').disabled=!ids.length;$('#checkout-button').style.opacity=ids.length?'1':'.5';$('#checkout-feedback').textContent='';
  }
  const filterButtons=$$('.filter');
  function createExtraCard(id){const m=menu[id],card=document.createElement('article');card.className='extra-card';const art=document.createElement('span');art.className='extra-icon';art.setAttribute('aria-hidden','true');art.textContent=m.emoji;const copy=document.createElement('div');copy.className='extra-copy';const title=document.createElement('h3');title.textContent=m.name;const desc=document.createElement('p');desc.textContent=m.desc||'Freshly prepared at Sunday Table';const price=document.createElement('strong');price.textContent='$'+m.price;copy.append(title,desc,price);const button=document.createElement('button');button.type='button';button.className='dish-add add-to-cart';button.setAttribute('aria-label','Add '+m.name+' to order');button.textContent='+';button.addEventListener('click',()=>addItem(id));card.append(art,copy,button);return card;}
  function filterMenu(filter,shouldScroll=false){
    const current=(filter==='all'||groups[filter])?filter:'all';filterButtons.forEach(b=>{const active=b.dataset.filter===current;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active))});
    const grid=$('#favorites-grid'),extra=$('#extra-menu');$$('.favorite-group',grid).forEach(el=>{el.hidden=current!=='all' && current!==el.dataset.group});
    if(current==='all'){grid.hidden=false;extra.hidden=true;}
    else if(current==='breakfast'||current==='lunch'){grid.hidden=false;extra.hidden=false;}
    else{grid.hidden=true;extra.hidden=false;}
    if(current!=='all'){const g=groups[current];$('#extra-menu-title').textContent=g.title;$('#extra-menu-desc').textContent=g.subtitle;const items=$('#extra-menu-items');items.replaceChildren(...g.ids.map(createExtraCard));}
    if(shouldScroll)$('#menu').scrollIntoView({behavior:'smooth',block:'start'});
  }
  filterButtons.forEach(el=>el.addEventListener('click',()=>filterMenu(el.dataset.filter)));
  $$('.view-category').forEach(el=>el.addEventListener('click',()=>filterMenu(el.dataset.filter,true)));
  $$('.add-to-cart').forEach(el=>el.addEventListener('click',()=>addItem(el.dataset.item)));
  $$('.order-trigger').forEach(el=>el.addEventListener('click',()=>{closeMobileNav();renderCart();showDialog('order-dialog')}));
  $$('.reserve-trigger').forEach(el=>el.addEventListener('click',()=>{closeMobileNav();showDialog('reserve-dialog')}));
  $$('[data-close]').forEach(el=>el.addEventListener('click',()=>closeDialog(el.dataset.close)));
  $$('#reserve-dialog, #order-dialog, #info-dialog'.split(',').map(x=>x.trim()).join(',')).forEach(d=>d.addEventListener('click',event=>{if(event.target===d)d.close()}));
  $('#checkout-button').addEventListener('click',()=>{$('#checkout-feedback').textContent='Your sample basket is ready! A live ordering system can be connected when this concept becomes a real site.'});
  const reservationForm=$('#reservation-form');const dateField=$('input[name="date"]',reservationForm);const today=new Date();const yyyy=today.getFullYear(),mm=String(today.getMonth()+1).padStart(2,'0'),dd=String(today.getDate()).padStart(2,'0');dateField.min=`${yyyy}-${mm}-${dd}`;dateField.value=dateField.min;
  reservationForm.addEventListener('submit',event=>{event.preventDefault();const data=new FormData(reservationForm);$('#reservation-feedback').textContent=`Preview: ${data.get('guests')} on ${data.get('date')} at ${data.get('time')}. This is not a confirmed reservation.`});
  function showInfo(message){$('#info-message').textContent=message;showDialog('info-dialog')}
  $('.directions-trigger').addEventListener('click',()=>showInfo('123 Maple Ave., Riverton, CA 94022 is the sample address shown in this design. Live directions and an interactive map would be connected for a real café.'));
  $$('.social-trigger').forEach(b=>b.addEventListener('click',()=>showInfo('This showroom concept has not been connected to a real social media account.')));
  const mobileToggle=$('#mobile-nav-toggle'),mobileNav=$('#mobile-nav');
  function closeMobileNav(){mobileNav.hidden=true;mobileToggle.setAttribute('aria-expanded','false');mobileToggle.setAttribute('aria-label','Open navigation');}
  mobileToggle.addEventListener('click',()=>{const open=mobileNav.hidden;mobileNav.hidden=!open;mobileToggle.setAttribute('aria-expanded',String(open));mobileToggle.setAttribute('aria-label',open?'Close navigation':'Open navigation')});
  $$('#mobile-nav a'.split(',')[0]).forEach(a=>a.addEventListener('click',closeMobileNav));
  document.addEventListener('keydown',event=>{if(event.key==='Escape')closeMobileNav()});
  updateCounts();renderCart();
})();
