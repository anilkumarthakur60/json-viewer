# Vanilla / Core

`@anil-labs/json-viewer-core` is the engine every binding wraps. Use it directly in plain JavaScript
or TypeScript  no framework required.

## Install

```bash
npm i @anil-labs/json-viewer-core
```

## Quick start

Import the stylesheet once, then construct a `JsonViewer`. Pass a `target` and it renders itself into
that element immediately:

```ts
import { JsonViewer } from '@anil-labs/json-viewer-core'
import '@anil-labs/json-viewer-core/styles.css'

const data = {
  name: 'Ada Lovelace',
  age: 36,
  active: true,
  roles: ['admin', 'author'],
  address: { city: 'London', country: 'UK' },
  meta: null,
}

const viewer = new JsonViewer({
  data,
  target: document.querySelector('#app')!,
  darkMode: true,
  expanded: true,
})

viewer.on('toggle', ({ path, expanded }) => console.log(path, expanded))
viewer.on('copy', ({ path, value }) => console.log('copied', path, value))
```

```html
<div id="app"></div>
```

No `target`? The rendered root lives on `viewer.el`, or call `viewer.mount(host)` to place it later.

## A lively demo

Turn off the built-in `rootControls` and drive expand/collapse and the theme from your own buttons 
the whole tree flips between dark and light with a single `setDarkMode` call:

```ts
import { JsonViewer } from '@anil-labs/json-viewer-core'
import '@anil-labs/json-viewer-core/styles.css'

let darkMode = true

const viewer = new JsonViewer({
  data,
  target: document.querySelector('#viewer')!,
  darkMode,
  rootControls: false, // we render our own controls below
})

const $ = (sel: string) => document.querySelector(sel)!

$('#expand-all').addEventListener('click', () => viewer.expandAll())
$('#collapse-all').addEventListener('click', () => viewer.collapseAll())
$('#toggle-theme').addEventListener('click', () => {
  darkMode = !darkMode
  viewer.setDarkMode(darkMode)
})
```

```html
<div class="toolbar">
  <button id="toggle-theme">Toggle theme</button>
  <button id="expand-all">Expand all</button>
  <button id="collapse-all">Collapse all</button>
</div>
<div id="viewer"></div>
```

## Options

Pass a [`JsonViewerOptions`](/reference/api#options) object to the constructor. Only `data` is
required:

```ts
const viewer = new JsonViewer({
  data,
  darkMode: true,
  expanded: true,
  rootControls: true,
  copyable: true,
  className: 'my-viewer',
  target: document.querySelector('#app')!,
})
```

## Methods

| Method | Description |
| --- | --- |
| `getData()` | The data currently displayed. |
| `setData(data)` | Replace the data and re-render (keeps per-node expand overrides). |
| `setDarkMode(darkMode)` | Switch between the dark and light themes. |
| `setExpandedDefault(expanded)` | Reset every node to a baseline expanded state (drops overrides). |
| `expandAll()` | Expand every node. |
| `collapseAll()` | Collapse every node. |
| `toggle(path, key?)` | Flip the expanded state of the node at `path`. |
| `isExpanded(path)` | Whether the node at `path` is currently expanded. |
| `on(event, handler)` | Subscribe; returns an unsubscribe function. |
| `mount(host)` | Append the viewer to `host`; returns a dispose that removes it. |
| `destroy()` | Tear down the instance and remove its DOM. |

The rendered root element is also available as the read-only `viewer.el` property.

## Events

Subscribe with `on(event, handler)`, which returns an unsubscribe function:

```ts
const off = viewer.on('copy', ({ path, value }) => console.log(path, value))
// later…
off()
```

| Event | Payload |
| --- | --- |
| `toggle` | `{ path, key, expanded }`  a node was expanded or collapsed. |
| `copy` | `{ path, key, value }`  a node's value was copied to the clipboard. |

## Cleanup

When you're done with a viewer instance, call `destroy()` to remove its DOM and listeners:

```ts
viewer.destroy()
```

See the [full API reference](/reference/api) for every option, method, event and type.
