import type { BadgeTone, SparklineTone } from '../../../design-system'
import type { IncidentPhase, ServiceStatus } from '../../data'

export const STATUS_LABELS: Record<ServiceStatus, string> = {
  operational: 'Operational',
  degraded: 'Degraded performance',
  outage: 'Outage',
  maintenance: 'Under maintenance',
}

export const STATUS_TONES: Record<ServiceStatus, BadgeTone> = {
  operational: 'success',
  degraded: 'warning',
  outage: 'danger',
  maintenance: 'info',
}

export const STATUS_SEVERITY: Record<ServiceStatus, number> = {
  operational: 0,
  maintenance: 1,
  degraded: 2,
  outage: 3,
}

export const PHASE_LABELS: Record<IncidentPhase, string> = {
  investigating: 'Investigating',
  identified: 'Identified',
  monitoring: 'Monitoring',
  resolved: 'Resolved',
}

export const RELATIVE_UNITS: readonly (readonly [Intl.RelativeTimeFormatUnit, number])[] = [
  ['day', 86_400_000],
  ['hour', 3_600_000],
  ['minute', 60_000],
]

export const LOCALE = 'en'

export const SPARKLINE_TONES: Record<ServiceStatus, SparklineTone> = {
  operational: 'success',
  degraded: 'warning',
  outage: 'danger',
  maintenance: 'neutral',
}
