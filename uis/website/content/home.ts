/**
 * Copy for the home page, word for word from the approved design
 * (docs/milestone-1/design/nexova-landing-v4.html). Company facts (founding
 * year, cities, headcount, business lines, industries) come from
 * @repo/shared-types and are never retyped here.
 */
import { businessLines, company } from "@repo/shared-types";
import type { BusinessLineId } from "@repo/shared-types";

/** Placeholder: the real public contact address is pending confirmation from Nexova. */
export const CONTACT_EMAIL = "hello@nexova.example";

export interface Link {
  href: string;
  label: string;
}

/** A heading or sentence with one highlighted part. */
export interface AccentText {
  before: string;
  accent: string;
  after: string;
}

function joinList(items: readonly string[]): string {
  if (items.length <= 1) return items.join("");
  return `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;
}

function capitalise(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function copyFor<T>(map: Readonly<Record<string, T>>, key: string): T {
  const v = map[key];
  if (v === undefined) throw new Error(`Missing website copy for "${key}"`);
  return v;
}

const branch = company.offices[0];
if (!branch) throw new Error("company.offices is empty");

const hq = company.headquarters.city;
const year = company.foundedYear;
const industries = joinList(company.clientIndustries);
const cities = `${hq} and ${branch.city}`;

export const brand = {
  name: "Nexova",
  homeLabel: "Nexova, back to top",
};

export const navigation = {
  links: [
    { href: "#services", label: "Services" },
    { href: "#industries", label: "Industries" },
    { href: "#about", label: "About" },
    { href: "#contact", label: "Contact" },
  ] satisfies Link[],
  cta: { href: "#contact", label: "Talk to us" } satisfies Link,
  menuOpen: "Menu",
  menuClose: "Close",
};

export const hero = {
  eyebrow: "HR consulting & talent acquisition",
  headline: [
    { accent: "", text: "Find the right one." },
    { accent: "Grow", text: " the many." },
    { accent: "", text: "Support every team." },
  ],
  lede: `Since ${year}, Nexova has helped mid-sized ${industries} companies hire leaders, build customer support teams and develop their people. Now we are bringing AI into the repetitive work, and people still make every call.`,
  tickerPrefix: "Start a search for",
  roles: [
    "a CFO.",
    "a Head of Customer Support.",
    "a Regional Retail Director.",
    "a VP of Engineering.",
    "a multilingual chat team.",
    "a leadership programme.",
  ],
  primaryCta: { href: "#contact", label: "Start a search" } satisfies Link,
  secondaryCta: { href: "#services", label: "Explore our services" } satisfies Link,
};

export const processSection = {
  heading: "From a wide field to the right person, in four steps.",
  stepLabel: "Step",
  /** `dots` is the size of the field left at each step, drawn as dots. */
  steps: [
    {
      title: "Briefing",
      body: "We sit down with your leadership to define the role, the team it joins and what success looks like.",
      dots: 12,
    },
    {
      title: "Screening",
      body: "AI-assisted screening helps us review a wide field quickly. Our consultants assess every profile that makes the shortlist.",
      dots: 6,
    },
    {
      title: "Interviews",
      body: "Structured interviews with our consultants, then with you, with clear, written feedback at every stage.",
      dots: 3,
    },
    {
      title: "Placement",
      body: "We help you close the offer and stay close through onboarding, so the hire works for both sides.",
      dots: 1,
    },
  ],
};

export const cascade = {
  title: "The shortlist",
  replay: "Replay",
  phases: processSection.steps.map((s) => s.title),
  label:
    "Illustration: a pile of 72 CVs is screened and ranked, five are shortlisted and one candidate is placed.",
  placed: "Placed",
};

export const marquee = [
  "Executive search",
  "Customer support teams",
  "Leadership training",
  ...company.clientIndustries.map(capitalise),
  cities,
];

export const keyFigures = {
  label: "Key figures",
  items: [
    { label: "Since", value: year, from: 1990, note: "12+ years of expertise" },
    { label: "People", value: company.employees, from: 0, note: "Across selection, support, training and operations" },
    { label: "Offices", value: 1 + company.offices.length, from: 0, note: cities },
    { label: "Business lines", value: businessLines.length, from: 0, note: "Search, support and training" },
  ],
};

export type ServiceTheme = "light" | "dark" | "coral";

export interface ServiceCard {
  businessLine: BusinessLineId;
  theme: ServiceTheme;
  title: string;
  body: string;
  tags: string[];
  moreLabel: string;
}

export const services = {
  heading: "Three ways we take talent off your plate.",
  intro:
    "Outsource one part of your talent management or all of it. Each business line has its own specialists, and they work as one team when you need them to.",
  more: "Learn more",
  cards: [
    {
      businessLine: "headhunting",
      theme: "light",
      title: "Executive & mid-management headhunting",
      body: "We search beyond the active market for directors and managers who fit your strategy and your culture, discreetly and against a brief we agree together.",
      tags: ["Executive roles", "Mid-management", "Discreet search"],
      moreLabel: "Learn more about executive and mid-management headhunting",
    },
    {
      businessLine: "outsourcing",
      theme: "dark",
      title: "Customer support team outsourcing",
      body: "Dedicated phone, email and chat teams for technology companies. We recruit, train and manage them, and they speak to your customers in your voice.",
      tags: ["Phone", "Email", "Chat"],
      moreLabel: "Learn more about customer support team outsourcing",
    },
    {
      businessLine: "training",
      theme: "coral",
      title: "Leadership & soft-skills training",
      body: "Courses, workshops and webinars on leadership, communication and team management, built around the challenges your managers actually face.",
      tags: ["Courses", "Workshops", "Webinars"],
      moreLabel: "Learn more about leadership and soft-skills training",
    },
  ] satisfies ServiceCard[],
};

const industryCopy: Readonly<Record<string, string>> = {
  technology:
    "Leadership hires and dedicated customer support teams for software and tech companies growing in Spain and the US.",
  retail:
    "Store, regional and head-office managers, plus leadership programmes for teams that work through constant change.",
  "financial services":
    "Discreet searches for roles where judgement, compliance and trust are non-negotiable.",
};

export const industrySection = {
  heading: "Three sectors we know from the inside.",
  rows: company.clientIndustries.map((i) => ({
    name: capitalise(i),
    body: copyFor(industryCopy, i),
  })),
};

export const humanAndAi = {
  heading: { before: "AI does the sorting. ", accent: "People make the call.", after: "" } satisfies AccentText,
  intro:
    "We use AI and automation to move faster and work at greater scale. Here is where it helps and where it stops. No candidate is ever rejected by an algorithm, and one client's data never mixes with another's.",
  statement: {
    before:
      "Every hiring decision, every customer escalation and every training plan is signed off by a person. AI makes us faster. ",
    accent: "People make it right.",
    after: "",
  } satisfies AccentText,
  aiLabel: "AI",
  peopleLabel: "People",
  pillars: [
    {
      title: "Screening",
      ai: "Reads every CV against the brief and explains each ranking.",
      people: "Decide who is shortlisted, interviewed and hired.",
    },
    {
      title: "Support",
      ai: "Routes tickets and drafts answers so agents can respond faster.",
      people: "Talk to your customers and handle anything that matters.",
    },
    {
      title: "Training",
      ai: "Personalises practice and follow-up between sessions.",
      people: "Design the programme, lead the room and coach your managers.",
    },
  ],
};

export const about = {
  heading: `Born in ${hq} in ${year}. Now on both sides of the Atlantic.`,
  paragraphs: [
    `${company.name} started in ${hq} in ${year} as a human resources consulting and talent acquisition firm. For more than twelve years we have helped mid-sized ${industries} companies find their leaders, build their customer support teams and develop their people.`,
    `Today we are ${company.employees} people across selection, support, training and operations, working from our headquarters in ${hq} and our expansion office in ${branch.city}, ${branch.region}, for clients in Spain and the US.`,
  ],
  photos: [
    { city: hq, src: "/images/valencia.jpg", alt: "Valencia, City of Arts and Sciences" },
    { city: branch.city, src: "/images/miami.jpg", alt: "Miami, Brickell waterfront" },
  ],
  hoursApartSuffix: " hours apart. One team.",
};

export const contact = {
  heading: { before: "Your next leader, team or programme starts with a ", accent: "conversation", after: "." } satisfies AccentText,
  body: `Tell us what you need. A consultant from ${hq} or ${branch.city} will get back to you to set up a first call.`,
  primary: { href: `mailto:${CONTACT_EMAIL}?subject=Start%20a%20search`, label: "Start a search" } satisfies Link,
  secondary: { href: `mailto:${CONTACT_EMAIL}`, label: "Talk to us" } satisfies Link,
};

export const footer = {
  tagline: `HR consulting and talent acquisition since ${year}.`,
  officesHeading: "Offices",
  offices: [
    { place: `${hq}, ${company.headquarters.country}`, role: "Headquarters" },
    { place: `${branch.city}, ${branch.region}`, role: "Expansion office" },
  ],
  navHeading: "Navigate",
  navLabel: "Footer",
  links: [
    { href: "#services", label: "Services" },
    { href: "#process", label: "How we work" },
    { href: "#industries", label: "Industries" },
    { href: "#about", label: "About" },
    { href: "#contact", label: "Contact" },
  ] satisfies Link[],
  legalHeading: "Legal",
  legal: [
    { href: "#", label: "Privacy policy" },
    { href: "#", label: "Cookie policy" },
  ] satisfies Link[],
  cookieSettings: "Cookie settings",
  copyright: `© 2026 ${company.name}. All rights reserved.`,
};

export const metadataCopy = {
  title: `${company.name} — HR consulting and talent acquisition`,
  description: hero.lede,
};
