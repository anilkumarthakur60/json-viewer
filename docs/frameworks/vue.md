# Vue

`@anil-labs/json-viewer-vue` wraps the core engine as a Vue 3 component and composable.

## Install

```bash
npm i @anil-labs/json-viewer-vue @anil-labs/json-viewer-core
```

The stylesheet lives in the core package  import it once, anywhere in your app:

```ts
import '@anil-labs/json-viewer-core/styles.css'
```

## Quick start

The `<JsonViewer>` component renders the tree inline. Options are passed as props (kebab-case in the
template); `toggle` and `copy` are emitted with the typed payloads:

```vue
<script setup lang="ts">
import { JsonViewer } from '@anil-labs/json-viewer-vue'
import type { ToggleEventPayload, CopyEventPayload } from '@anil-labs/json-viewer-vue'
import '@anil-labs/json-viewer-core/styles.css'

const data = {
  name: 'Ada Lovelace',
  age: 36,
  active: true,
  roles: ['admin', 'author'],
  address: { city: 'London', country: 'UK' },
  meta: null,
}

function onToggle(p: ToggleEventPayload) {
  console.log(p.path, p.expanded)
}
function onCopy(p: CopyEventPayload) {
  console.log('copied', p.path, p.value)
}
</script>

<template>
  <JsonViewer :data="data" :dark-mode="true" @toggle="onToggle" @copy="onCopy" />
</template>
```

### `<JsonViewer>` props & events

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `data` | `JsonValue` |  (required) | The JSON to display. |
| `dark-mode` | `boolean` | `true` | Use the dark theme (reactive  change it live to re-theme). |
| `expanded` | `boolean` | `true` | Baseline expanded state; flip it to expand/collapse everything. |
| `root-controls` | `boolean` | `true` | Show the built-in Expand-All / Collapse-All controls. |
| `copyable` | `boolean` | `true` | Show per-node copy buttons. |
| `class-name` | `string` |  | Extra class on the viewer root. |

| Event | Payload |
| --- | --- |
| `@toggle` | `ToggleEventPayload`  a node was expanded or collapsed. |
| `@copy` | `CopyEventPayload`  a node's value was copied. |

Because `dark-mode` and `expanded` are reactive props, a lively demo is just a couple of refs:

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { JsonViewer } from '@anil-labs/json-viewer-vue'

const dark = ref(true)
const expanded = ref(true)
</script>

<template>
  <div class="toolbar">
    <button @click="dark = !dark">Toggle theme</button>
    <button @click="expanded = true">Expand all</button>
    <button @click="expanded = false">Collapse all</button>
  </div>
  <JsonViewer :data="data" :dark-mode="dark" :expanded="expanded" :root-controls="false" />
</template>
```

## `useJsonViewer`

For full imperative control, use the composable. It builds the viewer on mount (SSR-safe) and
destroys it when the scope unmounts, returning a ref to the engine. Read `.el` or call `.mount(host)`
to place it in the DOM.

```vue
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useJsonViewer } from '@anil-labs/json-viewer-vue'

const host = ref<HTMLElement>()
const viewer = useJsonViewer({
  data,
  darkMode: true,
  onToggle: (p) => console.log('toggle', p.path),
})

onMounted(() => {
  if (host.value) viewer.value?.mount(host.value)
})
</script>

<template>
  <div class="toolbar">
    <button @click="viewer?.expandAll()">Expand all</button>
    <button @click="viewer?.collapseAll()">Collapse all</button>
    <button @click="viewer?.setDarkMode(false)">Light theme</button>
  </div>
  <div ref="host" />
</template>
```

### Returned controller

| Field | Type | Description |
| --- | --- | --- |
| `viewer` | `ShallowRef<JsonViewer \| null>` | The underlying engine (null until mounted). |

The composable accepts every [`JsonViewerOptions`](/reference/api#options) field plus the `onToggle`
and `onCopy` callbacks.
