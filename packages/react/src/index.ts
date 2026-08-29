'use client'
import {
  createElement as h,
  useEffect,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from 'react'
import { JsonViewer as JsonViewerCore } from '@anil-labs/json-viewer-core'
import type {
  JsonValue,
  JsonViewerOptions,
  ToggleEventPayload,
  CopyEventPayload,
} from '@anil-labs/json-viewer-core'

export interface UseJsonViewerOptions extends JsonViewerOptions {
  onToggle?: (payload: ToggleEventPayload) => void
  onCopy?: (payload: CopyEventPayload) => void
}

export interface JsonViewerController {
  /** The underlying engine (null until mounted on the client). */
  viewer: JsonViewerCore | null
  /** Attach to the host element the viewer renders into. */
  ref: RefObject<HTMLDivElement | null>
}

/**
 * Create and manage a JsonViewer instance. The viewer is created on mount
 * (client-only), mounted into `ref`, and destroyed on unmount. Changes to
 * `data` / `darkMode` / `expanded` are pushed into the engine as they happen.
 */
export function useJsonViewer(options: UseJsonViewerOptions): JsonViewerController {
  const optionsRef = useRef(options)
  optionsRef.current = options
  const ref = useRef<HTMLDivElement | null>(null)
  const [viewer, setViewer] = useState<JsonViewerCore | null>(null)
  // Track what has been pushed so we only call setters on an actual change.
  const synced = useRef<{ data: JsonValue; darkMode?: boolean; expanded?: boolean }>({
    data: options.data,
    darkMode: options.darkMode,
    expanded: options.expanded,
  })

  useEffect(() => {
    const host = ref.current
    if (!host) return
    const o = optionsRef.current
    const v = new JsonViewerCore({
      data: o.data,
      darkMode: o.darkMode,
      expanded: o.expanded,
      rootControls: o.rootControls,
      copyable: o.copyable,
      className: o.className,
    })
    const dispose = v.mount(host)
    const offs = [
      v.on('toggle', (payload) => optionsRef.current.onToggle?.(payload)),
      v.on('copy', (payload) => optionsRef.current.onCopy?.(payload)),
    ]
    setViewer(v)
    return () => {
      for (const off of offs) off()
      dispose()
      v.destroy()
      setViewer(null)
    }
    // Created once  options are read at construction and callbacks use a ref.
  }, [])

  // Reactive sync: push data / darkMode / expanded only when they change.
  useEffect(() => {
    if (!viewer) return
    const s = synced.current
    if (options.data !== s.data) {
      viewer.setData(options.data)
      s.data = options.data
    }
    if (options.darkMode !== undefined && options.darkMode !== s.darkMode) {
      viewer.setDarkMode(options.darkMode)
      s.darkMode = options.darkMode
    }
    if (options.expanded !== undefined && options.expanded !== s.expanded) {
      viewer.setExpandedDefault(options.expanded)
      s.expanded = options.expanded
    }
  })

  return { viewer, ref }
}

export interface JsonViewerProps extends UseJsonViewerOptions {
  /** Class name for the host element the viewer mounts into. */
  wrapperClass?: string
}

/**
 * Render a JSON tree viewer inline. For full control over the host element,
 * use {@link useJsonViewer} and attach its `ref` yourself.
 */
export function JsonViewer(props: JsonViewerProps): ReactNode {
  const { wrapperClass, ...options } = props
  const { ref } = useJsonViewer(options)
  return h('div', { ref, className: wrapperClass })
}

export type {
  JsonValue,
  JsonViewerOptions,
  ToggleEventPayload,
  CopyEventPayload,
} from '@anil-labs/json-viewer-core'
