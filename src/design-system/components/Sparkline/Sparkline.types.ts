import type { BcSparkline } from './Sparkline'
import type { SPARKLINE_TONES } from './Sparkline.constants'

export type SparklineTone = (typeof SPARKLINE_TONES)[number]

export interface ChartBox {
  readonly width: number
  readonly height: number
  readonly padding: number
}

export interface Point {
  readonly x: number
  readonly y: number
}

export interface Extent {
  readonly min: number
  readonly max: number
}

declare global {
  interface HTMLElementTagNameMap {
    'bc-sparkline': BcSparkline
  }
}
