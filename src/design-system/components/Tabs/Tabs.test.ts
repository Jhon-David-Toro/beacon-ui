import { describe, expect, it, vi } from 'vitest'
import { userEvent } from 'vitest/browser'
import { fixture, lightQuery, shadowQuery } from '../../../test/fixture'
import './Tabs'
import type { BcTabs } from './Tabs'

/** Three panels in one tab list. */
const markup = `<bc-tabs label="Details">
  <bc-tab-panel label="Latency">Latency chart</bc-tab-panel>
  <bc-tab-panel label="Uptime">Uptime bar</bc-tab-panel>
  <bc-tab-panel label="Incidents">Incident list</bc-tab-panel>
</bc-tabs>`

/**
 * Mounts the tabs and waits for the slot to report its panels.
 *
 * @returns The tabs, with their panels collected.
 */
async function mount(): Promise<BcTabs> {
  const el = await fixture<BcTabs>(markup)
  await new Promise(requestAnimationFrame)
  await el.updateComplete

  return el
}

/**
 * Tab buttons rendered in the shadow root.
 *
 * @param el - Tabs element.
 * @returns The buttons, in order.
 */
function tabs(el: BcTabs): HTMLButtonElement[] {
  return [...(el.shadowRoot?.querySelectorAll('button') ?? [])]
}

describe('bc-tabs', () => {
  it('builds one tab per panel, labelled by the panel', async () => {
    const el = await mount()
    expect(tabs(el).map((tab) => tab.textContent.trim())).toEqual([
      'Latency',
      'Uptime',
      'Incidents',
    ])
    expect(shadowQuery(el, '[role="tablist"]').getAttribute('aria-label')).toBe('Details')
  })

  it('shows only the selected panel', async () => {
    const el = await mount()
    const panels = [...el.querySelectorAll('bc-tab-panel')]
    expect(panels.map((panel) => panel.hidden)).toEqual([false, true, true])
  })

  it('uses a roving tabindex', async () => {
    const el = await mount()
    expect(tabs(el).map((tab) => tab.tabIndex)).toEqual([0, -1, -1])
  })

  it('selects a tab on click and fires bc-tab-change', async () => {
    const el = await mount()
    const onChange = vi.fn()
    el.addEventListener('bc-tab-change', onChange)
    tabs(el)[2]?.click()
    await el.updateComplete
    expect(el.selected).toBe(2)
    expect(lightQuery(el, 'bc-tab-panel:last-child').hidden).toBe(false)
    expect(onChange).toHaveBeenCalledOnce()
  })

  it('moves focus and selection with the arrow keys', async () => {
    const el = await mount()
    tabs(el)[0]?.focus()
    await userEvent.keyboard('{ArrowLeft}')
    await el.updateComplete
    expect(el.selected).toBe(2)
    expect(el.shadowRoot?.activeElement).toBe(tabs(el)[2])
  })

  it('exposes panels as tabpanels named after their tab', async () => {
    const el = await mount()
    const panel = lightQuery(el, 'bc-tab-panel')
    expect(panel.tabIndex).toBe(0)
    expect(panel.label).toBe('Latency')
  })
})
