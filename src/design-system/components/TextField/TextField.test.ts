import { describe, expect, it } from 'vitest'
import { userEvent } from 'vitest/browser'
import { fixture, lightQuery, settle, shadowQuery } from '../../../test/fixture'
import './TextField'
import type { BcTextField } from './TextField'

/**
 * Mounts a text field inside a form.
 *
 * @param attributes - Attributes for the field.
 */
async function mountInForm(
  attributes: string,
): Promise<{ form: HTMLFormElement; el: BcTextField }> {
  const form = await fixture<HTMLFormElement>(
    `<form><bc-text-field ${attributes}></bc-text-field></form>`,
  )
  const el = lightQuery(form, 'bc-text-field')
  await settle(el)
  return { form, el }
}

describe('bc-text-field', () => {
  it('labels the inner input', async () => {
    const el = await fixture<BcTextField>('<bc-text-field label="Title"></bc-text-field>')
    expect(shadowQuery(el, 'label').htmlFor).toBe(shadowQuery(el, 'input').id)
  })

  it('keeps value in sync with typing', async () => {
    const el = await fixture<BcTextField>('<bc-text-field label="Title"></bc-text-field>')
    await userEvent.type(shadowQuery(el, 'input'), 'Checkout errors')
    expect(el.value).toBe('Checkout errors')
  })

  it('submits its value with the form', async () => {
    const { form } = await mountInForm('name="title" label="Title" value="Slow search"')
    expect(new FormData(form).get('title')).toBe('Slow search')
  })

  it('is invalid while a required value is missing', async () => {
    const el = await fixture<BcTextField>('<bc-text-field label="Title" required></bc-text-field>')
    expect(el.checkValidity()).toBe(false)
    expect(el.validity.valueMissing).toBe(true)
    expect(el.validationMessage).toBe('Enter title.')
  })

  it('shows the error only after the field is left', async () => {
    const el = await fixture<BcTextField>('<bc-text-field label="Title" required></bc-text-field>')
    expect(el.shadowRoot?.querySelector('.error')).toBeNull()
    shadowQuery(el, 'input').dispatchEvent(new Event('blur'))
    await el.updateComplete
    const input = shadowQuery(el, 'input')
    expect(shadowQuery(el, '.error').textContent.trim()).toBe('Enter title.')
    expect(input.getAttribute('aria-invalid')).toBe('true')
    expect(input.getAttribute('aria-describedby')).toBe('message')
  })

  it('reveals errors when the form is submitted', async () => {
    const { form, el } = await mountInForm('name="t" label="Title" required')
    form.requestSubmit()
    await el.updateComplete
    expect(el.shadowRoot?.querySelector('.error')).not.toBeNull()
  })

  it('reports values that are too short', async () => {
    const el = await fixture<BcTextField>(
      '<bc-text-field label="Summary" minlength="10"></bc-text-field>',
    )
    await userEvent.type(shadowQuery(el, 'input'), 'short')
    expect(el.validity.tooShort).toBe(true)
    expect(el.validationMessage).toBe('Use at least 10 characters.')
  })

  it('restores the initial value when the form resets', async () => {
    const { form, el } = await mountInForm('name="t" label="Title" value="First"')
    el.value = 'Changed'
    form.reset()
    await el.updateComplete
    expect(el.value).toBe('First')
  })

  it('follows a disabled fieldset', async () => {
    const form = await fixture<HTMLFormElement>(
      '<form><fieldset disabled><bc-text-field label="Title"></bc-text-field></fieldset></form>',
    )
    const el = lightQuery(form, 'bc-text-field')
    await settle(el)
    expect(el.disabled).toBe(true)
    expect(shadowQuery(el, 'input').disabled).toBe(true)
  })

  it('renders a textarea with a counter', async () => {
    const el = await fixture<BcTextField>(
      '<bc-text-field label="Details" multiline maxlength="200" value="abc"></bc-text-field>',
    )
    expect(el.shadowRoot?.querySelector('textarea')).not.toBeNull()
    expect(shadowQuery(el, '.count').textContent).toBe('3/200')
  })

  it('shows the hint while the field is valid', async () => {
    const el = await fixture<BcTextField>(
      '<bc-text-field label="Title" hint="Visible on the status page"></bc-text-field>',
    )
    expect(shadowQuery(el, '.hint').textContent).toBe('Visible on the status page')
  })
})
