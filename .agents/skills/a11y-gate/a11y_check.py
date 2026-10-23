"""Accessibility checks for the a11y-gate skill (see SKILL.md).

Drives Playwright Chromium with axe-core (axe-playwright-python) against pages
served at --base, prints one PASS / FAIL / SKIP line per criterion and exits 1
when any line is FAIL.

Examples:
  python3 a11y_check.py --base http://127.0.0.1:8099 --out docs/milestone-2/a11y \
      --pages index.html application.html es/index.html es/application.html
  python3 a11y_check.py --base http://localhost:3000 --pages / --axe-only
"""

import argparse
import re
import sys
from pathlib import Path

from axe_playwright_python.sync_playwright import Axe
from playwright.sync_api import sync_playwright

WIDTHS = (375, 768, 1280)
REFLOW_WIDTH = 320
HEIGHT = 900
BLOCKING_IMPACTS = {"serious", "critical"}

failures = 0


def report(status, num, where, desc, detail=""):
    global failures
    if status == "FAIL":
        failures += 1
    line = f"{status} [{num}] {where}: {desc}"
    print(f"{line} — {detail}" if detail else line)


def slug(page_path):
    name = page_path.strip("/").replace("/", "-").replace(".html", "") or "root"
    return re.sub(r"[^A-Za-z0-9_-]", "-", name)


STRUCTURE_JS = """
() => {
  const visible = el => el.getClientRects().length > 0 && getComputedStyle(el).visibility !== 'hidden'
    && !el.closest('[aria-hidden="true"]');
  const headings = [...document.querySelectorAll('h1,h2,h3,h4,h5,h6')].filter(visible)
    .map(h => Number(h.tagName[1]));
  const imgs = [...document.querySelectorAll('img')].map(img => ({
    src: (img.getAttribute('src') || '').slice(0, 60),
    alt: img.getAttribute('alt'),
    hidden: img.getAttribute('aria-hidden') === 'true' || ['presentation', 'none'].includes(img.getAttribute('role')),
  }));
  const controls = [...document.querySelectorAll('input,select,textarea')]
    .filter(el => !['hidden', 'submit', 'button', 'reset', 'image'].includes((el.type || '').toLowerCase()))
    .map(el => {
      const byIds = (el.getAttribute('aria-labelledby') || '').split(/\\s+/).filter(Boolean)
        .some(id => (document.getElementById(id)?.textContent || '').trim());
      const labelled = (el.labels && [...el.labels].some(l => l.textContent.trim())) || byIds
        || (el.getAttribute('aria-label') || '').trim() !== '';
      return { name: el.name || el.id || el.tagName.toLowerCase(), labelled };
    });
  return { lang: document.documentElement.getAttribute('lang') || '', headings, imgs, controls };
}
"""

TABBABLES_JS = """
() => {
  const seenRadio = new Set();
  const list = [...document.querySelectorAll('a[href],button,input,select,textarea,summary,[tabindex]')]
    .filter(el => el.tabIndex >= 0 && !el.disabled && el.type !== 'hidden'
      && el.getClientRects().length > 0 && getComputedStyle(el).visibility !== 'hidden' && !el.closest('[inert]'))
    .filter(el => {
      if (el.type !== 'radio') return true;
      if (seenRadio.has(el.name)) return false;
      seenRadio.add(el.name);
      return true;
    });
  list.forEach((el, i) => el.setAttribute('data-a11y-idx', String(i)));
  return list.length;
}
"""

ACTIVE_JS = """
() => {
  let el = document.activeElement;
  if (!el || el === document.body) return null;
  if (el.type === 'radio') {
    const first = document.querySelector(`input[type=radio][name="${CSS.escape(el.name)}"][data-a11y-idx]`);
    if (first) el = first;
  }
  const cs = getComputedStyle(document.activeElement);
  const outline = cs.outlineStyle !== 'none' && parseFloat(cs.outlineWidth) > 0;
  const shadow = cs.boxShadow && cs.boxShadow !== 'none';
  const label = (document.activeElement.textContent || document.activeElement.name || document.activeElement.tagName).trim().slice(0, 40);
  return { idx: el.getAttribute('data-a11y-idx'), visible: outline || shadow, label };
}
"""


def check_structure(page, where, page_path):
    data = page.evaluate(STRUCTURE_JS)

    expected_lang = "es" if page_path.startswith("es/") else "en"
    problems = []
    if data["lang"].split("-")[0].lower() != expected_lang:
        problems.append(f'lang="{data["lang"]}" (expected {expected_lang})')
    h1_count = data["headings"].count(1)
    if h1_count != 1:
        problems.append(f"{h1_count} h1 elements")
    prev = 0
    for level in data["headings"]:
        if level > prev + 1:
            problems.append(f"heading jumps from h{prev or '-'} to h{level}")
            break
        prev = level
    desc = "lang set and correct, exactly one h1, no skipped heading levels"
    report("FAIL" if problems else "PASS", 2, where, desc, "; ".join(problems))

    bad_imgs = [i["src"] for i in data["imgs"] if not ((i["alt"] or "").strip() or (i["alt"] == "" and i["hidden"]))]
    desc = f"every img has a non-empty alt, or alt=\"\" with aria-hidden ({len(data['imgs'])} images)"
    report("FAIL" if bad_imgs else "PASS", 3, where, desc, ", ".join(bad_imgs))

    unlabelled = [c["name"] for c in data["controls"] if not c["labelled"]]
    desc = f"every form control has an associated label ({len(data['controls'])} controls)"
    report("FAIL" if unlabelled else "PASS", 4, where, desc, ", ".join(unlabelled))


def check_keyboard(page, where):
    total = page.evaluate(TABBABLES_JS)
    desc = f"Tab reaches every interactive element in DOM order with a visible focus style ({total} elements)"
    if total == 0:
        report("SKIP", 5, where, desc, "no interactive elements")
        return
    page.locator("body").focus()
    page.evaluate("() => document.activeElement && document.activeElement.blur()")
    problems = []
    for expected in range(total):
        page.keyboard.press("Tab")
        active = page.evaluate(ACTIVE_JS)
        if active is None or active["idx"] != str(expected):
            got = "body" if active is None else f"#{active['idx']} {active['label']!r}"
            problems.append(f"step {expected + 1}: expected element #{expected}, got {got}")
            break
        if not active["visible"]:
            problems.append(f"no visible focus style on #{expected} {active['label']!r}")
    report("FAIL" if problems else "PASS", 5, where, desc, "; ".join(problems[:3]))


def run_axe(page, axe, where):
    results = axe.run(page)
    blocking = [v for v in results.response["violations"] if v.get("impact") in BLOCKING_IMPACTS]
    detail = ", ".join(f"{v['id']} ({v['impact']}, {len(v['nodes'])} nodes)" for v in blocking)
    others = [v for v in results.response["violations"] if v.get("impact") not in BLOCKING_IMPACTS]
    if others:
        detail += ("; " if detail else "") + "minor/moderate: " + ", ".join(
            f"{v['id']} ({v['impact']}, {len(v['nodes'])} nodes)" for v in others)
    report("FAIL" if blocking else "PASS", 1, where, "axe: 0 serious or critical violations", detail)


def main():
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--base", required=True, help="base URL, e.g. http://127.0.0.1:8099")
    parser.add_argument("--pages", nargs="+", required=True, help="page paths relative to --base")
    parser.add_argument("--out", help="folder for the forced-colors screenshots")
    parser.add_argument("--axe-only", action="store_true", help="run only criterion 1 (axe)")
    args = parser.parse_args()

    base = args.base.rstrip("/")
    out = Path(args.out) if args.out else None
    if out:
        out.mkdir(parents=True, exist_ok=True)
    axe = Axe()

    with sync_playwright() as pw:
        browser = pw.chromium.launch()
        for page_path in args.pages:
            url = f"{base}/{page_path.lstrip('/')}"
            for width in WIDTHS:
                where = f"{page_path} @{width}px"
                context = browser.new_context(viewport={"width": width, "height": HEIGHT})
                page = context.new_page()
                response = page.goto(url, wait_until="networkidle")
                if response is None or response.status >= 400:
                    report("FAIL", 1, where, "page loads", f"HTTP {response.status if response else 'no response'}")
                    context.close()
                    continue
                run_axe(page, axe, where)
                if not args.axe_only:
                    check_structure(page, where, page_path)
                    check_keyboard(page, where)
                context.close()

            if args.axe_only:
                continue

            context = browser.new_context(viewport={"width": REFLOW_WIDTH, "height": HEIGHT})
            page = context.new_page()
            page.goto(url, wait_until="networkidle")
            sizes = page.evaluate("() => [document.documentElement.scrollWidth, document.documentElement.clientWidth]")
            report("FAIL" if sizes[0] > sizes[1] else "PASS", 6, f"{page_path} @{REFLOW_WIDTH}px",
                   "reflow: no horizontal scroll at 320px", f"scrollWidth {sizes[0]} > clientWidth {sizes[1]}" if sizes[0] > sizes[1] else "")
            context.close()

            context = browser.new_context(viewport={"width": 1280, "height": HEIGHT}, reduced_motion="reduce")
            page = context.new_page()
            page.goto(url, wait_until="networkidle")
            page.wait_for_timeout(500)
            running = page.evaluate("""() => document.getAnimations()
                .filter(a => a.playState === 'running' && a.constructor.name === 'CSSAnimation')
                .map(a => a.animationName)""")
            report("FAIL" if running else "PASS", 7, f"{page_path} reduced-motion",
                   "prefers-reduced-motion: reduce leaves no running CSS animations", ", ".join(running))
            context.close()

            context = browser.new_context(viewport={"width": 1280, "height": HEIGHT}, forced_colors="active")
            page = context.new_page()
            page.goto(url, wait_until="networkidle")
            if out:
                shot = out / f"{slug(page_path)}-forced-colors.png"
                page.screenshot(path=str(shot), full_page=True)
                report("PASS", 8, f"{page_path} forced-colors", "forced-colors screenshot saved for manual review", str(shot))
            else:
                report("SKIP", 8, f"{page_path} forced-colors", "forced-colors screenshot", "no --out folder given")
            context.close()
        browser.close()

    sys.exit(1 if failures else 0)


if __name__ == "__main__":
    main()
