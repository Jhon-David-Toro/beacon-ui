import type { LitElement } from 'lit'

/**
 * Mounts an HTML snippet in the document and waits until the first custom
 * element in it has finished rendering.
 *
 * @param markup - HTML to mount; its first element is returned.
 * @returns The mounted element, already updated.
 */
export async function fixture<T extends Element = LitElement>(markup: string): Promise<T> {
  const host = document.createElement('div')
  host.innerHTML = markup
  document.body.append(host)
  const element = host.firstElementChild as T
  await settle(element)
  return element
}

/**
 * Waits for a Lit element (and any Lit descendants in its shadow root) to
 * finish their pending updates.
 *
 * @param element - Element to wait for.
 */
export async function settle(element: Element): Promise<void> {
  const pending = [element, ...(element.shadowRoot?.querySelectorAll('*') ?? [])]
    .map((node) => (node as Partial<LitElement>).updateComplete)
    .filter((promise): promise is Promise<boolean> => promise !== undefined)
  await Promise.all(pending)
}

/**
 * Returns the first element matching a selector inside a shadow root, or
 * throws so a test fails with a clear message instead of a null error.
 *
 * @param host - Element whose shadow root is searched.
 * @param selector - CSS selector to match.
 */
export function shadowQuery<K extends keyof HTMLElementTagNameMap>(
  host: Element,
  selector: K,
): HTMLElementTagNameMap[K]
export function shadowQuery(host: Element, selector: string): HTMLElement
export function shadowQuery(host: Element, selector: string): HTMLElement {
  return mustFind(host.shadowRoot, selector, host.localName)
}

/**
 * Returns the first light-DOM descendant matching a selector, or throws.
 *
 * @param root - Element searched.
 * @param selector - CSS selector to match.
 */
export function lightQuery<K extends keyof HTMLElementTagNameMap>(
  root: ParentNode,
  selector: K,
): HTMLElementTagNameMap[K]
export function lightQuery(root: ParentNode, selector: string): HTMLElement
export function lightQuery(root: ParentNode, selector: string): HTMLElement {
  return mustFind(root, selector, 'root')
}

/**
 * Queries a root and throws a readable error when nothing matches.
 *
 * @param root - Node to search, or `null` when a shadow root is missing.
 * @param selector - CSS selector to match.
 * @param owner - Name used in the error message.
 */
function mustFind(root: ParentNode | null, selector: string, owner: string): HTMLElement {
  const found = root?.querySelector<HTMLElement>(selector)
  if (!found) {
    throw new Error(`No "${selector}" inside <${owner}>`)
  }
  return found
}
