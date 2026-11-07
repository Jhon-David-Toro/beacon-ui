import { describe, expect, it } from 'vitest'
import { LATENCY_SAMPLES, SERVICE_SEEDS, UPTIME_DAYS } from './services.constants'
import { buildServices } from './services.mock'

/** Fixed "now" so generated dates are stable. */
const now = new Date('2026-11-07T12:00:00Z')

describe('buildServices', () => {
  const services = buildServices(now)

  it('builds every seeded service', () => {
    expect(services.map((service) => service.id)).toEqual(SERVICE_SEEDS.map((seed) => seed.id))
  })

  it('gives each service 24 h of latency and 90 days of uptime', () => {
    services.forEach((service) => {
      expect(service.latency).toHaveLength(LATENCY_SAMPLES)
      expect(service.uptime).toHaveLength(UPTIME_DAYS)
    })
  })

  it('ends the uptime history today', () => {
    expect(services[0]?.uptime.at(-1)?.date).toBe('2026-11-07')
  })

  it('reflects an outage in today’s uptime', () => {
    const notifications = services.find((service) => service.id === 'notifications')
    expect(notifications?.uptime.at(-1)?.uptime).toBeLessThan(99)
  })

  it('dates incidents relative to now', () => {
    const notifications = services.find((service) => service.id === 'notifications')
    expect(notifications?.incidents[0]?.startedAt).toBe('2026-11-07T11:00:00.000Z')
  })

  it('is deterministic', () => {
    expect(buildServices(now)).toEqual(services)
  })
})
