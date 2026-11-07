import { describe, expect, it } from 'vitest'
import type { Service } from '../../data'
import { affectedCount, filterServices, overallStatus, regionCount } from './OverviewView.utils'

/**
 * Service with only the fields the filters read.
 *
 * @param overrides - Fields to set.
 */
function service(overrides: Partial<Service>): Service {
  return {
    id: 'x',
    name: 'X',
    description: '',
    region: 'us-east-1',
    status: 'operational',
    latency: [],
    uptime: [],
    incidents: [],
    ...overrides,
  }
}

const services = [
  service({ id: 'search', name: 'Search', region: 'eu-west-1' }),
  service({ id: 'checkout', name: 'Checkout', description: 'Payments', status: 'degraded' }),
  service({ id: 'cdn', name: 'Media CDN', region: 'global', status: 'outage' }),
]

describe('filterServices', () => {
  it('matches name, description and region, ignoring case', () => {
    const ids = (query: string) =>
      filterServices(services, { query, status: 'all' }).map((item) => item.id)
    expect(ids('SEARCH')).toEqual(['search'])
    expect(ids('payments')).toEqual(['checkout'])
    expect(ids('eu-west')).toEqual(['search'])
  })

  it('filters by status', () => {
    expect(
      filterServices(services, { query: '', status: 'outage' }).map((item) => item.id),
    ).toEqual(['cdn'])
  })
})

describe('summary helpers', () => {
  it('counts services that are not operational', () => {
    expect(affectedCount(services)).toBe(2)
  })

  it('finds the worst status', () => {
    expect(overallStatus(services)).toBe('outage')
    expect(overallStatus([])).toBe('operational')
  })

  it('counts distinct regions', () => {
    expect(regionCount(services)).toBe(3)
  })
})
