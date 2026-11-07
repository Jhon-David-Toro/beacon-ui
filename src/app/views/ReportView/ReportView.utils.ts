import { SERVICE_OPTIONS } from './ReportView.constants'

/**
 * Display name of a service id, falling back to the id itself.
 *
 * @param id - Service id.
 * @returns The service name.
 */
export function serviceName(id: string): string {
  return SERVICE_OPTIONS.find((option) => option.value === id)?.label ?? id
}

/**
 * Service to preselect: the one in the URL, if it exists.
 *
 * @param id - Service id from the query string.
 * @returns The id when it is a known service, otherwise an empty string.
 */
export function preselectedService(id: string): string {
  return SERVICE_OPTIONS.some((option) => option.value === id) ? id : ''
}
