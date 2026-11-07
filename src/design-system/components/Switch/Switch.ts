import { html, unsafeCSS } from 'lit'
import { FormControl, defineElement } from '../../shared'
import type { FormValue } from '../../shared'
import { SWITCH_ON_VALUE, SWITCH_TAG } from './Switch.constants'
import styles from './Switch.scss?inline'

/**
 * On/off control with the `switch` role. Like a checkbox, it only adds its
 * value to the form while it is on.
 *
 * @tag bc-switch
 * @slot - Label text.
 * @fires change - When the user toggles it.
 * @csspart control - The inner switch button.
 * @example
 * ```html
 * <bc-switch name="notify" checked>Email status subscribers</bc-switch>
 * ```
 */
export class BcSwitch extends FormControl {
  /** Compiled styles, adopted by the shadow root. */
  static override styles = unsafeCSS(styles)

  /** Reactive properties, on top of the ones from `FormControl`. */
  static override properties = {
    ...FormControl.properties,
    checked: { type: Boolean, reflect: true },
    value: {},
  }

  /**
   * Whether the switch is on.
   *
   * @default false
   */
  declare checked: boolean

  /**
   * Value submitted while the switch is on.
   *
   * @default 'on'
   */
  declare value: string

  /** State the switch had when it was connected; `reset` goes back to it. */
  #defaultChecked = false

  /** Sets the defaults. */
  constructor() {
    super()
    this.checked = false
    this.value = SWITCH_ON_VALUE
  }

  /** Remembers the initial state, set from markup or by the parent. */
  override connectedCallback(): void {
    super.connectedCallback()
    this.#defaultChecked = this.checked
  }

  /**
   * Renders the switch button with its track, thumb and label.
   *
   * @returns The switch template.
   */
  override render() {
    return html`<button
      type="button"
      role="switch"
      part="control"
      aria-checked=${this.checked ? 'true' : 'false'}
      ?disabled=${this.disabled}
      @click=${this.#toggle}
    >
      <span class="track" aria-hidden="true"><span class="thumb"></span></span>
      <slot></slot>
    </button>`
  }

  /**
   * Value submitted with the form.
   *
   * @returns `value` while on, `null` (left out of the form) while off.
   */
  protected formValue(): FormValue {
    return this.checked ? this.value : null
  }

  /** Goes back to the initial state. */
  protected resetValue(): void {
    this.checked = this.#defaultChecked
  }

  /** Reports a missing value when the switch is required and off. */
  protected syncValidity(): void {
    const button = this.renderRoot.querySelector('button') ?? undefined
    const missing = this.required && !this.checked
    const message = missing ? 'Turn this on to continue.' : ''
    this.internals.setValidity({ valueMissing: missing }, message, button)
  }

  /** Flips the state and tells listeners. */
  readonly #toggle = (): void => {
    this.checked = !this.checked
    this.dispatchEvent(new Event('change', { bubbles: true }))
  }
}

defineElement(SWITCH_TAG, BcSwitch)
