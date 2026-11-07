/**
 * Index a tab list moves to for a key press, following the WAI-ARIA tabs
 * pattern: arrows wrap around, Home and End jump to the ends.
 *
 * @param current - Index of the focused tab.
 * @param key - `KeyboardEvent.key` value.
 * @param count - Number of tabs.
 * @returns The new index, or `null` when the key is not handled.
 */
export function nextTabIndex(current: number, key: string, count: number): number | null {
  if (count === 0) {
    return null
  }
  switch (key) {
    case 'ArrowRight':
      return (current + 1) % count
    case 'ArrowLeft':
      return (current - 1 + count) % count
    case 'Home':
      return 0
    case 'End':
      return count - 1
    default:
      return null
  }
}

/**
 * Keeps a selected index inside the bounds of the list.
 *
 * @param index - Requested index.
 * @param count - Number of tabs.
 * @returns An index between 0 and `count - 1` (0 for an empty list).
 */
export function clampIndex(index: number, count: number): number {
  return Math.min(Math.max(index, 0), Math.max(count - 1, 0))
}
