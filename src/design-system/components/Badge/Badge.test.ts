import { describe, expect, it } from 'vitest'
import { fixture, shadowQuery } from '../../../test/fixture'
import './Badge'
import type { BcBadge } from './Badge'

describe('bc-badge', () => {
  it('defaults to the neutral tone', async () => {
    const el = await fixture<BcBadge>('<bc-badge>Unknown</bc-badge>')
    expect(el.getAttribute('tone')).toBe('neutral')
  })

  it('hides the decorative dot from assistive technology', async () => {
    const el = await fixture<BcBadge>('<bc-badge tone="danger">Outage</bc-badge>')
    expect(shadowQuery(el, '.dot').getAttribute('aria-hidden')).toBe('true')
  })

  it('colours the dot from the tone token', async () => {
    const el = await fixture<BcBadge>('<bc-badge tone="success">Operational</bc-badge>')
    const expected = getComputedStyle(document.documentElement)
      .getPropertyValue('--bc-color-operational')
      .trim()
    const probe = document.createElement('div')
    probe.style.color = expected
    document.body.append(probe)
    expect(getComputedStyle(shadowQuery(el, '.dot')).backgroundColor).toBe(
      getComputedStyle(probe).color,
    )
  })
})
