/** Tag name of the button element. */
export const BUTTON_TAG = 'bc-button'

/** Visual emphasis levels, from most to least prominent, plus a destructive one. */
export const BUTTON_VARIANTS = ['primary', 'secondary', 'ghost', 'danger'] as const

/** Heights: `m` meets the 44 px touch target, `s` is for dense toolbars. */
export const BUTTON_SIZES = ['s', 'm'] as const

/** Form behaviours, as on a native `<button>`. */
export const BUTTON_TYPES = ['button', 'submit', 'reset'] as const

/** Variant used when none is set. */
export const DEFAULT_BUTTON_VARIANT = 'secondary'

/** Size used when none is set. */
export const DEFAULT_BUTTON_SIZE = 'm'

/** Type used when none is set; `button` so it never submits by accident. */
export const DEFAULT_BUTTON_TYPE = 'button'
