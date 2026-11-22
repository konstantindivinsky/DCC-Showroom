# Riverdale Home Renovations | Website Showroom Concept

A fully static, responsive, interactive renovation-company concept site, built to reflect the provided Riverdale design reference.

## Hestia deployment

1. Extract the ZIP into the desired domain's `public_html` directory. `index.html`, `styles.css`, `app.js`, `assets/`, and `robots.txt` must be in the same document root.
2. Serve it as a normal static website, with no build step, PHP, database, API keys, or dependencies.
3. Load the website and verify its mobile and desktop layout.

## Functionality

- Multi-select renovation rooms, with sensible whole-home exclusivity.
- Renovation style selection.
- Adjustable minimum and maximum budget slider.
- Automatic preliminary range calculated from illustrative per-room assumptions and style factors.
- Budget mismatch notice when the preferred maximum is below the estimated minimum.
- Estimate dialog collecting contact/timeline information locally and generating a project brief the visitor can copy or download.
- Navigation, mobile menu, service quick-selection, renovation-gallery carousel and gallery detail previews.
- Accessible keyboard controls, semantic labels and reduced-motion support.

## Important: showroom content, not a live business site

**Do not deploy this publicly as a real contractor website without replacing or verifying the sample information.** Riverdale branding, phone number `(555) 827-4100`, customer trust claims, gallery items, and the one-business-day estimate promise are **illustrative content taken from the user's reference design** and are not independently verified. Gallery images are crops of the user-provided reference image, not actual Riverdale portfolio photography. All budget ranges are **demonstration assumptions**, not current contractor quotes or financial advice. The estimate request is **front-end only**: it does not send information to any server. It generates a downloadable, copyable local project brief.

The site is `noindex, nofollow` and `robots.txt` disallows indexing until production content is approved. Once real details, photos, copy, and lead-form processing have been approved and integrated, remove those directives if public indexing is desired.

## Files

- `index.html`: semantic page, SVG icon symbols, dialogs and forms.
- `styles.css`: responsive layout and styling.
- `app.js`: all interactive behaviors and local brief generation.
- `assets/images/*.webp`: local room and finish photo crops from the provided image.
- `assets/favicon.svg`: Riverdale-inspired site icon.