import { html, nothing, unsafeCSS } from 'lit'
import { ifDefined } from 'lit/directives/if-defined.js'
import { live } from 'lit/directives/live.js'
import {
  FormControl,
  defineElement,
  describedBy,
  renderFieldMessage,
  renderRequiredMark,
} from '../../shared'
import type { FieldMessages, FormValue } from '../../shared'
import '../Icon/Icon'
import { DEFAULT_TEXTAREA_ROWS, TEXT_FIELD_TAG } from './TextField.constants'
import styles from './TextField.scss?inline'
import type { TextControl, TextFieldType } from './TextField.types'
import { validationText, validityFlags } from './TextField.utils'

/**
 * Labelled text input or textarea that takes part in native forms.
 *
 * Errors appear only after the user leaves the field or tries to submit,
 * never while they are still typing the first time.
 *
 * @tag bc-text-field
 * @fires input - On every keystroke, like a native input.
 * @fires change - When the value is committed.
 */
export class BcTextField extends FormControl {
  static override styles = unsafeCSS(styles)

  static override properties = {
    ...FormControl.properties,
    label: {},
    value: {},
    type: {},
    placeholder: {},
    hint: {},
    multiline: { type: Boolean },
    minlength: { type: Number },
    maxlength: { type: Number },
    autocomplete: {},
  }

  declare label: string
  declare value: string
  /** Input type. Ignored when `multiline` is set. */
  declare type: TextFieldType
  declare placeholder: string | undefined
  /** Help text shown under the field while it is valid. */
  declare hint: string
  /** Renders a textarea instead of an input. */
  declare multiline: boolean
  declare minlength: number | undefined
  /** Also shows a character counter. */
  declare maxlength: number | undefined
  declare autocomplete: AutoFill | undefined

  #defaultValue = ''

  constructor() {
    super()
    this.label = ''
    this.value = ''
    this.type = 'text'
    this.placeholder = undefined
    this.hint = ''
    this.multiline = false
    this.minlength = undefined
    this.maxlength = undefined
    this.autocomplete = undefined
  }

  override connectedCallback(): void {
    super.connectedCallback()
    this.#defaultValue = this.value
  }

  override render() {
    const messages = this.#messages()
    return html`<label for="control">${this.label}${renderRequiredMark(this.required)}</label>
      ${this.multiline ? this.#renderTextarea(messages) : this.#renderInput(messages)}
      ${renderFieldMessage(messages)} ${this.#renderCount()}`
  }

  protected formValue(): FormValue {
    return this.value
  }

  protected resetValue(): void {
    this.value = this.#defaultValue
  }

  protected syncValidity(): void {
    const control = this.#control
    if (!control) {
      return
    }
    this.internals.setValidity(validityFlags(control), validationText(control, this.label), control)
  }

  /** Inner native control. */
  get #control(): TextControl | null {
    return this.renderRoot.querySelector('#control')
  }

  /** Current hint and the error to show, if any. */
  #messages(): FieldMessages {
    const control = this.#control
    const error = control && this.showError() ? validationText(control, this.label) : ''
    return { hint: this.hint, error }
  }

  /**
   * Single-line input.
   *
   * @param messages - Hint and error for ARIA wiring.
   */
  #renderInput(messages: FieldMessages) {
    return html`<input
      id="control"
      part="control"
      .value=${live(this.value)}
      type=${this.type}
      placeholder=${ifDefined(this.placeholder)}
      minlength=${ifDefined(this.minlength)}
      maxlength=${ifDefined(this.maxlength)}
      autocomplete=${ifDefined(this.autocomplete)}
      ?required=${this.required}
      ?disabled=${this.disabled}
      aria-invalid=${this.showError() ? 'true' : 'false'}
      aria-describedby=${ifDefined(describedBy(messages))}
      @input=${this.#handleInput}
      @change=${this.#handleChange}
      @blur=${this.markTouched}
    />`
  }

  /**
   * Multi-line textarea.
   *
   * @param messages - Hint and error for ARIA wiring.
   */
  #renderTextarea(messages: FieldMessages) {
    return html`<textarea
      id="control"
      part="control"
      .value=${live(this.value)}
      rows=${DEFAULT_TEXTAREA_ROWS}
      placeholder=${ifDefined(this.placeholder)}
      minlength=${ifDefined(this.minlength)}
      maxlength=${ifDefined(this.maxlength)}
      ?required=${this.required}
      ?disabled=${this.disabled}
      aria-invalid=${this.showError() ? 'true' : 'false'}
      aria-describedby=${ifDefined(describedBy(messages))}
      @input=${this.#handleInput}
      @change=${this.#handleChange}
      @blur=${this.markTouched}
    ></textarea>`
  }

  /** Character counter, only when there is a maximum. */
  #renderCount() {
    if (this.maxlength === undefined) {
      return nothing
    }
    return html`<span class="count" aria-hidden="true"
      >${this.value.length}/${this.maxlength}</span
    >`
  }

  /** Keeps `value` in step with what the user types. */
  readonly #handleInput = (event: Event): void => {
    this.value = (event.target as TextControl).value
  }

  /** Re-dispatches `change` from the host, since it does not cross the shadow root. */
  readonly #handleChange = (): void => {
    this.dispatchEvent(new Event('change', { bubbles: true }))
  }
}

defineElement(TEXT_FIELD_TAG, BcTextField)
