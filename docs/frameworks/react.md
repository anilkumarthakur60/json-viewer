# React

`@anil-labs/json-viewer-react` wraps the core engine in a hook and a component. It ships with a
`'use client'` banner, so it works in React Server Component setups (Next.js App Router) out of the
box.

## Install

```bash
npm i @anil-labs/json-viewer-react @anil-labs/json-viewer-core
```

The stylesheet lives in the core package  import it once, anywhere in your app:

```ts
import '@anil-labs/json-viewer-core/styles.css'
```

## Quick start

The `<JsonViewer>` component renders the tree inline. Options are passed as props; `onToggle` and
`onCopy` receive the typed event payloads:

```tsx
import { JsonViewer } from '@anil-labs/json-viewer-react'
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

The component spreads all [`JsonViewerOptions`](/reference/api#options) (`data`, `darkMode`,
`expanded`, `rootControls`, `copyable`, `className`) plus:

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `data` | `JsonValue` |  (required) | The JSON to display. |
| `darkMode` | `boolean` | `true` | Use the dark theme. Change it live and the whole tree re-themes. |
| `expanded` | `boolean` | `true` | Baseline expanded state; flip it to expand/collapse everything. |
| `rootControls` | `boolean` | `true` | Show the built-in Expand-All / Collapse-All controls. |
| `copyable` | `boolean` | `true` | Show per-node copy buttons. |
| `wrapperClass` | `string` |  | Class for the host element the viewer mounts into. |
| `onToggle` | `(p: ToggleEventPayload) => void` |  | Fires when a node is expanded or collapsed. |
| `onCopy` | `(p: CopyEventPayload) => void` |  | Fires when a node's value is copied. |

Because `darkMode` and `expanded` are reactive, wiring up a lively demo is just React state:

```tsx
import { useState } from 'react'
import { JsonViewer } from '@anil-labs/json-viewer-react'

export function Demo() {
  const [dark, setDark] = useState(true)
  const [expanded, setExpanded] = useState(true)

  return (
    <div>
      <div className="toolbar">
        <button onClick={() => setDark((d) => !d)}>Toggle theme</button>
        <button onClick={() => setExpanded(true)}>Expand all</button>
        <button onClick={() => setExpanded(false)}>Collapse all</button>
      </div>
      <JsonViewer data={data} darkMode={dark} expanded={expanded} rootControls={false} />
    </div>
  )
}
```

## `useJsonViewer`

For full imperative control, use the hook and attach its `ref` to your own element. It creates the
viewer on mount (client-only), mounts it into the ref, and destroys it on unmount, pushing prop
changes into the engine as they happen.

```tsx
import { useJsonViewer } from '@anil-labs/json-viewer-react'

function Tree() {
  const { viewer, ref } = useJsonViewer({
    data,
    darkMode: true,
    onToggle: (p) => console.log('toggle', p.path),
  })

  return (
    <div>
      <div className="toolbar">
        <button onClick={() => viewer?.expandAll()}>Expand all</button>
        <button onClick={() => viewer?.collapseAll()}>Collapse all</button>
        <button onClick={() => viewer?.setDarkMode(false)}>Light theme</button>
      </div>
      <div ref={ref} />
    </div>
  )
}
```

### Returned controller

| Field | Type | Description |
| --- | --- | --- |
| `viewer` | `JsonViewer \| null` | The underlying engine (null until mounted on the client). |
| `ref` | `RefObject<HTMLDivElement \| null>` | Attach to the element the viewer renders into. |

The hook accepts every [`JsonViewerOptions`](/reference/api#options) field plus the `onToggle` and
`onCopy` callbacks.
