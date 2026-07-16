# Expand & Collapse

Objects and arrays are collapsible. State is tracked **per node** and
**persists**, so exploring deep structures never loses your place.

## The Expanded Default

The `expanded` option sets the starting state for every node. It defaults to
`true` (everything open):

::: code-group

```ts [Vanilla]
// Start expanded (default)
new JsonViewer({ data, target, expanded: true });

// Start collapsed
new JsonViewer({ data, target, expanded: false });
```

```tsx [React]
<JsonViewer data={data} expanded={false} />
```

```vue [Vue]
<JsonViewer :data="data" :expanded="false" />
```

```svelte [Svelte]
<div use:jsonViewer={{ data, expanded: false }} />
```

```html [Web Component]
<json-viewer expanded="false"></json-viewer>
```

:::

::: tip Large data
For very large JSON, start with `expanded: false` — collapsed subtrees aren't
rendered at all, so the initial paint is much faster.
:::

## Root Controls

When `rootControls` is `true` (the default) and the root value is an object or
array, the viewer renders an **Expand All** / **Collapse All** bar above the
tree automatically. Hide it with `rootControls: false`:

```ts
new JsonViewer({ data, target, rootControls: false });
```

## Click to Toggle

Users can toggle a node by clicking any of:

1. the **key** (e.g. `"hobbies"`),
2. the **colon** after the key,
3. the **type indicator** — the badge and brackets (`obj {`, `[…]`),
4. the **count label** (`3 keys`, `5 items`) shown when collapsed.

Toggle targets are keyboard-accessible too: they expose `role="button"` /
`aria-expanded` and respond to <kbd>Enter</kbd> and <kbd>Space</kbd>.

## Persistent, Path-Keyed State

This is the important part. Expand a nested node, collapse one of its ancestors,
then expand that ancestor again — the nested node is **exactly where you left
it**.

Each node has a stable, JSONPath-style path (`$.users[0].role`). The viewer
keeps a single **path-keyed store of overrides** on the instance: toggling a
node writes `path → expanded` into that map, and `isExpanded(path)` reads the
override, falling back to the shared baseline (`expanded`) when a node has never
been touched. Because the store lives on the instance — not in the DOM that
unmounts when a parent collapses — collapsing an ancestor never discards the
state inside it.

::: info Why this matters
In many tree viewers, collapsing a parent throws away all the expand/collapse
state inside it, forcing you to re-drill every time. Here it just works.
:::

`setData()` re-renders with the **same override store**, so replacing the data
(e.g. live-updating JSON) preserves the open/closed shape of matching paths.

## Programmatic Control

The core exposes imperative methods for driving state yourself:

| Method                        | Effect                                                     |
| ----------------------------- | ---------------------------------------------------------- |
| `expandAll()`                 | Open every node (resets the baseline to expanded)          |
| `collapseAll()`               | Close every node (resets the baseline to collapsed)        |
| `setExpandedDefault(bool)`    | Reset the baseline and **clear all per-node overrides**    |
| `toggle(path, key?)`          | Flip the node at `path` (emits a `toggle` event)           |
| `isExpanded(path)`            | Whether the node at `path` is currently open               |

```ts
import { JsonViewer } from '@anil-labs/json-viewer-core';
import '@anil-labs/json-viewer-core/styles.css';

const viewer = new JsonViewer({
  target: document.querySelector('#app')!,
  data: {
    users: [
      { id: 1, name: 'Alice', role: 'admin' },
      { id: 2, name: 'Bob', role: 'user' },
    ],
    settings: { theme: 'dark', notifications: { email: true, push: false } },
  },
});

document.querySelector('#expand')!.addEventListener('click', () => viewer.expandAll());
document.querySelector('#collapse')!.addEventListener('click', () => viewer.collapseAll());

// Toggle one specific node by path:
viewer.toggle('$.settings');
console.log(viewer.isExpanded('$.settings')); // false
```

In the framework bindings, drive the same behavior through the reactive
`expanded` prop — flipping it calls `setExpandedDefault()` under the hood:

::: code-group

```tsx [React]
const [expanded, setExpanded] = useState(true);

<>
  <button onClick={() => setExpanded(true)}>Expand All</button>
  <button onClick={() => setExpanded(false)}>Collapse All</button>
  <JsonViewer data={data} expanded={expanded} />
</>
```

```vue [Vue]
<script setup lang="ts">
  import { ref } from 'vue';
  import { JsonViewer } from '@anil-labs/json-viewer-vue';
  import '@anil-labs/json-viewer-core/styles.css';

  const expanded = ref(true);
  const data = {
    /* … */
  };
</script>

<template>
  <button @click="expanded = true">Expand All</button>
  <button @click="expanded = false">Collapse All</button>

  <JsonViewer
    :data="data"
    :expanded="expanded"
  />
</template>
```

:::

::: warning Expand/Collapse All resets overrides
`expandAll()`, `collapseAll()`, and `setExpandedDefault()` reset the shared
baseline **and clear every per-node override** in one operation — so they do
**not** emit a `toggle` event per node. Only an individual `toggle()` (or a user
click) records an override and fires an event.
:::

## Visual Indicators

**Collapsed:**

- Object → `obj {...}` + count badge (`3 keys`)
- Array → `5 [...]` + count badge (`5 items`)

**Expanded:**

- Object → `obj {`, children, `}`
- Array → `5 [`, items, `]`

## Reacting to Toggles

To observe or persist toggles across a remount or reload, listen to the
[`toggle` event](/guide/events):

```ts
viewer.on('toggle', (e) => console.log(e.path, e.expanded));
```

See [Events](/guide/events) for saving state across reloads.
