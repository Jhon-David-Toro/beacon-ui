import { describe, expect, it, vi } from 'vitest'
import { fixture, lightQuery, shadowQuery } from '../../../test/fixture'
import './Button'
import type { BcButton } from './Button'

describe('bc-button', () => {
  it('renders a native button with the slotted label', async () => {
    const el = await fixture<BcButton>('<bc-button>Save changes</bc-button>')
    const button = shadowQuery(el, 'button')
    expect(button.type).toBe('button')
    expect(el.textContent).toBe('Save changes')
  })

  it('reflects variant and size defaults so styles can target them', async () => {
    const el = await fixture<BcButton>('<bc-button>Go</bc-button>')
    expect(el.getAttribute('variant')).toBe('secondary')
    expect(el.getAttribute('size')).toBe('m')
  })

  it('renders a link when href is set', async () => {
    const el = await fixture<BcButton>('<bc-button href="#/report">Report</bc-button>')
    expect(shadowQuery(el, 'a').getAttribute('href')).toBe('#/report')
  })

  it('uses the label as accessible name for icon-only buttons', async () => {
    const el = await fixture<BcButton>('<bc-button label="Close">x</bc-button>')
    expect(shadowQuery(el, 'button').getAttribute('aria-label')).toBe('Close')
  })

  it('submits the surrounding form when type is submit', async () => {
    const form = await fixture<HTMLFormElement>(
      '<form><bc-button type="submit">Send</bc-button></form>',
    )
    const onSubmit = vi.fn((event: Event) => {
      event.preventDefault()
    })
    form.addEventListener('submit', onSubmit)
    const el = lightQuery(form, 'bc-button')
    await el.updateComplete
    shadowQuery(el, 'button').click()
    expect(onSubmit).toHaveBeenCalledOnce()
  })

  it('resets the surrounding form when type is reset', async () => {
    const form = await fixture<HTMLFormElement>(
      '<form><input name="q" value="initial" /><bc-button type="reset">Clear</bc-button></form>',
    )
    const input = lightQuery(form, 'input')
    input.value = 'changed'
    const el = lightQuery(form, 'bc-button')
    await el.updateComplete
    shadowQuery(el, 'button').click()
    expect(input.value).toBe('initial')
  })

  it('does not act when disabled', async () => {
    const el = await fixture<BcButton>('<bc-button disabled href="#/x">Go</bc-button>')
    expect(el.shadowRoot?.querySelector('a')).toBeNull()
    expect(shadowQuery(el, 'button').disabled).toBe(true)
  })
})
