import type { BcSparkline } from './Sparkline'
import type { SPARKLINE_TONES } from './Sparkline.constants'

/** Colour of a sparkline. */
export type SparklineTone = (typeof SPARKLINE_TONES)[number]

/** Drawing area of a chart, in SVG user units. */
export interface ChartBox {
  /** Total width. */
  readonly width: number

  /** Total height. */
  readonly height: number

  /** Space kept free on every side. */
  readonly padding: number
}

/** A point in SVG coordinates (y grows downwards). */
export interface Point {
  /** Horizontal position. */
  readonly x: number

  /** Vertical position. */
  readonly y: number
}

/** Range of values shown on the vertical axis. */
export interface Extent {
  /** Value drawn at the bottom. */
  readonly min: number

  /** Value drawn at the top. */
  readonly max: number
}

declare global {
  /** Lets `querySelector('bc-sparkline')` return the right type. */
  interface HTMLElementTagNameMap {
    /** Compact line chart. */
    'bc-sparkline': BcSparkline
  }
}
