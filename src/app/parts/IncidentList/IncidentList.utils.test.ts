import { describe, expect, it } from 'vitest'
import type { Incident } from '../../data'
import { startedPrefix } from './IncidentList.utils'

const base = {
  id: 'i',
  serviceId: 's',
  title: 't',
  details: '',
  severity: 'outage',
  startedAt: '2026-11-07T10:00:00Z',
  reportedByYou: false,
} as const

describe('startedPrefix', () => {
  it('leads with the phase while the incident is open', () => {
    expect(startedPrefix({ ...base, phase: 'monitoring' } satisfies Incident)).toBe(
      'Monitoring, started',
    )
  })

  it('omits the phase once resolved', () => {
    expect(startedPrefix({ ...base, phase: 'resolved' } satisfies Incident)).toBe('Started')
  })
})
