# Riverstone Studio website concept

A complete, responsive, dependency-free static website, based on the supplied Riverstone Studio design reference. Intended as an inspirational design example for the DCC Website Showroom, not as a real business or a reusable client template.

## Publish on Hestia

1. Unzip this package.
2. Upload the **contents** of the `riverstone-studio` folder, including `index.html`, `styles.css`, `script.js`, and the `assets` directory, into the destination domain's `public_html` directory.
3. Visit the domain. No database, build step, PHP runtime, npm, or third-party image host is required.

## Included interactions

- Responsive mobile navigation with keyboard dismissal
- Working category filters for the concept portfolio
- Project-details lightbox with previous/next buttons and arrow-key navigation
- Section navigation and service links
- Validated inquiry form in safe demo mode, with an inquiry preview and copy-to-clipboard
- Keyboard-friendly controls, descriptive image alternatives, and reduced-motion support

## Before making a real client site

- The brand, service descriptions, project names, and portfolio are **illustrative**.
- The supplied screenshot was used to derive its own photographic crops; complementary editorial interiors were generated for the concept. Do not present these images as actual project photographs.
- No real email address is assumed, and this demo does **not** collect or transmit submitted data.
- To enable opening an addressed email draft, set `CONTACT_EMAIL` at the top of `script.js` to the verified recipient email. A production contact form with server-side delivery and spam protection would require a real backend or form service.
- Replace imagery, project information, business name, and copy with approved client material before production use.

## Files

- `index.html`: All page sections and content
- `styles.css`: Editorial visual system, responsive layout, and accessibility styles
- `script.js`: Navigation, portfolio, lightbox, and contact demo interactions
- `assets/`: Local optimized WebP images and SVG favicon
