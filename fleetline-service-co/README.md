# Fleetline Service Co. - Website Showroom Concept

An original, mobile-first, **functional static website** inspired by the supplied Fleetline reference image. No framework, Node build, CDN, external font, map API or backend is required.

## Deploy on Hestia

1. Unzip the contents into the intended domain's `public_html` directory.
2. Verify `index.html`, `styles.css`, `script.js` and `assets/` are in that directory together.
3. Visit the domain via HTTPS.

For local review, open `index.html` in a browser, or run `python3 -m http.server 8080` within this directory and visit `http://localhost:8080`.

## Interactions

- Desktop navigation with working Services and Resources menus, mobile hamburger menu, accessible keyboard operation.
- Service panels and anchor links scroll to details.
- Interactive plan selector on mobile, three-column plans on desktop, plan comparison dialog.
- Scheduling request modal with form validation, preselected service or plan, and a copyable browser-only summary.
- 24/7 call actions use the **phone number visible in the provided reference image**.
- FAQ accordions, responsive map illustration, keyboard focus styling and reduced-motion support.

## Demo content and assets

This is a **concept example**, not a live operating business. The contact number, coverage region, statistics and plan details are based on the supplied visual reference but have not been independently verified. Partner names are intentionally **fictional** to avoid implying an actual relationship with the recognizable companies shown in the inspiration image. The site makes the illustrative nature of the material explicit, including in the footer.

The form does not transmit or store contact details. It creates a summary locally in the browser. To convert this to a live client site, connect it to an approved server-side submission endpoint, replace placeholder claims and partners with verified customer-supplied content, confirm service boundaries and response metrics, and update SEO metadata and `robots`.

The brand logo and hero imagery were derived from **the reference image provided for this showroom project**. All other visuals, UI, content and styles are live HTML, CSS or inline SVG.