import type { BcUptimeBar } from './UptimeBar'

export interface UptimeDay {
  readonly date: string
  readonly uptime: number | null
}

export type UptimeLevel = 'healthy' | 'degraded' | 'down' | 'empty'

declare global {
  interface HTMLElementTagNameMap {
    'bc-uptime-bar': BcUptimeBar
  }
}
