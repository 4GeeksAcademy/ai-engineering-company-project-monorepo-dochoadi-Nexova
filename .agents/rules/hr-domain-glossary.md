---
description: Nexova HR and talent acquisition domain glossary; load it when naming entities, routes, types or database fields.
---

Scope: requested by the agent

Use these terms and identifiers consistently in code, routes, types and database fields. Identifiers are camelCase in TypeScript; use the snake_case form (e.g. `tenant_id`) in Python and SQL.

| Term | Definition | Identifier in code |
| --- | --- | --- |
| Vacancy | An open role a client company asks Nexova to fill, with must-have and nice-to-have requirements. | `vacancy` |
| Search | A recruitment process run by Nexova for one vacancy, from initial briefing to placement. | `search` |
| Selection consultant | One of Javier Almeida's 40 consultants who runs searches and makes the final hiring recommendation. | `selectionConsultant` |
| Candidate | A professional being considered for one or more vacancies. | `candidate` |
| CV | A candidate's résumé, parsed into structured fields (skills, experience, seniority, languages, salary expectation). | `cv` |
| Placement | A candidate successfully hired into a client company's vacancy. | `placement` |
| Client company / tenant | A company that buys Nexova's services; the unit of data isolation. | `clientCompany`, `tenantId` |
| Ticket | A customer-support incident handled for a client company, arriving by phone, email or chat. | `ticket` |
| Level 1 | Ticket resolution by the HelpDesk Support Agent without human intervention. | `level1` |
| Level 2 | Ticket resolution by a human support agent from Roberto Díaz's team. | `level2` |
| Escalation | Handing a ticket from Level 1 to Level 2 with a summary, due to low confidence or a sensitive case. | `escalation` |
| SLA | Committed ticket resolution time: 24 h; current average: 48 h. | `slaHours`, `slaAtRisk` |
| Knowledge base | Per-tenant store of resolved support cases used for retrieval. | `knowledgeBase`, `kbArticle` |
| Training programme | A course, workshop or webinar in Elena Vargas's corporate training catalogue. | `trainingProgramme` |
| Enrolment | A learner's registration in a training programme. | `enrolment` |
| Learner | A client-company employee taking a training programme. | `learner` |
| Account manager | One of the 6 Sales team members who look after existing clients. | `accountManager` |
| SDR | One of the 12 sales development representatives who prospect new clients. | `sdr` |
| Deal | A sales opportunity tracked in HubSpot, from first contact to close or discard. | `deal` |
