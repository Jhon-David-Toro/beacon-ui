/** Tag name of the sparkline element. */
export const SPARKLINE_TAG = 'bc-sparkline'

/** Line colours, mapped to the status tokens. */
export const SPARKLINE_TONES = ['neutral', 'success', 'warning', 'danger'] as const

/** Drawing width when none is set; the SVG still scales to its container. */
export const DEFAULT_SPARKLINE_WIDTH = 160

/** Drawing height when none is set. */
export const DEFAULT_SPARKLINE_HEIGHT = 40

/** Space kept around the line so the stroke and end marker are never clipped. */
export const SPARKLINE_PADDING = 3
