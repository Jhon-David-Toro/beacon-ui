import type { SelectOption } from '../../../design-system'

/** Tag name of the components page. */
export const COMPONENTS_VIEW_TAG = 'beacon-components'

/** Sample latency series for the sparkline demo, with one spike. */
export const DEMO_LATENCY: readonly number[] = [
  92, 88, 95, 101, 97, 90, 86, 99, 112, 126, 118, 104, 96, 93, 98, 140, 188, 172, 150, 121, 108, 99,
  95, 91,
]

/** Sample choices for the select demo. */
export const DEMO_OPTIONS: readonly SelectOption[] = [
  { value: 'eu', label: 'Europe' },
  { value: 'us', label: 'United States' },
  { value: 'sa', label: 'South America' },
]
