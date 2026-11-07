import { FormControl } from './FormControl'
import type { FormValue } from './FormControl.types'

/**
 * Base class for labelled controls whose value is a string, such as text
 * fields and selects. It adds the label, hint and placeholder, remembers the
 * initial value and restores it when the form resets.
 */
export abstract class ValueControl extends FormControl {
  /** Reactive properties of string-valued controls, on top of `FormControl`'s. */
  static override properties = {
    ...FormControl.properties,
    label: {},
    value: {},
    hint: {},
    placeholder: {},
  }

  /**
   * Visible label, also the control's accessible name.
   *
   * @default ''
   */
  declare label: string

  /**
   * Current value, submitted with the form.
   *
   * @default ''
   */
  declare value: string

  /**
   * Help text shown under the control while it is valid.
   *
   * @default ''
   */
  declare hint: string

  /**
   * Text shown while the control is empty.
   *
   * @default undefined
   */
  declare placeholder: string | undefined

  /** Value the control had when it was connected; `reset` goes back to it. */
  #defaultValue = ''

  /** Sets the defaults. */
  constructor() {
    super()
    this.label = ''
    this.value = ''
    this.hint = ''
    this.placeholder = undefined
  }

  /** Remembers the initial value, set from markup or by the parent. */
  override connectedCallback(): void {
    super.connectedCallback()
    this.#defaultValue = this.value
  }

  /**
   * Value submitted with the form.
   *
   * @returns The current string value.
   */
  protected formValue(): FormValue {
    return this.value
  }

  /** Goes back to the initial value. */
  protected resetValue(): void {
    this.value = this.#defaultValue
  }
}
