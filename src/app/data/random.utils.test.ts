import { describe, expect, it } from 'vitest'
import { seededRandom } from './random.utils'

describe('seededRandom', () => {
  it('repeats the same sequence for the same seed', () => {
    const a = seededRandom(7)
    const b = seededRandom(7)
    expect([a(), a(), a()]).toEqual([b(), b(), b()])
  })

  it('stays within [0, 1)', () => {
    const random = seededRandom(99)
    const values = Array.from({ length: 500 }, random)
    expect(values.every((value) => value >= 0 && value < 1)).toBe(true)
  })
})
