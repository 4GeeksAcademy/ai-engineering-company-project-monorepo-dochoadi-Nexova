/*
 * Nexova talent form validation (application.html, es/application.html).
 * Pure rules and the briefing's messages (EN + ES, verbatim) plus a small DOM layer.
 * The same file runs in the browser and in Node tests (module.exports). Nothing typed in the
 * form is sent, stored or logged: the submission is simulated (no backend yet).
 */
(function () {
  "use strict";

  var LIMIT = 500;

  var MESSAGES = {
    en: {
      fullName: "Name must contain at least first and last name",
      email: "Enter a valid email (example: name@company.com)",
      phone: "Phone must include country code (example: +34 612 345 678)",
      country: "Select your country of residence",
      years: "Years of experience must be between 0 and 50",
      sector: "Select your sector of interest",
      englishLevel: "Indicate your English level",
      availability: "Select your availability",
      linkedin: "If you include LinkedIn, it must be a valid URL",
      comments: "Comments cannot exceed 500 characters (X remaining)",
      dataPolicy: "You must accept the data processing policy to continue",
      successTitle: "Thank you for your interest in Nexova!",
      successBody: [
        "We have received your information. Our selection team will review it and contact you if your profile matches any of our current or future opportunities.",
        "In the meantime, follow us on LinkedIn to stay updated on our vacancies and professional development content.",
      ],
      summaryTitle: "There is a problem with your application",
      errorPrefix: "Error: ",
      sending: "Sending…",
      counterLeft: function (n) { return n === 1 ? "1 character remaining" : n + " characters remaining"; },
      counterOver: function (n) { return n === 1 ? "1 character over the limit" : n + " characters over the limit"; },
    },
    es: {
      fullName: "El nombre debe contener al menos nombre y apellido",
      email: "Ingresa un email válido (ejemplo: nombre@empresa.com)",
      phone: "El teléfono debe incluir código de país (ejemplo: +34 612 345 678)",
      country: "Selecciona tu país de residencia",
      years: "Los años de experiencia deben estar entre 0 y 50",
      sector: "Selecciona el sector de tu interés",
      englishLevel: "Indica tu nivel de inglés",
      availability: "Selecciona tu disponibilidad",
      linkedin: "Si incluyes LinkedIn, debe ser una URL válida",
      comments: "Los comentarios no pueden exceder 500 caracteres (quedan X)",
      dataPolicy: "Debes aceptar la política de tratamiento de datos para continuar",
      successTitle: "¡Gracias por tu interés en Nexova!",
      successBody: [
        "Hemos recibido tu información. Nuestro equipo de selección la revisará y te contactaremos en caso de que tu perfil encaje con alguna de nuestras oportunidades actuales o futuras.",
        "Mientras tanto, síguenos en LinkedIn para estar al día de nuestras vacantes y contenido sobre desarrollo profesional.",
      ],
      summaryTitle: "Hay un problema con tu solicitud",
      errorPrefix: "Error: ",
      sending: "Enviando…",
      counterLeft: function (n) { return n === 1 ? "Queda 1 carácter" : "Quedan " + n + " caracteres"; },
      counterOver: function (n) { return n === 1 ? "1 carácter por encima del límite" : n + " caracteres por encima del límite"; },
    },
  };

  // Field name → message key, in form order (the S05 field contract, systemPatterns.md pattern 20).
  var FIELDS = [
    ["full_name", "fullName"],
    ["email", "email"],
    ["phone", "phone"],
    ["country_of_residence", "country"],
    ["years_of_experience", "years"],
    ["sector_of_interest", "sector"],
    ["english_level", "englishLevel"],
    ["availability", "availability"],
    ["linkedin", "linkedin"],
    ["additional_comments", "comments"],
    ["data_policy", "dataPolicy"],
  ];

  var CHOICES = {
    country_of_residence: ["spain", "united_states", "other"],
    sector_of_interest: ["technology", "retail", "financial_services", "consulting", "other"],
    english_level: ["basic", "intermediate", "advanced", "native"],
    availability: ["immediate", "1_month", "2_3_months", "just_exploring"],
  };

  /** Characters left out of 500 (negative when over). Counts characters, not UTF-16 units. */
  function remaining(text) {
    return LIMIT - Array.from(text || "").length;
  }

  var NAME_WORD = /^[\p{L}][\p{L}'’-]*$/u;

  var RULES = {
    // At least two words of two or more letters; only letters, apostrophes and hyphens.
    full_name: function (v) {
      var words = String(v || "").trim().split(/\s+/).filter(Boolean);
      if (words.length < 2 || !words.every(function (w) { return NAME_WORD.test(w); })) return false;
      return words.filter(function (w) { return (w.match(/\p{L}/gu) || []).length >= 2; }).length >= 2;
    },
    // local@domain.tld: one @, a domain with at least one dot, no spaces.
    email: function (v) {
      return /^[^\s@]+@(?:[^\s@.]+\.)+[^\s@.]{2,}$/.test(String(v || "").trim());
    },
    // + and a 1–3 digit country code, then digits with optional single spaces or hyphens; 8–15 digits (E.164).
    phone: function (v) {
      var s = String(v || "").trim();
      if (!/^\+\d{1,3}(?:[ -]?\d)+$/.test(s)) return false;
      var digits = s.replace(/\D/g, "").length;
      return digits >= 8 && digits <= 15;
    },
    country_of_residence: function (v) { return CHOICES.country_of_residence.indexOf(v) !== -1; },
    // A whole number from 0 to 50.
    years_of_experience: function (v) {
      var s = String(v === undefined || v === null ? "" : v).trim();
      return /^\d+$/.test(s) && Number(s) <= 50;
    },
    sector_of_interest: function (v) { return CHOICES.sector_of_interest.indexOf(v) !== -1; },
    english_level: function (v) { return CHOICES.english_level.indexOf(v) !== -1; },
    availability: function (v) { return CHOICES.availability.indexOf(v) !== -1; },
    // Optional; if given, it starts with http:// or https:// and is a parseable URL.
    linkedin: function (v) {
      var s = String(v || "").trim();
      if (s === "") return true;
      if (!/^https?:\/\//i.test(s)) return false;
      try {
        return Boolean(new URL(s).hostname);
      } catch (e) {
        return false;
      }
    },
    additional_comments: function (v) { return remaining(v) >= 0; },
    data_policy: function (v) { return v === true; },
  };

  function lookup(lang) {
    return MESSAGES[lang] || MESSAGES.en;
  }

  /** "" when valid, otherwise the briefing's message in that language. */
  function validateField(name, value, lang) {
    var key = null;
    FIELDS.forEach(function (f) { if (f[0] === name) key = f[1]; });
    if (!key || RULES[name](value)) return "";
    var msg = lookup(lang)[key];
    return name === "additional_comments" ? msg.replace("X", String(remaining(value))) : msg;
  }

  /** { field: message } for every invalid field, in form order. */
  function validateAll(values, lang) {
    var errors = {};
    FIELDS.forEach(function (f) {
      var msg = validateField(f[0], values ? values[f[0]] : undefined, lang);
      if (msg) errors[f[0]] = msg;
    });
    return errors;
  }

  /**
   * What the form shows in each state. After a successful (simulated) submission only the thank-you message and
   * "Clear form" stay visible; "Clear form" brings the empty form back.
   */
  function layoutFor(state) {
    var done = state === "success";
    return { fields: !done, submit: !done, reset: true, success: done };
  }

  var api = { MESSAGES: MESSAGES, FIELDS: FIELDS, validateField: validateField, validateAll: validateAll, remaining: remaining, layoutFor: layoutFor };
  if (typeof module === "object" && module.exports) module.exports = api;
  if (typeof document === "undefined") return;

  // ---------------------------------------------------------------- DOM layer (browser only)

  var form = document.getElementById("talent-form");
  if (!form) return;
  var lang = (document.documentElement.lang || "en").slice(0, 2) === "es" ? "es" : "en";
  var t = lookup(lang);
  var summary = document.getElementById("form-errors");
  var success = document.getElementById("form-success");
  var counter = document.getElementById("additional_comments-counter");
  var submit = form.querySelector('button[type="submit"]');
  var submitLabel = submit ? submit.textContent : "";
  var touched = {};
  var sendingTimer = null;

  // Controls get a subtle green border once they are valid (aria-invalid="false").
  var VALID_CLASS = "aria-[invalid=false]:border-brand-green";
  var ERROR_CLASSES = ["flex", "items-start", "gap-2"];
  var ICON_CLASSES = "mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-brand-rust text-xs font-bold text-brand-paper";
  var LINK_CLASSES = "font-medium text-brand-rust underline underline-offset-4 hover:text-brand-ink focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-brand-coral";
  var SUCCESS_CLASSES = ["rounded-brand-card", "bg-brand-green", "p-6", "text-brand-cream", "shadow-brand-card-dark", "sm:p-10", "focus-visible:outline-3", "focus-visible:outline-offset-3", "focus-visible:outline-brand-coral"];

  form.noValidate = true;
  // Rows keep their natural height when the fields are hidden after a successful submission.
  form.classList.add("content-start");

  function controls(name) {
    return Array.prototype.slice.call(form.querySelectorAll('[name="' + name + '"]'));
  }

  function valueOf(name) {
    var els = controls(name);
    if (name === "availability") {
      var checked = els.filter(function (el) { return el.checked; })[0];
      return checked ? checked.value : "";
    }
    if (name === "data_policy") return els.length ? els[0].checked : false;
    return els.length ? els[0].value : "";
  }

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text) node.textContent = text;
    return node;
  }

  function clear(node) {
    while (node.firstChild) node.removeChild(node.firstChild);
  }

  function setInvalid(name, invalid) {
    controls(name).forEach(function (c) { c.setAttribute("aria-invalid", invalid ? "true" : "false"); });
  }

  function showError(name, message) {
    var box = document.getElementById(name + "-error");
    if (!box) return;
    clear(box);
    var icon = el("span", ICON_CLASSES, "!");
    icon.setAttribute("aria-hidden", "true");
    box.appendChild(icon);
    var text = el("span");
    text.appendChild(el("span", "sr-only", t.errorPrefix));
    text.appendChild(document.createTextNode(message));
    box.appendChild(text);
    box.classList.remove("hidden");
    ERROR_CLASSES.forEach(function (c) { box.classList.add(c); });
    setInvalid(name, true);
  }

  function clearError(name, markValid) {
    var box = document.getElementById(name + "-error");
    if (box) {
      clear(box);
      box.classList.add("hidden");
      ERROR_CLASSES.forEach(function (c) { box.classList.remove(c); });
    }
    if (markValid) setInvalid(name, false);
    else controls(name).forEach(function (c) { c.removeAttribute("aria-invalid"); });
  }

  /** Validates one field on screen; returns its message ("" when valid). */
  function check(name) {
    var msg = validateField(name, valueOf(name), lang);
    if (msg) showError(name, msg);
    else clearError(name, true);
    return msg;
  }

  function updateCounter() {
    if (!counter) return;
    var left = remaining(valueOf("additional_comments"));
    counter.textContent = left >= 0 ? t.counterLeft(left) : t.counterOver(-left);
    counter.classList.toggle("text-brand-rust", left < 0);
    counter.classList.toggle("font-medium", left < 0);
    counter.classList.toggle("text-brand-ink-muted", left >= 0);
  }

  function firstControl(name) {
    return controls(name)[0];
  }

  function showSummary(errors) {
    if (!summary) return;
    clear(summary);
    summary.appendChild(el("h2", "text-xl font-medium tracking-[-0.02em] text-brand-rust", t.summaryTitle));
    var list = el("ul", "mt-3 grid gap-2");
    list.setAttribute("role", "list");
    Object.keys(errors).forEach(function (name) {
      var target = firstControl(name);
      var link = el("a", LINK_CLASSES, errors[name]);
      link.href = "#" + (target ? target.id : name);
      link.addEventListener("click", function (event) {
        event.preventDefault();
        if (target) {
          target.focus();
          target.scrollIntoView({ block: "center" });
        }
      });
      var item = el("li");
      item.appendChild(link);
      list.appendChild(item);
    });
    summary.appendChild(list);
    summary.classList.remove("hidden");
    summary.focus();
  }

  function hideSummary() {
    if (!summary) return;
    clear(summary);
    summary.classList.add("hidden");
  }

  function fieldBlocks() {
    // Everything in the form except the buttons row and the success box.
    return Array.prototype.slice.call(form.children).filter(function (node) {
      return node !== success && node !== summary && !(submit && node.contains(submit));
    });
  }

  function applyLayout(state) {
    var show = layoutFor(state);
    fieldBlocks().forEach(function (node) { node.classList.toggle("hidden", !show.fields); });
    // The hidden attribute, not the class: the button's inline-flex class would override a "hidden" class.
    if (submit) submit.hidden = !show.submit;
    if (success) success.classList.toggle("hidden", !show.success);
  }

  function showSuccess() {
    applyLayout("success");
    hideSummary();
    if (!success) return;
    clear(success);
    success.appendChild(el("h2", "text-2xl font-medium leading-[1.1] tracking-[-0.035em] sm:text-3xl", t.successTitle));
    t.successBody.forEach(function (p) { success.appendChild(el("p", "mt-4 max-w-[60ch] text-brand-sage", p)); });
    SUCCESS_CLASSES.forEach(function (c) { success.classList.add(c); });
    success.setAttribute("tabindex", "-1");
    // Show the thank-you message above the buttons ("Clear form" stays below it).
    var buttons = submit ? submit.parentElement : null;
    if (buttons && buttons.parentElement === form) form.insertBefore(success, buttons);
    success.focus();
  }

  function setSending(on) {
    if (!submit) return;
    submit.disabled = on;
    submit.setAttribute("aria-disabled", on ? "true" : "false");
    submit.textContent = on ? t.sending : submitLabel;
  }

  // Real-time validation: on leaving a field, then on every change once it has been touched.
  FIELDS.forEach(function (f) {
    var name = f[0];
    controls(name).forEach(function (c) {
      c.classList.add(VALID_CLASS);
      c.addEventListener("blur", function (event) {
        // Moving from one radio to another in the same group is not leaving the group.
        if (event.relatedTarget && event.relatedTarget.name === name) return;
        touched[name] = true;
        check(name);
      });
      var live = function () {
        if (name === "additional_comments") {
          updateCounter();
          if (remaining(valueOf(name)) < 0) touched[name] = true;
        }
        if (c.type === "radio" || c.type === "checkbox" || c.tagName === "SELECT") touched[name] = true;
        if (touched[name]) check(name);
      };
      c.addEventListener("input", live);
      c.addEventListener("change", live);
    });
  });

  form.addEventListener("submit", function (event) {
    event.preventDefault(); // There is no backend: the submission is always simulated.
    if (sendingTimer) return;
    var values = {};
    FIELDS.forEach(function (f) { values[f[0]] = valueOf(f[0]); touched[f[0]] = true; });
    var errors = validateAll(values, lang);
    FIELDS.forEach(function (f) {
      if (errors[f[0]]) showError(f[0], errors[f[0]]);
      else clearError(f[0], true);
    });
    if (Object.keys(errors).length) {
      showSummary(errors);
      return;
    }
    hideSummary();
    setSending(true);
    sendingTimer = setTimeout(function () {
      sendingTimer = null;
      setSending(false); // Hidden with the fields until "Clear form".
      showSuccess();
    }, 800);
  });

  form.addEventListener("reset", function () {
    // The native reset clears the values after this event; restore everything else next.
    setTimeout(function () {
      if (sendingTimer) {
        clearTimeout(sendingTimer);
        sendingTimer = null;
      }
      touched = {};
      FIELDS.forEach(function (f) { clearError(f[0], false); });
      hideSummary();
      if (success) {
        clear(success);
        SUCCESS_CLASSES.forEach(function (c) { success.classList.remove(c); });
        success.removeAttribute("tabindex");
      }
      applyLayout("form");
      setSending(false);
      updateCounter();
      var first = firstControl("full_name");
      if (first) first.focus();
    }, 0);
  });

  updateCounter();
})();
