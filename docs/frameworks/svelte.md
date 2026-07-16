# Svelte

`@anil-labs/json-viewer-svelte` exposes the engine as a Svelte **action** (`use:jsonViewer`) plus a
`createJsonViewer` controller for imperative control.

## Install

```bash
npm i @anil-labs/json-viewer-svelte @anil-labs/json-viewer-core
```

The stylesheet lives in the core package — import it once, anywhere in your app:

```ts
import '@anil-labs/json-viewer-core/styles.css'
```

## Quick start

Attach the `jsonViewer` action to any element and pass the options. The action renders the tree into
that element, diffs `data` / `darkMode` / `expanded` on update, and cleans up automatically:

```svelte
<script lang="ts">
  import { jsonViewer } from '@anil-labs/json-viewer-svelte'
  import '@anil-labs/json-viewer-core/styles.css'

  const data = {
    name: 'Ada Lovelace',
    age: 36,
    active: true,
    roles: ['admin', 'author'],
    address: { city: 'London', country: 'UK' },
    meta: null,
  }
</script>

<div
  use:jsonViewer={{
    data,
    darkMode: true,
    onToggle: (p) => console.log(p.path, p.expanded),
    onCopy: (p) => console.log('copied', p.path, p.value),
  }}
></div>
```

Because the action re-runs when its options object changes, a lively demo is just reactive state:

```svelte
<script lang="ts">
  import { jsonViewer } from '@anil-labs/json-viewer-svelte'

  let dark = true
  let expanded = true
</script>

<div class="toolbar">
  <button on:click={() => (dark = !dark)}>Toggle theme</button>
  <button on:click={() => (expanded = true)}>Expand all</button>
  <button on:click={() => (expanded = false)}>Collapse all</button>
</div>

<div use:jsonViewer={{ data, darkMode: dark, expanded, rootControls: false }}></div>
```

### Action options

`use:jsonViewer` takes a `JsonViewerActionOptions` object — every
[`JsonViewerOptions`](/reference/api#options) field plus optional `onToggle` and `onCopy` callbacks.

## `createJsonViewer`

For imperative control (drive expand/collapse and the theme from your own buttons), create a
controller in the component and tear it down in `onDestroy`:

```svelte
<script lang="ts">
  import { onMount, onDestroy } from 'svelte'
  import { createJsonViewer, type JsonViewerController } from '@anil-labs/json-viewer-svelte'
  import '@anil-labs/json-viewer-core/styles.css'

  let host: HTMLDivElement
  let controller: JsonViewerController

  onMount(() => {
    controller = createJsonViewer({
      data,
      darkMode: true,
      onToggle: (p) => console.log('toggle', p.path),
    })
    controller.mount(host)
  })

  onDestroy(() => controller?.destroy())
</script>

<div class="toolbar">
  <button on:click={() => controller.expandAll()}>Expand all</button>
  <button on:click={() => controller.collapseAll()}>Collapse all</button>
  <button on:click={() => controller.setDarkMode(false)}>Light theme</button>
</div>

<div bind:this={host}></div>
```

### Returned controller

| Field | Type | Description |
| --- | --- | --- |
| `viewer` | `JsonViewer` | The underlying engine. |
| `mount` | `(node: HTMLElement) => () => void` | Mount into `node`; returns an unmount function. |
| `setData` | `(data: JsonValue) => void` | Replace the displayed data. |
| `setDarkMode` | `(darkMode: boolean) => void` | Switch between dark and light. |
| `expandAll` | `() => void` | Expand every node. |
| `collapseAll` | `() => void` | Collapse every node. |
| `destroy` | `() => void` | Tear down — call in `onDestroy`. |

::: tip Action or controller?
Reach for `use:jsonViewer` for the declarative common case, and `createJsonViewer` when you need to
call `expandAll` / `collapseAll` / `setDarkMode` imperatively.
:::
