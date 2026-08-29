# Solid

`@anil-labs/json-viewer-solid` wraps the core engine in a Solid component and hook. It's SSR-safe 
the viewer is only ever created on the client, inside effects.

## Install

```bash
npm i @anil-labs/json-viewer-solid @anil-labs/json-viewer-core
```

The stylesheet lives in the core package  import it once, anywhere in your app:

```ts
import '@anil-labs/json-viewer-core/styles.css'
```

## Quick start

The `<JsonViewer>` component renders the tree inline. Options are passed as props:

```tsx
import { JsonViewer } from '@anil-labs/json-viewer-solid'
import '@anil-labs/json-viewer-core/styles.css'

const data = {
  name: 'Ada Lovelace',
  age: 36,
  active: true,
  roles: ['admin', 'author'],
  address: { city: 'London', country: 'UK' },
  meta: null,
}

export function App() {
  return (
    <JsonViewer
      data={data}
      darkMode
      expanded
      onToggle={(p) => console.log(p.path, p.expanded)}
      onCopy={(p) => console.log('copied', p.path, p.value)}
    />
  )
}
```

### `<JsonViewer>` props

The component accepts every [`JsonViewerOptions`](/reference/api#options) field (`data`, `darkMode`,
`expanded`, `rootControls`, `copyable`, `className`) plus:

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `data` | `JsonValue` |  (required) | The JSON to display. |
| `darkMode` | `boolean` | `true` | Use the dark theme (reactive  change it live to re-theme). |
| `expanded` | `boolean` | `true` | Baseline expanded state; flip it to expand/collapse everything. |
| `onToggle` | `(p: ToggleEventPayload) => void` |  | Fires when a node is expanded or collapsed. |
| `onCopy` | `(p: CopyEventPayload) => void` |  | Fires when a node's value is copied. |

Because the props are reactive, a lively demo is just a couple of signals:

```tsx
import { createSignal } from 'solid-js'
import { JsonViewer } from '@anil-labs/json-viewer-solid'

export function Demo() {
  const [dark, setDark] = createSignal(true)
  const [expanded, setExpanded] = createSignal(true)

  return (
    <div>
      <div class="toolbar">
        <button onClick={() => setDark((d) => !d)}>Toggle theme</button>
        <button onClick={() => setExpanded(true)}>Expand all</button>
        <button onClick={() => setExpanded(false)}>Collapse all</button>
      </div>
      <JsonViewer data={data} darkMode={dark()} expanded={expanded()} rootControls={false} />
    </div>
  )
}
```

## `useJsonViewer`

For full imperative control, use the hook. It creates the viewer on mount, cleans up on scope
dispose, and returns a controller whose methods proxy the engine:

```tsx
import { useJsonViewer } from '@anil-labs/json-viewer-solid'

function Tree() {
  const host = document.createElement('div')
  const c = useJsonViewer({
    data,
    darkMode: true,
    target: host,
    onToggle: (p) => console.log('toggle', p.path),
  })

  return (
    <div>
      <div class="toolbar">
        <button onClick={() => c.expandAll()}>Expand all</button>
        <button onClick={() => c.collapseAll()}>Collapse all</button>
        <button onClick={() => c.setDarkMode(false)}>Light theme</button>
      </div>
      {host}
    </div>
  )
}
```

### Returned controller

| Field | Type | Description |
| --- | --- | --- |
| `viewer` | `JsonViewer \| null` | The underlying engine (null before mount / on the server). |
| `expandAll` | `() => void` | Expand every node. |
| `collapseAll` | `() => void` | Collapse every node. |
| `toggle` | `(path: string, key?: string) => void` | Flip the node at `path`. |
| `isExpanded` | `(path: string) => boolean` | Whether the node at `path` is expanded. |
| `getData` | `() => JsonValue \| undefined` | The data currently displayed. |
| `setData` | `(data: JsonValue) => void` | Replace the displayed data. |
| `setDarkMode` | `(darkMode: boolean) => void` | Switch between dark and light. |
| `setExpandedDefault` | `(expanded: boolean) => void` | Reset every node to a baseline state. |

The hook accepts every [`JsonViewerOptions`](/reference/api#options) field plus the `onToggle` and
`onCopy` callbacks.
