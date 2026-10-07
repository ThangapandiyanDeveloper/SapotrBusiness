# SAPOTR Business — website for businesses that need staff

The Business site of SAPOTR (NZ's last-minute staff support), a sister to the
frozen Staff Partner site in `../Brand2`. It shares that site's brand system
(tokens, header, buttons, arrows, motion) but has its own content, photography
and section designs. Plain HTML, CSS and vanilla JavaScript — no framework, no
build step, no dependencies.

## Structure

    index.html      header (About Us dropdown), hero (6 banners), category ticker,
                    benefits bento, industry card rail (details on demand), safety & trust
                    (card rail on phones), testimonials, growth, 3 hire steps, FAQ
                    (2 columns), CTA, footer
                    · FAQPage + Organization JSON-LD
    about.html      hero, how SAPOTR got its name, the problem, then mission, vision
                    and the SAPOTR advantage as a zig-zag, get in touch, careers,
                    brand CTA, footer
    styles.css      one stylesheet for both pages: tokens, sections, responsive,
                    reduced motion
    script.js       one script for both pages: header + dropdown, reveals,
                    carousel engine (hero + testimonials), ticker loop, card rails
                    (industries + safety), accordions (industries + FAQ), count-up,
                    store links, back to top
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

The industry cards and, on phones, the safety cards run on a second engine
(`rail()` in `script.js`), the frozen site's work-types rail:

- Cards sit side by side and the track slides: three per view on a desktop,
  two on a tablet, one wide card (the next one peeking in) on a phone. How many
  show is set in CSS (`--rail-per`, and the card width under 680px); the script
  only measures.
- Arrows, dots, a swipe or mouse drag and a sideways trackpad scroll each move
  exactly one card; the arrows wrap at either end. Autoplay moves one card
  every 4.2 s and rewinds at the end.
- Autoplay waits 5 s after any touch, and pauses on hover, while an opened
  industry card is in view, off screen, in a hidden tab, and always with
  reduced motion. Tabbing to a card out of view brings it in.
- When every card already fits (the safety cards above 680px) the rail is
  static and its arrows and dots are hidden. Without JavaScript each rail is a
  plain scroll-snapping row.

## Before launch

- **Testimonial photos** (`assets/img/tm-*.webp`) are stock placeholders. Swap
  each one for the real customer's own photo, with their consent — stock
  licences do not allow a model to appear to endorse a product.
- **Store links**: set `APP_LINKS` at the top of section 12 in `script.js`; every
  "Download the App" button and store badge picks them up. Until then they are
  placeholders that do nothing (as on the Staff Partner site).
- **Social links** in both footers are placeholders (`data-placeholder`).
- **Social card**: once the Business domain is known, make `og:image` absolute
  and add `og:url` + `<link rel="canonical">` on both pages.
- **"Become a SAPOTR"** links to `https://www.sapotr.co.nz/` (the Staff Partner site).

## Assets

Only files referenced by the pages should be kept in `assets/`; remove any image
that stops being referenced. Where every image comes from is listed in
`assets/img/CREDITS.md`.

Typography note: Plus Jakarta Sans has a narrow word space, so headings carry a
small positive `word-spacing` (see section 2 of `styles.css`). Keep it when
tightening `letter-spacing`, or words start to run together again.
