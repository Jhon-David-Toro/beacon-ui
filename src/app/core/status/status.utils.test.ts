import { describe, expect, it } from 'vitest'
import type { Incident, Service } from '../../data'
import { effectiveStatus, openFirst, withReports } from './status.utils'

const service = {
  id: 'search',
  name: 'Search',
  description: '',
  region: 'eu-west-1',
  status: 'operational',
  latency: [],
  uptime: [],
  incidents: [],
} satisfies Service

/**
 * Incident with defaults for the fields a test does not care about.
 *
 * @param overrides - Fields to set.
 */
function incident(overrides: Partial<Incident>): Incident {
  return {
    id: 'i',
    serviceId: 'search',
    title: 't',
    details: '',
    severity: 'degraded',
    phase: 'investigating',
    startedAt: '2026-11-07T10:00:00Z',
    reportedByYou: true,
    ...overrides,
  }
}

describe('effectiveStatus', () => {
  it('worsens the status with an open report', () => {
    expect(effectiveStatus(service, [incident({ severity: 'outage' })])).toBe('outage')
  })

  it('ignores resolved reports', () => {
    expect(effectiveStatus(service, [incident({ phase: 'resolved' })])).toBe('operational')
  })
})

describe('withReports', () => {
  it('merges reports into the incident list', () => {
    const merged = withReports(service, [incident({ id: 'mine' })])
    expect(merged.incidents.map((item) => item.id)).toEqual(['mine'])
    expect(merged.status).toBe('degraded')
  })
})

describe('openFirst', () => {
  it('lists open incidents before resolved ones', () => {
    const list = openFirst([
      incident({ id: 'resolved-new', phase: 'resolved', startedAt: '2026-11-07T11:00:00Z' }),
      incident({ id: 'open-old', startedAt: '2026-11-01T11:00:00Z' }),
    ])
    expect(list.map((item) => item.id)).toEqual(['open-old', 'resolved-new'])
  })
})
