/** Text shown under a form control. */
export interface FieldMessages {
  /** Help text, shown while the control is valid. */
  readonly hint: string

  /** Current error, shown instead of the hint. Empty while valid. */
  readonly error: string
}
