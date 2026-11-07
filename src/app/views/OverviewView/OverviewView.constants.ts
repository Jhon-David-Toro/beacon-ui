import type { SelectOption } from '../../../design-system'
import { STATUS_LABELS } from '../../core/format'
import { SERVICE_STATUSES } from '../../data'

/** Tag name of the overview page. */
export const OVERVIEW_VIEW_TAG = 'beacon-overview'
/** Value of the status filter that shows every service. */
export const ALL_STATUSES = 'all'
/** Placeholder rows shown while services load. */
export const SKELETON_ROWS = 5

/** Choices of the status filter: all, then one per status. */
export const STATUS_FILTER_OPTIONS: readonly SelectOption[] = [
  { value: ALL_STATUSES, label: 'All statuses' },
  ...SERVICE_STATUSES.map((status) => ({ value: status, label: STATUS_LABELS[status] })),
]
