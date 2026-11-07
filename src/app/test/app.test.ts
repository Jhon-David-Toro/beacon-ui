import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { userEvent } from 'vitest/browser'
import { deepQuery, deepText } from '../../test/fixture'
import { IncidentStore } from '../core/store'
import { AppRoot } from '../shell/AppRoot'

const LOAD_TIMEOUT = { timeout: 3000 }

/**
 * Mounts the app at a route with an empty, in-memory store.
 *
 * @param hash - Route to start on.
 */
async function mountApp(hash: string): Promise<AppRoot> {
  location.hash = hash
  const app = new AppRoot(new IncidentStore(null))
  document.body.append(app)
  await app.updateComplete
  return app
}

/**
 * Waits until an element exists anywhere in the app. Each selector is
 * matched inside the element found by the previous one, which is how a
 * selector crosses shadow-root boundaries.
 *
 * @param app - App root.
 * @param selectors - One selector per shadow-root level.
 */
async function find(app: AppRoot, ...selectors: string[]): Promise<HTMLElement> {
  const resolve = () =>
    selectors.reduce<HTMLElement | null>(
      (root, selector) => (root ? deepQuery(root, selector) : null),
      app,
    )
  await expect.poll(resolve, LOAD_TIMEOUT).not.toBeNull()
  const found = resolve()
  if (!found) {
    throw new Error(`Not found: ${selectors.join(' > ')}`)
  }
  return found
}

describe('Beacon app', () => {
  beforeEach(() => {
    location.hash = ''
  })

  afterEach(() => {
    location.hash = ''
  })

  it('loads the overview and summarises every service', async () => {
    const app = await mountApp('#/')
    const headline = await find(app, '#headline')
    expect(headline.textContent).toBe('3 services need attention.')
    expect(deepQuery(app, 'beacon-service-row')).not.toBeNull()
  })

  it('filters services and offers a way out of an empty result', async () => {
    const app = await mountApp('#/')
    const field = await find(app, 'bc-text-field[type="search"]')
    await userEvent.type(deepQuery(field, 'input') as HTMLInputElement, 'zzz')
    const empty = await find(app, '.empty', 'bc-button')
    expect(deepText(await find(app, '.count'))).toContain('Showing 0 of 8')
    ;(deepQuery(empty, 'button') as HTMLButtonElement).click()
    await expect.poll(() => deepQuery(app, '.empty')).toBeNull()
  })

  it('reports an incident and shows it on the service page', async () => {
    const app = await mountApp('#/report?service=search')
    const title = await find(app, 'bc-text-field[name="title"]')
    await userEvent.type(deepQuery(title, 'input') as HTMLInputElement, 'Results take 5 seconds')
    const submit = await find(app, 'bc-button[type="submit"]')
    ;(deepQuery(submit, 'button') as HTMLButtonElement).click()

    await expect.poll(() => location.hash).toBe('#/services/search')
    const toast = await find(app, 'bc-toast-region', '.message')
    expect(toast.textContent).toBe('Incident reported for Search.')
    await expect.poll(() => deepText(app), LOAD_TIMEOUT).toContain('Results take 5 seconds')
  })

  it('keeps the user on the form while it is invalid', async () => {
    const app = await mountApp('#/report')
    const submit = await find(app, 'bc-button[type="submit"]')
    ;(deepQuery(submit, 'button') as HTMLButtonElement).click()
    const error = await find(app, 'bc-select[name="service"]', '.error')
    expect(error.textContent.trim()).toBe('Choose service.')
    expect(location.hash).toBe('#/report')
  })

  it('shows a helpful page for unknown services and routes', async () => {
    const app = await mountApp('#/services/teleporter')
    const heading = await find(app, 'beacon-service', 'h1')
    expect(heading.textContent).toContain('teleporter')

    location.hash = '#/nowhere'
    const notFound = await find(app, 'beacon-not-found', 'h1')
    expect(notFound.textContent).toBe('This page does not exist.')
  })

  it('moves focus to the main region after navigating', async () => {
    const app = await mountApp('#/')
    location.hash = '#/components'
    await expect.poll(() => app.shadowRoot?.activeElement?.id).toBe('main')
    expect(document.title).toBe('Components – Beacon')
  })
})
