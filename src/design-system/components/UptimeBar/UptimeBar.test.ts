import { describe, expect, it } from 'vitest'
import { fixture, shadowQuery } from '../../../test/fixture'
import './UptimeBar'
import type { BcUptimeBar } from './UptimeBar'

describe('bc-uptime-bar', () => {
  it('renders one bar per day with its level and tooltip', async () => {
    const el = await fixture<BcUptimeBar>('<bc-uptime-bar></bc-uptime-bar>')
    el.days = [
      { date: '2026-11-01', uptime: 100 },
      { date: '2026-11-02', uptime: 96 },
    ]
    await el.updateComplete
    const bars = el.shadowRoot?.querySelectorAll('.day') ?? []
    expect(bars).toHaveLength(2)
    expect(bars[1]?.getAttribute('data-level')).toBe('down')
    expect(bars[1]?.getAttribute('title')).toBe('2026-11-02: 96.00%')
  })

  it('hides the bars and announces a summary instead', async () => {
    const el = await fixture<BcUptimeBar>('<bc-uptime-bar label="Search"></bc-uptime-bar>')
    el.days = [{ date: '2026-11-01', uptime: 100 }]
    await el.updateComplete
    expect(shadowQuery(el, '.bar').getAttribute('aria-hidden')).toBe('true')
    expect(shadowQuery(el, '.visually-hidden').textContent).toBe(
      'Search: 100.00% over 1 days, 0 with issues',
    )
  })
})
