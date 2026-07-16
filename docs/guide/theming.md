# Dark / Light Mode

`@anil-labs/json-viewer` ships two built-in themes: a Catppuccin-inspired dark
palette (the default) and a bright, high-contrast light palette. Switch between
them with the `darkMode` option — no CSS variables to wire up.

## Basic Usage

`darkMode` defaults to `true`. Pass `false` for the light theme:

::: code-group

```ts [Vanilla]
import { JsonViewer } from '@anil-labs/json-viewer-core';
import '@anil-labs/json-viewer-core/styles.css';

const viewer = new JsonViewer({
  target: document.querySelector('#app')!,
  data: { message: 'Hello World', count: 42, active: true },
  darkMode: true,
});

// Flip themes later:
viewer.setDarkMode(false);
```

```tsx [React]
<JsonViewer data={data} darkMode={isDark} />
```

```vue [Vue]
<JsonViewer :data="data" :dark-mode="isDark" />
```

```svelte [Svelte]
<div use:jsonViewer={{ data, darkMode: isDark }} />
```

```tsx [Solid]
<JsonViewer data={data} darkMode={isDark()} />
```

```html [Web Component]
<json-viewer dark-mode="false"></json-viewer>
```

:::

## A Live Dark / Light Toggle

In vanilla JS, call `setDarkMode()` from a button. Every binding pushes changes
to its `darkMode` prop straight through to this method:

```ts
import { JsonViewer } from '@anil-labs/json-viewer-core';
import '@anil-labs/json-viewer-core/styles.css';

const data = {
  message: 'Hello World',
  count: 42,
  active: true,
  nested: { colors: ['green', 'peach', 'yellow'] },
};

let dark = true;
const viewer = new JsonViewer({
  target: document.querySelector('#app')!,
  data,
  darkMode: dark,
});

document.querySelector('#toggle-theme')!.addEventListener('click', () => {
  dark = !dark;
  viewer.setDarkMode(dark);
});
```

## Dark Mode (Default)

A Catppuccin-inspired palette:

- **Background** — gradient `#1e1e2e → #2d2d3f`
- **Text** — `#cdd6f4`
- **Strings** — `#a6e3a1` · **Numbers** — `#fab387` · **Booleans** — `#f9e2af`
- **Null / undefined** — `#f38ba8`

## Light Mode

A clean, high-contrast palette:

- **Background** — gradient `#f8f9fa → #e9ecef`
- **Text** — `#343a40`
- **Strings** — `#2f9e44` · **Numbers** — `#e8590c` · **Booleans** — `#f59f00`
- **Null / undefined** — `#e03131`

## Full Color Reference

### Dark Mode

| Data Type       | Color   | Hex       |
| --------------- | ------- | --------- |
| String          | Green   | `#a6e3a1` |
| Number          | Peach   | `#fab387` |
| Boolean         | Yellow  | `#f9e2af` |
| Null / undefined | Pink   | `#f38ba8` |
| Date            | Teal    | `#94e2d5` |
| RegExp          | Mauve   | `#cba6f7` |
| Object Key      | Pink    | `#f5c2e7` |
| Array Key       | Blue    | `#89b4fa` |
| Empty Container | Overlay | `#9399b2` |
| Default Text    | Text    | `#cdd6f4` |

### Light Mode

| Data Type       | Color  | Hex       |
| --------------- | ------ | --------- |
| String          | Green  | `#2f9e44` |
| Number          | Orange | `#e8590c` |
| Boolean         | Amber  | `#f59f00` |
| Null / undefined | Red   | `#e03131` |
| Date            | Teal   | `#0c8599` |
| RegExp          | Purple | `#7048e8` |
| Object Key      | Pink   | `#c2255c` |
| Array Key       | Blue   | `#1971c2` |
| Empty Container | Gray   | `#868e96` |
| Default Text    | Text   | `#343a40` |

## Rainbow Nesting

Bracket colors cycle through six hues by nesting depth, so you can always tell
which level you're on:

- **Dark:** Pink → Peach → Yellow → Green → Sky → Mauve
- **Light:** Red → Orange → Amber → Green → Cyan → Purple

## How the Theme Is Applied

The viewer renders its **own DOM and its own `jv-*` classes** — there is no
Shadow DOM. The theme is expressed two ways:

- The root element carries `jv-node jv-root` plus a theme class:
  **`jv-dark`** or **`jv-light`**.
- Each value carries a type class with a theme suffix, e.g. `jv-string
  jv-string-dark`, `jv-number jv-number-light`, `jv-null jv-null-dark`.

That means the whole tree re-themes the moment the root class flips. Value and
key colors that vary per node (object keys, rainbow brackets) are applied
inline from the built-in palette above.

```html
<!-- Simplified structure the engine produces in dark mode -->
<div class="jv-node jv-root jv-dark">
  <div class="jv-row">
    <span class="jv-key">"name"</span>
    <span class="jv-colon">: </span>
    <span class="jv-string jv-string-dark">"Ada"</span>
  </div>
</div>
```

## Custom Colors

There is **no color-theme option** yet. To recolor values, override the themed
`jv-*` classes in your own (global) CSS — using `!important` where an inline
color would otherwise win:

```css
.jv-string-dark {
  color: #7ee787 !important;
}

.jv-root {
  border-radius: 12px;
}
```

::: tip Scope your overrides
Pass `className` (or the `class-name` attribute on the Web Component) to add an
extra class to the viewer root, then scope your CSS to it — e.g.
`.my-viewer .jv-string-dark { … }`.
:::
