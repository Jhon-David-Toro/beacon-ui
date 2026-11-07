import { describe, expect, it, vi } from 'vitest'
import { userEvent } from 'vitest/browser'
import { fixture, lightQuery, settle, shadowQuery } from '../../../test/fixture'
import './Switch'
import type { BcSwitch } from './Switch'

describe('bc-switch', () => {
  it('exposes the switch role and state', async () => {
    const el = await fixture<BcSwitch>('<bc-switch>Notify subscribers</bc-switch>')
    const button = shadowQuery(el, 'button')
    expect(button.getAttribute('role')).toBe('switch')
    expect(button.getAttribute('aria-checked')).toBe('false')
  })

  it('toggles with the keyboard and fires change', async () => {
    const el = await fixture<BcSwitch>('<bc-switch>Notify</bc-switch>')
    const onChange = vi.fn()
    el.addEventListener('change', onChange)
    shadowQuery(el, 'button').focus()
    await userEvent.keyboard(' ')
    await el.updateComplete
    expect(el.checked).toBe(true)
    expect(onChange).toHaveBeenCalledOnce()
  })

  it('only submits its value while on', async () => {
    const form = await fixture<HTMLFormElement>(
      '<form><bc-switch name="notify">Notify</bc-switch></form>',
    )
    const el = lightQuery(form, 'bc-switch')
    await settle(el)
    expect(new FormData(form).has('notify')).toBe(false)
    el.checked = true
    await el.updateComplete
    expect(new FormData(form).get('notify')).toBe('on')
  })

  it('is invalid when required and off', async () => {
    const el = await fixture<BcSwitch>('<bc-switch required>Accept</bc-switch>')
    expect(el.checkValidity()).toBe(false)
  })

  it('returns to its initial state on reset', async () => {
    const form = await fixture<HTMLFormElement>(
      '<form><bc-switch checked>Notify</bc-switch></form>',
    )
    const el = lightQuery(form, 'bc-switch')
    await settle(el)
    el.checked = false
    form.reset()
    await el.updateComplete
    expect(el.checked).toBe(true)
  })
})
