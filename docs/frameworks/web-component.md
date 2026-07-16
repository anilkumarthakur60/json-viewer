# Web Component

`@anil-labs/json-viewer-element` registers a `<json-viewer>` custom element — usable in any framework
or in plain HTML, with no build step. Importing the package auto-registers the element.

## Install

```bash
npm i @anil-labs/json-viewer-element @anil-labs/json-viewer-core
```

The stylesheet lives in the core package — import it once, anywhere in your app:

```ts
import '@anil-labs/json-viewer-core/styles.css'
```

## Quick start

Configure the element with **attributes**, set the JSON as the `.data` **JS property** (it's an
arbitrary value, not a string), and listen for `jv:*` **events** — where `event.detail` is the typed
payload.

```html
<json-viewer id="viewer" dark-mode expanded></json-viewer>

<script type="module">
  import '@anil-labs/json-viewer-element'
  import '@anil-labs/json-viewer-core/styles.css'

  const el = document.querySelector('#viewer')

  // `data` is an arbitrary JS value → set it as a property, not an attribute.
  el.data = {
    name: 'Ada Lovelace',
    age: 36,
    active: true,
    roles: ['admin', 'author'],
    address: { city: 'London', country: 'UK' },
    meta: null,
  }

  el.addEventListener('jv:toggle', (e) => console.log(e.detail.path, e.detail.expanded))
  el.addEventListener('jv:copy', (e) => console.log('copied', e.detail.path, e.detail.value))
</script>
```

## A lively demo

Wire your own buttons to the element's `expandAll()` / `collapseAll()` methods, and flip the theme by
setting the `dark-mode` attribute (both `dark-mode` and `expanded` apply in place — no rebuild):

```html
<div class="toolbar">
  <button id="theme">Toggle theme</button>
  <button id="expand">Expand all</button>
  <button id="collapse">Collapse all</button>
</div>
<json-viewer id="viewer" dark-mode expanded></json-viewer>

<script type="module">
  import '@anil-labs/json-viewer-element'
  import '@anil-labs/json-viewer-core/styles.css'

  const el = document.querySelector('#viewer')
  el.data = { hello: 'world', nested: { count: 2, items: [1, 2, 3] } }

  let dark = true
  document.querySelector('#theme').addEventListener('click', () => {
    dark = !dark
    el.setAttribute('dark-mode', String(dark))
  })
  document.querySelector('#expand').addEventListener('click', () => el.expandAll())
  document.querySelector('#collapse').addEventListener('click', () => el.collapseAll())
</script>
```

## Attributes

Boolean-ish attributes are **on** when present and **off** only when set to `="false"`. `dark-mode`
and `expanded` are applied in place; changing `root-controls`, `copyable` or `class-name` rebuilds
the viewer with the new configuration.

| Attribute | Type | Description |
| --- | --- | --- |
| `dark-mode` | boolean | Use the dark theme (default on; set `="false"` for light). |
| `expanded` | boolean | Baseline expanded state for every node (default on). |
| `root-controls` | boolean | Show the built-in Expand-All / Collapse-All controls (default on). |
| `copyable` | boolean | Show per-node copy buttons (default on). |
| `class-name` | string | Extra class on the viewer root. |

## Property

| Property | Type | Description |
| --- | --- | --- |
| `data` | `JsonValue` | **Required.** The JSON to display. Set as a JS property. |

```js
document.querySelector('json-viewer').data = { any: 'value' }
```

## Events

Every event's `detail` is the typed payload. Events bubble.

| Event | `detail` | Fires when |
| --- | --- | --- |
| `jv:toggle` | `ToggleEventPayload` | A node is expanded or collapsed. |
| `jv:copy` | `CopyEventPayload` | A node's value is copied to the clipboard. |

## Methods & getters

| Member | Description |
| --- | --- |
| `expandAll()` | Expand every node. |
| `collapseAll()` | Collapse every node. |
| `data` | Getter/setter — the JSON value on display. |
| `jsonViewer` | Getter — the underlying `JsonViewer` engine (once built). |

```js
const el = document.querySelector('json-viewer')
el.expandAll()
console.log(el.jsonViewer)
```

The package also exports `register(tag?)`, called automatically on import, to define the element
under a custom tag name if you need to avoid a collision.

## Using it inside a framework

Because it's a standard custom element, `<json-viewer>` drops into any framework's template. Set
`data` via a property binding (or an effect / `ref`) and listen for the `jv:*` events. For deep
framework integration, the dedicated [React](/frameworks/react), [Vue](/frameworks/vue),
[Svelte](/frameworks/svelte) and [Solid](/frameworks/solid) bindings offer idiomatic hooks and
components.
