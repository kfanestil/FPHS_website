# FPHS_website

Website for Fanny Pack Home Services, a handyman and home services business in the Orlando metro.

Live site: https://fanny-pack.net

## Domains

All three domains are registered and managed in Cloudflare.

| Domain | Role |
|---|---|
| fanny-pack.net | Main site. Apex and www are custom domains on the Cloudflare Pages project; www redirects to the apex. |
| fannypackhomeservices.com | 301 to fanny-pack.net, path preserved (Page Rules, `https://fanny-pack.net/$1`). Also the Google Workspace primary domain, so its MX records must stay. |
| fannypackhs.com | 301 to fanny-pack.net, path preserved (Page Rules). |

Contact email on the site: hello@fanny-pack.net (alias on the Google Workspace account; fanny-pack.net is a user alias domain).

## Hosting and deploys

- Cloudflare Pages project `fanny-pack-home-services` (`fanny-pack-home-services.pages.dev`).
- No build step and no framework: plain static HTML with CSS inlined per page.
- A push to `main` deploys in about 15 to 20 seconds.
- `functions/api/reviews.js` is a Pages Function for the Google reviews feed (`REVIEWS_LIVE` flag).
- `_redirects` holds the in-site redirects (retired Tampa Bay pages, `_archive/`).
- Quote form posts to Formspree.

## When the domain changes

Update canonical tags, `og:url`, `og:image`, JSON-LD, `sitemap.xml`, `robots.txt`, `llms.txt`, and `llms-full.txt` together. Grep for the old domain before calling it done.
