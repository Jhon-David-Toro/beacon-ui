/**
 * Small seeded pseudo-random generator (mulberry32). The mock data uses it so
 * every visit, test run and screenshot shows exactly the same charts.
 *
 * @param seed - Any 32-bit integer.
 * @returns A function that returns numbers in [0, 1).
 */
export function seededRandom(seed: number): () => number {
  let state = seed >>> 0

  return () => {
    state = (state + 0x6d2b79f5) >>> 0
    let t = state
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)

    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
