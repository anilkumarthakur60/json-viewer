# Getting Started

`@anil-labs/json-viewer` is a beautiful, framework-agnostic JSON tree viewer.
A single vanilla-JS engine renders an interactive, syntax-highlighted tree for
any JSON-like value, and thin official bindings wrap it for React, Vue, Svelte,
Solid, and the DOM as a Web Component  ideal for debugging panels, API
explorers, admin tools, and docs.

## Features

- 🧩 **Framework-agnostic**  one engine, official React / Vue / Svelte / Solid / Web Component bindings
- 🎨 **Beautiful UI**  gradient backgrounds and per-type syntax highlighting
- 🌙 **Dark & light mode**  switchable with a single option
- 📦 **TypeScript-first**  authored in TS with complete, exported types
- 🔄 **Persistent expand/collapse**  per-node state, keyed by a stable path
- 📡 **Typed events**  `toggle` and `copy` with typed payloads
- 📋 **Copy to clipboard**  one click, with a fallback for non-secure contexts
- 🌈 **Rainbow nesting**  color-coded bracket levels

## Packages

Everything renders through the core engine. Pick the binding that matches your
stack  each one depends on the core, and the **stylesheet always lives in the
core package**.

| Package                          | Use with            |
| -------------------------------- | ------------------- |
| `@anil-labs/json-viewer-core`    | Vanilla JS / TS     |
| `@anil-labs/json-viewer-react`   | React 17 – 19       |
| `@anil-labs/json-viewer-vue`     | Vue 3.3+            |
| `@anil-labs/json-viewer-svelte`  | Svelte 4 / 5        |
| `@anil-labs/json-viewer-solid`   | Solid 1.8+          |
| `@anil-labs/json-viewer-element` | Any page (`<json-viewer>`) |

## Installation

Install the core plus the binding for your framework. Vanilla usage needs only
the core.

::: code-group

```bash [Vanilla]
npm install @anil-labs/json-viewer-core
```

```bash [React]
npm install @anil-labs/json-viewer-react @anil-labs/json-viewer-core
```

```bash [Vue]
npm install @anil-labs/json-viewer-vue @anil-labs/json-viewer-core
```

```bash [Svelte]
npm install @anil-labs/json-viewer-svelte @anil-labs/json-viewer-core
```

```bash [Solid]
npm install @anil-labs/json-viewer-solid @anil-labs/json-viewer-core
```

```bash [Web Component]
npm install @anil-labs/json-viewer-element @anil-labs/json-viewer-core
```

:::

::: tip Any package manager works
`pnpm add`, `yarn add`, and `bun add` accept the same package names.
:::

## Import the Stylesheet

The engine renders plain DOM but ships its CSS separately, so it is **never**
injected automatically. Import it **once**, anywhere in your app, from the core
package  every binding shares it:

```ts
import '@anil-labs/json-viewer-core/styles.css';
```

## Minimal Usage

The core accepts a single options object:
`new JsonViewer({ data, darkMode?, expanded?, rootControls?, copyable?, className?, target? })`.
Each binding forwards the same options as props, attributes, or action
parameters.

::: code-group

```ts [Vanilla]
import { JsonViewer } from '@anil-labs/json-viewer-core';
import '@anil-labs/json-viewer-core/styles.css';

const data = {
  name: '@anil-labs/json-viewer',
  version: '1.0.0',
  features: ['dark mode', 'expand/collapse', 'events', 'copy'],
};

new JsonViewer({
  data,
  target: document.querySelector('#app')!,
  darkMode: true,
});
```

```tsx [React]
import { JsonViewer } from '@anil-labs/json-viewer-react';
import '@anil-labs/json-viewer-core/styles.css';

const data = { name: 'Ada', roles: ['admin'] };

export function App() {
  return <JsonViewer data={data} darkMode expanded />;
}
```

```vue [Vue]
<script setup lang="ts">
  import { JsonViewer } from '@anil-labs/json-viewer-vue';
  import '@anil-labs/json-viewer-core/styles.css';

  const data = { name: 'Ada', roles: ['admin'] };
</script>

<template>
  <JsonViewer
    :data="data"
    :dark-mode="true"
  />
</template>
```

```svelte [Svelte]
<script lang="ts">
  import { jsonViewer } from '@anil-labs/json-viewer-svelte';
  import '@anil-labs/json-viewer-core/styles.css';

  const data = { name: 'Ada', roles: ['admin'] };
</script>

<div use:jsonViewer={{ data, darkMode: true }} />
```

```tsx [Solid]
import { JsonViewer } from '@anil-labs/json-viewer-solid';
import '@anil-labs/json-viewer-core/styles.css';

const data = { name: 'Ada', roles: ['admin'] };

export function App() {
  return <JsonViewer data={data} darkMode />;
}
```

```ts [Web Component]
// Registers <json-viewer> on import.
import '@anil-labs/json-viewer-element';
import '@anil-labs/json-viewer-core/styles.css';

const el = document.querySelector('json-viewer')!;
el.data = { name: 'Ada', roles: ['admin'] };
```

:::

For the Web Component, place the element in your markup and assign `.data` as a
JS property (not an attribute):

```html
<json-viewer dark-mode="true"></json-viewer>
```

## Options at a Glance

| Option         | Type          | Default | Description                                     |
| -------------- | ------------- | ------- | ----------------------------------------------- |
| `data`         | `JsonValue`   |        | The value to display (required)                 |
| `darkMode`     | `boolean`     | `true`  | Use the dark theme                              |
| `expanded`     | `boolean`     | `true`  | Initial expanded state for every node           |
| `rootControls` | `boolean`     | `true`  | Show the Expand-All / Collapse-All bar          |
| `copyable`     | `boolean`     | `true`  | Show per-node copy buttons                      |
| `className`    | `string`      | `''`    | Extra class on the viewer root, for scoped CSS  |
| `target`       | `HTMLElement` |        | Host element to render into immediately (core)  |

## What's Next?

- [Data Types](/guide/data-types)  what each value looks like
- [Dark / Light Mode](/guide/theming)  themes and the color palettes
- [Expand & Collapse](/guide/expand-collapse)  persistent per-node state
- [Events](/guide/events)  react to toggles and copies
