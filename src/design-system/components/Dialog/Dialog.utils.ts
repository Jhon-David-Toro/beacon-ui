/**
 * Whether a click landed on the backdrop of a modal `<dialog>` rather than
 * inside its box. The backdrop has no element of its own, so clicks on it
 * report the dialog itself as the target, at coordinates outside its rect.
 *
 * @param dialog - The dialog element.
 * @param event - Pointer event to test.
 */
export function isBackdropClick(dialog: HTMLDialogElement, event: MouseEvent): boolean {
  if (event.target !== dialog) {
    return false
  }
  const rect = dialog.getBoundingClientRect()
  const inside =
    event.clientX >= rect.left &&
    event.clientX <= rect.right &&
    event.clientY >= rect.top &&
    event.clientY <= rect.bottom
  return !inside
}
