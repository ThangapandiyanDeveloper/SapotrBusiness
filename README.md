# SAPOTR Business — website for businesses that need staff

The Business site of SAPOTR (NZ's last-minute staff support), a sister to the
frozen Staff Partner site in `../Brand2`. It shares that site's brand system
(tokens, header, buttons, arrows, motion) but has its own content, photography
and section designs. Plain HTML, CSS and vanilla JavaScript — no framework, no
build step, no dependencies.

## Structure

    index.html      header (About Us dropdown), hero (6 banners), benefits,
                    industries (accordions), safety & trust, testimonials,
                    growth, 3 steps, FAQ, CTA, footer · FAQPage + Organization JSON-LD
    about.html      hero, how SAPOTR got its name, the problem, mission, vision,
                    the SAPOTR advantage, get in touch, careers, brand CTA, footer
    styles.css      one stylesheet for both pages: tokens, sections, responsive,
                    reduced motion
    script.js       one script for both pages: header + dropdown, reveals,
                    carousel engine (hero + testimonials), hire steps,
                    accordions, count-up, store links, back to top
    assets/img/     web-ready WebP crops of the photos listed in CREDITS.md

## Local preview

    python -m http.server 8000

Then open <http://localhost:8000>.

## How the carousels work

The hero and the testimonials run on one engine (`carousel()` in `script.js`):

- One slide at a time, cross-faded. Autoplay (hero 6–8 s per banner,
  testimonials 8 s), and 11–14 s after a manual move.
- Arrows, swipe (touch or mouse drag), sideways trackpad scroll and ←/→/Home/End
  each move exactly one slide; moves made during a fade are merged into one.
- Autoplay pauses for keyboard focus, a drag, hovering the controls (or the
  quote), when off screen and when the tab is hidden. With reduced motion there
  is no autoplay.

## Before launch

- **Testimonial photos** (`assets/img/tm-*.webp`) are stock placeholders. Swap
  each one for the real customer's own photo, with their consent — stock
  licences do not allow a model to appear to endorse a product.
- **Store links**: set `APP_LINKS` at the top of section 11 in `script.js`; every
  "Download the App" button and store badge picks them up. Until then they are
  placeholders that do nothing (as on the Staff Partner site).
- **Social links** in both footers are placeholders (`data-placeholder`).
- **Social card**: once the Business domain is known, make `og:image` absolute
  and add `og:url` + `<link rel="canonical">` on both pages.
- **"Become a SAPOTR"** links to `https://www.sapotr.co.nz/` (the Staff Partner site).
- **Git remote**: this folder was cloned from the Staff Partner repo and still
  pushes to the same `origin`. Point it at its own repository before pushing,
  or the frozen Staff Partner site will be overwritten.

## Assets

Only files referenced by the pages are kept in `assets/`; remove any image that
stops being referenced. The SAPOTR wordmark and mark are the official brand
files; every photograph is listed in `assets/img/CREDITS.md`.
