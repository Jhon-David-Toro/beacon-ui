/**
 * Whether a slot currently has any element assigned to it.
 *
 * @param slot - Slot to inspect.
 */
export function hasAssignedContent(slot: HTMLSlotElement): boolean {
  return slot.assignedElements({ flatten: true }).length > 0
}
