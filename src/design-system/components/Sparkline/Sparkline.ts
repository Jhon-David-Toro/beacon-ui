import { LitElement, html, nothing, svg, unsafeCSS } from 'lit'
import { defineElement } from '../../shared'
import {
  DEFAULT_SPARKLINE_HEIGHT,
  DEFAULT_SPARKLINE_WIDTH,
  SPARKLINE_PADDING,
  SPARKLINE_TAG,
} from './Sparkline.constants'
import type { ChartBox, Extent, Point, SparklineTone } from './Sparkline.types'
import { areaPath, describeSeries, extentOf, linePath, scaleY, toPoints } from './Sparkline.utils'
import styles from './Sparkline.scss?inline'

/**
 * Compact line chart for a numeric series. It scales to its container's
 * width and announces a text summary instead of the raw points.
 *
 * @tag bc-sparkline
 */
export class BcSparkline extends LitElement {
  static override styles = unsafeCSS(styles)

  static override properties = {
    values: { attribute: false },
    label: {},
    unit: {},
    tone: { reflect: true },
    area: { type: Boolean },
    threshold: { type: Number },
    width: { type: Number },
    height: { type: Number },
  }

  /** Data series, oldest first. */
  declare values: readonly number[]
  /** What the series measures, used in the accessible summary. */
  declare label: string
  declare unit: string
  declare tone: SparklineTone
  /** Fills the area under the line. */
  declare area: boolean
  /** Draws a dashed reference line at this value. */
  declare threshold: number | undefined
  /** Drawing width; the SVG still scales to its container. */
  declare width: number
  declare height: number

  constructor() {
    super()
    this.values = []
    this.label = 'Series'
    this.unit = ''
    this.tone = 'neutral'
    this.area = false
    this.threshold = undefined
    this.width = DEFAULT_SPARKLINE_WIDTH
    this.height = DEFAULT_SPARKLINE_HEIGHT
  }

  override render() {
    const box: ChartBox = { width: this.width, height: this.height, padding: SPARKLINE_PADDING }
    const extent = extentOf(this.values, this.threshold)
    const points = toPoints(this.values, box, extent)
    return html`<svg
      viewBox="0 0 ${box.width} ${box.height}"
      role="img"
      aria-label=${describeSeries(this.label, this.values, this.unit)}
      preserveAspectRatio="none"
    >
      ${this.area ? svg`<path class="area" d=${areaPath(points, box)}></path>` : nothing}
      ${this.#renderThreshold(box, extent)}
      <path class="line" d=${linePath(points)}></path>
      ${this.#renderLast(points.at(-1))}
    </svg>`
  }

  /**
   * Dashed line at the threshold value, if one is set.
   *
   * @param box - Chart dimensions.
   * @param extent - Range of the vertical scale.
   */
  #renderThreshold(box: ChartBox, extent: Extent) {
    if (this.threshold === undefined) {
      return nothing
    }
    const y = scaleY(this.threshold, extent, box)
    return svg`<line class="threshold" x1="0" x2=${box.width} y1=${y} y2=${y}></line>`
  }

  /**
   * Marker on the most recent point.
   *
   * @param point - Last point of the series.
   */
  #renderLast(point: Point | undefined) {
    return point ? svg`<circle class="last" cx=${point.x} cy=${point.y} r="2.5"></circle>` : nothing
  }
}

defineElement(SPARKLINE_TAG, BcSparkline)
