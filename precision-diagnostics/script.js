(function(){
  'use strict';
  const nav=document.getElementById('main-nav');
  const menu=document.querySelector('.mobile-menu-toggle');
  const dropdown=document.querySelector('.nav-dropdown');
  const dropdownToggle=document.querySelector('.dropdown-toggle');
  function closeMenu(){nav.classList.remove('is-open');menu.setAttribute('aria-expanded','false');menu.setAttribute('aria-label','Open navigation');dropdown.classList.remove('open');dropdownToggle.setAttribute('aria-expanded','false');}
  menu.addEventListener('click',()=>{const open=nav.classList.toggle('is-open');menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',open?'Close navigation':'Open navigation')});
  dropdownToggle.addEventListener('click',e=>{e.stopPropagation();const open=dropdown.classList.toggle('open');dropdownToggle.setAttribute('aria-expanded',String(open))});
  document.addEventListener('click',e=>{if(!dropdown.contains(e.target)){dropdown.classList.remove('open');dropdownToggle.setAttribute('aria-expanded','false')}});
  nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));
  window.addEventListener('resize',()=>{if(window.innerWidth>760)closeMenu()});
  document.addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu()});
  const lightData={
    engine:{name:'Check Engine',color:'amber',icon:'engine',urgency:'Schedule evaluation',meaning:'The vehicle has detected a fault in an engine, emissions, or related control system. A code points to where testing should begin, not necessarily which part needs replacing.',next:'If the light is steady and the vehicle drives normally, arrange a diagnosis soon. If it flashes or the engine runs very poorly, reduce load and stop driving when safe to prevent possible damage.'},
    battery:{name:'Battery / Charging',color:'red',icon:'battery',urgency:'Potentially urgent',meaning:'The charging system may not be maintaining electrical power. The vehicle could continue running only until available battery energy is depleted.',next:'Turn off unnecessary electrical accessories and stop in a safe place. Have the charging system evaluated promptly. Do not continue driving if the vehicle begins losing electrical functions.'},
    oil:{name:'Oil Pressure',color:'red',icon:'oil',urgency:'Stop safely',meaning:'A red oil pressure warning can indicate inadequate lubrication pressure. Continuing to operate the engine may cause rapid, severe internal damage.',next:'Pull over safely and turn off the engine as soon as possible. Check the owner’s manual and arrange professional assistance. Do not assume adding oil will resolve a pressure fault.'},
    abs:{name:'ABS / Traction',color:'amber',icon:'abs',urgency:'Evaluate soon',meaning:'Anti-lock braking or traction-control assistance may be unavailable even if basic hydraulic braking still works. Other stability functions could also be affected.',next:'Drive cautiously, leave extra stopping distance, and avoid hard braking when possible. If a red brake warning is also on or braking feels abnormal, stop driving safely and seek help.'},
    airbag:{name:'Airbag (SRS)',color:'red',icon:'airbag',urgency:'Evaluate promptly',meaning:'The supplemental restraint system has reported a fault. Airbags or seat-belt pretensioners may not perform as intended during a collision.',next:'Arrange professional diagnosis promptly. Do not attempt to probe, disconnect, or repair airbag circuits yourself.'},
    tire:{name:'Tire Pressure',color:'amber',icon:'tire',urgency:'Inspect tires',meaning:'One or more tires may be underinflated, or the tire pressure monitoring system may have a fault.',next:'Check tires for visible damage and use a gauge to verify inflation against the vehicle door-jamb placard. If a tire is severely low or damaged, stop driving and address it before continuing.'}
  };
  const warningDialog=document.getElementById('warning-dialog');
  const bookingDialog=document.getElementById('booking-dialog');
  function openDialog(dialog){if(typeof dialog.showModal==='function'){dialog.showModal()}else{dialog.setAttribute('open','')}}
  function closeDialog(dialog){if(typeof dialog.close==='function'){dialog.close()}else{dialog.removeAttribute('open')}}
  function showLight(id){const info=lightData[id];if(!info)return;document.getElementById('warning-dialog-title').textContent=info.name;document.getElementById('warning-urgency').textContent=info.urgency;document.getElementById('warning-urgency').className='urgency-tag'+(info.color==='red'?' high':'');document.getElementById('warning-meaning').textContent=info.meaning;document.getElementById('warning-next').textContent=info.next;const sym=document.getElementById('warning-dialog-symbol');sym.className='dialog-warning-icon '+info.color;sym.querySelector('use').setAttribute('href','#i-'+info.icon);document.querySelectorAll('.guide-tabs [data-warning]').forEach(button=>{button.setAttribute('aria-pressed',String(button.dataset.warning===id))});if(!warningDialog.open)openDialog(warningDialog)}
  document.querySelectorAll('[data-warning]').forEach(btn=>btn.addEventListener('click',()=>showLight(btn.dataset.warning)));
  document.querySelectorAll('[data-guide]').forEach(btn=>btn.addEventListener('click',()=>showLight('engine')));
  document.querySelectorAll('[data-booking]').forEach(btn=>btn.addEventListener('click',()=>{if(warningDialog.open)closeDialog(warningDialog);openDialog(bookingDialog)}));
  document.querySelectorAll('[data-close-dialog]').forEach(btn=>btn.addEventListener('click',()=>closeDialog(btn.closest('dialog'))));
  [warningDialog,bookingDialog].forEach(dialog=>dialog.addEventListener('click',e=>{if(e.target===dialog)closeDialog(dialog)}));
  const form=document.getElementById('booking-form');
  let latestSummary='';
  form.addEventListener('submit',e=>{e.preventDefault();if(!form.reportValidity())return;const data=new FormData(form);const clean=key=>String(data.get(key)||'').trim();latestSummary=['PRECISION DIAGNOSTICS - SERVICE INQUIRY','Name: '+clean('name'),'Phone: '+clean('phone'),'Vehicle: '+clean('vehicle'),'Preferred contact: '+clean('contact'),'Concern: '+clean('concern')].join('\n');document.getElementById('booking-summary').textContent=latestSummary;document.getElementById('booking-result').hidden=false;document.getElementById('copy-status').textContent='';document.getElementById('booking-result').scrollIntoView({block:'nearest',behavior:'smooth'})});
  document.getElementById('copy-summary').addEventListener('click',async()=>{const status=document.getElementById('copy-status');try{if(!navigator.clipboard?.writeText)throw Error('clipboard unavailable');await navigator.clipboard.writeText(latestSummary);status.textContent='Summary copied. Call the number above to discuss your request.'}catch(e){const area=document.getElementById('booking-summary');const selection=window.getSelection();const range=document.createRange();range.selectNodeContents(area);selection.removeAllRanges();selection.addRange(range);status.textContent='Select and copy the highlighted summary.'}});
})();
