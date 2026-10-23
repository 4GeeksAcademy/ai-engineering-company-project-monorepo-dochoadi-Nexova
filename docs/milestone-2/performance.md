# Milestone 2 — Performance (Lighthouse on the public Codespaces URL)

Evidence for criterion E13: "Performance verified with a minimum score of 80 (ideal above 90) using PageSpeed Insights on the public Codespaces URL, or Lighthouse from Chrome DevTools if PageSpeed cannot reach Codespaces".

- **Public URL:** <https://fantastic-space-doodle-q76p5vgw97r6cqrp-8080.app.github.dev/> (GitHub Codespaces, port 8080 set to Public by the developer)
- **Date:** 2026-10-23
- **Tool:** **Lighthouse 13.5.0** (command line), run by the developer on the public Codespaces URL. This is the fallback the brief allows, because PageSpeed Insights could not reach the site (see below). The screenshot files keep their `pagespeed-*.png` names.
- **Served by:** `pnpm serve:site` (`dist/` only, no caching). Before the run, `/.env`, `/.git/config`, `/.mcp.json`, `/package.json` and `/memory-bank/` all returned 404 on the public URL.

The URL is temporary (a Codespaces port) and contains no secrets. That is acceptable for an academic project. The developer sets port 8080 back to **Private** after the pull request has been reviewed.

## Why not PageSpeed Insights

PageSpeed Insights only reached GitHub's "You are about to access a development port served by someone's codespace" page. Codespaces shows that page to any visitor who is not signed in, so PageSpeed measured the warning page, not the site.

![GitHub Codespaces warning page "You are about to access a development port served by someone's codespace", which PageSpeed Insights reached instead of the site](./screenshots/pagespeed-codespaces-warning-page.png)

This capture was taken by the coding agent with an anonymous headless browser on 2026-10-23 (the same view PageSpeed gets), because the developer's own capture was not in the repository.

## Scores on the public URL (Lighthouse 13.5.0)

| Page | Device | Performance | Accessibility | Best practices | SEO |
| --- | --- | --- | --- | --- | --- |
| Home `/` | Mobile | **99** | 100 | 100 | 61 |
| Home `/` | Desktop | **100** | 100 | 100 | 61 |
| Form `/application.html` | Mobile | **95** | 100 | 100 | 61 |
| Form `/application.html` | Desktop | **100** | 100 | 100 | 61 |

Every Performance score is above 90 (minimum 80). Mobile metrics: home FCP 1.5 s, LCP 1.8 s, TBT 20 ms, CLS 0; form FCP 1.3 s, LCP 1.8 s, TBT 180 ms, CLS 0.

**Why SEO is 61 on the public URL:**
- GitHub Codespaces adds the header `x-robots-tag: noindex, nofollow` to every forwarded port (checked with `curl -I` on the public URL), and Lighthouse fails "Page is blocked from indexing" because of it.
- `robots.txt` did not exist yet when the screenshots were taken (see below).
- Neither comes from the pages themselves. On a real host (`nexova.com`) the header is not there.

### Screenshots

Home, mobile:

![Lighthouse 13.5.0 on the public URL, home page, mobile: Performance 99, Accessibility 100, Best practices 100, SEO 61](./screenshots/pagespeed-home-mobile.png)

Home, desktop:

![Lighthouse 13.5.0 on the public URL, home page, desktop: Performance 100, Accessibility 100, Best practices 100, SEO 61](./screenshots/pagespeed-home-desktop.png)

Form, mobile:

![Lighthouse 13.5.0 on the public URL, application form, mobile: Performance 95, Accessibility 100, Best practices 100, SEO 61](./screenshots/pagespeed-form-mobile.png)

Form, desktop:

![Lighthouse 13.5.0 on the public URL, application form, desktop: Performance 100, Accessibility 100, Best practices 100, SEO 61](./screenshots/pagespeed-form-desktop.png)

## Local Lighthouse for comparison

Lighthouse 13.5.0 run locally on the documented server (S08 command; reports in [`lighthouse/`](./lighthouse/)). The runs below are from S09, after `robots.txt` and `sitemap.xml` were added. The public-URL screenshots above were taken **before** that change.

| Page | Performance | Accessibility | Best practices | SEO |
| --- | --- | --- | --- | --- |
| `/` | 95 | 100 | 100 | 92 |
| `/application.html` | 100 | 100 | 100 | 92 |
| `/es/` | 100 | 100 | 100 | 92 |
| `/es/application.html` | 100 | 100 | 100 | 92 |

S08 recorded 100 / 100 / 100 / 92 on all four pages; Performance moves a few points between runs.

## SEO 92 with the strict security policy (accepted by the developer)

- `robots.txt` is valid and served (`200 text/plain`), but Lighthouse fetches it from inside the page.
- The pages' Content-Security-Policy says `connect-src 'none'`, which blocks every network request from page scripts, so form data can never leave the browser. It also blocks Lighthouse's fetch ("Fetch of robots.txt failed: … CSP violation"), which costs the last SEO points.
- Search engines read `robots.txt` directly, not through the page, so they are not affected.
- Decision (developer, after S09): `connect-src 'none'` stays, and SEO 92 is accepted.

## Why the scores are good

Compiled, minified Tailwind CSS (about 42 KB, only the classes used, no CDN), 1200 px WebP photos with explicit sizes and lazy loading, the self-hosted Instrument Sans font with `preload`, `defer`red scripts, a cascade animation that creates its work phase by phase (no long task), and no third-party requests at all.
