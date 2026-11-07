import { LitElement, html, unsafeCSS } from 'lit'
import { repeat } from 'lit/directives/repeat.js'
import { defineElement } from '../../shared'
import '../Button/Button'
import '../Icon/Icon'
import { TOAST_DURATION_MS, TOAST_LIMIT, TOAST_REGION_TAG } from './Toast.constants'
import type { ToastItem, ToastOptions } from './Toast.types'
import { dequeue, enqueue } from './Toast.utils'
import styles from './Toast.scss?inline'

/**
 * Live region that stacks short confirmations in a corner of the screen.
 * Place one per page and call `show()` on it. The region is in the page
 * from the start, so screen readers announce every message added to it.
 *
 * @tag bc-toast-region
 * @example
 * ```html
 * <bc-toast-region></bc-toast-region>
 * <script>
 *   document.querySelector('bc-toast-region').show({ message: 'Saved.', tone: 'success' })
 * </script>
 * ```
 */
export class BcToastRegion extends LitElement {
  /** Compiled styles, adopted by the shadow root. */
  static override styles = unsafeCSS(styles)

  /** Reactive properties; each one is documented on its field. */
  static override properties = {
    items: { state: true },
  }

  /** Toasts on screen, oldest first. */
  declare private items: ToastItem[]

  /** Id given to the next toast. */
  #nextId = 0

  /** Auto-dismiss timer of each toast, by toast id. */
  readonly #timers = new Map<number, number>()

  /** Sets the defaults. */
  constructor() {
    super()
    this.items = []
  }

  /**
   * Shows a message and removes it after `duration` milliseconds.
   *
   * @param options - Message, tone and duration.
   * @returns The toast id, which `dismiss()` accepts.
   */
  show(options: ToastOptions): number {
    const id = this.#nextId++
    this.items = enqueue(
      this.items,
      { id, message: options.message, tone: options.tone ?? 'neutral' },
      TOAST_LIMIT,
    )
    this.#timers.set(id, window.setTimeout(this.dismiss, options.duration ?? TOAST_DURATION_MS, id))

    return id
  }

  /**
   * Removes a toast before its timer runs out.
   *
   * @param id - Toast to remove.
   */
  readonly dismiss = (id: number): void => {
    window.clearTimeout(this.#timers.get(id))
    this.#timers.delete(id)
    this.items = dequeue(this.items, id)
  }

  /** Clears every pending timer so nothing fires after removal. */
  override disconnectedCallback(): void {
    super.disconnectedCallback()
    this.#timers.forEach((timer) => {
      window.clearTimeout(timer)
    })
    this.#timers.clear()
  }

  /**
   * Renders the live region with one item per toast.
   *
   * @returns The region template.
   */
  override render() {
    return html`<ol role="status" aria-live="polite" aria-label="Notifications">
      ${repeat(
        this.items,
        (item) => item.id,
        (item) =>
          html`<li data-tone=${item.tone}>
            <p class="message">${item.message}</p>
            <bc-button
              variant="ghost"
              size="s"
              label="Dismiss notification"
              data-id=${item.id}
              @click=${this.#handleDismiss}
            >
              <bc-icon name="close" size="16"></bc-icon>
            </bc-button>
          </li>`,
      )}
    </ol>`
  }

  /**
   * Dismisses the toast whose close button was clicked.
   *
   * @param event - Click on a dismiss button.
   */
  readonly #handleDismiss = (event: Event): void => {
    const button = event.currentTarget as HTMLElement
    this.dismiss(Number(button.dataset.id))
  }
}

defineElement(TOAST_REGION_TAG, BcToastRegion)
