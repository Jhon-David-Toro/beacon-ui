import type { Incident, Service, ServiceStatus } from '../../data'
import { worstStatus } from '../format'
import { sortByNewest } from '../store'

/**
 * Whether an incident still affects its service.
 *
 * @param incident - Incident to check.
 * @returns `true` until the incident is resolved.
 */
export function isOpen(incident: Incident): boolean {
  return incident.phase !== 'resolved'
}

/**
 * Status to show for a service once reports from this browser are taken
 * into account: an open report can only make the status worse.
 *
 * @param service - Service as returned by the API.
 * @param reported - Incidents reported for it from this browser.
 * @returns The worst of the API status and the open reports.
 */
export function effectiveStatus(service: Service, reported: readonly Incident[]): ServiceStatus {
  return reported
    .filter(isOpen)
    .reduce<ServiceStatus>(
      (status, incident) => worstStatus(status, incident.severity),
      service.status,
    )
}

/**
 * The service with reported incidents merged in and its status updated.
 *
 * @param service - Service as returned by the API.
 * @param reported - Incidents reported for it from this browser.
 * @returns A new service object; the input is not changed.
 */
export function withReports(service: Service, reported: readonly Incident[]): Service {
  return {
    ...service,
    status: effectiveStatus(service, reported),
    incidents: sortByNewest([...reported, ...service.incidents]),
  }
}

/**
 * Open incidents first, then the rest, newest first within each group.
 *
 * @param incidents - Incidents in any order.
 * @returns A new, sorted list.
 */
export function openFirst(incidents: readonly Incident[]): Incident[] {
  const sorted = sortByNewest(incidents)

  return [...sorted.filter(isOpen), ...sorted.filter((incident) => !isOpen(incident))]
}
