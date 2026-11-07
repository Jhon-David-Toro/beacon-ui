import { html, nothing, unsafeCSS } from 'lit'
import { ifDefined } from 'lit/directives/if-defined.js'
import { repeat } from 'lit/directives/repeat.js'
import {
  FormControl,
  defineElement,
  describedBy,
  renderFieldMessage,
  renderRequiredMark,
} from '../../shared'
import type { FieldMessages, FormValue } from '../../shared'
import '../Icon/Icon'
import { SELECT_TAG } from './Select.constants'
import styles from './Select.scss?inline'
import type { SelectOption } from './Select.types'

/**
 * Labelled native `<select>` that takes part in forms. Keeping the native
 * element gives the platform picker on mobile and full keyboard support.
 *
 * @tag bc-select
 * @fires change - When the user picks another option.
 */
export class BcSelect extends FormControl {
  static override styles = unsafeCSS(styles)

  static override properties = {
    ...FormControl.properties,
    label: {},
    value: {},
    hint: {},
    placeholder: {},
    options: { attribute: false },
  }

  declare label: string
  declare value: string
  declare hint: string
  /** First, empty option. Required selects stay invalid while it is chosen. */
  declare placeholder: string | undefined
  declare options: readonly SelectOption[]

  #defaultValue = ''

  constructor() {
    super()
    this.label = ''
    this.value = ''
    this.hint = ''
    this.placeholder = undefined
    this.options = []
  }

  override connectedCallback(): void {
    super.connectedCallback()
    this.#defaultValue = this.value
  }

  override render() {
    const messages = this.#messages()
    return html`<label for="control">${this.label}${renderRequiredMark(this.required)}</label>
      <div class="wrapper">
        <select
          id="control"
          part="control"
          ?required=${this.required}
          ?disabled=${this.disabled}
          aria-invalid=${this.showError() ? 'true' : 'false'}
          aria-describedby=${ifDefined(describedBy(messages))}
          @change=${this.#handleChange}
          @blur=${this.markTouched}
        >
          ${this.#renderPlaceholder()}
          ${repeat(
            this.options,
            (option) => option.value,
            (option) =>
              html`<option value=${option.value} ?selected=${option.value === this.value}>
                ${option.label}
              </option>`,
          )}
        </select>
        <span class="chevron" aria-hidden="true"></span>
      </div>
      ${renderFieldMessage(messages)}`
  }

  protected formValue(): FormValue {
    return this.value
  }

  protected resetValue(): void {
    this.value = this.#defaultValue
  }

  protected syncValidity(): void {
    const select = this.#select
    if (!select) {
      return
    }
    select.value = this.value
    const missing = select.validity.valueMissing
    this.internals.setValidity(
      { valueMissing: missing },
      missing ? `Choose ${this.label.toLowerCase()}.` : '',
      select,
    )
  }

  /** Inner native select. */
  get #select(): HTMLSelectElement | null {
    return this.renderRoot.querySelector('select')
  }

  /** Empty first option, when a placeholder is set. */
  #renderPlaceholder() {
    if (this.placeholder === undefined) {
      return nothing
    }
    return html`<option value="" ?selected=${this.value === ''}>${this.placeholder}</option>`
  }

  /** Current hint and the error to show, if any. */
  #messages(): FieldMessages {
    return { hint: this.hint, error: this.showError() ? this.internals.validationMessage : '' }
  }

  /** Stores the picked value and re-dispatches `change` from the host. */
  readonly #handleChange = (event: Event): void => {
    this.value = (event.target as HTMLSelectElement).value
    this.touched = true
    this.dispatchEvent(new Event('change', { bubbles: true }))
  }
}

defineElement(SELECT_TAG, BcSelect)
