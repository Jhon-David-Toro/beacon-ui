import type { SelectOption } from '../../../design-system'
import { STATUS_LABELS } from '../../core/format'
import { SERVICE_STATUSES } from '../../data'

export const OVERVIEW_VIEW_TAG = 'beacon-overview'
export const ALL_STATUSES = 'all'
export const SKELETON_ROWS = 5

export const STATUS_FILTER_OPTIONS: readonly SelectOption[] = [
  { value: ALL_STATUSES, label: 'All statuses' },
  ...SERVICE_STATUSES.map((status) => ({ value: status, label: STATUS_LABELS[status] })),
]
