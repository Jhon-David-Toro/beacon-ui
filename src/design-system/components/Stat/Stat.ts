import { LitElement, html, nothing, unsafeCSS } from 'lit'
import { defineElement } from '../../shared'
import { STAT_TAG } from './Stat.constants'
import styles from './Stat.scss?inline'

/**
 * A single labelled figure, rendered as a description list so the label and
 * value are announced together.
 *
 * @tag bc-stat
 */
export class BcStat extends LitElement {
  static override styles = unsafeCSS(styles)

  static override properties = {
    label: {},
    value: {},
    unit: {},
  }

  /** What the figure measures. */
  declare label: string
  /** Already formatted value. */
  declare value: string
  /** Optional unit, shown smaller after the value. */
  declare unit: string | undefined

  constructor() {
    super()
    this.label = ''
    this.value = ''
    this.unit = undefined
  }

  override render() {
    return html`<dl>
      <dt>${this.label}</dt>
      <dd>${this.value}${this.unit ? html`<span class="unit">${this.unit}</span>` : nothing}</dd>
    </dl>`
  }
}

defineElement(STAT_TAG, BcStat)
