# Milestone 2 — Content decisions

`BRIEFING.md` (root, English, base language) is the single source of truth for the public site's content, and `docs/milestone-2/BRIEFING.es.md` is the official Spanish version used for the `es/` pages. Both are the official 4Geeks files (repo `4GeeksAcademy/ai-engineering-syllabus`, commit `ae89516`), kept unmodified and checked by SHA-256 (see `verification.md`, S01).

These are the only places where the site deliberately differs from the briefing text:

| Briefing text | What the site does | Why |
| --- | --- | --- |
| "12 years of experience in the Latin American market" / "12 años de experiencia en el mercado latinoamericano" | "12 years of experience in the Spanish and US markets" / "12 años de experiencia en los mercados español y estadounidense" | Nexova operates from Valencia and Miami, as the briefing itself says ("Regional presence: Spain and United States"). Developer decision; `BRIEFING.md` is not changed. |
| Schema.org JSON: `"@context": "<https://schema.org>"` and `"url": "<https://nexova.com>"` (English briefing) | The page markup uses the plain URLs `https://schema.org` and `https://nexova.com` | The angle brackets are a Markdown autolink artefact and would make the JSON-LD invalid. Everything else is copied exactly, including `"addressRegion": "Comunidad Valenciana"`. The Spanish pages use the Spanish briefing's JSON (`"description": "Consultora de recursos humanos y adquisición de talento"`). |
| Emails in angle brackets: `<contacto@nexova.com>`, `<name@company.com>` | The site shows the plain address | Markdown autolinks, not part of the address. |
| Form option labels | Spanish labels come from the Spanish briefing; option `value` attributes are the same in both languages | One set of values for validation and a future backend, two sets of visible labels. |
| Language scope ("multilingual support is optional but highly recommended") | Bilingual site: English (base) at the root, Spanish under `es/` | Nexova operates between Spain and Miami; English stays complete as the base language. |
| Images (not part of the briefing text) | The landing page shows the two office photos `assets/valencia.webp` and `assets/miami.webp` (from the Milestone 1 design) | Images: office photos used with the developer's confirmed permission (2026-10-23), including the people visible in the Miami photo. |
