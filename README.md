# DCC Showroom v5

A static, Hestia-deployable **website concept showroom with 20 functional HTML demo websites**. Created for Divinsky Computer Consulting (DCC) to inspire conversations about bespoke client websites.

## The important distinction

These demos are **not products to choose from a menu**. They illustrate different design languages, information architectures, and possible user journeys. Every real client website needs a separate discovery process, authentic content, client-owned imagery or licensed artwork, and a tailored build.

**Live HTML is the default preview.** The optional **Reference Image** tab shows the previously approved concept board for comparison only. The site also offers a color picker and device-width preview.

## Publish to Hestia

1. Create or select your web domain in Hestia.
2. Extract the contents of this ZIP into the domain's `public_html/`, not into a second nested folder.
3. Check that `index.html`, `preview.html`, `templates/`, and `assets/` are directly inside `public_html/`.
4. Visit the domain and open the live website for each industry.
5. HTTPS should be configured through Hestia as usual.

No PHP, database, build tool, Node server, external fonts, or external photo service is needed for these demos. All images used by the site are included locally.

The showroom is intentionally marked `noindex,nofollow`; these are concept demonstrations, not real client businesses.

## Directory structure

- `index.html`: DCC-branded main showroom with an expandable, data-driven category carousel and concept gallery.
- `preview.html`: site chooser, desktop/tablet/mobile viewport, four working color palettes per design, saved ideas, and reference artwork tab.
- `assets/data.js`: the category/concept registry (edit this to expand the collection).
- `assets/showroom.css`, `assets/showroom.js`: main gallery styling and interactions.
- `assets/preview.css`, `assets/preview.js`: preview UI styling and interactions.
- `assets/demo-v5.css`, `assets/demo-v5.js`: **real demo website styling and client-side functionality**.
- `assets/hero/`, `assets/detail/`: local web images used inside the HTML websites.
- `assets/boards/`: reference mockup images, shown *only when requested*.
- `templates/<concept-id>/index.html`: **20 full multi-section, interactive HTML pages**, each with its own site structure and style.
- `CLAUDE-REVIEW-HANDOFF.md`: independent review brief.

## Demo interactions

- Restaurant menu filtering and local-only demo bag, reservation form simulation, wine and event selectors.
- Remodeling before-and-after comparison range slider, image gallery modal, project-planning choices and discussion summary.
- Garage service tabs, warning-light educational selector, build options, service inquiry form and fleet plan guidance.
- Professional portfolios, filtered initiatives, inquiry forms, timeline and practice-area exploration.
- Every site has responsive navigation, a floating 4-color palette dock, and a return link to the showroom.
- No demo form sends, stores, or schedules anything. Real integration is not included.

## Add a business category

Edit `assets/data.js` and add a new entry under `categories` with a unique `id`. Add one or more entries to `concepts` that point to static HTML pages in `templates/`, with local hero/detail/board imagery. The home carousel and concept gallery populate from the data file automatically and do not require HTML changes.

## Palettes

Each concept has four palettes with these keys: `bg`, `panel`, `ink`, `muted`, `accent`, `accentText` and `accentInk`.

- `accentText` is the text color on accent buttons. It must reach 4.5:1 against `accent`.
- `accentInk` is the accent shade used for small accent text (eyebrows, numerals) and the keyboard focus ring. It must reach 4.5:1 against both `bg` and `panel`. If it is missing, the plain `accent` is used.
- The same palette list lives in three places and must match: `assets/data.js`, `catalog.json`, and the `window.DCC_SITE` block in the template. The template's `<body style>` holds palette 1 so the page looks right before the script runs.

## Legal and content notes

- Example business names, projects, roles, claims, images and storylines are fictional. Do not copy unverified statements into client production sites.
- No named client branding is used in sample designs.
- Do not present generated professional faces as photographs of actual client employees.
- Photo crops were taken from approved concept artwork, with local files supplied in this package. Original artwork is not a client's licensed photo library.
- No real payment, reservation, booking, email, or service submission occurs in these demos.

## Testing

All 20 demo HTML pages rendered at desktop (1440 px) and mobile (390 px) viewport widths. Automated checks covered page errors, horizontal overflow, section structure, core demo forms, menu bag, warning selector, planner, and comparison slider. Local browser security restrictions prevented an end-to-end test using an actual hosted domain, so verify deployment paths, click-through and mobile devices after publishing to Hestia.

## Source control

Intended repository: `konstantindivinsky/DCC-Showroom`. This ZIP includes the complete deployable site, source code and local artwork. Do not upload private customer artwork or credentials into this public repository.
