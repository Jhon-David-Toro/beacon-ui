import { describe, expect, it } from 'vitest'
import { fixture, shadowQuery } from '../../../test/fixture'
import './Card'
import type { BcCard } from './Card'

describe('bc-card', () => {
  it('collapses the header when no heading is slotted', async () => {
    const el = await fixture<BcCard>('<bc-card><p>Body</p></bc-card>')
    expect(shadowQuery(el, 'header').classList.contains('empty')).toBe(true)
  })

  it('shows the header when a heading is slotted', async () => {
    const el = await fixture<BcCard>('<bc-card><h2 slot="heading">Latency</h2></bc-card>')
    await new Promise(requestAnimationFrame)
    await el.updateComplete
    expect(shadowQuery(el, 'header').classList.contains('empty')).toBe(false)
  })

  it('reflects the padding so styles can target it', async () => {
    const el = await fixture<BcCard>('<bc-card padding="l"></bc-card>')
    expect(el.padding).toBe('l')
  })
})
