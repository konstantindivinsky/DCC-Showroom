(() => {
  "use strict";

  // Each entry links to the original working site in this one repository.
  // Adding a future concept only requires an entry here and its site directory.
  const demos = [
    { id:"apex-motorsports",name:"Apex Motorsports",category:"automotive",kind:"High-performance automotive",tag:"PERFORMANCE / HIGH ENERGY",description:"An unapologetically bold experience for a high-performance tuning and fabrication shop.",image:"apex-motorsports/assets/img/hero.webp" },
    { id:"iron-and-road",name:"Iron & Road",category:"automotive",kind:"Motorcycle workshop",tag:"MOTORCYCLES / CHARACTER",description:"A rugged, editorial motorcycle workshop concept with expressive imagery and real service interactions.",image:"" },
    { id:"harbor-auto-service",name:"Harbor Auto Service",category:"automotive",kind:"Independent service center",tag:"AUTO CARE / TRUST",description:"An approachable, professional presence for a dependable neighborhood auto service center.",image:"harbor-auto-service/assets/harbor-hero.webp" },
    { id:"precision-diagnostics",name:"Precision Diagnostics",category:"automotive",kind:"Specialized vehicle diagnostics",tag:"DIAGNOSTICS / PRECISION",description:"A technology-forward service experience for advanced automotive diagnostics and repair.",image:"precision-diagnostics/assets/hero-diagnostics.webp" },
    { id:"fleetline-service-co",name:"Fleetline Service Co.",category:"automotive",kind:"Commercial fleet services",tag:"FLEET / CAPABILITY",description:"A confident industrial design for vehicle fleet maintenance and commercial service.",image:"fleetline-service-co/assets/fleetline-hero.jpg" },

    { id:"riverdale-home-renovations",name:"Riverdale Renovations",category:"home",kind:"Residential renovation",tag:"RENOVATION / CONFIDENCE",description:"A polished, inviting renovation website with warm spaces and clear service pathways.",image:"riverdale-home-renovations/assets/images/kitchen.webp" },
    { id:"riverstone-remodeling",name:"Riverstone Remodeling",category:"home",kind:"Home remodeling",tag:"REMODELING / TRUST",description:"A friendly, visually grounded remodeling concept with project stories and before-and-after comparisons.",image:"riverstone-remodeling/assets/hero-background.jpg" },
    { id:"riverstone-renovations",name:"Riverstone Renovations",category:"home",kind:"Home renovation studio",tag:"HOME / CRAFT",description:"A refined renovation brand that pairs beautiful project imagery with practical details.",image:"riverstone-renovations/assets/kitchen-after.webp" },
    { id:"riverstone-studio",name:"Riverstone Studio",category:"home",kind:"Interior design studio",tag:"DESIGN / MINIMALISM",description:"A quiet, elevated design direction built around interiors, materials, and craftsmanship.",image:"riverstone-studio/assets/hero-kitchen.webp" },
    { id:"renovation-atelier",name:"Renovation Atelier",category:"home",kind:"Boutique renovation practice",tag:"EDITORIAL / MATERIALS",description:"An intimate editorial approach to residential design, thoughtful detailing, and renovation.",image:"renovation-atelier/assets/maplewood.jpg" },

    { id:"atelier-noir",name:"Atelier Noir",category:"dining",kind:"Fine dining",tag:"DINING / DRAMA",description:"An atmospheric fine-dining concept with cinematic food photography and immersive storytelling.",image:"atelier-noir/assets/hero-steak.webp" },
    { id:"osteria-verde",name:"Osteria Verde",category:"dining",kind:"Italian restaurant",tag:"ITALIAN / HERITAGE",description:"A warm Italian restaurant website with inviting textures and a strong sense of tradition.",image:"osteria-verde/assets/hero-osteria.jpg" },
    { id:"saltwater-social",name:"Saltwater Social",category:"dining",kind:"Waterfront dining",tag:"WATERFRONT / LIFESTYLE",description:"An airy coastal destination concept with seafood, social moments, and waterfront atmosphere.",image:"saltwater-social/assets/hero-waterfront.jpg" },
    { id:"sunday-table",name:"Sunday Table",category:"dining",kind:"Cafe and brunch",tag:"CAFE / WARMTH",description:"A welcoming neighborhood cafe concept, approachable and lively without losing character.",image:"sunday-table/assets/sunday-hero.webp" },
    { id:"taco-riot",name:"Taco Riot",category:"dining",kind:"Street food and tacos",tag:"STREET FOOD / ENERGY",description:"An expressive street-food identity bursting with contrast, personality, and bold color.",image:"taco-riot/assets/hero-tacos.webp" },

    { id:"alex-mercer",name:"Alex Mercer",category:"professional",kind:"Creative portfolio",tag:"PORTFOLIO / EDITORIAL",description:"A contemporary creative portfolio that leads with work, identity, and a distinctive voice.",image:"alex-mercer/assets/alex-portrait.jpg" },
    { id:"james-morrison",name:"James Morrison",category:"professional",kind:"Professional personal brand",tag:"PERSONAL BRAND / EDITORIAL",description:"An architectural, understated personal brand website with room for substance and story.",image:"james-morrison/assets/hero-portrait.webp" },
    { id:"morgan-reeves",name:"Morgan Reeves",category:"professional",kind:"Creative professional",tag:"PERSONAL BRAND / MODERN",description:"A contemporary professional website with confident type, personal imagery, and clean structure.",image:"morgan-reeves/assets/morgan-portrait.webp" },
    { id:"richard-hartwell",name:"Richard Hartwell",category:"professional",kind:"Law practice",tag:"LEGAL / AUTHORITY",description:"A refined legal services website designed to communicate credibility and experience.",image:"" },

    { id:"riverside-wellness",name:"Riverside Wellness",category:"wellness",kind:"Health and wellness practice",tag:"WELLNESS / CALM",description:"A calm, contemporary practice website designed to feel approachable and reassuring.",image:"riverside-wellness/assets/hero-doctor.webp" }
  ];

  const categories = [
    { id:"all",title:"All concepts",description:"Every direction in one collection" },
    { id:"automotive",title:"Automotive & motorsports",description:"Performance, service, and precision" },
    { id:"home",title:"Home & design",description:"Spaces, craftsmanship, and transformation" },
    { id:"dining",title:"Food & hospitality",description:"Experiences worth gathering around" },
    { id:"professional",title:"Professional & creative",description:"Trust, identity, and expertise" },
    { id:"wellness",title:"Health & wellness",description:"Calm, care, and connection" }
  ];

  const $ = id => document.getElementById(id);
  const strip = $("demo-strip");
  const frame = $("demo-frame");
  const categoryProgress = $("category-progress");
  const browserShell = $("browser-shell");
  let categoryIndex = 0;
  let selectedId = demos[0].id;
  let mobile = false;

  const activeCategory = () => categories[categoryIndex];
  const visibleDemos = () => demos.filter(d => categoryIndex === 0 || d.category === activeCategory().id);
  const pad = number => String(number).padStart(2,"0");
  const categoryName = id => (categories.find(c => c.id === id) || categories[0]).title;

  function updateQuery() {
    try {
      const url = new URL(window.location.href);
      url.searchParams.set("demo", selectedId);
      if (categoryIndex) url.searchParams.set("category",activeCategory().id);
      else url.searchParams.delete("category");
      history.replaceState(null,"",url);
    } catch { /* Local file previews still work. */ }
  }

  function renderCategory() {
    const category = activeCategory();
    $("category-title").textContent = category.title;
    $("category-description").textContent = category.description;
    $("category-position").textContent = pad(categoryIndex+1)+" / "+pad(categories.length);
    $("results-count").textContent = visibleDemos().length;
    categoryProgress.replaceChildren();
    categories.forEach((item,index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.setAttribute("aria-label","View "+item.title);
      button.setAttribute("aria-current",String(index === categoryIndex));
      button.addEventListener("click",() => setCategory(index));
      categoryProgress.append(button);
    });
  }

  function renderCards() {
    const list = visibleDemos();
    strip.replaceChildren();
    list.forEach((item,index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "demo-card";
      button.dataset.demoId = item.id;
      button.setAttribute("aria-label","Preview "+item.name);
      button.setAttribute("aria-pressed", String(item.id === selectedId));
      const art = document.createElement("span");
      art.className = "card-art";
      if (item.image) {
        const img = document.createElement("img");
        img.src = item.image;
        img.alt = "";
        img.loading = "lazy";
        art.append(img);
      } else {
        const fallback = document.createElement("span");
        fallback.className = "card-fallback";
        fallback.textContent = item.name.split(" ").map(word=>word[0]).join("").slice(0,3).toUpperCase();
        art.append(fallback);
      }
      const number = document.createElement("span");
      number.className = "card-number";
      number.textContent = pad(index+1)+" / "+pad(list.length);
      const selected = document.createElement("span");
      selected.className = "card-selected";
      selected.textContent = "SELECTED";
      art.append(number,selected);
      const info = document.createElement("span");
      info.className = "card-info";
      const kind = document.createElement("span");
      kind.className = "card-category";
      kind.textContent = item.kind;
      const title = document.createElement("span");
      title.className = "card-title";
      title.textContent = item.name;
      const subtitle = document.createElement("span");
      subtitle.className = "card-subtitle";
      subtitle.textContent = item.tag.replace(" / "," · ");
      info.append(kind,title,subtitle);
      button.append(art,info);
      button.addEventListener("click",() => selectDemo(item.id, true));
      strip.append(button);
    });
  }

  function selectDemo(id, scrollCard=false) {
    const item = demos.find(d=>d.id === id);
    if (!item) return;
    selectedId = item.id;
    const list = visibleDemos();
    if (!list.some(d=>d.id === id)) {
      categoryIndex = 0;
      renderCategory();
      renderCards();
    }
    const current = visibleDemos();
    $("viewer-title").textContent = item.name;
    $("viewer-tag").textContent = item.tag;
    $("viewer-description").textContent = item.description;
    $("viewer-category").textContent = categoryName(item.category);
    $("viewer-index").textContent = pad(current.findIndex(d=>d.id===item.id)+1)+" / "+pad(current.length);
    $("browser-domain").textContent = "showroom / "+item.id;
    const link = item.id+"/";
    $("open-demo").href = link;
    $("viewer-text-link").href = link;
    if (frame.getAttribute("src") !== link) {
      frame.title = "Live interactive preview of "+item.name;
      frame.src = link;
    }
    strip.querySelectorAll(".demo-card").forEach(card=>{
      card.setAttribute("aria-pressed",String(card.dataset.demoId===id));
    });
    if (scrollCard) {
      const button = Array.from(strip.querySelectorAll(".demo-card")).find(b=>b.dataset.demoId===id);
      if (button) strip.scrollTo({left:button.offsetLeft-strip.offsetLeft-16,behavior:window.matchMedia("(prefers-reduced-motion: reduce)").matches?"instant":"smooth"});
    }
    updateQuery();
  }

  function setCategory(index) {
    categoryIndex = (index + categories.length) % categories.length;
    renderCategory();
    const list = visibleDemos();
    if (!list.some(d=>d.id===selectedId)) selectedId=list[0].id;
    renderCards();
    selectDemo(selectedId, true);
  }

  function advanceDemo(delta) {
    const list = visibleDemos();
    const current = Math.max(0,list.findIndex(item=>item.id===selectedId));
    selectDemo(list[(current+delta+list.length)%list.length].id, true);
  }

  function setDevice(nextMobile) {
    mobile=nextMobile;
    browserShell.classList.toggle("is-mobile",mobile);
    ["desktop","mobile"].forEach(device=>{
      const selected = mobile ? device==="mobile" : device==="desktop";
      const button = $("device-"+device);
      button.classList.toggle("is-selected",selected);
      button.setAttribute("aria-pressed",String(selected));
    });
  }

  $("category-prev").addEventListener("click",()=>setCategory(categoryIndex-1));
  $("category-next").addEventListener("click",()=>setCategory(categoryIndex+1));
  $("demo-prev").addEventListener("click",()=>advanceDemo(-1));
  $("demo-next").addEventListener("click",()=>advanceDemo(1));
  $("device-desktop").addEventListener("click",()=>setDevice(false));
  $("device-mobile").addEventListener("click",()=>setDevice(true));
  $("copyright-year").textContent = String(new Date().getFullYear());

  const menuToggle = $("menu-toggle");
  const mainNav = $("main-nav");
  menuToggle.addEventListener("click",()=>{
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded",String(!isOpen));
    menuToggle.setAttribute("aria-label",isOpen ? "Open navigation" : "Close navigation");
    mainNav.classList.toggle("is-open",!isOpen);
  });
  mainNav.querySelectorAll("a").forEach(link=>link.addEventListener("click",()=>{
    menuToggle.setAttribute("aria-expanded","false");
    mainNav.classList.remove("is-open");
  }));
  document.addEventListener("keydown",event=>{
    if (event.key==="Escape") {
      menuToggle.setAttribute("aria-expanded","false");
      mainNav.classList.remove("is-open");
    }
    if (!event.target.closest(".category-selector") && !event.target.closest(".demo-strip")) return;
    if (event.key==="ArrowLeft" || event.key==="ArrowRight") {
      event.preventDefault();
      if (event.target.closest(".category-selector")) setCategory(categoryIndex+(event.key==="ArrowRight"?1:-1));
      else advanceDemo(event.key==="ArrowRight"?1:-1);
    }
  });

  // Deep links can open directly to any of the 20 interactive examples.
  const params = new URLSearchParams(window.location.search);
  const queryId = params.get("demo");
  const queryCategory = params.get("category");
  const foundCategory = categories.findIndex(c=>c.id===queryCategory);
  if (foundCategory>=0) categoryIndex=foundCategory;
  if (demos.some(d=>d.id===queryId)) selectedId=queryId;
  if (!visibleDemos().some(d=>d.id===selectedId)) categoryIndex=0;
  renderCategory();
  renderCards();
  selectDemo(selectedId, true);
  setDevice(false);
})();
