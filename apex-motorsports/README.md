# Apex Motorsports | Standalone website concept

A fully functional, mobile-first, static motorsports website based on the supplied visual reference. This is **website #1** in a greenfield series. There is intentionally **no showroom application, category selector, or showroom-specific navigation** in this deliverable.

## What is included
- Responsive single-page design with real semantic HTML, CSS, and vanilla JavaScript.
- Working desktop dropdowns and mobile navigation.
- Package selectors that populate the project inquiry form.
- Clickable featured builds with project-detail dialogs.
- Interactive booking-request dialog and form validation.
- Inquiry-summary and booking-summary copying, without pretending a backend is connected.
- Local WebP imagery derived from regions of the user-provided concept image.

## Hestia deployment
1. Extract the ZIP locally.
2. Upload the **contents** of `apex-motorsports` into your site's `public_html` directory on Hestia (so `index.html` is at the web root).
3. Open the domain. No Node, database, PHP, build step, or .htaccess is needed.

You can also preview locally by opening `index.html`, or serve the folder with `python3 -m http.server 8080`.

## Important design-demo notes
- Apex Motorsports is a fictional demo brand and does not represent a real operating shop.
- The displayed prices, power gains, build details and availability are illustrative only.
- Booking and contact controls **do not send** or store messages. They validate details and prepare a copyable summary. Connect a production backend or scheduling service before using these controls for real clients.
- Images are crops of the user-provided visual concept, which gives the first implementation unusually close visual fidelity. For a real client production launch, replace with licensed full-resolution originals.
- Google Fonts (`Barlow`, `Barlow Condensed`) load when an internet connection is available; system fonts provide fallback offline. No JavaScript libraries or CDN dependencies.

## Folder structure
```
index.html
assets/
  css/styles.css
  js/site.js
  img/*.webp
```
