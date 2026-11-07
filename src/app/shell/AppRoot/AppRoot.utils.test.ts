import { describe, expect, it } from 'vitest'
import { documentTitle } from './AppRoot.utils'

describe('documentTitle', () => {
  it('uses the product tagline on the overview', () => {
    expect(documentTitle('overview')).toBe('Beacon – Service status')
  })

  it('puts the page name first elsewhere', () => {
    expect(documentTitle('report')).toBe('Report an incident – Beacon')
    expect(documentTitle('service', 'Search')).toBe('Search – Beacon')
  })
})
