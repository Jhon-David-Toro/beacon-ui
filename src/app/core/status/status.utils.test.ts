import { describe, expect, it } from 'vitest'
import { makeIncident as incident, makeService } from '../../../test/factories'
import { effectiveStatus, openFirst, withReports } from './status.utils'

/** Operational service the reports are applied to. */
const service = makeService()

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
