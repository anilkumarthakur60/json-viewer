import { el, on } from './dom'
import { Emitter, type JsonViewerEventMap, type JsonViewerEventName } from './events'
import { copyJsonToClipboard } from './clipboard'
import { isJsonObject, isJsonArray } from './type-guards'
import {
  formatValue,
  getValueCssClass,
  getBrackets,
  getBadgeContent,
  getCountLabel,
  buildChildPath,
} from './formatters'
import { getKeyColor, getBracketColor } from './theme'
import type { ContainerKind, JsonValue, JsonViewerOptions } from './types'

const ROOT_PATH = '$'
const COPY_SUCCESS_MS = 1500

const esc = (s: string): string =>
  s.replace(
    /[&<>"']/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c] ?? c,
  )

const ICONS = {
  copy: '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>',
  check:
    '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>',
  expand:
    '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><polyline points="6 9 12 15 18 9"/></svg>',
  collapse:
    '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><polyline points="18 15 12 9 6 15"/></svg>',
}

interface ResolvedOptions {
  darkMode: boolean
  expanded: boolean
  rootControls: boolean
  copyable: boolean
  className: string
}

interface NodeCtx {
  parentKey: string | number
  level: number
  isArrayItem: boolean
  isLast: boolean
  path: string
}

/**
 * A framework-agnostic JSON tree viewer. Renders its own DOM and emits `toggle`
 * / `copy` events. Import the stylesheet once:
 * `import '@anil-labs/json-viewer-core/styles.css'`.
 */
export class JsonViewer {
  /** The rendered root element. Append it where you want the viewer to appear. */
  readonly el: HTMLElement

  private data: JsonValue
  private darkMode: boolean
  private baseline: boolean
  private readonly overrides = new Map<string, boolean>()
  private readonly pathValues = new Map<string, JsonValue>()
  private readonly emitter = new Emitter()
  private readonly o: ResolvedOptions
  private readonly disposers: (() => void)[] = []
  private copyTimer: ReturnType<typeof setTimeout> | undefined
  private copyBtn: HTMLButtonElement | undefined

  constructor(options: JsonViewerOptions) {
    if (typeof document === 'undefined') {
      throw new Error(
        '[json-viewer] JsonViewer renders to the DOM and must be constructed in the browser. ' +
          'During SSR, create it inside an effect / onMount.',
      )
    }
    this.o = {
      darkMode: options.darkMode ?? true,
      expanded: options.expanded ?? true,
      rootControls: options.rootControls ?? true,
      copyable: options.copyable ?? true,
      className: options.className ?? '',
    }
    this.data = options.data
    this.darkMode = this.o.darkMode
    this.baseline = this.o.expanded
    this.el = el('div', { class: this.rootClass() })
    this.disposers.push(
      on(this.el, 'click', (e) => this.onClick(e)),
      on(this.el, 'keydown', (e) => this.onKeydown(e)),
    )
    this.render()
    if (options.target) options.target.append(this.el)
  }

  private rootClass(): string {
    const theme = this.darkMode ? 'jv-dark' : 'jv-light'
    return `jv-node jv-root ${theme}${this.o.className ? ` ${this.o.className}` : ''}`
  }

  // ── public API ─────────────────────────────────────────────────────

  on<E extends JsonViewerEventName>(
    event: E,
    handler: (...a: JsonViewerEventMap[E]) => void,
  ): () => void {
    return this.emitter.on(event, handler)
  }

  /** The data currently displayed. */
  getData(): JsonValue {
    return this.data
  }

  /** Replace the displayed data and re-render (keeps per-node expand overrides). */
  setData(data: JsonValue): void {
    this.data = data
    this.render()
  }

  /** Switch between dark and light themes. */
  setDarkMode(darkMode: boolean): void {
    this.darkMode = darkMode
    this.render()
  }

  /** Reset every node to a baseline expanded state (drops per-node overrides). */
  setExpandedDefault(expanded: boolean): void {
    this.overrides.clear()
    this.baseline = expanded
    this.render()
  }

  /** Expand every node. */
  expandAll(): void {
    this.setExpandedDefault(true)
  }

  /** Collapse every node. */
  collapseAll(): void {
    this.setExpandedDefault(false)
  }

  /** Whether the node at `path` is currently expanded. */
  isExpanded(path: string): boolean {
    const override = this.overrides.get(path)
    return override === undefined ? this.baseline : override
  }

  /** Flip the expanded state of the node at `path`. */
  toggle(path: string, key = ''): void {
    this.setExpanded(path, key, !this.isExpanded(path))
  }

  private setExpanded(path: string, key: string, expanded: boolean): void {
    this.overrides.set(path, expanded)
    this.emitter.emit('toggle', { path, key, expanded })
    this.render()
  }

  /** Append the viewer to `host`; returns a dispose that removes it. */
  mount(host: HTMLElement): () => void {
    host.append(this.el)
    return () => this.el.remove()
  }

  /** Tear down: remove the element, drop listeners and state. */
  destroy(): void {
    clearTimeout(this.copyTimer)
    for (const d of this.disposers) d()
    this.disposers.length = 0
    this.emitter.clear()
    this.overrides.clear()
    this.pathValues.clear()
    this.el.remove()
  }

  // ── rendering ──────────────────────────────────────────────────────

  private render(): void {
    this.pathValues.clear()
    this.copyBtn = undefined
    this.el.className = this.rootClass()
    const data = this.data
    const showControls = this.o.rootControls && (isJsonObject(data) || isJsonArray(data))
    const controls = showControls
      ? `<div class="jv-root-controls">` +
        `<button type="button" class="jv-control-btn ${this.themed('jv-control-btn')}" data-action="expand-all" title="Expand All">${ICONS.expand}Expand All</button>` +
        `<button type="button" class="jv-control-btn ${this.themed('jv-control-btn')}" data-action="collapse-all" title="Collapse All">${ICONS.collapse}Collapse All</button>` +
        `</div>`
      : ''
    this.el.innerHTML =
      controls +
      this.nodeHtml(data, {
        parentKey: '',
        level: 0,
        isArrayItem: false,
        isLast: true,
        path: ROOT_PATH,
      })
  }

  private themed(base: string): string {
    return this.darkMode ? `${base}-dark` : `${base}-light`
  }

  private nodeHtml(value: JsonValue, ctx: NodeCtx): string {
    this.pathValues.set(ctx.path, value)
    if (isJsonObject(value)) {
      return this.containerHtml('object', Object.entries(value), '}', value, ctx)
    }
    if (isJsonArray(value)) {
      const entries = value.map((v, i) => [String(i), v] as [string, JsonValue])
      return this.containerHtml('array', entries, ']', value, ctx)
    }
    return this.primitiveHtml(value, ctx)
  }

  private containerHtml(
    kind: ContainerKind,
    entries: [string, JsonValue][],
    closeBracket: string,
    value: JsonValue,
    ctx: NodeCtx,
  ): string {
    const { parentKey, level, isArrayItem, isLast, path } = ctx
    const dark = this.darkMode
    const bracketColor = getBracketColor(level, dark)
    const isEmpty = entries.length === 0
    const isExpanded = this.isExpanded(path)
    const isArray = kind === 'array'
    const [open, close] = getBrackets(kind)
    const badge = getBadgeContent(kind, isEmpty, entries.length)
    const showKey = !isArrayItem && parentKey !== '' && parentKey !== undefined
    const p = esc(path)
    const k = esc(String(parentKey ?? ''))

    const keyHtml = showKey
      ? `<span class="jv-key jv-clickable" style="color:${getKeyColor(value, dark)}" data-action="toggle" data-path="${p}" data-key="${k}">"${k}"</span>` +
        `<span class="jv-colon jv-clickable" data-action="toggle" data-path="${p}" data-key="${k}">:</span>`
      : ''

    const bracketBody = isEmpty
      ? `<span>${open}${close}</span>`
      : `<span>${isExpanded ? open : `${open}...${close}`}</span>`
    const toggleHtml =
      `<span class="jv-toggle jv-type-indicator" style="color:${bracketColor}" role="button" tabindex="0" aria-expanded="${isExpanded ? 'true' : 'false'}" data-action="toggle" data-path="${p}" data-key="${k}">` +
      `<span class="jv-type-badge jv-type-${kind}">${esc(badge)}</span>${bracketBody}</span>`

    const countHtml =
      !isEmpty && !isExpanded
        ? `<span class="jv-count ${this.themed('jv-count')}" data-action="toggle" data-path="${p}" data-key="${k}">${esc(getCountLabel(kind, entries.length))}</span>`
        : ''

    const rowHtml = `<div class="jv-row">${keyHtml}${toggleHtml}${countHtml}${this.copyHtml(path, parentKey)}</div>`

    let childrenHtml = ''
    if (isExpanded && !isEmpty) {
      const kids = entries
        .map(([key, v], i) =>
          this.nodeHtml(v, {
            parentKey: key,
            level: level + 1,
            isArrayItem: isArray,
            isLast: i === entries.length - 1,
            path: buildChildPath(path, key, isArray),
          }),
        )
        .join('')
      childrenHtml =
        `<div class="jv-children" style="border-color:${bracketColor}40">${kids}</div>` +
        `<div class="jv-row"><span class="jv-bracket" style="color:${bracketColor}">${closeBracket}${isLast ? '' : ','}</span></div>`
    }

    return `<div class="jv-node"><div class="jv-item">${rowHtml}${childrenHtml}</div></div>`
  }

  private primitiveHtml(value: JsonValue, ctx: NodeCtx): string {
    const { parentKey, isArrayItem, isLast, path } = ctx
    const dark = this.darkMode
    const showKey = !isArrayItem && parentKey !== '' && parentKey !== undefined
    const k = esc(String(parentKey ?? ''))
    const keyHtml = showKey
      ? `<span class="jv-key" style="color:${getKeyColor(value, dark)}">"${k}"</span><span class="jv-colon">: </span>`
      : ''
    const valHtml = `<span class="${getValueCssClass(value, dark)}">${esc(formatValue(value))}</span>`
    const commaHtml = !isLast ? `<span class="jv-comma">,</span>` : ''
    return `<div class="jv-node"><div class="jv-item jv-primitive"><div class="jv-row">${keyHtml}${valHtml}${commaHtml}${this.copyHtml(path, parentKey)}</div></div></div>`
  }

  private copyHtml(path: string, parentKey: string | number): string {
    if (!this.o.copyable) return ''
    return `<button type="button" class="jv-copy-btn ${this.themed('jv-copy-btn')}" data-action="copy" data-path="${esc(path)}" data-key="${esc(String(parentKey ?? ''))}" title="Copy" aria-label="Copy value">${ICONS.copy}</button>`
  }

  // ── interaction ────────────────────────────────────────────────────

  private onClick(e: MouseEvent): void {
    const actionEl = (e.target as HTMLElement).closest('[data-action]')
    if (!actionEl) return
    this.handleAction(actionEl.getAttribute('data-action'), actionEl)
  }

  private onKeydown(e: KeyboardEvent): void {
    if (e.key !== 'Enter' && e.key !== ' ' && e.key !== 'Spacebar') return
    const actionEl = (e.target as HTMLElement).closest('[data-action]')
    if (!actionEl) return
    // Buttons handle Enter/Space natively; only intercept the toggle spans.
    if (actionEl.tagName === 'BUTTON') return
    e.preventDefault()
    this.handleAction(actionEl.getAttribute('data-action'), actionEl)
  }

  private handleAction(action: string | null, actionEl: Element): void {
    if (action === 'expand-all') return this.expandAll()
    if (action === 'collapse-all') return this.collapseAll()
    const path = actionEl.getAttribute('data-path') ?? ROOT_PATH
    const key = actionEl.getAttribute('data-key') ?? ''
    if (action === 'toggle') {
      this.toggle(path, key)
      return
    }
    if (action === 'copy') {
      void this.doCopy(actionEl as HTMLButtonElement, path, key)
    }
  }

  private async doCopy(btn: HTMLButtonElement, path: string, key: string): Promise<void> {
    if (!this.pathValues.has(path)) return
    const value = this.pathValues.get(path)
    const ok = await copyJsonToClipboard(value)
    if (!ok) return
    this.emitter.emit('copy', { path, key, value })
    // Reset any previously-marked button, then mark this one.
    clearTimeout(this.copyTimer)
    if (this.copyBtn && this.copyBtn !== btn) this.resetCopyBtn(this.copyBtn)
    this.copyBtn = btn
    btn.innerHTML = ICONS.check
    btn.title = 'Copied!'
    this.copyTimer = setTimeout(() => this.resetCopyBtn(btn), COPY_SUCCESS_MS)
  }

  private resetCopyBtn(btn: HTMLButtonElement): void {
    btn.innerHTML = ICONS.copy
    btn.title = 'Copy'
    if (this.copyBtn === btn) this.copyBtn = undefined
  }
}
