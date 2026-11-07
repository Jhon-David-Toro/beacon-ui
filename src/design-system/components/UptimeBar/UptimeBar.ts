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
 */
export class BcUptimeBar extends LitElement {
  static override styles = unsafeCSS(styles)

  static override properties = {
    days: { attribute: false },
    label: {},
  }

  /** Daily records, oldest first. */
  declare days: readonly UptimeDay[]
  /** What is being measured, used in the summary. */
  declare label: string

  constructor() {
    super()
    this.days = []
    this.label = 'Uptime'
  }

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
