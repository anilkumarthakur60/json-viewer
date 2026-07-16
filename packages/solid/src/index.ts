import { createEffect, mergeProps, onCleanup, onMount, untrack } from 'solid-js'
import type { JSX } from 'solid-js'
import { isServer } from 'solid-js/web'
import { JsonViewer as JsonViewerCore } from '@anil-labs/json-viewer-core'
import type {
  CopyEventPayload,
  JsonValue,
  JsonViewerOptions,
  ToggleEventPayload,
} from '@anil-labs/json-viewer-core'

export interface UseJsonViewerOptions extends JsonViewerOptions {
  /** Called when a node is expanded or collapsed. */
  onToggle?: (payload: ToggleEventPayload) => void
  /** Called when a node's value is copied to the clipboard. */
  onCopy?: (payload: CopyEventPayload) => void
}

export interface JsonViewerController {
  /** The underlying core viewer, or `null` before mount / on the server. */
  readonly viewer: JsonViewerCore | null
  /** Expand every node. */
  expandAll: () => void
  /** Collapse every node. */
  collapseAll: () => void
  /** Flip the expanded state of the node at `path`. */
  toggle: (path: string, key?: string) => void
  /** Whether the node at `path` is currently expanded. */
  isExpanded: (path: string) => boolean
  /** The data currently displayed, or `undefined` before mount. */
  getData: () => JsonValue | undefined
  /** Replace the displayed data. */
  setData: (data: JsonValue) => void
  /** Switch between dark and light themes. */
  setDarkMode: (darkMode: boolean) => void
  /** Reset every node to a baseline expanded state. */
  setExpandedDefault: (expanded: boolean) => void
}

/**
 * Create and manage a {@link JsonViewerCore}; cleans up on scope dispose.
 *
 * Pass `target` (e.g. via the {@link JsonViewer} component) to render into a
 * host element, or read `controller.viewer?.el` and place it yourself.
 */
export function useJsonViewer(options: UseJsonViewerOptions): JsonViewerController {
  let viewer: JsonViewerCore | null = null

  const build = (): JsonViewerCore => {
    const v = new JsonViewerCore({
      data: options.data,
      darkMode: options.darkMode,
      expanded: options.expanded,
      rootControls: options.rootControls,
      copyable: options.copyable,
      className: options.className,
      target: options.target,
    })
    v.on('toggle', (payload) => options.onToggle?.(payload))
    v.on('copy', (payload) => options.onCopy?.(payload))
    return v
  }

  onMount(() => {
    viewer = build()
    onCleanup(() => {
      viewer?.destroy()
      viewer = null
    })
  })

  // Reactive sync — push into the engine only when the value actually changes.
  let prevData = options.data
  createEffect(() => {
    const data = options.data
    if (!viewer || data === prevData) return
    prevData = data
    viewer.setData(data)
  })

  let prevDarkMode = options.darkMode
  createEffect(() => {
    const darkMode = options.darkMode
    if (!viewer || darkMode === prevDarkMode) return
    prevDarkMode = darkMode
    if (darkMode !== undefined) viewer.setDarkMode(darkMode)
  })

  let prevExpanded = options.expanded
  createEffect(() => {
    const expanded = options.expanded
    if (!viewer || expanded === prevExpanded) return
    prevExpanded = expanded
    if (expanded !== undefined) viewer.setExpandedDefault(expanded)
  })

  // `rootControls`, `copyable` and `className` are construction-only in the
  // core, so a change to any of them rebuilds the viewer in place.
  let prevRootControls = options.rootControls
  let prevCopyable = options.copyable
  let prevClassName = options.className
  createEffect(() => {
    const rootControls = options.rootControls
    const copyable = options.copyable
    const className = options.className
    if (
      !viewer ||
      (rootControls === prevRootControls &&
        copyable === prevCopyable &&
        className === prevClassName)
    ) {
      return
    }
    prevRootControls = rootControls
    prevCopyable = copyable
    prevClassName = className
    untrack(() => {
      viewer?.destroy()
      viewer = build()
    })
  })

  return {
    get viewer() {
      return viewer
    },
    expandAll: () => viewer?.expandAll(),
    collapseAll: () => viewer?.collapseAll(),
    toggle: (path, key) => viewer?.toggle(path, key),
    isExpanded: (path) => viewer?.isExpanded(path) ?? false,
    getData: () => viewer?.getData(),
    setData: (data) => viewer?.setData(data),
    setDarkMode: (darkMode) => viewer?.setDarkMode(darkMode),
    setExpandedDefault: (expanded) => viewer?.setExpandedDefault(expanded),
  }
}

export type JsonViewerProps = UseJsonViewerOptions

/** An inline JSON tree viewer. Renders the core viewer into a host `<div>`. */
export function JsonViewer(props: JsonViewerProps): JSX.Element {
  // SSR-safe: never touch the DOM on the server. The host wrapper and the
  // imperative viewer are created only on the client, inside effects.
  if (isServer || typeof document === 'undefined') return null
  const host = document.createElement('div')
  useJsonViewer(mergeProps(props, { target: host }))
  return host
}

export type {
  JsonValue,
  JsonPrimitive,
  JsonObject,
  JsonArray,
  ContainerKind,
  JsonViewerOptions,
  ToggleEventPayload,
  CopyEventPayload,
  JsonViewerEventMap,
  JsonViewerEventName,
} from '@anil-labs/json-viewer-core'
