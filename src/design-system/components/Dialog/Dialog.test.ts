import { describe, expect, it, vi } from 'vitest'
import { userEvent } from 'vitest/browser'
import { fixture, shadowQuery } from '../../../test/fixture'
import './Dialog'
import type { BcDialog } from './Dialog'
import { isBackdropClick } from './Dialog.utils'

/**
 * Mounts a dialog with a focusable body.
 */
async function mount(): Promise<BcDialog> {
  return fixture<BcDialog>(
    '<bc-dialog heading="Resolve incident"><p>Body</p><button slot="footer">Ok</button></bc-dialog>',
  )
}

describe('bc-dialog', () => {
  it('is named by its heading', async () => {
    const el = await mount()
    const dialog = shadowQuery(el, 'dialog')
    expect(dialog.getAttribute('aria-labelledby')).toBe('heading')
    expect(shadowQuery(el, '#heading').textContent).toBe('Resolve incident')
  })

  it('opens as a native modal', async () => {
    const el = await mount()
    el.show()
    await el.updateComplete
    const dialog = shadowQuery(el, 'dialog')
    expect(dialog.open).toBe(true)
    expect(dialog.matches(':modal')).toBe(true)
  })

  it('closes on Escape and fires bc-close', async () => {
    const el = await mount()
    const onClose = vi.fn()
    el.addEventListener('bc-close', onClose)
    el.show()
    await el.updateComplete
    await userEvent.keyboard('{Escape}')
    await vi.waitFor(() => {
      expect(onClose).toHaveBeenCalledOnce()
    })
    expect(el.open).toBe(false)
  })

  it('closes from the close button', async () => {
    const el = await mount()
    el.show()
    await el.updateComplete
    const closeButton = shadowQuery(el, 'bc-button')
    shadowQuery(closeButton, 'button').click()
    await el.updateComplete
    expect(shadowQuery(el, 'dialog').open).toBe(false)
  })
})

describe('isBackdropClick', () => {
  it('is true for clicks on the dialog outside its box', async () => {
    const el = await mount()
    el.show()
    await el.updateComplete
    const dialog = shadowQuery(el, 'dialog')
    const outside = new MouseEvent('click', { clientX: 1, clientY: 1 })
    Object.defineProperty(outside, 'target', { value: dialog })
    expect(isBackdropClick(dialog, outside)).toBe(true)
  })

  it('is false for clicks inside the dialog content', async () => {
    const el = await mount()
    const dialog = shadowQuery(el, 'dialog')
    const inside = new MouseEvent('click')
    Object.defineProperty(inside, 'target', { value: shadowQuery(el, 'h2') })
    expect(isBackdropClick(dialog, inside)).toBe(false)
  })
})
