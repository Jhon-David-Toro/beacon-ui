import { LitElement, html, unsafeCSS } from 'lit'
import { ifDefined } from 'lit/directives/if-defined.js'
import { defineElement } from '../../shared'
import {
  BUTTON_TAG,
  DEFAULT_BUTTON_SIZE,
  DEFAULT_BUTTON_TYPE,
  DEFAULT_BUTTON_VARIANT,
} from './Button.constants'
import styles from './Button.scss?inline'
import type { ButtonSize, ButtonType, ButtonVariant } from './Button.types'

/**
 * Action button. Renders a link when `href` is set.
 *
 * It is form-associated: `type="submit"` and `type="reset"` act on the
 * surrounding light-DOM `<form>`, which a `<button>` inside a shadow root
 * cannot do on its own.
 *
 * @tag bc-button
 * @slot - Button label, optionally with an icon.
 * @csspart control - The inner button or link.
 * @example
 * ```html
 * <bc-button variant="primary" type="submit">Save changes</bc-button>
 * <bc-button href="#/report">Report incident</bc-button>
 * ```
 */
export class BcButton extends LitElement {
  /** Tells the browser this element participates in forms. */
  static formAssociated = true

  /** Forwards focus to the inner button when the host is focused. */
  static override shadowRootOptions: ShadowRootInit = {
    ...LitElement.shadowRootOptions,
    delegatesFocus: true,
  }

  /** Compiled styles, adopted by the shadow root. */
  static override styles = unsafeCSS(styles)

  /** Reactive properties; each one is documented on its field. */
  static override properties = {
    variant: { reflect: true },
    size: { reflect: true },
    type: { reflect: true },
    disabled: { type: Boolean, reflect: true },
    href: {},
    label: {},
  }

  /**
   * Visual emphasis.
   *
   * @default 'secondary'
   */
  declare variant: ButtonVariant

  /**
   * Control height.
   *
   * @default 'm'
   */
  declare size: ButtonSize

  /**
   * Form behaviour, as on a native button.
   *
   * @default 'button'
   */
  declare type: ButtonType

  /**
   * Blocks interaction. A disabled link renders as a disabled button.
   *
   * @default false
   */
  declare disabled: boolean

  /**
   * When set, the button renders as a link to this URL.
   *
   * @default undefined
   */
  declare href: string | undefined

  /**
   * Accessible name, for icon-only buttons.
   *
   * @default undefined
   */
  declare label: string | undefined

  /** Connection to the owning form. */
  readonly #internals: ElementInternals

  /** Sets the defaults and attaches the form internals. */
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

  /**
   * Renders a link when `href` is set and the button is enabled, otherwise a
   * native button.
   *
   * @returns The control template.
   */
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
