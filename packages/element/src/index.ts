import { JsonViewer } from '@anil-labs/json-viewer-core'
import type {
  CopyEventPayload,
  JsonValue,
  JsonViewerOptions,
  ToggleEventPayload,
} from '@anil-labs/json-viewer-core'

/**
 * SSR-safe base: `HTMLElement` is undefined outside the browser, so evaluating
 * `class ... extends HTMLElement` at import time would throw during SSR. Fall
 * back to an inert base; `register()` still guards actual definition.
 */
const Base: typeof HTMLElement =
  typeof HTMLElement !== 'undefined' ? HTMLElement : (class {} as unknown as typeof HTMLElement)

/**
 * `<json-viewer>` custom element. Set the JSON via the `.data` JS property
 * (it's an arbitrary value), tweak presentation via attributes, and listen for
 * `jv:toggle` / `jv:copy` events (`event.detail` is the payload).
 *
 * ```html
 * <json-viewer dark-mode="false" expanded></json-viewer>
 * <script type="module">
 *   const el = document.querySelector('json-viewer')
 *   el.data = { hello: 'world', nested: { count: 2 } }
 *   el.addEventListener('jv:copy', (e) => console.log(e.detail))
 * </script>
 * ```
 */
export class JsonViewerElement extends Base {
  private viewer: JsonViewer | null = null
  private dataRef: JsonValue = null
  private hasData = false
  private disposers: (() => void)[] = []

  static readonly observedAttributes = [
    'dark-mode',
    'expanded',
    'root-controls',
    'copyable',
    'class-name',
  ]

  /** The JSON value to display. Set as a property, not an attribute. */
  set data(value: JsonValue) {
    this.dataRef = value
    this.hasData = true
    if (this.viewer) this.viewer.setData(value)
    else this.build()
  }
  get data(): JsonValue {
    return this.viewer ? this.viewer.getData() : this.dataRef
  }

  /** The underlying engine, once built. */
  get jsonViewer(): JsonViewer | null {
    return this.viewer
  }

  connectedCallback(): void {
    this.build()
  }

  disconnectedCallback(): void {
    this.teardown()
  }

  attributeChangedCallback(name: string): void {
    if (!this.isConnected || !this.viewer) return
    // Attributes the core can apply in place  no full rebuild needed.
    if (name === 'dark-mode') {
      this.viewer.setDarkMode(this.bool('dark-mode'))
      return
    }
    if (name === 'expanded') {
      this.viewer.setExpandedDefault(this.bool('expanded'))
      return
    }
    // `root-controls`, `copyable` and `class-name` are construction-time only.
    this.build()
  }

  /** Expand every node. */
  expandAll(): void {
    this.viewer?.expandAll()
  }

  /** Collapse every node. */
  collapseAll(): void {
    this.viewer?.collapseAll()
  }

  /** Boolean-ish attribute: true unless explicitly `="false"`; true when absent. */
  private bool(name: string): boolean {
    return this.getAttribute(name) !== 'false'
  }

  private build(): void {
    if (!this.isConnected || !this.hasData) return
    this.teardown()

    const options: JsonViewerOptions = {
      data: this.dataRef,
      darkMode: this.bool('dark-mode'),
      expanded: this.bool('expanded'),
      rootControls: this.bool('root-controls'),
      copyable: this.bool('copyable'),
      ...(this.getAttribute('class-name')
        ? { className: this.getAttribute('class-name') as string }
        : {}),
    }

    const viewer = new JsonViewer(options)
    this.viewer = viewer
    this.disposers.push(
      viewer.on('toggle', (payload) => this.emit('toggle', payload)),
      viewer.on('copy', (payload) => this.emit('copy', payload)),
    )
    this.disposers.push(viewer.mount(this))
  }

  private teardown(): void {
    for (const dispose of this.disposers) dispose()
    this.disposers = []
    this.viewer?.destroy()
    this.viewer = null
    this.innerHTML = ''
  }

  private emit(name: 'toggle' | 'copy', detail: ToggleEventPayload | CopyEventPayload): void {
    this.dispatchEvent(new CustomEvent(`jv:${name}`, { detail, bubbles: true }))
  }
}

/** Register `<json-viewer>` (idempotent). Called automatically on import. */
export function register(tag = 'json-viewer'): void {
  if (typeof customElements !== 'undefined' && !customElements.get(tag)) {
    customElements.define(tag, JsonViewerElement)
  }
}

register()

export type {
  JsonValue,
  JsonViewerOptions,
  ToggleEventPayload,
  CopyEventPayload,
  JsonViewerEventMap,
  JsonViewerEventName,
} from '@anil-labs/json-viewer-core'
