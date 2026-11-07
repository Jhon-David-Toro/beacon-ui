import { LitElement, html, unsafeCSS } from 'lit'
import { repeat } from 'lit/directives/repeat.js'
import { defineElement } from '../../shared'
import { UPTIME_BAR_TAG } from './UptimeBar.constants'
import type { UptimeDay } from './UptimeBar.types'
import { describeDay, describeUptime, uptimeLevel } from './UptimeBar.utils'
import styles from './UptimeBar.scss?inline'

/**
 * One bar per day, coloured by uptime. Each day keeps its own tooltip, and
 * the list as a whole is summarised for screen readers.
 *
 * @tag bc-uptime-bar
 * @cssprop --bc-uptime-height - Height of the bars. Defaults to 32px.
 * @cssprop --bc-uptime-gap - Space between bars. Defaults to 2px.
 * @example
 * ```html
 * <bc-uptime-bar label="Search"></bc-uptime-bar>
 * <script>
 *   document.querySelector('bc-uptime-bar').days = [{ date: '2026-11-07', uptime: 99.98 }]
 * </script>
 * ```
 */
export class BcUptimeBar extends LitElement {
  /** Compiled styles, adopted by the shadow root. */
  static override styles = unsafeCSS(styles)

  /** Reactive properties; each one is documented on its field. */
  static override properties = {
    days: { attribute: false },
    label: {},
  }

  /**
   * Daily records, oldest first. Set it as a property, not an attribute.
   *
   * @default []
   */
  declare days: readonly UptimeDay[]

  /**
   * What is being measured, used in the screen reader summary.
   *
   * @default 'Uptime'
   */
  declare label: string

  /** Sets the defaults. */
  constructor() {
    super()
    this.days = []
    this.label = 'Uptime'
  }

  /**
   * Renders the hidden summary and one bar per day.
   *
   * @returns The bar template.
   */
  override render() {
    return html`<p class="visually-hidden">${describeUptime(this.label, this.days)}</p>
      <ul class="bar" aria-hidden="true">
        ${repeat(
          this.days,
          (day) => day.date,
          (day) =>
            html`<li
              class="day"
              data-level=${uptimeLevel(day.uptime)}
              title=${describeDay(day)}
            ></li>`,
        )}
      </ul>`
  }
}

defineElement(UPTIME_BAR_TAG, BcUptimeBar)
