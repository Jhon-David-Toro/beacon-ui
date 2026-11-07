import type { BcUptimeBar } from './UptimeBar'

/** Uptime measured for one day. */
export interface UptimeDay {
  /** Day in `YYYY-MM-DD` format. */
  readonly date: string

  /** Percentage from 0 to 100, or `null` when the day was not measured. */
  readonly uptime: number | null
}

/** How a day is coloured in the bar. */
export type UptimeLevel = 'healthy' | 'degraded' | 'down' | 'empty'

declare global {
  /** Lets `querySelector('bc-uptime-bar')` return the right type. */
  interface HTMLElementTagNameMap {
    /** One bar per day, coloured by uptime. */
    'bc-uptime-bar': BcUptimeBar
  }
}
