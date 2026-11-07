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
 */
export class BcSwitch extends FormControl {
  static override styles = unsafeCSS(styles)

  static override properties = {
    ...FormControl.properties,
    checked: { type: Boolean, reflect: true },
    value: {},
  }

  declare checked: boolean
  /** Value submitted while the switch is on. */
  declare value: string

  #defaultChecked = false

  constructor() {
    super()
    this.checked = false
    this.value = SWITCH_ON_VALUE
  }

  override connectedCallback(): void {
    super.connectedCallback()
    this.#defaultChecked = this.checked
  }

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

  protected formValue(): FormValue {
    return this.checked ? this.value : null
  }

  protected resetValue(): void {
    this.checked = this.#defaultChecked
  }

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
