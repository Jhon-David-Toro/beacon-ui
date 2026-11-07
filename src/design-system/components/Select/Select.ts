import { html, nothing, unsafeCSS } from 'lit'
import { ifDefined } from 'lit/directives/if-defined.js'
import { repeat } from 'lit/directives/repeat.js'
import {
  ValueControl,
  defineElement,
  describedBy,
  renderFieldMessage,
  renderRequiredMark,
} from '../../shared'
import type { FieldMessages } from '../../shared'
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
 * @csspart control - The inner select.
 * @example
 * ```html
 * <bc-select name="region" label="Region" placeholder="Choose a region" required></bc-select>
 * <script>
 *   document.querySelector('bc-select').options = [{ value: 'eu', label: 'Europe' }]
 * </script>
 * ```
 */
export class BcSelect extends ValueControl {
  /** Compiled styles, adopted by the shadow root. */
  static override styles = unsafeCSS(styles)

  /** Reactive properties, on top of the ones from `ValueControl`. */
  static override properties = {
    ...ValueControl.properties,
    options: { attribute: false },
  }

  /**
   * Choices, in display order. Set it as a property, not an attribute.
   *
   * @default []
   */
  declare options: readonly SelectOption[]

  /** Sets the defaults. */
  constructor() {
    super()
    this.options = []
  }

  /**
   * Renders the label, the select with its options, and the hint or error.
   *
   * @returns The field template.
   */
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
          ${this.#renderPlaceholder()} ${this.#renderOptions()}
        </select>
        <span class="chevron" aria-hidden="true"></span>
      </div>
      ${renderFieldMessage(messages)}`
  }

  /** Keeps the native select on `value` and copies its validity to the host. */
  protected syncValidity(): void {
    const select = this.#select
    if (!select) {
      return
    }
    select.value = this.value
    const missing = select.validity.valueMissing
    const message = missing ? `Choose ${this.label.toLowerCase()}.` : ''
    this.internals.setValidity({ valueMissing: missing }, message, select)
  }

  /**
   * Inner native select.
   *
   * @returns The select, or `null` before the first render.
   */
  get #select(): HTMLSelectElement | null {
    return this.renderRoot.querySelector('select')
  }

  /**
   * Empty first option, when a placeholder is set.
   *
   * @returns The placeholder option, or `nothing`.
   */
  #renderPlaceholder() {
    if (this.placeholder === undefined) {
      return nothing
    }

    return html`<option value="" ?selected=${this.value === ''}>${this.placeholder}</option>`
  }

  /**
   * One `<option>` per entry, keyed by value.
   *
   * @returns The option templates.
   */
  #renderOptions() {
    return repeat(
      this.options,
      (option) => option.value,
      (option) =>
        html`<option value=${option.value} ?selected=${option.value === this.value}>
          ${option.label}
        </option>`,
    )
  }

  /**
   * Current hint and the error to show, if any.
   *
   * @returns The messages for this render.
   */
  #messages(): FieldMessages {
    return { hint: this.hint, error: this.showError() ? this.internals.validationMessage : '' }
  }

  /**
   * Stores the picked value and re-dispatches `change` from the host.
   *
   * @param event - `change` event from the inner select.
   */
  readonly #handleChange = (event: Event): void => {
    this.value = (event.target as HTMLSelectElement).value
    this.touched = true
    this.dispatchEvent(new Event('change', { bubbles: true }))
  }
}

defineElement(SELECT_TAG, BcSelect)
