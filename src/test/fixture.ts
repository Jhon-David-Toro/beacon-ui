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
 * @returns The matching element.
 * @throws {Error} When nothing matches.
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
 * @returns The matching element.
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
 * @returns The matching element.
 * @throws {Error} When nothing matches, naming the selector and the owner.
 */
function mustFind(root: ParentNode | null, selector: string, owner: string): HTMLElement {
  const found = root?.querySelector<HTMLElement>(selector)
  if (!found) {
    throw new Error(`No "${selector}" inside <${owner}>`)
  }

  return found
}

/**
 * Finds the first element matching a selector anywhere under `root`,
 * descending into every open shadow root. App-level tests use it to reach
 * through nested components the way a user's eyes would.
 *
 * @param root - Node to start from.
 * @param selector - CSS selector to match.
 * @returns The first match, or `null`.
 */
export function deepQuery(root: ParentNode, selector: string): HTMLElement | null {
  const direct = root.querySelector<HTMLElement>(selector)
  if (direct) {
    return direct
  }
  const own =
    root instanceof Element && root.shadowRoot ? deepQuery(root.shadowRoot, selector) : null
  if (own) {
    return own
  }
  for (const element of root.querySelectorAll('*')) {
    const found = element.shadowRoot ? deepQuery(element.shadowRoot, selector) : null
    if (found) {
      return found
    }
  }

  return null
}

/**
 * Text content of an element, flattened across shadow roots and slots.
 *
 * @param node - Element to read.
 * @returns The visible text, as one string.
 */
export function deepText(node: Node): string {
  if (node.nodeType === Node.TEXT_NODE) {
    return node.textContent ?? ''
  }
  const element = node as Element
  const children = element.shadowRoot ? [...element.shadowRoot.childNodes] : [...node.childNodes]
  const slotted = element instanceof HTMLSlotElement ? element.assignedNodes({ flatten: true }) : []

  return [...(slotted.length ? slotted : children)].map(deepText).join('')
}
