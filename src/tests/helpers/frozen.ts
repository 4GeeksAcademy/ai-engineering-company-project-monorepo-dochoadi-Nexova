// Freezes a list and every object in it, so any change attempt throws (modules run in strict mode).
export function deepFrozen<T extends object>(items: T[]): T[] {
  return Object.freeze(items.map((item) => Object.freeze(structuredClone(item)))) as T[];
}
