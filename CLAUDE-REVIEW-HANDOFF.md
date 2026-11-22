# Independent review: DCC Showroom v5

## Objective

Review a **static, interactive collection of 20 original concept websites** for Divinsky Computer Consulting. Prior output relied too heavily on screenshots; v5 must demonstrate actual HTML, CSS and JavaScript page layouts that prospects can navigate and interact with. The approved artwork remains reference material, not the implementation.

## Business intent

The showroom is a **conversation starter**, not an off-the-shelf template shop. It should encourage a custom discovery conversation about the visitor's objectives, brand, customers, and features. The four business categories are restaurants, renovations, auto/motorcycle garages, and professional profiles, each with five distinct visual and structural approaches.

## Requirements to preserve

- DCC brand direction: charcoal, neon green, technical geometry, responsive and accessible navigation.
- Homepage category carousel left/right controls; expandable from `assets/data.js` without homepage redesign.
- Front end static only, deployable into Hestia `public_html/`.
- Preview opens **Live Website** first. Reference Image is optional and clearly identified.
- Four palette options on every page; they change actual CSS variables, not only a static image.
- No em dashes in rendered copy, no third-party client branding.
- Navigation must be labeled The Process.
- Fictional names: Jack Miller, Jill Parker, John Davis, Sarah Wilson, Steve Carter.
- No pretend submission, booking, payment, testimonials, fake ratings or unverifiable professional claims.
- Sample forms demonstrate the workflow but never transmit contact data.

## Code

- `index.html` + `assets/showroom.js`/`.css`: landing site.
- `preview.html` + `assets/preview.js`/`.css`: preview controls, color choices, reference art, live iframe.
- `assets/data.js`: data-driven category and concept registry.
- `templates/*/index.html`: independent functional site experiences.
- `assets/demo-v5.css` + `.js`: common behavior with bespoke HTML and page architecture for the 20 sites.
- `assets/hero`, `assets/detail`: local photographic artwork crops.
- `assets/boards`: approved mockup image references.

## Review focus

1. Compare 20 actual HTML layouts and confirm their structural differences are meaningful.
2. Test the live preview and full-page navigation across desktop/tablet/mobile.
3. Verify all on-page interactions: menus, sample bag, no-network form simulation, modal galleries, choice selectors, warning-light guide, before/after slider, and palette changes.
4. Check 320/375/390/768/1024/1440 widths, keyboard and focus behavior, reduced-motion preferences, color contrast and semantic structure.
5. Look for ghost links, duplicate or missing ids, XSS risk, missing assets, and incorrect ARIA or responsive behavior.
6. Flag any remaining screenshot-derived artwork that contains stray UI words or generated text and recommend where licensed photography should replace it.
7. Flag claims, credentials, representative headshots and industry-specific regulatory issues that would need verified client information for real use.
8. Verify Hestia ZIP structure and no unexpected network, PHP, database or build dependencies.

Please return a prioritized issue list with file paths and reproducible steps. No redesign, major rewrite or deployment without approval.
