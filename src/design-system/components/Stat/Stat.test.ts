import { describe, expect, it } from 'vitest'
import { fixture, shadowQuery } from '../../../test/fixture'
import './Stat'
import type { BcStat } from './Stat'

describe('bc-stat', () => {
  it('pairs the label and the value in a description list', async () => {
    const el = await fixture<BcStat>(
      '<bc-stat label="p95 latency" value="182" unit="ms"></bc-stat>',
    )
    expect(shadowQuery(el, 'dt').textContent).toBe('p95 latency')
    expect(shadowQuery(el, 'dd').textContent).toBe('182ms')
  })

  it('omits the unit when none is given', async () => {
    const el = await fixture<BcStat>('<bc-stat label="Incidents" value="3"></bc-stat>')
    expect(el.shadowRoot?.querySelector('.unit')).toBeNull()
  })
})
