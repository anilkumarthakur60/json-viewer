# API Reference

The complete public API of `@anil-labs/json-viewer-core`. The framework bindings wrap the
`JsonViewer` class documented here  see the [Frameworks](/frameworks/vanilla) section for their
hooks, components, actions and the custom element.

```ts
import { JsonViewer } from '@anil-labs/json-viewer-core'
import '@anil-labs/json-viewer-core/styles.css'
```

## `new JsonViewer(options)`

```ts
const viewer = new JsonViewer(options)
```

The viewer renders its own DOM into `viewer.el` and, if you pass `target`, appends itself there
immediately. It must be constructed in the browser  during SSR, create it inside an effect /
`onMount`.

### Options

`JsonViewerOptions`  only `data` is required.

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `data` | `JsonValue` |  (required) | The JSON data to display. |
| `darkMode` | `boolean` | `true` | Use the dark theme. Switchable at runtime with `setDarkMode`. |
| `expanded` | `boolean` | `true` | Initial expanded state applied to every node. |
| `rootControls` | `boolean` | `true` | Show the built-in Expand-All / Collapse-All controls above a root container. |
| `copyable` | `boolean` | `true` | Show per-node copy-to-clipboard buttons. |
| `className` | `string` | `''` | Extra class on the viewer root, for scoped styling. |
| `target` | `HTMLElement` |  | Optional host element to render into immediately. |

```ts
const viewer = new JsonViewer({
  data: { name: 'Ada', roles: ['admin', 'author'], meta: null },
  darkMode: true,
  expanded: true,
  rootControls: true,
  copyable: true,
  className: 'my-viewer',
  target: document.querySelector('#app')!,
})
```

### Properties

| Property | Type | Description |
| --- | --- | --- |
| `el` | `readonly HTMLElement` | The rendered root element. Append it where you want the viewer to appear. |

### Methods

| Method | Signature | Description |
| --- | --- | --- |
| `getData` | `(): JsonValue` | The data currently displayed. |
| `setData` | `(data: JsonValue): void` | Replace the displayed data and re-render (keeps per-node expand overrides). |
| `setDarkMode` | `(darkMode: boolean): void` | Switch between the dark and light themes. |
| `setExpandedDefault` | `(expanded: boolean): void` | Reset every node to a baseline expanded state (drops per-node overrides). |
| `expandAll` | `(): void` | Expand every node. |
| `collapseAll` | `(): void` | Collapse every node. |
| `toggle` | `(path: string, key?: string): void` | Flip the expanded state of the node at `path`. |
| `isExpanded` | `(path: string): boolean` | Whether the node at `path` is currently expanded. |
| `on` | `(event, handler): () => void` | Subscribe; returns an unsubscribe function. |
| `mount` | `(host: HTMLElement): () => void` | Append the viewer to `host`; returns a dispose that removes it. |
| `destroy` | `(): void` | Tear down the instance and remove its DOM, listeners and state. |

### Events

Subscribe with `on(event, handler)`. The handler receives a single typed payload; `on` returns a
function that unsubscribes.

| Event | Payload | Fires when |
| --- | --- | --- |
| `toggle` | `ToggleEventPayload` | A node is expanded or collapsed (via the UI or `toggle` / `expandAll` / `collapseAll`). |
| `copy` | `CopyEventPayload` | A node's value is successfully copied to the clipboard. |

```ts
const off = viewer.on('toggle', ({ path, key, expanded }) => console.log(path, expanded))
off() // unsubscribe

viewer.on('copy', ({ path, value }) => console.log('copied', path, value))
```

The payloads carry a JSONPath-style `path` (e.g. `$.address.city`, `$.roles[0]`) and the `key` of the
node within its parent:

```ts
interface ToggleEventPayload {
  /** JSONPath-style path of the toggled node (e.g. `$.address`). */
  path: string
  /** Key/index of the toggled node within its parent. */
  key: string
  /** The node's new expanded state. */
  expanded: boolean
}

interface CopyEventPayload {
  /** JSONPath-style path of the copied node. */
  path: string
  /** Key/index of the copied node within its parent. */
  key: string
  /** The copied value. */
  value: JsonValue
}
```

## Types

```ts
/** Any valid JSON primitive. */
type JsonPrimitive = string | number | boolean | null | undefined

/** A JSON object with string keys. */
interface JsonObject {
  [key: string]: JsonValue
}

/** A JSON array. */
type JsonArray = JsonValue[]

/** Any displayable value  primitives, objects, arrays, plus Date/RegExp/function. */
type JsonValue =
  | JsonPrimitive
  | JsonObject
  | JsonArray
  | Date
  | RegExp
  | ((...args: unknown[]) => unknown)
```

`JsonValue`, `JsonViewerOptions`, `ToggleEventPayload` and `CopyEventPayload` are all exported from
the core (and re-exported by every binding) for typing your own handlers and wrappers.

## CSS

The stylesheet is required and imported separately  once, anywhere in your app:

```ts
import '@anil-labs/json-viewer-core/styles.css'
```

Switch themes at runtime with the `darkMode` option / `setDarkMode`, which toggles the `jv-dark` /
`jv-light` classes on the root. See [Theming](/guide/theming) for the CSS variables you can override.
