import { LitElement, html, unsafeCSS } from 'lit'
import { ifDefined } from 'lit/directives/if-defined.js'
import { defineElement } from '../../shared'
import {
  BUTTON_TAG,
  DEFAULT_BUTTON_SIZE,
  DEFAULT_BUTTON_TYPE,
  DEFAULT_BUTTON_VARIANT,
} from './Button.constants'
import type { ButtonSize, ButtonType, ButtonVariant } from './Button.types'
import styles from './Button.scss?inline'

/**
 * Action button. Renders a link when `href` is set.
 *
 * It is form-associated: `type="submit"` and `type="reset"` act on the
 * surrounding light-DOM `<form>`, which a `<button>` inside a shadow root
 * cannot do on its own.
 *
 * @tag bc-button
 * @slot - Button label, optionally with an icon.
 */
export class BcButton extends LitElement {
  static formAssociated = true

  static override shadowRootOptions: ShadowRootInit = {
    ...LitElement.shadowRootOptions,
    delegatesFocus: true,
  }

  static override styles = unsafeCSS(styles)

  static override properties = {
    variant: { reflect: true },
    size: { reflect: true },
    type: { reflect: true },
    disabled: { type: Boolean, reflect: true },
    href: {},
    label: {},
  }

  /** Visual emphasis. */
  declare variant: ButtonVariant
  /** Control height. */
  declare size: ButtonSize
  /** Form behaviour, as on a native button. */
  declare type: ButtonType
  declare disabled: boolean
  /** When set, the button renders as a link to this URL. */
  declare href: string | undefined
  /** Accessible name, for icon-only buttons. */
  declare label: string | undefined

  readonly #internals: ElementInternals

  constructor() {
    super()
    this.#internals = this.attachInternals()
    this.variant = DEFAULT_BUTTON_VARIANT
    this.size = DEFAULT_BUTTON_SIZE
    this.type = DEFAULT_BUTTON_TYPE
    this.disabled = false
    this.href = undefined
    this.label = undefined
  }

  override render() {
    if (this.href && !this.disabled) {
      return html`<a
        class="control"
        part="control"
        href=${this.href}
        aria-label=${ifDefined(this.label)}
        ><slot></slot
      ></a>`
    }
    return html`<button
      class="control"
      part="control"
      type="button"
      ?disabled=${this.disabled}
      aria-label=${ifDefined(this.label)}
      @click=${this.#handleClick}
    >
      <slot></slot>
    </button>`
  }

  /** Forwards submit and reset clicks to the owning form. */
  readonly #handleClick = (): void => {
    const form = this.#internals.form
    if (this.type === 'submit') {
      form?.requestSubmit()
    } else if (this.type === 'reset') {
      form?.reset()
    }
  }
}

defineElement(BUTTON_TAG, BcButton)
