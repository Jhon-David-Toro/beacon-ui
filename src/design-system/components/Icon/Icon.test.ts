import { describe, expect, it } from 'vitest'
import { fixture, shadowQuery } from '../../../test/fixture'
import { ICON_PATHS } from './Icon.constants'
import './Icon'
import type { BcIcon } from './Icon'

describe('bc-icon', () => {
  it('draws the path of the named icon', async () => {
    const el = await fixture<BcIcon>('<bc-icon name="sun"></bc-icon>')
    expect(shadowQuery(el, 'path').getAttribute('d')).toBe(ICON_PATHS.sun)
  })

  it('is hidden from assistive technology without a label', async () => {
    const el = await fixture<BcIcon>('<bc-icon name="moon"></bc-icon>')
    const icon = shadowQuery(el, 'svg')
    expect(icon.getAttribute('aria-hidden')).toBe('true')
    expect(icon.hasAttribute('role')).toBe(false)
  })

  it('exposes an image role and name when labelled', async () => {
    const el = await fixture<BcIcon>('<bc-icon name="alert" label="Warning"></bc-icon>')
    const icon = shadowQuery(el, 'svg')
    expect(icon.getAttribute('role')).toBe('img')
    expect(icon.getAttribute('aria-label')).toBe('Warning')
  })

  it('uses the size for both dimensions', async () => {
    const el = await fixture<BcIcon>('<bc-icon name="plus" size="32"></bc-icon>')
    expect(shadowQuery(el, 'svg').getAttribute('width')).toBe('32')
    expect(shadowQuery(el, 'svg').getAttribute('height')).toBe('32')
  })
})
