/**
 * Data for the hero "CV cascade": an exact port of the field set-up inside
 * setupCascade() in docs/milestone-1/design/nexova-landing-v4.html.
 * Same seeded PRNG (mulberry32), same call order and same maths, so the same
 * seed always gives the same field. No DOM access: the component animates it.
 */

/** Avatar tones, in the design's order (#C9D6D1, #9DB5AD, #D9CBB6, #4F7A72). */
export const CV_TONES = [
  "var(--color-sage)",
  "var(--color-sage-tone)",
  "var(--color-tan)",
  "var(--color-green-mid)",
] as const;

export const CV_FIELD_SEED = 2011;
export const CV_CARD_COUNT = 72;
export const CV_SHORTLIST_SIZE = 5;
export const CV_COLS = 12;
export const CV_ROWS = 6;

/** Gap between cards, in card widths. */
const G = 0.18;
const XU = 1 + G;
const YU = 1 + G * 0.75;

export type CvStatus = "win" | "short" | "rest";

export interface CvCard {
  /** Random score; the higher, the better the rank. */
  score: number;
  /** Pile position after the fall, in card units. */
  px: number;
  py: number;
  /** Pile rotation in degrees. */
  rot: number;
  /** Fall delay in ms. */
  delay: number;
  /** Fall height above the field, in card heights. */
  drop: number;
  tone: (typeof CV_TONES)[number];
  /** Widths of the two text lines, in % of the card. */
  l1: number;
  l2: number;
  /** 0 is the best score. */
  rank: number;
  /** Grid cell the card sorts into. */
  col: number;
  row: number;
  /** Grid position, in card units. */
  gx: number;
  gy: number;
  /** Score bar fill, 0 to 1. */
  fill: number;
  status: CvStatus;
}

export interface CvFieldData {
  cards: CvCard[];
  /** Index in `cards` of the placed candidate. */
  winIndex: number;
  /** Field size, in card widths and card heights. */
  W: number;
  H: number;
}

interface Cell {
  c: number;
  r: number;
  d: number;
  k: number;
}

function at<T>(list: readonly T[], i: number): T {
  const v = list[i];
  if (v === undefined) throw new RangeError(`index ${i} out of range`);
  return v;
}

export function cvField(seed: number = CV_FIELD_SEED): CvFieldData {
  let s = seed >>> 0;
  const rnd = (): number => {
    s |= 0;
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };

  const W = CV_COLS + G * (CV_COLS - 1);
  const H = CV_ROWS + G * 0.75 * (CV_ROWS - 1);

  // Cells ordered from the centre outwards (vertical distance weighted 4/3).
  const cells: Cell[] = [];
  for (let r = 0; r < CV_ROWS; r++) {
    for (let c = 0; c < CV_COLS; c++) {
      const dx = c * XU + 0.5 - W / 2;
      const dy = ((r * YU + 0.5 - H / 2) * 4) / 3;
      cells.push({ c, r, d: dx * dx + dy * dy, k: r * CV_COLS + c });
    }
  }
  cells.sort((a, b) => a.d - b.d || a.k - b.k);

  const g3 = () => rnd() + rnd() + rnd() - 1.5;
  const cards: CvCard[] = [];
  for (let i = 0; i < CV_CARD_COUNT; i++) {
    // Property order matters: it fixes the order of the rnd() calls.
    const score = rnd();
    const px = Math.max(0, Math.min(W - 1, W / 2 - 0.5 + g3() * 5.4));
    const py = Math.max(0, Math.min(H - 1, H / 2 - 0.5 + g3() * 2.6));
    const rot = (rnd() * 2 - 1) * 15;
    const delay = rnd() * 900;
    const drop = 1.4 + rnd() * 1.6;
    const tone = at(CV_TONES, Math.floor(rnd() * CV_TONES.length));
    const l1 = 58 + rnd() * 26;
    const l2 = 34 + rnd() * 24;
    cards.push({
      score, px, py, rot, delay, drop, tone, l1, l2,
      rank: 0, col: 0, row: 0, gx: 0, gy: 0, fill: 0, status: "rest",
    });
  }

  const order = cards.map((_, i) => i).sort((a, b) => at(cards, b).score - at(cards, a).score);
  order.forEach((ci, rank) => {
    const c = at(cards, ci);
    const cell = at(cells, rank);
    c.rank = rank;
    c.col = cell.c;
    c.row = cell.r;
    c.gx = cell.c * XU;
    c.gy = cell.r * YU;
    c.fill = 0.98 - (rank / (CV_CARD_COUNT - 1)) * 0.72;
    c.status = rank === 0 ? "win" : rank < CV_SHORTLIST_SIZE ? "short" : "rest";
  });

  return { cards, winIndex: at(order, 0), W, H };
}
