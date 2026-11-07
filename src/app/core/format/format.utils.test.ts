import { describe, expect, it } from 'vitest'
import { formatRelative, headline, percentile, sparklineTone, worstStatus } from './format.utils'

const now = new Date('2026-11-07T12:00:00Z')

describe('formatRelative', () => {
  it.each([
    ['2026-11-07T11:59:40Z', 'this minute'],
    ['2026-11-07T11:45:00Z', '15 minutes ago'],
    ['2026-11-07T09:00:00Z', '3 hours ago'],
    ['2026-11-06T12:00:00Z', 'yesterday'],
    ['2026-11-01T12:00:00Z', '6 days ago'],
  ])('formats %s as "%s"', (iso, expected) => {
    expect(formatRelative(iso, now)).toBe(expected)
  })
})

describe('percentile', () => {
  const values = [5, 1, 4, 2, 3, 10, 9, 8, 7, 6]

  it('uses the nearest-rank method', () => {
    expect(percentile(values, 50)).toBe(5)
    expect(percentile(values, 95)).toBe(10)
  })

  it('returns 0 for no data', () => {
    expect(percentile([], 95)).toBe(0)
  })
})

describe('worstStatus', () => {
  it('keeps the more severe status', () => {
    expect(worstStatus('operational', 'degraded')).toBe('degraded')
    expect(worstStatus('outage', 'maintenance')).toBe('outage')
  })
})

describe('headline', () => {
  it('reads naturally for zero, one and many', () => {
    expect(headline(0)).toBe('All systems are running normally.')
    expect(headline(1)).toBe('1 service needs attention.')
    expect(headline(3)).toBe('3 services need attention.')
  })
})

describe('sparklineTone', () => {
  it('maps each status to a chart colour', () => {
    expect(sparklineTone('outage')).toBe('danger')
    expect(sparklineTone('maintenance')).toBe('neutral')
  })
})
