import { LitElement, html, nothing, unsafeCSS } from 'lit'
import { defineElement } from '../../shared'
import { STAT_TAG } from './Stat.constants'
import styles from './Stat.scss?inline'

/**
 * A single labelled figure, rendered as a description list so the label and
 * value are announced together.
 *
 * @tag bc-stat
 * @example
 * ```html
 * <bc-stat label="p95 latency" value="182" unit="ms"></bc-stat>
 * ```
 */
export class BcStat extends LitElement {
  /** Compiled styles, adopted by the shadow root. */
  static override styles = unsafeCSS(styles)

  /** Reactive properties; each one is documented on its field. */
  static override properties = {
    label: {},
    value: {},
    unit: {},
  }

  /**
   * What the figure measures.
   *
   * @default ''
   */
  declare label: string

  /**
   * Already formatted value.
   *
   * @default ''
   */
  declare value: string

  /**
   * Unit, shown smaller after the value.
   *
   * @default undefined
   */
  declare unit: string | undefined

  /** Sets the defaults. */
  constructor() {
    super()
    this.label = ''
    this.value = ''
    this.unit = undefined
  }

  /**
   * Renders the label and the value with its unit.
   *
   * @returns The stat template.
   */
  override render() {
    return html`<dl>
      <dt>${this.label}</dt>
      <dd>${this.value}${this.unit ? html`<span class="unit">${this.unit}</span>` : nothing}</dd>
    </dl>`
  }
}

defineElement(STAT_TAG, BcStat)
