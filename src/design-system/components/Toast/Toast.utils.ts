import type { ToastItem } from './Toast.types'

/**
 * Adds a toast to the end of the queue, dropping the oldest ones beyond the
 * limit so the stack never covers the page.
 *
 * @param queue - Toasts currently shown.
 * @param item - Toast to add.
 * @param limit - Maximum number of toasts on screen.
 */
export function enqueue(queue: readonly ToastItem[], item: ToastItem, limit: number): ToastItem[] {
  return [...queue, item].slice(-limit)
}

/**
 * Removes a toast from the queue.
 *
 * @param queue - Toasts currently shown.
 * @param id - Toast to remove.
 */
export function dequeue(queue: readonly ToastItem[], id: number): ToastItem[] {
  return queue.filter((item) => item.id !== id)
}
