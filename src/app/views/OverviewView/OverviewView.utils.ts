import type { Service, ServiceStatus } from '../../data'
import { worstStatus } from '../../core/format'
import { ALL_STATUSES } from './OverviewView.constants'
import type { ServiceFilters } from './OverviewView.types'

/**
 * Services matching the search text (name, description or region) and the
 * status filter.
 *
 * @param services - Every service.
 * @param filters - Current filters.
 * @returns The services that match both filters, in their original order.
 */
export function filterServices(services: readonly Service[], filters: ServiceFilters): Service[] {
  const query = filters.query.trim().toLowerCase()

  return services.filter((service) => {
    const statusMatches = filters.status === ALL_STATUSES || service.status === filters.status
    const text = `${service.name} ${service.description} ${service.region}`.toLowerCase()

    return statusMatches && text.includes(query)
  })
}

/**
 * Number of services that are not fully operational.
 *
 * @param services - Every service.
 * @returns How many services are degraded, down or in maintenance.
 */
export function affectedCount(services: readonly Service[]): number {
  return services.filter((service) => service.status !== 'operational').length
}

/**
 * Worst status across all services.
 *
 * @param services - Every service.
 * @returns The worst status, or `operational` for no services.
 */
export function overallStatus(services: readonly Service[]): ServiceStatus {
  return services.reduce<ServiceStatus>(
    (worst, service) => worstStatus(worst, service.status),
    'operational',
  )
}

/**
 * Number of distinct regions.
 *
 * @param services - Every service.
 * @returns How many regions the services run in.
 */
export function regionCount(services: readonly Service[]): number {
  return new Set(services.map((service) => service.region)).size
}

/**
 * Sentence under the headline.
 *
 * @param services - Every service.
 * @param checkedAt - When the data was loaded.
 * @returns A sentence such as "Checked at 11:02 AM. Watching 8 services in 5 regions."
 */
export function summaryLine(services: readonly Service[], checkedAt: Date): string {
  const time = checkedAt.toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' })

  return `Checked at ${time}. Watching ${services.length} services in ${regionCount(services)} regions.`
}
