import { html, nothing, unsafeCSS } from 'lit'
import { ifDefined } from 'lit/directives/if-defined.js'
import { live } from 'lit/directives/live.js'
import {
  ValueControl,
  defineElement,
  describedBy,
  renderFieldMessage,
  renderRequiredMark,
} from '../../shared'
import type { FieldMessages } from '../../shared'
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
 * @csspart control - The inner input or textarea.
 * @example
 * ```html
 * <form>
 *   <bc-text-field name="title" label="What is happening" required minlength="8"></bc-text-field>
 * </form>
 * ```
 */
export class BcTextField extends ValueControl {
  /** Compiled styles, adopted by the shadow root. */
  static override styles = unsafeCSS(styles)

  /** Reactive properties, on top of the ones from `ValueControl`. */
  static override properties = {
    ...ValueControl.properties,
    type: {},
    multiline: { type: Boolean },
    minlength: { type: Number },
    maxlength: { type: Number },
    autocomplete: {},
  }

  /**
   * Input type. Ignored when `multiline` is set.
   *
   * @default 'text'
   */
  declare type: TextFieldType

  /**
   * Renders a textarea instead of a single-line input.
   *
   * @default false
   */
  declare multiline: boolean

  /**
   * Fewest characters accepted.
   *
   * @default undefined
   */
  declare minlength: number | undefined

  /**
   * Most characters accepted. Also shows a character counter.
   *
   * @default undefined
   */
  declare maxlength: number | undefined

  /**
   * Autofill hint for the browser, as on a native input.
   *
   * @default undefined
   */
  declare autocomplete: AutoFill | undefined

  /** Sets the defaults. */
  constructor() {
    super()
    this.type = 'text'
    this.multiline = false
    this.minlength = undefined
    this.maxlength = undefined
    this.autocomplete = undefined
  }

  /**
   * Renders the label, the control, and the hint or error with the counter.
   *
   * @returns The field template.
   */
  override render() {
    const messages = this.#messages()

    return html`<label for="control">${this.label}${renderRequiredMark(this.required)}</label>
      ${this.multiline ? this.#renderTextarea(messages) : this.#renderInput(messages)}
      <div class="meta">${renderFieldMessage(messages)}${this.#renderCount()}</div>`
  }

  /** Copies the inner control's validity to the host. */
  protected syncValidity(): void {
    const control = this.#control
    if (!control) {
      return
    }
    this.internals.setValidity(validityFlags(control), validationText(control, this.label), control)
  }

  /**
   * Inner native control.
   *
   * @returns The input or textarea, or `null` before the first render.
   */
  get #control(): TextControl | null {
    return this.renderRoot.querySelector('#control')
  }

  /**
   * Current hint and the error to show, if any.
   *
   * @returns The messages for this render.
   */
  #messages(): FieldMessages {
    const control = this.#control
    const error = control && this.showError() ? validationText(control, this.label) : ''

    return { hint: this.hint, error }
  }

  /**
   * Single-line input.
   *
   * @param messages - Hint and error for ARIA wiring.
   * @returns The input template.
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
   * @returns The textarea template.
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

  /**
   * Character counter, only when there is a maximum.
   *
   * @returns The counter, or `nothing` without `maxlength`.
   */
  #renderCount() {
    if (this.maxlength === undefined) {
      return nothing
    }

    return html`<span class="count" aria-hidden="true"
      >${this.value.length}/${this.maxlength}</span
    >`
  }

  /**
   * Keeps `value` in step with what the user types.
   *
   * @param event - `input` event from the inner control.
   */
  readonly #handleInput = (event: Event): void => {
    this.value = (event.target as TextControl).value
  }

  /** Re-dispatches `change` from the host, since it does not cross the shadow root. */
  readonly #handleChange = (): void => {
    this.dispatchEvent(new Event('change', { bubbles: true }))
  }
}

defineElement(TEXT_FIELD_TAG, BcTextField)
