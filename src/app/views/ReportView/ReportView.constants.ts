import type { SelectOption } from '../../../design-system'
import { STATUS_LABELS } from '../../core/format'
import { SERVICE_SEEDS } from '../../data'

export const REPORT_VIEW_TAG = 'beacon-report'
export const TITLE_MIN_LENGTH = 8
export const TITLE_MAX_LENGTH = 80
export const DETAILS_MAX_LENGTH = 500

export const SERVICE_OPTIONS: readonly SelectOption[] = SERVICE_SEEDS.map((seed) => ({
  value: seed.id,
  label: seed.name,
}))

export const SEVERITY_OPTIONS: readonly SelectOption[] = [
  { value: 'degraded', label: STATUS_LABELS.degraded },
  { value: 'outage', label: STATUS_LABELS.outage },
  { value: 'maintenance', label: STATUS_LABELS.maintenance },
]
