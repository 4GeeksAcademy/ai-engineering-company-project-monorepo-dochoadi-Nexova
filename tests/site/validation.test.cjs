// Tests for validation.js (the public site form): every rule with valid and invalid values, and every
// message compared with the official briefings. Run with `pnpm test:site`.
const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const { MESSAGES, FIELDS, validateField, validateAll, remaining, layoutFor } = require("../../validation.js");

const ROOT = path.join(__dirname, "..", "..");
const MESSAGE_KEYS = FIELDS.map(([, key]) => key);

/** The quoted messages of a briefing's error list, in order, without Markdown angle brackets. */
function briefingErrors(file, heading) {
  const text = fs.readFileSync(path.join(ROOT, file), "utf8");
  const section = text.split(`## ${heading}`)[1].split("\n## ")[0];
  return [...section.matchAll(/^- \*\*[^*]+\*\* "(.+)"$/gm)].map((m) => m[1].replace(/<([^>]+)>/g, "$1"));
}

/** The success message blockquote of a briefing: title and paragraphs. */
function briefingSuccess(file, heading) {
  const text = fs.readFileSync(path.join(ROOT, file), "utf8");
  const section = text.split(`## ${heading}`)[1].split("\n## ")[0];
  const lines = [...section.matchAll(/^> (.+)$/gm)].map((m) => m[1]);
  return { title: lines[0].replace(/\*\*/g, ""), body: lines.slice(1) };
}

const valid = (field, value) => assert.equal(validateField(field, value, "en"), "", `${field}: ${JSON.stringify(value)} should be valid`);
const invalid = (field, value) => assert.notEqual(validateField(field, value, "en"), "", `${field}: ${JSON.stringify(value)} should be invalid`);

test("full name: at least first and last name", () => {
  ["Ana López", "María José Pérez", "Jean-Luc O'Neil", "Zoë Ångström"].forEach((v) => valid("full_name", v));
  ["", "   ", "Ana", "Ana L", "A B", "Ana López3", "ana@lopez com"].forEach((v) => invalid("full_name", v));
});

test("email: an @ and a domain with a dot, no spaces", () => {
  ["name@company.com", "ana.lopez@nexova.es", "a+tag@mail.co.uk"].forEach((v) => valid("email", v));
  ["", "name", "name@", "name@company", "name company@x.com", "@company.com", "name@@company.com"].forEach((v) => invalid("email", v));
});

test("phone: + country code, 8–15 digits", () => {
  ["+34 612 345 678", "+1 305 555 0191", "+34612345678", "+44-20-7946-0958"].forEach((v) => valid("phone", v));
  ["", "612345678", "34 612 345 678", "+34", "+34 612", "+34 612  345 678", "+34 612 345 678 901 234", "+34 612a345678"].forEach((v) => invalid("phone", v));
});

test("selects and availability: only the listed values", () => {
  ["spain", "united_states", "other"].forEach((v) => valid("country_of_residence", v));
  ["technology", "retail", "financial_services", "consulting", "other"].forEach((v) => valid("sector_of_interest", v));
  ["basic", "intermediate", "advanced", "native"].forEach((v) => valid("english_level", v));
  ["immediate", "1_month", "2_3_months", "just_exploring"].forEach((v) => valid("availability", v));
  [["country_of_residence", "france"], ["sector_of_interest", "health"], ["english_level", "fluent"], ["availability", "tomorrow"]].forEach(([f, v]) => {
    invalid(f, v);
    invalid(f, "");
  });
});

test("years of experience: a whole number from 0 to 50", () => {
  ["0", "1", "25", "50", 0, 50].forEach((v) => valid("years_of_experience", v));
  ["", "-1", "51", "abc", "2.5", "1e1", " "].forEach((v) => invalid("years_of_experience", v));
});

test("LinkedIn: optional, otherwise an http(s) URL", () => {
  ["", "https://linkedin.com/in/x", "http://www.linkedin.com/in/ana-lopez"].forEach((v) => valid("linkedin", v));
  ["linkedin.com/in/x", "www.linkedin.com/in/x", "ftp://linkedin.com/in/x", "https://", "https:// linkedin.com"].forEach((v) => invalid("linkedin", v));
});

test("comments: up to 500 characters, X = characters left", () => {
  valid("additional_comments", "");
  valid("additional_comments", "a".repeat(500));
  invalid("additional_comments", "a".repeat(501));
  assert.equal(remaining(""), 500);
  assert.equal(remaining("a".repeat(520)), -20);
  assert.equal(remaining("é".repeat(10)), 490);
  assert.equal(validateField("additional_comments", "a".repeat(501), "en"), "Comments cannot exceed 500 characters (-1 remaining)");
  assert.equal(validateField("additional_comments", "a".repeat(520), "es"), "Los comentarios no pueden exceder 500 caracteres (quedan -20)");
});

test("data policy: must be checked", () => {
  valid("data_policy", true);
  [false, undefined, "", "on"].forEach((v) => invalid("data_policy", v));
});

for (const [lang, file, heading] of [["en", "BRIEFING.md", "Expected error messages"], ["es", "docs/milestone-2/BRIEFING.es.md", "Mensajes de error esperados"]]) {
  test(`${lang}: every error message equals the briefing text`, () => {
    const expected = briefingErrors(file, heading);
    assert.equal(expected.length, MESSAGE_KEYS.length, "the briefing lists one message per field");
    MESSAGE_KEYS.forEach((key, i) => assert.equal(MESSAGES[lang][key], expected[i], `${lang}.${key}`));
  });
}

for (const [lang, file, heading] of [["en", "BRIEFING.md", "Success message"], ["es", "docs/milestone-2/BRIEFING.es.md", "Mensaje de éxito"]]) {
  test(`${lang}: the success message equals the briefing text`, () => {
    const { title, body } = briefingSuccess(file, heading);
    assert.equal(MESSAGES[lang].successTitle, title);
    assert.deepEqual(MESSAGES[lang].successBody, body);
  });
}

test("validateAll: an empty submission gives exactly the 9 required-field errors", () => {
  for (const lang of ["en", "es"]) {
    const errors = validateAll({}, lang);
    assert.deepEqual(Object.keys(errors), [
      "full_name", "email", "phone", "country_of_residence", "years_of_experience",
      "sector_of_interest", "english_level", "availability", "data_policy",
    ]);
    assert.equal(errors.data_policy, MESSAGES[lang].dataPolicy);
  }
});

test("validateAll: a complete, valid application has no errors", () => {
  const values = {
    full_name: "Ana López", email: "ana@company.com", phone: "+34 612 345 678", country_of_residence: "spain",
    years_of_experience: "7", sector_of_interest: "technology", english_level: "advanced", availability: "1_month",
    linkedin: "https://linkedin.com/in/ana", additional_comments: "Open to remote roles.", data_policy: true,
  };
  assert.deepEqual(validateAll(values, "en"), {});
});

test("after a successful submission only the thank-you message and Clear form stay visible", () => {
  assert.deepEqual(layoutFor("success"), { fields: false, submit: false, reset: true, success: true });
  // "Clear form" brings the empty form back, submit button included.
  assert.deepEqual(layoutFor("form"), { fields: true, submit: true, reset: true, success: false });
});
