# @anil-labs/json-viewer

A **framework-agnostic JSON tree viewer** — expand/collapse with persistent per-node state, syntax highlighting, rainbow brackets, type badges, dark/light themes and per-node copy-to-clipboard. A zero-dependency core renders its own DOM, with thin bindings for **React, Vue, Svelte, Solid** and a **Web Component**.

## Packages

| Package | What it is |
| --- | --- |
| [`@anil-labs/json-viewer-core`](packages/core) | The engine — vanilla TS, renders its own DOM + ships `styles.css`. Zero dependencies. |
| [`@anil-labs/json-viewer-react`](packages/react) | React hook + `<JsonViewer>` component |
| [`@anil-labs/json-viewer-vue`](packages/vue) | Vue 3 `<JsonViewer>` component + composable |
| [`@anil-labs/json-viewer-svelte`](packages/svelte) | Svelte action + controller |
| [`@anil-labs/json-viewer-solid`](packages/solid) | Solid `<JsonViewer>` component + primitive |
| [`@anil-labs/json-viewer-element`](packages/element) | `<json-viewer>` custom element |

## Quick start

Install the core (or a framework binding) and import the stylesheet once:

```bash
pnpm add @anil-labs/json-viewer-core
```

```ts
import { JsonViewer } from '@anil-labs/json-viewer-core'
import '@anil-labs/json-viewer-core/styles.css'

const viewer = new JsonViewer({
  data: { name: 'Ada', skills: ['math', 'code'], active: true, meta: null },
  target: document.querySelector('#app')!,
})

viewer.on('copy', ({ path, value }) => console.log('copied', path, value))
```

### React

```tsx
import { JsonViewer } from '@anil-labs/json-viewer-react'
import '@anil-labs/json-viewer-core/styles.css'

export default () => <JsonViewer data={data} darkMode onCopy={(p) => console.log(p)} />
```

## Features

- **Recursive rendering** of objects, arrays and primitives — plus `Date`, `RegExp` and functions.
- **Persistent expand/collapse** — a path-keyed store means a nested collapse survives an ancestor collapse + re-expand. Expand-All / Collapse-All controls included.
- **Syntax highlighting** — distinct colors per type, key colors by value type, and rainbow brackets by nesting depth.
- **Type badges** (`obj` / item count) and collapsed count labels (`3 keys`, `5 items`).
- **Copy to clipboard** per node, with a legacy `execCommand` fallback, and a `copy` event.
- **Dark & light themes** (Catppuccin-inspired dark, bright light).
- **`toggle` / `copy` events**, SSR-safe construction, keyboard-operable toggles, HTML-escaped output.

## Development

```bash
pnpm install
pnpm build        # build every package
pnpm test         # run unit tests
pnpm typecheck
pnpm lint
pnpm docs:dev     # run the docs site
```

## License

MIT © Er. Anil Kumar Thakur
