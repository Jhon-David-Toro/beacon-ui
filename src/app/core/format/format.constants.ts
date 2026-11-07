import type { BadgeTone, SparklineTone } from '../../../design-system'
import type { IncidentPhase, ServiceStatus } from '../../data'

/** Text shown for each status. */
export const STATUS_LABELS: Record<ServiceStatus, string> = {
  operational: 'Operational',
  degraded: 'Degraded performance',
  outage: 'Outage',
  maintenance: 'Under maintenance',
}

/** Badge colour of each status. */
export const STATUS_TONES: Record<ServiceStatus, BadgeTone> = {
  operational: 'success',
  degraded: 'warning',
  outage: 'danger',
  maintenance: 'info',
}

/** How bad each status is; higher wins when statuses are combined. */
export const STATUS_SEVERITY: Record<ServiceStatus, number> = {
  operational: 0,
  maintenance: 1,
  degraded: 2,
  outage: 3,
}

/** Text shown for each incident phase. */
export const PHASE_LABELS: Record<IncidentPhase, string> = {
  investigating: 'Investigating',
  identified: 'Identified',
  monitoring: 'Monitoring',
  resolved: 'Resolved',
}

/** Units used for relative times, largest first, with their size in milliseconds. */
export const RELATIVE_UNITS: readonly (readonly [Intl.RelativeTimeFormatUnit, number])[] = [
  ['day', 86_400_000],
  ['hour', 3_600_000],
  ['minute', 60_000],
]

/** Locale of dates and numbers in the interface. */
export const LOCALE = 'en'

/** Chart colour of each status. Maintenance is planned, so it stays neutral. */
export const SPARKLINE_TONES: Record<ServiceStatus, SparklineTone> = {
  operational: 'success',
  degraded: 'warning',
  outage: 'danger',
  maintenance: 'neutral',
}
