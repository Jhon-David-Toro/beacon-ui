import { describe, expect, it } from 'vitest'
import { makeService } from '../../../test/factories'
import { affectedCount, filterServices, overallStatus, regionCount } from './OverviewView.utils'

/** Three services in different regions and statuses. */
const services = [
  makeService({ id: 'search', name: 'Search', region: 'eu-west-1' }),
  makeService({
    id: 'checkout',
    name: 'Checkout',
    description: 'Payments',
    region: 'us-east-1',
    status: 'degraded',
  }),
  makeService({ id: 'cdn', name: 'Media CDN', region: 'global', status: 'outage' }),
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
