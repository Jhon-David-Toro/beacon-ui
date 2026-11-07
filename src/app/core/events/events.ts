import type { ToastOptions } from '../../../design-system'
import { NOTIFY_EVENT } from './events.constants'

/**
 * Asks the app shell to show a toast. Views never reach for the toast
 * region directly; they announce what happened and the shell decides how.
 *
 * @param source - Element dispatching the event.
 * @param options - Toast content.
 */
export function notify(source: EventTarget, options: ToastOptions): void {
  source.dispatchEvent(
    new CustomEvent<ToastOptions>(NOTIFY_EVENT, { detail: options, bubbles: true, composed: true }),
  )
}
