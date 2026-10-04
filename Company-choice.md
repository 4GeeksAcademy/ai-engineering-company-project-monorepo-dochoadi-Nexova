# Company Choice
 
**Company:** Nexova Solutions
 
## Justification
 
I'm starting the AI Engineering master's coming from the "client side," not the pure technical side: I've spent years managing support teams and B2B accounts (currently at Agilimo, before that at BlackBerry EMEA), so Nexova's problems feel familiar rather than theoretical. It's a consultancy that provides outsourced services to other companies — the same kind of relationship I manage with my own clients — and its support team is missing a 24h SLA by roughly 100% (real average: 48h), with zero centralized knowledge base behind 30 agents. That's a concrete, measurable gap I can actually reason about, not a generic "add AI" exercise.
 
## Departments I'm interested in
 
- **Customer Support (Roberto Díaz):** 30 outsourced agents handle incidents for tech, retail and finance clients by phone, email and chat, with no centralized knowledge base and a 48h average resolution time against a 24h committed SLA.
- **Recruitment / Staffing (Javier Almeida):** 40 recruiting consultants manually screen 30–80 CVs per hiring process, matching candidates to openings purely on individual judgment, with no shared or trackable criteria.
## Automation challenge
 
Cut the average incident resolution time in Customer Support from 48h down to the committed 24h SLA by having a Level-1 agent resolve at least 40% of incoming tickets without human intervention within the first 3 months live, while keeping every client's data strictly isolated from every other client's.
 
## My AI Agent Idea
 
**Name:** HelpDesk Support Agent
 
**What it does:** When an incident comes in, it checks a knowledge base for a similar already-solved case (Level 1 — inspired by the escalation model we used at BlackBerry, though that one was fully manual, no AI involved). If it finds a good match, it answers directly. If not, or if the case looks sensitive, it escalates to a human agent with the context already summarized (Level 2). Whatever the human resolves gets written back into the knowledge base, so the agent keeps improving instead of staying frozen at day one.
 
**Information it needs:** The support knowledge base itself (today scattered across each agent's memory and a shared Word doc on Drive — that's the real problem behind all of this), the history of resolved tickets, and each incoming ticket's metadata: what the customer is asking, which client company it belongs to (Nexova serves several clients and must never mix their data), and which channel it came through.
 
**What it produces or triggers:** An automatic reply when it resolves a case on its own; an escalated, pre-summarized ticket when it can't; a knowledge-base update for every new case worth remembering; and an SLA-risk alert when a ticket is approaching the 24h limit so a supervisor can step in before it's breached.
 
### Flow
 
1. A ticket arrives via chat, email, or the support widget, tagged with the client company it belongs to.
2. The agent embeds the query and retrieves candidate matches from the knowledge base, scoped to that client's data only (hard filter, not a prompt instruction).
3. It decides: answer directly (high-confidence match, Level 1), escalate with a summary (low-confidence or sensitive case, Level 2), or flag as SLA-at-risk if the ticket has been open too long.
4. The outcome — answer sent, escalation created, or alert raised — is logged, and any new human-resolved case is added back into the knowledge base.
### Planned stack
 
TBD - Python + FastAPI for the agent service, Postgres for ticket/case metadata, a vector store (Qdrant) for the knowledge base with hybrid search, an LLM via API (Anthropic/OpenAI) for retrieval-grounded answers and ticket summarization, and a simple Next.js dashboard for supervisors to watch SLA risk and escalations in real time.
 
### How I'll measure success
 
Percentage of tickets resolved at Level 1 without escalation (target: 40%+), average resolution time (target: under 24h, down from 48h), and groundedness/faithfulness of Level-1 answers against the knowledge base (to catch hallucinated responses before they reach a customer).
 
### Risks and limitations
 
There's no real knowledge base to start from — it has to be bootstrapped from the shared Word doc and whatever history I can reconstruct, so early accuracy will be low. Multi-tenant data isolation is non-negotiable and has to be enforced at the query/filter level, never just "asked nicely" in a prompt. Ticket content is untrusted input, so it needs to be treated as data, not instructions (prompt-injection risk). And any case the model isn't confident about has to escalate to a human by default — a wrong Level-1 answer is worse than a slower one.
 
## My Second AI Agent Idea
 
**Name:** CV–Vacancy Matching Agent
 
**What it does:** HR staff define the keywords and requirements that matter for a given opening (mandatory vs. nice-to-have). The agent compares every incoming CV against those criteria and returns a ranked list of candidates by fit, instead of a pile of unsorted PDFs. It's built to reuse the same scoring logic the course already defines in Milestone 2 (skills, experience, seniority, English level, salary) — I haven't reached that milestone yet, but the structure in the repo template maps directly onto this idea, so I wouldn't be inventing a scoring system from scratch, just applying it here.
 
**Information it needs:** The job posting text with requirements prioritized by HR, each candidate's CV parsed into structured text, and — ideally — the history of who actually got hired in similar past processes, to gradually calibrate how much weight each keyword carries. Same rule as the support agent: candidate data from one Nexova client can never mix with another's.
 
**What it produces or triggers:** A ranking per opening with a total score and which requirements each candidate meets or misses; an alert when a very high-match candidate appears, so the consultant doesn't lose them to a competitor; and a log of whether the consultant accepts the ranking as-is or reorders it manually — that signal is what eventually lets the keyword weights get tuned.
 
### Flow
 
1. HR enters a new opening with its must-have and nice-to-have requirements.
2. Incoming CVs are parsed into structured fields (skills, experience, seniority, languages, salary expectation).
3. The agent scores each CV against the opening's requirements and ranks the candidate pool; low-confidence or incomplete CVs are flagged for manual review instead of silently scored.
4. The consultant sees the ranking, can override it, and that decision (accepted / overridden) is logged for future calibration.
### Planned stack
 
TypeScript end-to-end to match the scoring logic already defined in the course's Milestone 2 spec, a Node/Next.js API layer, Postgres for structured candidate and vacancy data, a CV-parsing step (text extraction + an LLM call to normalize fields into the expected schema), and — only if free-text search over the candidate pool turns out to be needed ("find me profiles with B2B sales experience and C1 English") — a vector store layered on top, since that's explicitly one of the things Operaciones de Selección says it needs.
 
### How I'll measure success
 
Top-5 recall against who was historically actually hired for similar roles (does the ranking surface the right candidates near the top?), time saved per hiring process compared to reading 30–80 CVs manually, and the override rate over time (a high override rate early on is expected and useful for calibration; it should trend down as the weights improve, not be treated as a success metric on day one).
 
### Risks and limitations
 
Keyword-based matching can quietly encode bias if the requirements themselves are biased, so the ranking has to stay a decision-support tool, not an auto-reject filter — a human keeps the final call, partly because Nexova operates in the EU and fully automated hiring decisions run into GDPR Article 22 territory. CV formats vary enormously, so parsing errors are a real risk and need a confidence threshold with manual fallback. And there's limited historical hiring-outcome data to calibrate against at the start, so the weighting will likely need synthetic or rule-based defaults before it has enough real outcomes to learn from.
