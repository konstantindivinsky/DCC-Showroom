# Divinsky Website Showroom

A single static, mobile-friendly showroom containing **20 complete interactive website concepts**. This is an inspiration collection, **not** a template store or a menu of fixed designs. Each concept is fictional and intended to help clients discuss the possibilities for an original website.

The entire project is one website. The root `index.html` is the showroom, and every demo opens from a dedicated subfolder. The demos are preserved from their approved individual builds, including their local photos, stylesheets, scripts, forms, and interactions.

## Browse the showroom

- Central left/right industry selector, expandable to additional categories without changing the layout
- Interactive cards for each concept
- Live desktop and mobile website previews, with links to open every full demo
- Deep links: `?demo=taco-riot` or `?category=dining&demo=atelier-noir`
- Divinsky's existing dark charcoal and neon-green brand system, with the original logo files from the `DCC-Website` repository
- A section labeled **The process** explaining exploration and custom website development

## Included demos

**Automotive and motorsports (5):** Apex Motorsports, Iron & Road, Harbor Auto Service, Precision Diagnostics, Fleetline Service Co.

**Home and design (5):** Riverdale Renovations, Riverstone Remodeling, Riverstone Renovations, Riverstone Studio, Renovation Atelier.

**Food and hospitality (5):** Atelier Noir, Osteria Verde, Saltwater Social, Sunday Table, Taco Riot.

**Professional and creative (4):** Alex Mercer, James Morrison, Morgan Reeves, Richard Hartwell.

**Health and wellness (1):** Riverside Wellness.

## HestiaCP installation

No build tools, database, PHP, backend service, container, or Node.js are required. Every demo and the showroom are static HTML/CSS/JS.

1. Download the repository ZIP from GitHub using **Code > Download ZIP** (or the standard branch archive URL: `https://github.com/konstantindivinsky/DCC-Showroom/archive/refs/heads/main.zip`).
2. In Hestia File Manager, open the chosen domain's `public_html` folder. Back up anything currently there.
3. Upload the ZIP, extract it, and open the extracted `DCC-Showroom-main` folder.
4. Move **all the contents** of that folder, not the folder itself, directly into `public_html`. That includes the hidden `.htaccess` file, which keeps the showroom out of search results.
5. Verify `public_html/index.html` and `public_html/.htaccess` exist, along with `public_html/showroom/`, `public_html/apex-motorsports/`, and the other demo folders.
6. Visit the domain using HTTPS. The showroom loads at `/`, while demos load at paths like `/apex-motorsports/` and `/saltwater-social/`.

### Equivalent command line deployment

Run from the target domain's `public_html` (use a backup before replacing an existing site):

```sh
curl -fL https://github.com/konstantindivinsky/DCC-Showroom/archive/refs/heads/main.zip -o /tmp/dcc-showroom.zip
unzip -q /tmp/dcc-showroom.zip -d /tmp
cp -a /tmp/DCC-Showroom-main/. ./
```

The `./` path above must be the right `public_html`. Do not run it against another Hestia website.

## Project layout

```text
index.html                  Showroom homepage
showroom/
  app.js                    Categories, navigation and live previews
  styles.css                Responsive Divinsky showroom styling
  assets/                   Original Divinsky logo and favicon
apex-motorsports/           First original demo, moved out of the old repo root
alex-mercer/
atelier-noir/
...                         Remaining 17 demo directories
```

## Content and privacy

These concepts are demonstrations, not actual businesses or active customer services. Contact, reservation, and consultation controls inside demos may simulate preparing a request but are **not** wired to production backends. Demo phone numbers, awards, testimonials, prices, people, and performance figures may be fictional.

## Search engines

The showroom is kept out of search results on purpose, so the fictional businesses never show up as if they were real. Every page, the showroom and each demo, has `<meta name="robots" content="noindex, nofollow">`, and `.htaccess` sends the same instruction as an `X-Robots-Tag` header for everything else (images, scripts). Give any new demo the same meta tag. Don't add a `robots.txt` that blocks crawling: search engines would then never read the noindex.

The page meant to show up in search for web design is [divinsky.net/web-design/](https://divinsky.net/web-design/), which links here. *Connect with Divinsky* opens the divinsky.net contact form with *Website design* already selected. Replace imagery and confirm usage rights before reusing any concept for real clients.

## Maintaining the gallery

Add a future static demo in a new sibling folder with its own `index.html` (including the robots meta tag) and relative assets. Then add its metadata to `demos` in `showroom/app.js`, and optionally add a category to `categories`. The centered industry selector is data-driven so it does not require changes when categories are added.

**No GitHub Actions workflows or hosted runners are required.**
