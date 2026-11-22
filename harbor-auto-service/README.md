# Harbor Auto Service | Website Showroom Concept

A functional static, responsive website that closely follows the supplied Harbor Auto Service reference layout. This is **an original demonstration site, not an actual operating business**.

## Quick deployment to Hestia

1. Extract the archive.
2. Upload **the contents of `harbor-auto-service/`** (not the enclosing directory) into the desired domain's `public_html` directory.
3. Visit the domain. No build process, package manager, database or backend is required.

You can also open `index.html` directly in a modern browser for a local preview.

## Working interactions

- Responsive desktop and mobile navigation, with accessible services dropdown/menu.
- Service tiles populate the booking form.
- Booking date and time choices, with appropriate Saturday hours and Sunday closure.
- Validated appointment preview dialog with copyable summary.
- Expand/collapse full pricing panel.
- Live anchor links and tap-to-call phone number.
- Keyboard focus states, semantics, reduced-motion handling.

## Explicitly not connected

The booking form does **not** transmit information, reserve a time, or collect customer data. It displays an honest local preview of the selection. Phone, address, prices, reviews, certifications, warranty and business history are fictional showroom placeholders based on the design reference. Replace all such details with real client-provided information before public use. The map is a decorative illustration, not actual directions.

## Files

- `index.html`: semantic site structure and SVG icon definitions
- `css/styles.css`: layout, colors, responsive rules
- `js/app.js`: interactions and demo booking flow
- `assets/harbor-hero.webp`: photographic hero crop derived from the user-supplied design reference, with its text area covered so real HTML text can be overlaid
- `assets/favicon.svg`: site icon

No external dependencies, CDNs, remote fonts, analytics or tracking.
