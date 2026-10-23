# Product Context — Nexova departments

Type: business

Source: `CONTEXT.md` (department profiles) and `Company-choice.md`. Nexova has 120 employees spread across the following areas.

## Executive Direction

- **Manager:** Laura Mendoza, CEO and founder (2011).
- **Team:** leadership; receives reporting from each area manager.
- **How they work today:** each department head manually prepares a weekly PDF report for Laura.
- **Problem:** preparing the report takes 4 to 8 hours per manager every week, there is no unified view of the business, and strategic decisions are made with week-old data.
- **What they need:** a unified executive dashboard with real-time KPIs from all areas, an automatically generated weekly report, strategic threshold alerts, and a natural-language AI assistant Laura can query directly.

## Talent Selection Operations (core business)

- **Manager:** Javier Almeida.
- **Team:** 40 selection consultants.
- **How they work today:** they run clients' recruitment processes end to end (briefing, CV screening, interviews and placement) entirely by hand. Each consultant reads 30 to 80 CVs per search and communicates with candidates by individual email with no templates.
- **Problem:** there is no real-time tracking of each candidate's status (clients call to ask), and candidate–vacancy matching relies entirely on the consultant's intuition.
- **What they need:** an AI-assisted selection pipeline with automatic CV scoring and ranking, a RAG system over the candidate database ("profiles with B2B sales experience and C1 English"), a candidate portal with real-time status, and a communication agent that sends automatic status emails.

## Customer Support (outsourced service)

- **Manager:** Roberto Díaz.
- **Team:** 30 agents.
- **How they work today:** they handle incidents from outsourcing clients (technology, retail and finance) by phone, email and web chat. They resolve issues from their own experience and a shared Word document on Drive; there is no centralised knowledge base.
- **Problem:** average resolution time is **48 h** against a **committed 24 h SLA**, and supervisors have no real-time visibility into workload or backlog.
- **What they need:** a first-line support chatbot that resolves 40 % of queries without human intervention using RAG, a centralised knowledge base with semantic search, a real-time support dashboard, and ticket sentiment analysis to identify dissatisfied clients before they escalate.

## Corporate Training

- **Manager:** Elena Vargas.
- **Team:** 12 people.
- **How they work today:** they design and deliver courses, workshops and webinars on leadership, communication and team management. The catalogue is a PDF updated quarterly, enrolments come in through a Google Form managed by hand in a spreadsheet, and attendance is tracked with Excel lists.
- **Problem:** the catalogue is invisible to most potential buyers, there is no record of who completed which training, and personalisation is zero: every client receives the same proposal.
- **What they need:** a searchable catalogue with online enrolment, a recommendation system that suggests programmes based on client profile, a learner portal with progress tracking, and a training advisory chatbot that builds personalised training plans.

## Sales and Business Development

- **Manager:** Marcos Ibáñez (see the discrepancy recorded in `activeContext.md`).
- **Team:** 18 people: 6 account managers (existing clients) and 12 SDRs (new clients).
- **How they work today:** SDRs prospect manually on LinkedIn, export lists to Excel and follow up by email with no automation. They have a CRM (HubSpot), but only 40 % of the team updates it consistently.
- **Problem:** deals are lost due to lack of follow-up, and there is no visibility into which prospects are most likely to close.
- **What they need:** a sales pipeline dashboard, prospecting sequence automation (first contact → follow-up → close or discard), deal alerts for inactive conversations, and an AI agent that suggests personalised proposal angles based on a prospect's profile.

## Marketing and Communications

- **Manager:** Carmen Ruiz.
- **Team:** small team (`CONTEXT.md` does not state the number).
- **How they work today:** they manage the corporate website, LinkedIn, the monthly newsletter and the blog, with entirely manual production.
- **Problem:** the website dates from 2019, is slow, not accessible and does not reflect the company's current positioning. They know how many visits they get, but not what converts.
- **What they need:** a full redesign of the corporate website with SEO/GEO optimisation and schema.org markup, an AI-assisted content pipeline, and a marketing metrics dashboard (visits, traffic sources and conversion rates).

## Human Resources (internal)

- **Manager:** Patricia Solís.
- **Team:** 4 people, serving Nexova's 120 employees.
- **How they work today:** holidays, absences and queries by email and spreadsheets; manual onboarding; twice-yearly performance reviews in Google Forms that nobody reviews systematically.
- **Problem:** there are no metrics: no turnover rate, no absenteeism data, no average time-to-fill for internal roles.
- **What they need:** an internal HR portal, an automated onboarding flow with progressive checklists, an HR KPI dashboard, and an internal agent that answers questions about policies and benefits.

## Technology and Infrastructure

- **Manager:** Sergio Molina, CTO.
- **Team:** 6 people.
- **How they work today:** they maintain a set of disconnected tools: HubSpot, a legacy Zendesk, Google Workspace, a home-built ATS from the 2010s and multiple spreadsheets. Deployments are manual.
- **Problem:** there is no telemetry or centralised logging; when something fails, they find out through users.
- **What they need:** centralised telemetry and logging, a data pipeline that feeds each area's dashboards, real-time monitoring with automatic alerts, and an internal engineering agent that answers architecture questions by querying technical documentation.

## Users of what we build

| User | Who they are | What they expect from our systems |
| --- | --- | --- |
| Selection consultants | The 40 consultants in Javier Almeida's team | An explainable CV ranking they can accept or correct, and fewer hours of manual reading |
| Support agents | The 30 agents in Roberto Díaz's team | Level 2 tickets that arrive already summarised, and a searchable knowledge base instead of the Word document on Drive |
| Support supervisors | Supervisors in Roberto Díaz's team | Real-time visibility into workload, backlog and SLA-at-risk tickets before the 24 h deadline expires |
| Nexova's client companies | Mid-sized companies in technology, retail and finance | Fast answers to their incidents, the status of their recruitment processes, and data isolated from other clients' data |
| Candidates | Professionals in selection processes run by Nexova | Knowing where their application stands without having to ask, and fair treatment (with a final human decision) |
| CEO | Laura Mendoza | A unified, up-to-date view of the business, without waiting for the weekly PDF report |

## Users of the public website (Milestone 2)

| User | Who they are | What the site gives them |
| --- | --- | --- |
| Professionals joining the talent pool | People in active or passive job search, in Spain, the US or elsewhere, in English or Spanish | The landing page (who Nexova is, its services and advantages) and the application form with the 11 briefing fields, clear error messages, and a thank-you message. Nothing is sent yet: the submission is simulated until a backend exists. |
| Companies looking for talent | Client companies that want Nexova's headhunting, support outsourcing or training services | The form is not for them. A visible notice on both form pages sends them to `contacto@nexova.com` (the briefing's "specific restriction"), and the landing page lists the contact email and both office phones. |
| Carmen Ruiz's Marketing team | The site's owner (the brief's stakeholder) | A fast, accessible, bilingual site with Schema.org markup, and structured candidate data instead of CVs by email (once a backend exists). |

