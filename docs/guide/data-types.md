# Data Types

`JsonViewer` renders far more than plain JSON. It understands every JavaScript
value you are likely to inspect while debugging  including `Date`, `RegExp`,
`undefined`, and functions  and gives each its own color, type badge, and
formatting.

## Supported Types

| Value       | Rendered as                   | Dark color   | Light color  |
| ----------- | ----------------------------- | ------------ | ------------ |
| `string`    | `"value"` (quoted)            | Green        | Green        |
| `number`    | `42`, `-2.75`                 | Peach        | Orange       |
| `boolean`   | `true` / `false`              | Yellow       | Amber        |
| `null`      | `null` (italic)               | Pink         | Red          |
| `undefined` | `undefined` (italic)          | Pink         | Red          |
| `Date`      | ISO string, e.g. `"2024-…Z"`  | Teal         | Teal         |
| `RegExp`    | `/pattern/flags`              | Mauve        | Purple       |
| `function`  | its `toString()`              | Default text | Default text |
| `object`    | expandable `{ … }` + `obj` badge  | Pink key  | Pink key     |
| `array`     | expandable `[ … ]` + count badge  | Blue key  | Blue key     |

See [Dark / Light Mode](/guide/theming) for the exact hex values behind each
color.

## Example Data

Every supported type in one object:

```ts
import { JsonViewer } from '@anil-labs/json-viewer-core';
import '@anil-labs/json-viewer-core/styles.css';

new JsonViewer({
  target: document.querySelector('#app')!,
  data: {
    string: 'hello world',
    number: 42,
    float: -2.757,
    booleanTrue: true,
    booleanFalse: false,
    nullValue: null,
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    pattern: /[a-z]+/gi,
    emptyString: '',
    emptyArray: [],
    emptyObject: {},
    array: [1, 2, 3],
    nested: { a: { b: 'deep' } },
  },
});
```

## How Values Are Formatted

The formatting logic is deterministic:

- **Strings** are wrapped in double quotes: `"John"`.
- **Numbers** and **booleans** print their literal form: `42`, `true`.
- **Dates** are serialized with `.toISOString()` and quoted.
- **RegExp** uses its literal form via `.toString()`, e.g. `/[0-9]/gi`.
- **`null` and `undefined`** are shown in *italics* to distinguish "empty" from
  a real value.
- **Functions** display their source via `.toString()`.

```ts
// Effectively what the formatter produces
formatValue(null); // "null"
formatValue(undefined); // "undefined"
formatValue('hi'); // "\"hi\""
formatValue(42); // "42"
formatValue(new Date('2024-01-01')); // "\"2024-01-01T00:00:00.000Z\""
formatValue(/[a-z]+/gi); // "/[a-z]+/gi"
```

::: tip `formatValue` is exported
The core exports the same `formatValue` helper it uses internally, along with
type guards like `isJsonDate` and `isJsonRegExp`, if you want to format values
the same way elsewhere.
:::

## Containers & Badges

Objects and arrays are expandable and carry a small type badge. When collapsed
they also show a size label:

| Type        | Badge   | Collapsed example              |
| ----------- | ------- | ------------------------------ |
| Object      | `obj`   | `"user": obj {...} 3 keys`     |
| Array       | count   | `"items": 5 [...] 5 items`     |
| Empty array | `empty` | `"list": empty []`             |

- Object badges always read **`obj`**.
- Array badges show the **item count** (`5`)  or **`empty`** when the array has
  no items.
- The count label is singular for one child: `1 key`, `1 item`.

## Empty Containers

Empty objects and arrays render inline and are **not** expandable  there is
nothing to open, so no toggle or count label appears:

- Empty object → `obj {}`
- Empty array → `empty []`

Their keys are also dimmed to a muted overlay color to signal emptiness.

## Colors & Keys

Every value gets a themed color, and **keys are colored to match the type of
their value**  so an object key is pink, an array key is blue, a string key is
green, and so on. Nested brackets cycle through a six-color rainbow by depth.
The complete palette lives in [Dark / Light Mode](/guide/theming).

::: tip Non-plain objects
Values like `Map`, `Set`, or class instances are treated as plain objects and
enumerated with `Object.entries()`. A `Map` has no enumerable own properties, so
it renders as an empty object. For predictable output, convert such values to
plain objects/arrays before passing them in.
:::

## TypeScript

The full value type is exported as `JsonValue`:

```ts
import type { JsonValue } from '@anil-labs/json-viewer-core';

const data: JsonValue = {
  createdAt: new Date(),
  pattern: /[0-9]+/,
  tags: ['a', 'b'],
  handler: () => {},
};
```

`JsonValue` is the union of everything the viewer can render:

```ts
type JsonPrimitive = string | number | boolean | null | undefined;

type JsonValue =
  | JsonPrimitive
  | JsonObject
  | JsonArray
  | Date
  | RegExp
  | ((...args: unknown[]) => unknown);
```
