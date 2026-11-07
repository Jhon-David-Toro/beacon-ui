import { describe, expect, it } from 'vitest'
import { isSeverity, parseStored, reportFromFormData, sortByNewest } from './store.utils'
import type { Incident } from '../../data'

/**
 * FormData from plain entries.
 *
 * @param entries - Field names and values.
 * @returns A `FormData` with one entry per key.
 */
function formData(entries: Record<string, string>): FormData {
  const data = new FormData()
  Object.entries(entries).forEach(([key, value]) => {
    data.append(key, value)
  })

  return data
}

describe('reportFromFormData', () => {
  it('reads and trims a complete report', () => {
    const data = formData({
      service: 'search',
      title: '  Slow results ',
      severity: 'degraded',
      details: ' p95 above 2 s ',
      notify: 'on',
    })
    expect(reportFromFormData(data)).toEqual({
      serviceId: 'search',
      title: 'Slow results',
      details: 'p95 above 2 s',
      severity: 'degraded',
      notify: true,
    })
  })

  it('rejects an unknown severity', () => {
    expect(reportFromFormData(formData({ service: 'a', title: 'b', severity: 'meh' }))).toBeNull()
  })

  it('treats missing details and notify as empty', () => {
    const report = reportFromFormData(formData({ service: 'a', title: 'b', severity: 'outage' }))
    expect(report).toMatchObject({ details: '', notify: false })
  })
})

describe('isSeverity', () => {
  it('only accepts non-operational statuses', () => {
    expect(isSeverity('outage')).toBe(true)
    expect(isSeverity('operational')).toBe(false)
    expect(isSeverity(null)).toBe(false)
  })
})

describe('parseStored', () => {
  it('returns an empty list for missing or invalid data', () => {
    expect(parseStored(null)).toEqual([])
    expect(parseStored('{"a":1}')).toEqual([])
  })
})

describe('sortByNewest', () => {
  it('orders by start time, newest first', () => {
    const incidents = [
      { id: 'old', startedAt: '2026-11-01T00:00:00Z' },
      { id: 'new', startedAt: '2026-11-07T00:00:00Z' },
    ] as Incident[]
    expect(sortByNewest(incidents).map((incident) => incident.id)).toEqual(['new', 'old'])
  })
})
