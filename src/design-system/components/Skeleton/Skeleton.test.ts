import { describe, expect, it } from 'vitest'
import { fixture } from '../../../test/fixture'
import './Skeleton'

describe('bc-skeleton', () => {
  it('is hidden from assistive technology', async () => {
    const el = await fixture('<bc-skeleton></bc-skeleton>')
    expect(el.getAttribute('aria-hidden')).toBe('true')
  })
})
