import { html, nothing } from 'lit'
import type { TemplateResult } from 'lit'
import type { FieldMessages } from './field.types'

/**
 * Hint or error line under a form control. The error replaces the hint, so
 * `aria-describedby` always points at one element with the current message.
 *
 * @param messages - Hint text and the current error, if any.
 * @returns The message paragraph, or `nothing` when there is no text.
 */
export function renderFieldMessage(messages: FieldMessages): TemplateResult | typeof nothing {
  if (messages.error) {
    return html`<p class="error" id="message">
      <bc-icon name="alert" size="14"></bc-icon>${messages.error}
    </p>`
  }
  if (messages.hint) {
    return html`<p class="hint" id="message">${messages.hint}</p>`
  }

  return nothing
}

/**
 * Value for `aria-describedby` on the inner control.
 *
 * @param messages - Hint text and the current error, if any.
 * @returns The id of the message element, or `undefined` when there is none.
 */
export function describedBy(messages: FieldMessages): string | undefined {
  return messages.error || messages.hint ? 'message' : undefined
}

/**
 * Asterisk shown after the label of a required field. It is hidden from
 * screen readers because the control itself already reports `required`.
 *
 * @param required - Whether the field is required.
 * @returns The asterisk, or `nothing` for optional fields.
 */
export function renderRequiredMark(required: boolean): TemplateResult | typeof nothing {
  return required ? html`<span class="required" aria-hidden="true"> *</span>` : nothing
}
