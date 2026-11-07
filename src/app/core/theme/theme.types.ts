import type { THEMES } from './theme.constants'

/** A colour theme. */
export type Theme = (typeof THEMES)[number]
