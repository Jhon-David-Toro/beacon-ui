import { describe, expect, it } from 'vitest'
import { fixture, shadowQuery } from '../../../test/fixture'
import './Sparkline'
import type { BcSparkline } from './Sparkline'

/**
 * Mounts a sparkline and assigns its series through the property.
 *
 * @param markup - Element markup.
 * @param values - Series to draw.
 * @returns The sparkline, drawn with the series.
 */
async function mount(markup: string, values: number[]): Promise<BcSparkline> {
  const el = await fixture<BcSparkline>(markup)
  el.values = values
  await el.updateComplete

  return el
}

describe('bc-sparkline', () => {
  it('exposes a text summary as an image', async () => {
    const el = await mount('<bc-sparkline label="Latency" unit="ms"></bc-sparkline>', [10, 30, 20])
    const chart = shadowQuery(el, 'svg')
    expect(chart.getAttribute('role')).toBe('img')
    expect(chart.getAttribute('aria-label')).toBe('Latency: latest 20ms, range 10ms to 30ms')
  })

  it('only fills the area when asked to', async () => {
    const plain = await mount('<bc-sparkline></bc-sparkline>', [1, 2])
    expect(plain.shadowRoot?.querySelector('.area')).toBeNull()
    const filled = await mount('<bc-sparkline area></bc-sparkline>', [1, 2])
    expect(filled.shadowRoot?.querySelector('.area')).not.toBeNull()
  })

  it('draws the threshold line when set', async () => {
    const el = await mount('<bc-sparkline threshold="15"></bc-sparkline>', [10, 20])
    expect(el.shadowRoot?.querySelector('.threshold')).not.toBeNull()
  })

  it('marks the latest point and skips it with no data', async () => {
    const el = await mount('<bc-sparkline></bc-sparkline>', [5, 8])
    expect(el.shadowRoot?.querySelector('.last')).not.toBeNull()
    el.values = []
    await el.updateComplete
    expect(el.shadowRoot?.querySelector('.last')).toBeNull()
  })
})
