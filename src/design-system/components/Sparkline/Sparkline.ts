import { LitElement, html, nothing, svg, unsafeCSS } from 'lit'
import { defineElement } from '../../shared'
import {
  DEFAULT_SPARKLINE_HEIGHT,
  DEFAULT_SPARKLINE_WIDTH,
  SPARKLINE_PADDING,
  SPARKLINE_TAG,
} from './Sparkline.constants'
import styles from './Sparkline.scss?inline'
import type { ChartBox, Extent, Point, SparklineTone } from './Sparkline.types'
import { areaPath, describeSeries, extentOf, linePath, scaleY, toPoints } from './Sparkline.utils'

/**
 * Compact line chart for a numeric series. It scales to its container's
 * width and announces a text summary instead of the raw points.
 *
 * @tag bc-sparkline
 * @example
 * ```html
 * <bc-sparkline label="Latency" unit="ms" threshold="250" area></bc-sparkline>
 * <script>
 *   document.querySelector('bc-sparkline').values = [120, 98, 143, 260]
 * </script>
 * ```
 */
export class BcSparkline extends LitElement {
  /** Compiled styles, adopted by the shadow root. */
  static override styles = unsafeCSS(styles)

  /** Reactive properties; each one is documented on its field. */
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

  /**
   * Data series, oldest first. Set it as a property, not an attribute.
   *
   * @default []
   */
  declare values: readonly number[]

  /**
   * What the series measures, used in the accessible summary.
   *
   * @default 'Series'
   */
  declare label: string

  /**
   * Unit appended to the numbers in the summary, such as `ms`.
   *
   * @default ''
   */
  declare unit: string

  /**
   * Line colour.
   *
   * @default 'neutral'
   */
  declare tone: SparklineTone

  /**
   * Fills the area under the line.
   *
   * @default false
   */
  declare area: boolean

  /**
   * Draws a dashed reference line at this value, such as a latency target.
   *
   * @default undefined
   */
  declare threshold: number | undefined

  /**
   * Drawing width; the SVG still scales to its container.
   *
   * @default 160
   */
  declare width: number

  /**
   * Drawing height.
   *
   * @default 40
   */
  declare height: number

  /** Sets the defaults. */
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

  /**
   * Renders the area, threshold, line and last-point marker.
   *
   * @returns The chart template.
   */
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
   * @returns The line, or `nothing` without a threshold.
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
   * @returns The marker, or `nothing` for an empty series.
   */
  #renderLast(point: Point | undefined) {
    return point ? svg`<circle class="last" cx=${point.x} cy=${point.y} r="2.5"></circle>` : nothing
  }
}

defineElement(SPARKLINE_TAG, BcSparkline)
