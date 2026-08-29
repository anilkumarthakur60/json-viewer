---
layout: home

hero:
  name: "@anil-labs/json-viewer"
  text: "A JSON tree viewer for any framework"
  tagline: Persistent expand/collapse, syntax-highlighted data types, dark & light themes, typed events and one-click copy  one core engine, and bindings for React, Vue, Svelte, Solid and a Web Component.
  actions:
    - theme: brand
      text: Get Started
      link: /guide/getting-started
    - theme: alt
      text: Frameworks
      link: /frameworks/vanilla
    - theme: alt
      text: Live Demos
      link: https://anil-labs-json-viewer.vercel.app

features:
  - icon: 🌳
    title: Framework-agnostic core
    details: One JsonViewer engine renders the tree in plain TypeScript. Every binding is a thin wrapper over the same core  no duplicated logic.
  - icon: 🎨
    title: Syntax-highlighted types
    details: Strings, numbers, booleans, null, objects and arrays are each styled distinctly, so deeply nested structures stay easy to scan.
  - icon: 🌙
    title: Dark & light themes
    details: Flip a single darkMode flag to switch the whole tree between built-in dark and light palettes. No external theme files.
  - icon: 🔄
    title: Persistent expand/collapse
    details: Node state is keyed by path and survives collapsing an ancestor  plus expandAll, collapseAll and per-node toggle helpers.
  - icon: 📡
    title: Typed events
    details: Listen to toggle and copy with fully typed payloads (path, key, expanded/value) to sync or persist your view state.
  - icon: 📋
    title: Copy to clipboard
    details: One-click copy on any node or value, with a graceful fallback for non-secure contexts.
  - icon: 🧩
    title: Five bindings + Web Component
    details: React, Vue, Svelte and Solid wrappers, a framework-free <json-viewer> custom element, and the raw core  all over one engine.
  - icon: 🎯
    title: Typed, zero-any
    details: Written in strict TypeScript with exported JsonValue, JsonViewerOptions and event payload types  no any in the public API.
---

## Quick Start

Install the core engine:

```bash
npm i @anil-labs/json-viewer-core
```

Import the stylesheet once, then mount a viewer:

```ts
import { JsonViewer } from '@anil-labs/json-viewer-core'
import '@anil-labs/json-viewer-core/styles.css'

const data = {
  name: 'Ada Lovelace',
  age: 36,
  languages: ['Ada', 'Analytical Engine'],
  active: true,
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

Prefer a framework wrapper? Every binding takes the same options and emits the
same events  pick yours from the [Frameworks](/frameworks/vanilla) guides.

## Why @anil-labs/json-viewer?

| Feature                   | Description                                                     |
| ------------------------- | --------------------------------------------------------------- |
| 🌳 **One engine**         | The core renders the tree; bindings only wire it to your view   |
| 🧠 **State that persists**| Expand/collapse is keyed by path and survives collapsing a parent |
| 🚀 **Efficient**          | Collapsed subtrees aren't rendered at all                       |
| 🔧 **Themeable**          | darkMode, expanded and className options; CSS variables for the rest |
| 📦 **Zero dependencies**  | The core ships with no runtime dependencies                     |
