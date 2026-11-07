import type { SelectOption } from '../../../design-system'
import { STATUS_LABELS } from '../../core/format'
import { SERVICE_SEEDS } from '../../data'

/** Tag name of the report page. */
export const REPORT_VIEW_TAG = 'beacon-report'
/** Fewest characters of an incident title. */
export const TITLE_MIN_LENGTH = 8
/** Most characters of an incident title: one line on a status page. */
export const TITLE_MAX_LENGTH = 80
/** Most characters of the incident details. */
export const DETAILS_MAX_LENGTH = 500

/** Services the user can report on. */
export const SERVICE_OPTIONS: readonly SelectOption[] = SERVICE_SEEDS.map((seed) => ({
  value: seed.id,
  label: seed.name,
}))

/** Impact choices, from least to most severe, then planned work. */
export const SEVERITY_OPTIONS: readonly SelectOption[] = [
  { value: 'degraded', label: STATUS_LABELS.degraded },
  { value: 'outage', label: STATUS_LABELS.outage },
  { value: 'maintenance', label: STATUS_LABELS.maintenance },
]
