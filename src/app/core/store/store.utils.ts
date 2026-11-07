import type { Incident, IncidentSeverity } from '../../data'
import type { IncidentReport } from './store.types'

/** Severities the report form accepts. */
const SEVERITIES: readonly IncidentSeverity[] = ['degraded', 'outage', 'maintenance']

/**
 * Reads a report out of the incident form's `FormData`. Returns `null` when
 * a field is missing or unexpected, which the form's own validation should
 * already have prevented.
 *
 * @param data - Submitted form data.
 * @returns The report, or `null` when the data is incomplete.
 */
export function reportFromFormData(data: FormData): IncidentReport | null {
  const serviceId = data.get('service')
  const title = data.get('title')
  const severity = data.get('severity')
  if (typeof serviceId !== 'string' || typeof title !== 'string' || !isSeverity(severity)) {
    return null
  }
  const details = data.get('details')

  return {
    serviceId,
    title: title.trim(),
    details: typeof details === 'string' ? details.trim() : '',
    severity,
    notify: data.has('notify'),
  }
}

/**
 * Whether a form value is a known severity.
 *
 * @param value - Raw form value.
 * @returns `true` for `degraded`, `outage` or `maintenance`.
 */
export function isSeverity(value: FormDataEntryValue | null): value is IncidentSeverity {
  return typeof value === 'string' && (SEVERITIES as readonly string[]).includes(value)
}

/**
 * Builds the incident stored for a report.
 *
 * @param report - Validated report.
 * @param id - Unique id.
 * @param now - Report time.
 * @returns The incident, in the `investigating` phase.
 */
export function toIncident(report: IncidentReport, id: string, now: Date): Incident {
  return {
    id,
    serviceId: report.serviceId,
    title: report.title,
    details: report.details,
    severity: report.severity,
    phase: 'investigating',
    startedAt: now.toISOString(),
    reportedByYou: true,
  }
}

/**
 * Parses stored incidents, ignoring anything that is not a list.
 *
 * @param raw - Stored JSON, or `null` when nothing is stored.
 * @returns The stored incidents, or an empty list.
 */
export function parseStored(raw: string | null): Incident[] {
  if (!raw) {
    return []
  }
  try {
    const parsed: unknown = JSON.parse(raw)

    return Array.isArray(parsed) ? (parsed as Incident[]) : []
  } catch {
    return []
  }
}

/**
 * Newest incidents first.
 *
 * @param incidents - Incidents in any order.
 * @returns A new, sorted list.
 */
export function sortByNewest(incidents: readonly Incident[]): Incident[] {
  return [...incidents].sort((a, b) => b.startedAt.localeCompare(a.startedAt))
}
