# Events

`JsonViewer` emits two typed events so you can observe interaction and, if you
want, persist or synchronize view state in your own store.

| Event    | Fired when                      | Payload                                             |
| -------- | ------------------------------- | --------------------------------------------------- |
| `toggle` | a node is expanded or collapsed | `{ path: string; key: string; expanded: boolean }`  |
| `copy`   | a node's value is copied        | `{ path: string; key: string; value: JsonValue }`   |

Both payload shapes are exported as `ToggleEventPayload` and `CopyEventPayload`.

## Listening for Events

The core uses `on(event, handler)`, which returns an **unsubscribe** function.
Each binding surfaces the same two events in its idiomatic way:

::: code-group

```ts [Vanilla]
import { JsonViewer } from '@anil-labs/json-viewer-core';
import '@anil-labs/json-viewer-core/styles.css';
import type {
  ToggleEventPayload,
  CopyEventPayload,
} from '@anil-labs/json-viewer-core';

const viewer = new JsonViewer({
  target: document.querySelector('#app')!,
  data: { user: { name: 'Ada', roles: ['admin', 'editor'] } },
});

const offToggle = viewer.on('toggle', (e: ToggleEventPayload) => {
  console.log(`${e.expanded ? 'expanded' : 'collapsed'} ${e.path}`);
});

const offCopy = viewer.on('copy', (e: CopyEventPayload) => {
  console.log(`copied ${e.path}`, e.value);
});

// Later: stop listening.
offToggle();
offCopy();
```

```tsx [React]
<JsonViewer
  data={data}
  onToggle={(e) => console.log(e.path, e.expanded)}
  onCopy={(e) => console.log(e.path, e.value)}
/>
```

```vue [Vue]
<JsonViewer
  :data="data"
  @toggle="(e) => console.log(e.path, e.expanded)"
  @copy="(e) => console.log(e.path, e.value)"
/>
```

```svelte [Svelte]
<div
  use:jsonViewer={{
    data,
    onToggle: (e) => console.log(e.path, e.expanded),
    onCopy: (e) => console.log(e.path, e.value),
  }}
/>
```

```tsx [Solid]
<JsonViewer
  data={data}
  onToggle={(e) => console.log(e.path, e.expanded)}
  onCopy={(e) => console.log(e.path, e.value)}
/>
```

```ts [Web Component]
const el = document.querySelector('json-viewer')!;
el.data = data;
// The element re-dispatches the events as `jv:toggle` / `jv:copy`;
// the payload is on `event.detail`.
el.addEventListener('jv:toggle', (e) => console.log(e.detail.path, e.detail.expanded));
el.addEventListener('jv:copy', (e) => console.log(e.detail.path, e.detail.value));
```

:::

## Payload Types

```ts
interface ToggleEventPayload {
  /** JSONPath-style path of the toggled node, e.g. `$.address` or `$.items[0]`. */
  path: string;
  /** Key/index of the toggled node within its parent (`''` for the root). */
  key: string;
  /** The node's new expanded state. */
  expanded: boolean;
}

interface CopyEventPayload {
  /** JSONPath-style path of the copied node. */
  path: string;
  /** Key/index of the copied node within its parent (`''` for the root). */
  key: string;
  /** The copied value (the same reference shown in the tree). */
  value: JsonValue;
}
```

## Understanding `path`

Every node has a stable, JSONPath-style `path` that uniquely identifies it in
the tree:

| Node                          | `path`            |
| ----------------------------- | ----------------- |
| Root                          | `$`               |
| Object key `address`          | `$.address`       |
| Nested key `city`             | `$.address.city`  |
| Array item at index 0         | `$.items[0]`      |
| Non-identifier key `order.id` | `$["order.id"]`   |

Identifier-safe keys use dot notation; any other key is bracket-quoted so a key
containing a `.` can never be confused with a nested path. Because the path is
unique and stable, it's the ideal key for storing view state.

## Persisting Expand/Collapse State

Expand/collapse state already **persists across collapse/re-expand within a
single `JsonViewer` instance**  you don't need events for that (see
[Expand & Collapse](/guide/expand-collapse)).

Use the `toggle` event when you want state to survive something bigger  a route
change, a remount, or a page reload  by recording it yourself and replaying it
with `toggle()` on the next mount:

```ts
import { JsonViewer } from '@anil-labs/json-viewer-core';
import '@anil-labs/json-viewer-core/styles.css';

// Restore any previously-saved state.
const saved: Record<string, boolean> = JSON.parse(
  localStorage.getItem('jv-state') ?? '{}',
);

const viewer = new JsonViewer({
  target: document.querySelector('#app')!,
  data: {
    /* … */
  },
});

// Replay saved overrides.
for (const [path, expanded] of Object.entries(saved)) {
  if (viewer.isExpanded(path) !== expanded) viewer.toggle(path);
}

// Record future changes.
viewer.on('toggle', (e) => {
  saved[e.path] = e.expanded;
  localStorage.setItem('jv-state', JSON.stringify(saved));
});
```

::: warning Expand All / Collapse All don't emit per node
The root "Expand All" / "Collapse All" controls  and the `expandAll()` /
`collapseAll()` / `setExpandedDefault()` methods  reset the shared baseline in
one operation and do **not** emit a `toggle` for each node. Listen for those
buttons separately if you need to react to them.
:::

## Auditing Copies

The `copy` event is handy for analytics or to show a toast. It fires **only
after** the value is successfully written to the clipboard:

```ts
viewer.on('copy', (e) => {
  // e.g. show a notification
  console.log(`Copied ${e.key || 'root'} (${e.path})`);
});
```

::: tip Copy only fires on success
If the copy fails  for example a value that can't be serialized, or a blocked
clipboard  no `copy` event is emitted and the button's icon does not change.
:::
