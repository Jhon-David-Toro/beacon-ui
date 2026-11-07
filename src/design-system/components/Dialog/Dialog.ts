import { LitElement, html, unsafeCSS } from 'lit'
import type { PropertyValues } from 'lit'
import { defineElement } from '../../shared'
import '../Button/Button'
import '../Icon/Icon'
import { DIALOG_CLOSE_EVENT, DIALOG_TAG } from './Dialog.constants'
import { isBackdropClick } from './Dialog.utils'
import styles from './Dialog.scss?inline'

/**
 * Modal dialog built on the native `<dialog>` element, so focus trapping,
 * Escape to close, the top layer and returning focus all come from the
 * browser instead of custom code.
 *
 * @tag bc-dialog
 * @slot - Body content.
 * @slot footer - Actions, usually `bc-button` elements.
 * @fires bc-close - After the dialog closes, whatever closed it.
 */
export class BcDialog extends LitElement {
  static override styles = unsafeCSS(styles)

  static override properties = {
    open: { type: Boolean, reflect: true },
    heading: {},
  }

  /** Whether the dialog is shown. */
  declare open: boolean
  /** Title, also used as the dialog's accessible name. */
  declare heading: string

  constructor() {
    super()
    this.open = false
    this.heading = ''
  }

  /** Opens the dialog as a modal. */
  show(): void {
    this.open = true
  }

  /** Closes the dialog. */
  close(): void {
    this.open = false
  }

  protected override updated(changed: PropertyValues<this>): void {
    super.updated(changed)
    if (changed.has('open')) {
      this.#syncOpen()
    }
  }

  override render() {
    // Clicking the backdrop is a pointer shortcut; keyboard users close the
    // dialog with Escape, which the native element already handles.
    // eslint-disable-next-line lit-a11y/click-events-have-key-events
    return html`<dialog
      part="dialog"
      aria-labelledby="heading"
      @close=${this.#handleClose}
      @click=${this.#handleClick}
    >
      <header>
        <h2 id="heading">${this.heading}</h2>
        <bc-button variant="ghost" size="s" label="Close" @click=${this.#handleCloseClick}>
          <bc-icon name="close" size="18"></bc-icon>
        </bc-button>
      </header>
      <div class="body"><slot></slot></div>
      <footer><slot name="footer"></slot></footer>
    </dialog>`
  }

  /** The native dialog in the shadow root. */
  get #dialog(): HTMLDialogElement | null {
    return this.renderRoot.querySelector('dialog')
  }

  /** Mirrors the `open` property onto the native dialog. */
  #syncOpen(): void {
    const dialog = this.#dialog
    if (!dialog) {
      return
    }
    if (this.open && !dialog.open) {
      dialog.showModal()
    } else if (!this.open && dialog.open) {
      dialog.close()
    }
  }

  /** Keeps `open` in sync when the browser closes the dialog (Escape). */
  readonly #handleClose = (): void => {
    this.open = false
    this.dispatchEvent(new Event(DIALOG_CLOSE_EVENT, { bubbles: true, composed: true }))
  }

  /** Closes the dialog from its close button. */
  readonly #handleCloseClick = (): void => {
    this.close()
  }

  /** Closes the dialog when its backdrop is clicked. */
  readonly #handleClick = (event: MouseEvent): void => {
    const dialog = this.#dialog
    if (dialog && isBackdropClick(dialog, event)) {
      this.close()
    }
  }
}

defineElement(DIALOG_TAG, BcDialog)
