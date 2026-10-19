# Image credits

## SAPOTR brand imagery

The client's own SAPOTR character images. Converted to WebP for the web; the
originals are the source of truth.

| File | Source | Used for |
| --- | --- | --- |
| hero-cafe-1800.png, hero-cafe-m.png, hero-instant.png, about-hero-*.png | Supplied by the client for this site | Hero banners 1–2, About hero |
| step-hire-760.webp, step-arrive-760.webp | WebP copies of the client's step-*.png | Banner 5 board |
| Banner6.jpg | Supplied by the client | Hero banner 6 (desktop) |
| banner6-m.jpg | Banner6.jpg cropped to the left 1010 px (the checklist panel left out) | Hero banner 6 (phones, portrait tablets) |
| bn-crisis.webp, bn-grow.webp | Cut out of the client's `Section 2 Images` (WA0007, WA0009) | How SAPOTR Benefits You — replacement staff and customer service cards |
| sapotr-flex.webp, sapotr-walk.webp, sapotr-watch.webp, banner4-group.webp | Copied unchanged from the frozen Brand2 site | About: mission, vision, advantage, name; banner4-group also the "Scale Staff With Demand" card |
| cta-team-1600.webp, cta-team-900.webp | Brand2 `cta-team-1400.png`, as WebP | Final CTA (the frozen CTA image) |
| ind-*.webp (9) | Brand2's work-type images, as WebP, one per category | Businesses Across NZ cards |

The `Section 2 Images` JPGs have a grey/white checkerboard painted into the
picture where a transparent background should be, so the four used here were
cut out (background removed) and saved as transparent WebP. If the client can
supply the originals with a real transparent background, re-export from those.

Not referenced by the pages any more: bn-time.webp, bn-cost.webp (cut out from
WA0008 and WA0013), step-done-760.webp, app-phone-760.webp,
bf-kitchen-760.webp (replaced in Phase 3), and hero-warehouse-1600.png /
hero-warehouse-m.png (replaced by Banner6.jpg).

## Stock photography


All photographs are from Pexels and used under the Pexels License (free for
commercial use, modification allowed, attribution not required). Each was
cropped and converted to WebP for this site. Find the original at
`https://www.pexels.com/photo/<id>/`.

| File | Pexels ID | Shows |
| --- | --- | --- |
| hero-cafe-1800.webp, hero-cafe-m.webp | 6612691 | Café manager on the phone with a tablet |
| hero-instant.webp | 8476592 | Shop assistant bagging produce at a grocery counter |
| hero-warehouse-1600.png, hero-warehouse-m.png | 4487365 | Warehouse staff in a racking aisle |
| step-hire.webp | 5410101 | Florist on the phone in her shop |
| step-arrive.webp | 36581576 | Waiter ready with a tray of drinks |
| step-done.webp | 16154014 | Grocer stocking a fruit display |
| step-repeat.webp | 36729737 | Two café staff behind the counter |
| cta-cafe.webp | 34654336 | Café owner working behind the counter |
| cta-grocery.webp | 8422726 | Grocery clerk serving a customer |
| cta-warehouse.webp | 4481328 | Warehouse team moving stock |
| about-hero-1800.webp, about-hero-m.webp | 3770091 | Restaurant staff setting up before service |
| tm-sarah.png | 36730466 | **Placeholder** testimonial portrait |
| tm-aroha.webp | 11946133 | **Placeholder** testimonial portrait |
| tm-priya.webp | 8230014 | **Placeholder** testimonial portrait |
| tm-chris.webp | 4484078 | **Placeholder** testimonial portrait |
| tm-james.webp | 27538700 | **Placeholder** testimonial portrait |
| tm-emma.webp | 7648319 | **Placeholder** testimonial portrait |

The Pexels License does not allow identifiable people to appear to endorse a
product. The six `tm-*` portraits sit beside named customer quotes, so replace
them with the real customers' own photos (with consent) before launch.

## Asset clean-up (19 October 2026)

Removed because no page, stylesheet or script refers to them. Each is still in
git (commit `b4bd89c`); to bring one back: `git checkout b4bd89c -- assets/img/<file>`.

- Stock photos the pages no longer show: about-hero-1800.webp, about-hero-m.webp,
  cta-cafe.webp, cta-groceryy.webp, cta-warehouse.webp, hero-cafe-1800.webp,
  hero-cafe-m.webp, hero-instant.webp, hero-warehouse-1600.webp, hero-warehouse-m.webp,
  step-done.webp, step-hire.webp, step-repeat.webp, tm-sarah.webp
- Older web copies replaced by newer ones: about-name-group.webp, banner4-group.webp,
  ind-cleaning.webp, ind-moving.webp, tm-sarah-800.webp
- Earlier-phase cut-outs and copies no longer used: app-phone-760.webp,
  bf-kitchen-760.webp, step-done-760.webp, bn-cost.webp, bn-crisis.webp, bn-time.webp

New web copies: tm-sarah-849.webp (of tm-sarah.png) and `assets/favicon-96.png`
(the logo mark, square, for the browser tab).

## Originals removed (19 October 2026)

The client's full-size originals were removed too, as no page uses them — only
the web copies above are served. They are still in git (commit `b7b3db5`); to
bring one back: `git checkout b7b3db5 -- "assets/img/<file>"`.

- The whole `Section 2 Images` folder (WA0007–WA0014)
- AboutUs.jpg, AboutUs.png, Aboutusehero.png, aboutassection2.png,
  about-hero-1800.png, about-hero-m.png, about-name-group.png
- Banner6th.png, BannerSix.jpg, BannerSix.png, banner4-group.png
- hero-cafe-1800.png, hero-cafe-m.png, hero-instant.png,
  hero-warehouse-1600.png, hero-warehouse-m.png
- step-arrive.png, step-done.png, step-hire.png, step-repeat.png
- bn-cost.jpg, bn-crisis.png, ind-cleaning.jpg, ind-moving.jpg, tm-sarah.png

Only files that a page, stylesheet or script refers to are kept in `assets/`.
