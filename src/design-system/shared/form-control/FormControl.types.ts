/**
 * What a form-associated element can submit, as accepted by
 * `ElementInternals.setFormValue()`. `null` leaves the control out of the
 * form data, the way an unchecked checkbox does.
 */
export type FormValue = string | File | FormData | null
