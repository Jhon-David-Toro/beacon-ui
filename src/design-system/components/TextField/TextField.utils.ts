import type { TextControl } from './TextField.types'

/**
 * Copies the inner control's validity flags so the host element reports the
 * same constraint errors a native input would.
 *
 * @param control - Inner input or textarea.
 */
export function validityFlags(control: TextControl): ValidityStateFlags {
  const { validity } = control
  return {
    valueMissing: validity.valueMissing,
    typeMismatch: validity.typeMismatch,
    tooShort: validity.tooShort,
    tooLong: validity.tooLong,
    patternMismatch: validity.patternMismatch,
  }
}

/**
 * Message for the first failing constraint, phrased as what to do next.
 *
 * @param control - Inner input or textarea.
 * @param label - Field label, used in the message.
 */
export function validationText(control: TextControl, label: string): string {
  const { validity } = control
  if (validity.valueMissing) {
    return `Enter ${label.toLowerCase()}.`
  }
  if (validity.tooShort) {
    return `Use at least ${control.minLength} characters.`
  }
  if (validity.typeMismatch) {
    return `Enter a valid ${control.type === 'email' ? 'email address' : 'value'}.`
  }
  return control.validationMessage
}
