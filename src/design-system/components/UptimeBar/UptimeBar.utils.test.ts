import { describe, expect, it } from 'vitest'
import { averageUptime, describeUptime, formatUptime, uptimeLevel } from './UptimeBar.utils'

describe('uptimeLevel', () => {
  it.each([
    [100, 'healthy'],
    [99.9, 'healthy'],
    [99.5, 'degraded'],
    [99, 'degraded'],
    [97.2, 'down'],
    [null, 'empty'],
  ] as const)('classifies %s as %s', (uptime, level) => {
    expect(uptimeLevel(uptime)).toBe(level)
  })
})

describe('averageUptime', () => {
  it('ignores days that were not measured', () => {
    expect(
      averageUptime([
        { date: 'a', uptime: 100 },
        { date: 'b', uptime: null },
        { date: 'c', uptime: 98 },
      ]),
    ).toBe(99)
  })

  it('returns null when nothing was measured', () => {
    expect(averageUptime([{ date: 'a', uptime: null }])).toBeNull()
  })
})

describe('formatUptime', () => {
  it('truncates instead of rounding up to 100%', () => {
    expect(formatUptime(99.999)).toBe('99.99%')
  })

  it('keeps a perfect score', () => {
    expect(formatUptime(100)).toBe('100.00%')
  })

  it('says when there is no data', () => {
    expect(formatUptime(null)).toBe('No data')
  })
})

describe('describeUptime', () => {
  it('counts the days with issues', () => {
    const days = [
      { date: 'a', uptime: 100 },
      { date: 'b', uptime: 98 },
    ]
    expect(describeUptime('API', days)).toBe('API: 99.00% over 2 days, 1 with issues')
  })
})
