# Milestone 3 — How other recruitment systems model this (benchmark)

**Goal:** check the Milestone 3 domain model (`model.md`) against how established recruitment software models candidates, jobs and hiring processes, and decide what to change.

**Rule for this milestone:** the brief grades "entity names, fields and types match BRIEFING.md exactly". So the briefing model is implemented **as is**. Anything learned here becomes either a small documented addition that changes no briefing field, or a note for a later milestone.

Sources: the public API documentation and guides of three widely used systems, plus the schema.org standard and published material on candidate matching (links at the end). Field lists come from public docs and third-party integration guides, so they show the general shape, not every field.

## 1. The core entities: same shape as the industry

| Nexova (briefing) | Greenhouse (in-house hiring ATS) | Lever (in-house hiring ATS) | Bullhorn (staffing and recruiting **agencies**, like Nexova) | schema.org |
|---|---|---|---|---|
| `Candidate` | Candidate | Contact | Candidate | Person |
| `Vacancy` | Job | Posting | JobOrder (linked to a ClientCorporation) | JobPosting |
| `SelectionProcess` (candidate + vacancy + stage + score) | Application (one per candidate per job) + Application stages | Opportunity (a candidacy tied to a posting, in a pipeline) | JobSubmission (links a candidate to a job order, with a status) | — |

**Verdict: the model matches.** Every system separates the person, the job, and the link between them. Nexova's `SelectionProcess` is the industry's "application", "opportunity" or "submission". Bullhorn is the closest comparison, because it serves agencies that fill jobs **for client companies**, which is exactly what Nexova does.

## 2. Stages

| Topic | Industry | Nexova (briefing) | Decision |
|---|---|---|---|
| Stage list | Configurable per job or pipeline. Lever fixes only "New applicant/lead" at the start and "Offer" at the end | A fixed list: Screening → Interview → Technical test → Final interview → Offer → Hired / Rejected | Keep (briefing). The fixed list is enough for a first engine. |
| Stage history | Greenhouse keeps one row per stage visit with entry and exit times | One `stage` plus `createdAt` and `updatedAt` | Keep. Future: a stage-history list, to measure time per stage. |
| Rejection | Lever requires an archive **reason**. "Hired" is the only fixed reason; anything else means rejected | A "Rejected" stage with no reason (only free-text `notes`) | Keep. Future: a `rejectionReason` field, for reports on why candidates drop out. |
| One process per candidate and job | Greenhouse: one application per candidate per job | Not stated | Future check (duplicate process). Out of scope for M3. |

## 3. The vacancy (job) fields

| Topic | Industry | Nexova (briefing) | Decision |
|---|---|---|---|
| Client company | Bullhorn: a JobOrder points to a ClientCorporation entity | `companyName: string` | Keep (briefing). Superseded by Part 3: `ClientCompany` is added as an extension. |
| Salary | schema.org `baseSalary` is a monetary amount with currency and period. Google asks for the real offered pay, not an estimate | `salaryRangeMin` / `salaryRangeMax` in USD | Keep. Record that every amount is in USD (period not stated: assumed monthly, consistent with the sample data). Valencia roles in EUR are a future concern. |
| Employment type | schema.org `employmentType` (full-time, contract…) is on about 82 % of real postings | Not in the briefing; only `isRemote` and `location` | Future field. |
| Skills | schema.org `skills` is free text or a defined term. Real postings use it rarely and inconsistently (comma lists) | `requiredSkills` / `preferredSkills` as `string[]`, split into required and preferred | Keep. The required/preferred split is **better structured** than most postings. |

## 4. Matching and scoring

| Topic | Industry | Nexova (briefing) | Decision |
|---|---|---|---|
| Method | A weighted score over several factors. Examples: skills 0.35, experience 0.25, location 0.15, salary 0.10 (an academic platform); mandatory criteria 80 % and optional 20 % (a vendor) | Weighted points: skills 40, experience 20, seniority 15, English 15, salary 10. Required skills count more than preferred ones | **Matches the industry pattern.** The weights are reasonable for an agency (skills first). |
| Location / remote | Often a factor (e.g. 0.15) | `remoteOnly` and `isRemote` exist but are **not scored** | Keep the briefing formula. Note: a remote-only candidate can be ranked for an on-site vacancy. Future: a location factor or filter. |
| Experience | A penalty that grows with the gap to the job's level | In range 20, 1–2 years outside 10, more 0 | Matches. |
| Skill synonyms | Keyword matching misses synonyms (JS vs JavaScript), so modern systems add a semantic layer | Exact, case-insensitive match | Keep for M3 (deterministic, explainable). Future: a synonym list, or embeddings in the CV-matching agent milestone. |
| **Explainability** | Recruiters see **why** a score is high or low (which skills matched, what is missing). This also enables bias audits | The briefing returns only a number | **Recommended addition:** a pure function that returns the score **broken down by part** (skills, experience, seniority, English, salary). `calculateCandidateScore` keeps the briefing signature and adds the parts together. No briefing field changes. |
| Human decision | Sources warn that treating a match score as a hiring decision is the most common failure mode | The briefing ranks candidates for consultants | Record the principle: the score is a ranking aid, never an automatic rejection. This is consistent with the planned CV-matching agent ("rankings with reasons, never auto-reject"). |

## 5. Outcome for Milestone 3
1. **The domain model stays exactly as in the briefing.** It matches the industry's three-entity shape and an agency setup like Bullhorn's.
2. **One recommended addition:** a score breakdown, for explainability. It is a separate pure function; `calculateCandidateScore` and every briefing field stay unchanged.
3. **Documented assumptions:** all money in USD per month; the score is a ranking aid, never an automatic rejection; remote preference is not part of the briefing score.
4. **Future model extensions (not built now):**
   - a `Client` entity (superseded by Part 3: built as `ClientCompany`);
   - stage history with entry and exit dates;
   - `rejectionReason`;
   - one process per candidate and vacancy;
   - `employmentType`;
   - salary currency and period;
   - skill synonyms;
   - a location factor;
   - mapping the M2 form's English levels (Basic…Native) to CEFR (A1…Native).

## Sources
- Greenhouse Harvest API: [applications](https://harvestdocs.greenhouse.io/reference/applications), [application stages](https://harvestdocs.greenhouse.io/reference/application-stages), [Knit API directory (Greenhouse)](https://getknit.dev/blog/greenhouse-api-directory-0zj8dx/)
- Lever: [developer FAQ](https://hire.sandbox.lever.co/developer/support), [Knit API directory (Lever)](https://getknit.dev/blog/lever-api-directory.md), [Pipedream: archive opportunity](https://pipedream.com/apps/lever/actions/archive-opportunity)
- Bullhorn: [REST API docs](https://bullhorn.github.io/rest-api-docs), [creating a submission](https://bullhorn.github.io/Creating-a-Submission), [custom objects](https://bullhorn.github.io/Custom-Objects)
- schema.org: [JobPosting](https://schema.org/JobPosting), [Schemas for JobPostings in practice](https://skeptric.com/schema-jobposting)
- Matching: [JobMatchAI (arXiv)](https://arxiv.org/pdf/2603.14558), [explainable match scores (Perfect)](https://www.goperfect.com/blog/ai-scoring-for-applicants-how-explainable-match-scores-are-changing-recruiting-in-2026), [Eightfold engineering blog](https://eightfold.ai/engineering-blog/ai-powered-talent-matching-the-tech-behind-smarter-and-fairer-hiring/), [AI candidate matching glossary](https://join-dev.com/en/glossary/ai-candidate-matching), [Clara](https://www.clara.works/blog/core-engine)

---

# Part 2 — Market research update (2026-11-18): what else the market models, and a peer example

> Superseded where it differs from Part 3: the briefing entities stay exact, and 6 extension entities are added (including `ClientCompany`).

## A. A peer's model ("Client → ClientRequest → Vacancy → Application ← Candidate")
Another interpretation of the same milestone models the Sales side: a **Client** (name, tax id) sends a **ClientRequest** (with a contact: email or phone, at least one), which opens a **Vacancy** (title, **positions to fill**, **gross annual salary range in EUR**); **Applications** link candidates to vacancies with a short status (underReview, finalist, hired, rejected).

| Peer model | Our model (official briefing) | Outcome |
|---|---|---|
| Candidate (id, fullName) | Candidate (14 fields) | Covered, richer |
| Application (status ×4) | SelectionProcess (stage ×7, score, notes, dates) | Covered, richer |
| Vacancy (clientRequestId, positionsToFill, EUR gross annual range) | Vacancy (companyName, skills, experience, English, seniority, USD range, remote) | Mostly covered; the three missing fields go to the backlog (they would change a graded interface) |
| Client, ClientRequest, contact type | — | Backlog (Data model) |
| Worked case: "one vacancy with two positions; a person can apply to several vacancies" | — | **Adopted now** as sample data (no field change) |
| Footer "implemented / pending" | — | **Adopted now** as a progress table in `model.md` |

## B. What the wider market models that we do not (yet)
| Area | What the market does | Source type | Outcome for M3 |
|---|---|---|---|
| **Recruiting KPIs** | Time to fill, time to hire, source of hire, offer acceptance rate, submission-to-interview and interview-to-offer ratios, stage-by-stage funnel | Recruiting-metrics guides, SHRM figures quoted by them | **Two reports added now**, built only from existing briefing fields: `countProcessesByStage` (the pipeline funnel) and `calculateAverageTimeToHire` (days from `createdAt` to `updatedAt` for "Hired" processes). Offer acceptance and stage-to-stage ratios need stage history → backlog |
| **GDPR in recruitment (EU, Valencia)** | Lawful basis and consent record (date, scope, withdrawal), source of the data, privacy-notice version, retention and review dates, explicit consent for speculative CV submissions | GDPR guidance for recruitment agencies | Backlog (Data model + Security). Note: the score stays a ranking aid, never an automatic decision (GDPR Art. 22) |
| **Source of candidate** | "Source of hire" (job board, referral, agency, direct) per candidate | Recruiting-metrics guides | Backlog |
| **Placement and fees** | A placement record linking candidate, vacancy, client and fee terms | Agency guidance | Backlog (with Client) |
| **Standards** | HR Open Standards / HR-XML: `PositionOpening` and `Candidate` with remuneration and position preferences; JDX job posting (education, experience, licences) | HR Open Standards material | Backlog: education and certifications; align field names if an integration ever needs it |
| **Opening details** | Employment type, description, education requirements | schema.org JobPosting, ATS APIs | Backlog (employment type already listed) |

## C. Final outcome
1. **The model stays exactly as in the briefing**: it already matches the industry's core shape.
2. **Added in M3 without touching any briefing field:** the score breakdown (S05), `validateSelectionProcess` (S07), the worked-case sample data (S02), the progress table in `model.md` (every step), and two KPI reports: `countProcessesByStage` and `calculateAverageTimeToHire` (S06).
3. **Everything else goes to `docs/improvements.md`** with options to compare in the final milestone.

## Sources (Part 2)
- GDPR for recruitment: [Custodia (DEV)](https://dev.to/custodiaadmin/gdpr-for-recruitment-agencies-how-to-handle-candidate-and-client-data-compliantly-425n), [Firefish: consent vs legitimate interest](https://blog.firefishsoftware.com/consent-vs-legitimate-interest), [GDPR Local](https://gdprlocal.com/how-gdpr-affects-staffing-and-recruiting/), [Staffing Industry Analysts](https://cwstrategies.staffingindustry.com/?p=13815), [Recruiterflow: candidate consent](https://recruiterflow.com/glossary/?p=24909)
- Standards: [HR Open Standards recruiting (PDF)](https://assets.noviams.com/novi-file-uploads/hropen/pdfs-and-documents/04_Recruiting_SM-dd7d0929.pdf), [HR-XML 3.0 CandidateType](https://schemas.liquid-technologies.com/HR-XML/3.0/candidatetype.html), [HR-XML ProcessPositionOpening](https://schemas.liquid-technologies.com/HR-XML/3.0/processpositionopening_xsd.html), [Microsoft HR candidate table](https://microsoft.github.io/gov-solutions/tables/hr-recruiting/hr-candidate), [Recruiterbox opening object](https://developers.recruiterbox.com/reference/opening-object)
- KPIs: [NetSuite recruitment metrics](https://www.netsuite.com/portal/resource/articles/human-resources/recruitment-metrics.shtml), [Recruiting metrics (Wikipedia)](https://Www.Wikipedia.org/wiki/Recruiting_metrics), [Pin: recruiter KPIs](https://pin.com/blog/recruiter-kpis-dashboard/), [Metaview](https://www.metaview.ai/resources/blog/recruitment-analytics-metrics), [People Managing People](https://peoplemanagingpeople.com/recruitment/recruitment-kpis/)

---

# Part 3 — Company-choice extensions and architecture review (2026-11-18)
The teacher pointed out missing entities: the guide derives the model from `Company-choice.md`, which describes two agents. Market tools for Nexova's two businesses model the same core: agency recruitment (Bullhorn: client company, recruiter, job, candidate, submission) and helpdesk (Zendesk: organization, agents, tickets, SLA policies, help-centre articles). An architecture review (dedicated planning agent) confirmed the final shape:
- **Keep** the 3 briefing entities exactly (graded).
- **Add 6:** `ClientCompany` (tenant for both agents), `ClientVacancy extends Vacancy` (link without touching the graded interface), `NexovaEmployee` with `role` (consultants and support agents share the same fields: one type, not two), `RankingDecision`, `SupportTicket`, `KnowledgeBaseArticle`.
- **Computed, not stored:** score breakdown, SLA status, validation result, high match, escalation (= L2 ticket).
- **Not included:** `ClientRequest` (only in a peer's model, not in Company-choice).
- **Purity:** time-based functions take `now` as a parameter; thresholds in named constants (`SLA_HOURS` (24, imported from `packages/shared/company.ts`), `SLA_AT_RISK_HOURS = 20`).
- **Risk control:** the extensions live under a clear divider in `models.ts`; briefing reports first; extension reports labelled as Company-choice metrics; no new steps (folded into S02–S07).
Sources: [Zendesk organizations API](https://developer.zendesk.com/api-reference/ticketing/organizations/organizations/), [Zendesk data dictionary (Panoply)](https://panoply-documentation.document360.io/docs/data-dictionary-zendesk), [Stitch Zendesk integration](https://stitchdata.com/docs/integrations/saas/zendesk), plus the Bullhorn sources in Part 1.
