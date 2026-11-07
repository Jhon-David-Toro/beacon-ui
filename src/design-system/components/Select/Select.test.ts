import { describe, expect, it, vi } from 'vitest'
import { userEvent } from 'vitest/browser'
import { fixture, lightQuery, settle, shadowQuery } from '../../../test/fixture'
import './Select'
import type { BcSelect } from './Select'

const options = [
  { value: 'api', label: 'API gateway' },
  { value: 'search', label: 'Search' },
]

/**
 * Mounts a select inside a form with the shared options.
 *
 * @param attributes - Extra attributes for the select.
 */
async function mount(attributes = ''): Promise<{ form: HTMLFormElement; el: BcSelect }> {
  const form = await fixture<HTMLFormElement>(
    `<form><bc-select name="service" label="Service" ${attributes}></bc-select></form>`,
  )
  const el = lightQuery(form, 'bc-select')
  el.options = options
  await settle(el)
  await el.updateComplete
  return { form, el }
}

describe('bc-select', () => {
  it('renders the placeholder and one option per entry', async () => {
    const { el } = await mount('placeholder="Choose a service"')
    const labels = [...(el.shadowRoot?.querySelectorAll('option') ?? [])].map((option) =>
      option.textContent.trim(),
    )
    expect(labels).toEqual(['Choose a service', 'API gateway', 'Search'])
  })

  it('submits the picked value and fires change', async () => {
    const { form, el } = await mount()
    const onChange = vi.fn()
    el.addEventListener('change', onChange)
    await userEvent.selectOptions(shadowQuery(el, 'select'), 'search')
    await el.updateComplete
    expect(el.value).toBe('search')
    expect(new FormData(form).get('service')).toBe('search')
    expect(onChange).toHaveBeenCalledOnce()
  })

  it('is invalid while the placeholder of a required select is chosen', async () => {
    const { el } = await mount('required placeholder="Choose a service"')
    expect(el.checkValidity()).toBe(false)
    expect(el.validationMessage).toBe('Choose service.')
  })

  it('selects the option that matches value', async () => {
    const { el } = await mount('value="search"')
    expect(shadowQuery(el, 'select').value).toBe('search')
  })

  it('goes back to its initial value on reset', async () => {
    const { form, el } = await mount('value="api"')
    el.value = 'search'
    form.reset()
    await el.updateComplete
    expect(el.value).toBe('api')
  })
})
