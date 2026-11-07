import axe from 'axe-core'
import { afterEach, describe, expect, it } from 'vitest'
import { deepQuery } from '../../test/fixture'
import '../styles/global.scss'
import { IncidentStore } from '../core/store'
import { THEME_STORAGE_KEY } from '../core/theme/theme.constants'
import { AppRoot } from '../shell/AppRoot'

const PAGES = [
  ['overview', '#/', 'beacon-service-row'],
  ['service detail', '#/services/checkout', 'bc-tabs'],
  ['report form', '#/report', 'bc-switch'],
  ['components', '#/components', 'bc-dialog'],
  ['not found', '#/missing', 'beacon-not-found'],
] as const

/**
 * Runs axe on the whole document (axe walks open shadow roots) and returns
 * a readable list of violations.
 */
async function violations(): Promise<string[]> {
  const results = await axe.run(document, {
    runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'] },
  })
  return results.violations.map(
    (violation) =>
      `${violation.id}: ${violation.nodes.map((node) => node.target.join(' ')).join(', ')}`,
  )
}

describe.each(['light', 'dark'] as const)('accessibility (%s theme)', (theme) => {
  afterEach(() => {
    location.hash = ''
    localStorage.removeItem(THEME_STORAGE_KEY)
  })

  it.each(PAGES)('%s has no WCAG 2.2 AA violations', async (_name, hash, ready) => {
    localStorage.setItem(THEME_STORAGE_KEY, theme)
    location.hash = hash
    const app = new AppRoot(new IncidentStore(null))
    document.body.append(app)
    await expect.poll(() => deepQuery(app, ready), { timeout: 3000 }).not.toBeNull()
    await new Promise((resolve) => setTimeout(resolve, 300))
    expect(document.documentElement.dataset.theme).toBe(theme)
    expect(await violations()).toEqual([])
  })
})
