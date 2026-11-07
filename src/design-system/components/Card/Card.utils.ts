/**
 * Whether a slot currently has any element assigned to it.
 *
 * @param slot - Slot to inspect.
 * @returns `true` when at least one element is slotted.
 */
export function hasAssignedContent(slot: HTMLSlotElement): boolean {
  return slot.assignedElements({ flatten: true }).length > 0
}
