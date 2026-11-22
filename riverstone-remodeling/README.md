# Riverstone Home Remodeling

A mobile-first, dependency-free, single-page inspirational website, based closely on the supplied Riverstone concept reference.

## Preview / deploy

Open `index.html` in a modern browser to explore the site, or upload the **contents** of this folder to a HestiaCP domain's `public_html` directory. No build command, database, backend, or API keys are required.

## Interactive features

- Responsive mobile navigation and services dropdown
- Draggable and keyboard-accessible before/after kitchen comparison
- Service cards that preselect the service on the project planning form
- Project form with client-side validation and a *local-only summary preview*, plus copy-to-clipboard
- Functional section links, focus styles, accessible dialogs, and reduced-motion handling

## Demo notice

This is a **design concept**, not a live Riverstone business website. Names, experience metrics, rating, testimonial, locations, and contact workflow are placeholders derived from the supplied concept. The project form intentionally does not transmit information. Connect it to a real email delivery or backend service, and replace all claims and business details with verified client information, before publishing as a real business website.

The website's images are adapted/cropped from the user-provided visual reference in this project and stored locally under `assets/` so the site does not depend on external image services. `make_assets.py` documents the extraction for future use; it is not required for deployment.
