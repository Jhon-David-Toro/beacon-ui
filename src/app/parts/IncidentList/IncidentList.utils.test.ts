import { describe, expect, it } from 'vitest'
import { makeIncident } from '../../../test/factories'
import { startedPrefix } from './IncidentList.utils'

describe('startedPrefix', () => {
  it('leads with the phase while the incident is open', () => {
    expect(startedPrefix(makeIncident({ phase: 'monitoring' }))).toBe('Monitoring, started')
  })

  it('omits the phase once resolved', () => {
    expect(startedPrefix(makeIncident({ phase: 'resolved' }))).toBe('Started')
  })
})
