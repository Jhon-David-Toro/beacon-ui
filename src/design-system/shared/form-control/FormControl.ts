import { LitElement } from 'lit'
import type { PropertyValues } from 'lit'
import type { FormValue } from './FormControl.types'

/**
 * Base class for form-associated custom elements.
 *
 * It wires `ElementInternals` so the element takes part in a native `<form>`
 * exactly like a built-in control: its value lands in `FormData`, it blocks
 * submission while invalid, it honours `<fieldset disabled>` and it resets
 * with the form. Subclasses only describe their value and validity.
 */
export abstract class FormControl extends LitElement {
  /** Tells the browser this element participates in forms. */
  static formAssociated = true

  /** Forwards focus to the inner native control when the host is focused. */
  static override shadowRootOptions: ShadowRootInit = {
    ...LitElement.shadowRootOptions,
    delegatesFocus: true,
  }

  /** Reactive properties shared by every form control. */
  static override properties = {
    name: { reflect: true },
    disabled: { type: Boolean, reflect: true },
    required: { type: Boolean, reflect: true },
    touched: { state: true },
  }

  /**
   * Key of the control's value in the submitted `FormData`.
   *
   * @default ''
   */
  declare name: string

  /**
   * Blocks interaction and leaves the value out of the form.
   *
   * @default false
   */
  declare disabled: boolean

  /**
   * Makes the form invalid while the control has no value.
   *
   * @default false
   */
  declare required: boolean

  /** Whether the user has left the control or tried to submit; errors show only then. */
  declare protected touched: boolean

  /** Connection to the owning form: value, validity and form state. */
  protected readonly internals: ElementInternals

  /** Sets the defaults and starts listening for failed validation. */
  constructor() {
    super()
    this.internals = this.attachInternals()
    this.name = ''
    this.disabled = false
    this.required = false
    this.touched = false
    this.addEventListener('invalid', this.markTouched)
  }

  /**
   * The `<form>` this control belongs to.
   *
   * @returns The owning form, or `null` outside a form.
   */
  get form(): HTMLFormElement | null {
    return this.internals.form
  }

  /**
   * Native validity state, as computed by `syncValidity`.
   *
   * @returns The current `ValidityState`.
   */
  get validity(): ValidityState {
    return this.internals.validity
  }

  /**
   * Message shown by the browser when the control is invalid.
   *
   * @returns The message, or an empty string while valid.
   */
  get validationMessage(): string {
    return this.internals.validationMessage
  }

  /**
   * Runs constraint validation, firing `invalid` when it fails.
   *
   * @returns Whether the control is valid.
   */
  checkValidity(): boolean {
    return this.internals.checkValidity()
  }

  /**
   * Same as `checkValidity`, but also shows the browser's message.
   *
   * @returns Whether the control is valid.
   */
  reportValidity(): boolean {
    return this.internals.reportValidity()
  }

  /**
   * Called by the browser when an ancestor `<fieldset>` toggles `disabled`.
   *
   * @param disabled - New disabled state of the fieldset.
   */
  formDisabledCallback(disabled: boolean): void {
    this.disabled = disabled
  }

  /** Called by the browser when the owning form is reset. */
  formResetCallback(): void {
    this.touched = false
    this.resetValue()
  }

  /**
   * Pushes the value and validity to the form after every render, so the
   * form always sees what the user sees.
   *
   * @param changed - Properties that changed in this update.
   */
  protected override updated(changed: PropertyValues<this>): void {
    super.updated(changed)
    this.internals.setFormValue(this.formValue())
    this.syncValidity()
  }

  /** Marks the control as interacted with, so errors become visible. */
  protected readonly markTouched = (): void => {
    this.touched = true
  }

  /**
   * Whether the error message should be rendered right now.
   *
   * @returns `true` once the control was touched and is invalid.
   */
  protected showError(): boolean {
    return this.touched && !this.internals.validity.valid
  }

  /**
   * Value submitted with the form.
   *
   * @returns The value, or `null` to leave the control out of the form data.
   */
  protected abstract formValue(): FormValue

  /** Restores the initial value when the form resets. */
  protected abstract resetValue(): void

  /** Mirrors the control's validity into `ElementInternals`. */
  protected abstract syncValidity(): void
}
