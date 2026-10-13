import { test } from "node:test";
import assert from "node:assert/strict";
import { CV_CARD_COUNT, CV_COLS, CV_ROWS, cvField } from "./cvField.ts";

test("the field has 72 cards: exactly 1 win and 4 short", () => {
  const { cards } = cvField();
  assert.equal(cards.length, 72);
  assert.equal(CV_CARD_COUNT, 72);
  assert.equal(cards.filter((c) => c.status === "win").length, 1);
  assert.equal(cards.filter((c) => c.status === "short").length, 4);
});

test("the same seed gives the same output", () => {
  assert.deepEqual(cvField(2011), cvField(2011));
  assert.notDeepEqual(cvField(2011), cvField(7));
});

test("every card sorts into a unique grid cell", () => {
  const { cards } = cvField();
  const cells = new Set(cards.map((c) => `${c.col},${c.row}`));
  assert.equal(cells.size, cards.length);
  for (const c of cards) {
    assert.ok(c.col >= 0 && c.col < CV_COLS && c.row >= 0 && c.row < CV_ROWS);
  }
});

test("the win card lands in one of the 4 centre cells", () => {
  const { cards, winIndex } = cvField();
  const win = cards[winIndex];
  assert.ok(win);
  assert.equal(win.status, "win");
  assert.ok([CV_COLS / 2 - 1, CV_COLS / 2].includes(win.col), `col ${win.col}`);
  assert.ok([CV_ROWS / 2 - 1, CV_ROWS / 2].includes(win.row), `row ${win.row}`);
});
