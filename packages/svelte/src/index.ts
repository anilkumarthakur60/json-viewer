import type { ActionReturn } from 'svelte/action'
import { JsonViewer } from '@anil-labs/json-viewer-core'
import type {
  JsonValue,
  JsonViewerOptions,
  ToggleEventPayload,
  CopyEventPayload,
} from '@anil-labs/json-viewer-core'

/**
 * Options accepted by both the `jsonViewer` action and `createJsonViewer`.
 * Everything from the core options, plus `toggle`/`copy` event callbacks.
 */
export interface JsonViewerActionOptions extends JsonViewerOptions {
  onToggle?: (payload: ToggleEventPayload) => void
  onCopy?: (payload: CopyEventPayload) => void
}

export type CreateJsonViewerOptions = JsonViewerActionOptions

export interface JsonViewerController {
  /** The underlying engine. */
  viewer: JsonViewer
  /** Mount the rendered element into `node`; returns an unmount function. */
  mount: (node: HTMLElement) => () => void
  setData: (data: JsonValue) => void
  setDarkMode: (darkMode: boolean) => void
  expandAll: () => void
  collapseAll: () => void
  /** Tear down (call in `onDestroy`). */
  destroy: () => void
}

function wireEvents(viewer: JsonViewer, options: JsonViewerActionOptions): void {
  if (options.onToggle) viewer.on('toggle', options.onToggle)
  if (options.onCopy) viewer.on('copy', options.onCopy)
}

/**
 * Svelte action: `<div use:jsonViewer={{ data }} />`. Renders the JSON tree
 * inside `node`, forwards `toggle`/`copy` via callbacks, and diffs
 * `data`/`darkMode`/`expanded` on update so only changed values are pushed.
 */
export function jsonViewer(
  node: HTMLElement,
  options: JsonViewerActionOptions,
): ActionReturn<JsonViewerActionOptions> {
  let current = options
  const viewer = new JsonViewer(options)
  viewer.mount(node)
  wireEvents(viewer, options)

  return {
    update(next: JsonViewerActionOptions) {
      if (next.data !== current.data) viewer.setData(next.data)
      if (next.darkMode !== undefined && next.darkMode !== current.darkMode) {
        viewer.setDarkMode(next.darkMode)
      }
      if (next.expanded !== undefined && next.expanded !== current.expanded) {
        viewer.setExpandedDefault(next.expanded)
      }
      current = next
    },
    destroy() {
      viewer.destroy()
    },
  }
}

/**
 * Create a JsonViewer controller. Call this inside a component (e.g. `onMount`)
 * since the engine renders to the DOM, mount it into a node, and call
 * `.destroy()` in `onDestroy`.
 */
export function createJsonViewer(options: CreateJsonViewerOptions): JsonViewerController {
  const viewer = new JsonViewer(options)
  wireEvents(viewer, options)

  return {
    viewer,
    mount: (node) => viewer.mount(node),
    setData: (data) => viewer.setData(data),
    setDarkMode: (darkMode) => viewer.setDarkMode(darkMode),
    expandAll: () => viewer.expandAll(),
    collapseAll: () => viewer.collapseAll(),
    destroy: () => viewer.destroy(),
  }
}

export type {
  JsonValue,
  JsonViewerOptions,
  ToggleEventPayload,
  CopyEventPayload,
  JsonViewerEventMap,
  JsonViewerEventName,
} from '@anil-labs/json-viewer-core'
