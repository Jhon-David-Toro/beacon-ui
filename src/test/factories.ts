import type { Incident, Service } from '../app/data'

/**
 * A service with neutral defaults, for tests that only care about a few
 * fields.
 *
 * @param overrides - Fields to set.
 * @returns A complete `Service`.
 */
export function makeService(overrides: Partial<Service> = {}): Service {
  return {
    id: 'search',
    name: 'Search',
    description: '',
    region: 'eu-west-1',
    status: 'operational',
    latency: [],
    uptime: [],
    incidents: [],
    ...overrides,
  }
}

/**
 * An open incident reported from this browser, with neutral defaults.
 *
 * @param overrides - Fields to set.
 * @returns A complete `Incident`.
 */
export function makeIncident(overrides: Partial<Incident> = {}): Incident {
  return {
    id: 'incident',
    serviceId: 'search',
    title: 'Search results are slow',
    details: '',
    severity: 'degraded',
    phase: 'investigating',
    startedAt: '2026-11-07T10:00:00Z',
    reportedByYou: true,
    ...overrides,
  }
}
