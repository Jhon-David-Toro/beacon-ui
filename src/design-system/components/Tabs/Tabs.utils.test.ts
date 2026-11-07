import { describe, expect, it } from 'vitest'
import { clampIndex, nextTabIndex } from './Tabs.utils'

describe('nextTabIndex', () => {
  it.each([
    [0, 'ArrowRight', 1],
    [2, 'ArrowRight', 0],
    [0, 'ArrowLeft', 2],
    [1, 'Home', 0],
    [0, 'End', 2],
  ])('from %i, %s goes to %i', (current, key, expected) => {
    expect(nextTabIndex(current, key, 3)).toBe(expected)
  })

  it('ignores keys outside the pattern', () => {
    expect(nextTabIndex(0, 'Enter', 3)).toBeNull()
  })

  it('does nothing for an empty list', () => {
    expect(nextTabIndex(0, 'ArrowRight', 0)).toBeNull()
  })
})

describe('clampIndex', () => {
  it('keeps the index within the list', () => {
    expect(clampIndex(5, 3)).toBe(2)
    expect(clampIndex(-1, 3)).toBe(0)
    expect(clampIndex(1, 0)).toBe(0)
  })
})
