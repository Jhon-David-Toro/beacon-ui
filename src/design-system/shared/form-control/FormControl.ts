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
  static formAssociated = true

  static override shadowRootOptions: ShadowRootInit = {
    ...LitElement.shadowRootOptions,
    delegatesFocus: true,
  }

  static override properties = {
    name: { reflect: true },
    disabled: { type: Boolean, reflect: true },
    required: { type: Boolean, reflect: true },
    touched: { state: true },
  }

  declare name: string
  declare disabled: boolean
  declare required: boolean
  declare protected touched: boolean

  protected readonly internals: ElementInternals

  constructor() {
    super()
    this.internals = this.attachInternals()
    this.name = ''
    this.disabled = false
    this.required = false
    this.touched = false
    this.addEventListener('invalid', this.markTouched)
  }

  /** The `<form>` this control belongs to, if any. */
  get form(): HTMLFormElement | null {
    return this.internals.form
  }

  /** Native validity state, as computed by `syncValidity`. */
  get validity(): ValidityState {
    return this.internals.validity
  }

  /** Message shown by the browser when the control is invalid. */
  get validationMessage(): string {
    return this.internals.validationMessage
  }

  /** Runs constraint validation, firing `invalid` when it fails. */
  checkValidity(): boolean {
    return this.internals.checkValidity()
  }

  /** Same as `checkValidity`, but also shows the browser's message. */
  reportValidity(): boolean {
    return this.internals.reportValidity()
  }

  protected override updated(changed: PropertyValues<this>): void {
    super.updated(changed)
    this.internals.setFormValue(this.formValue())
    this.syncValidity()
  }

  /** Called by the browser when an ancestor `<fieldset>` toggles `disabled`. */
  formDisabledCallback(disabled: boolean): void {
    this.disabled = disabled
  }

  /** Called by the browser when the owning form is reset. */
  formResetCallback(): void {
    this.touched = false
    this.resetValue()
  }

  /** Marks the control as interacted with, so errors become visible. */
  protected readonly markTouched = (): void => {
    this.touched = true
  }

  /** Whether the error message should be rendered right now. */
  protected showError(): boolean {
    return this.touched && !this.internals.validity.valid
  }

  /** Value submitted with the form. */
  protected abstract formValue(): FormValue

  /** Restores the initial value when the form resets. */
  protected abstract resetValue(): void

  /** Mirrors the control's validity into `ElementInternals`. */
  protected abstract syncValidity(): void
}
