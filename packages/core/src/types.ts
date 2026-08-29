/**
 * Public types for @anil-labs/json-viewer-core.
 */

/** Any valid JSON primitive. */
export type JsonPrimitive = string | number | boolean | null | undefined

/** A JSON object with string keys. */
export interface JsonObject {
  [key: string]: JsonValue
}

/** A JSON array. */
export type JsonArray = JsonValue[]

/** Any displayable value  primitives, objects, arrays, plus Date/RegExp/function. */
export type JsonValue =
  JsonPrimitive | JsonObject | JsonArray | Date | RegExp | ((...args: unknown[]) => unknown)

/** Discriminates object vs array containers. */
export type ContainerKind = 'object' | 'array'

/** Emitted when a node is expanded or collapsed. */
export interface ToggleEventPayload {
  /** JSONPath-style path of the toggled node (e.g. `$.address`). */
  path: string
  /** Key/index of the toggled node within its parent. */
  key: string
  /** The node's new expanded state. */
  expanded: boolean
}

/** Emitted when a node's value is copied to the clipboard. */
export interface CopyEventPayload {
  /** JSONPath-style path of the copied node. */
  path: string
  /** Key/index of the copied node within its parent. */
  key: string
  /** The copied value. */
  value: JsonValue
}

/** Options for constructing a {@link JsonViewer}. */
export interface JsonViewerOptions {
  /** The JSON data to display. */
  data: JsonValue
  /** Use the dark theme. @default true */
  darkMode?: boolean
  /** Initial expanded state applied to every node. @default true */
  expanded?: boolean
  /** Show the Expand-All / Collapse-All controls above a root container. @default true */
  rootControls?: boolean
  /** Show per-node copy-to-clipboard buttons. @default true */
  copyable?: boolean
  /** Extra class on the viewer root, for scoped styling. */
  className?: string
  /** Optional host element to render into immediately. */
  target?: HTMLElement
}
