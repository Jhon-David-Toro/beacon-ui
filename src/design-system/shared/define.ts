/**
 * Registers a custom element once. Calling it again with the same tag is a
 * no-op, so a component can be imported from several entry points (or hot
 * reloaded) without throwing `NotSupportedError`.
 *
 * @param tag - Custom element name; must contain a hyphen.
 * @param constructor - Element class to register.
 */
export function defineElement(tag: string, constructor: CustomElementConstructor): void {
  if (!customElements.get(tag)) {
    customElements.define(tag, constructor)
  }
}
