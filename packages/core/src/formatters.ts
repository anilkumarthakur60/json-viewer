import type { JsonValue, ContainerKind } from './types'
import {
  isJsonNull,
  isJsonUndefined,
  isJsonString,
  isJsonBoolean,
  isJsonNumber,
  isJsonDate,
  isJsonRegExp,
  isJsonFunction,
} from './type-guards'

/** Matches keys safe to serialize with dot notation (`$.foo`). */
const SAFE_KEY = /^[A-Za-z_$][A-Za-z0-9_$]*$/

/**
 * Builds a unique, JSONPath-style path for a child node. Identifier-safe object
 * keys use dot notation (`$.address.city`); anything else is bracket-quoted
 * (`$["a.b"]`). Array items use bracket-index notation (`$.items[0]`).
 */
export function buildChildPath(basePath: string, key: string, isArrayItem: boolean): string {
  if (isArrayItem) return `${basePath}[${key}]`
  return SAFE_KEY.test(key) ? `${basePath}.${key}` : `${basePath}[${JSON.stringify(key)}]`
}

/** Formats a JSON value into its display string representation. */
export const formatValue = (value: JsonValue): string => {
  if (isJsonNull(value)) return 'null'
  if (isJsonUndefined(value)) return 'undefined'
  if (isJsonString(value)) return `"${value}"`
  if (isJsonBoolean(value)) return value ? 'true' : 'false'
  if (isJsonNumber(value)) return String(value)
  if (isJsonDate(value)) return `"${value.toISOString()}"`
  if (isJsonRegExp(value)) return value.toString()
  if (isJsonFunction(value)) return value.toString()
  // Only containers remain here; formatValue is only rendered for primitives.
  return Array.isArray(value) ? '[…]' : '{…}'
}

/** CSS class string for a value based on its type and theme mode. */
export const getValueCssClass = (value: JsonValue, darkMode: boolean): string => {
  const suffix = darkMode ? '-dark' : '-light'
  if (isJsonNull(value) || isJsonUndefined(value)) return `jv-null jv-null${suffix}`
  if (isJsonString(value)) return `jv-string jv-string${suffix}`
  if (isJsonNumber(value)) return `jv-number jv-number${suffix}`
  if (isJsonBoolean(value)) return `jv-boolean jv-boolean${suffix}`
  if (isJsonDate(value)) return `jv-date jv-date${suffix}`
  if (isJsonRegExp(value)) return `jv-regexp jv-regexp${suffix}`
  return darkMode ? 'jv-value-dark' : 'jv-value-light'
}

/** Open/close bracket pair for a container kind. */
export const getBrackets = (kind: ContainerKind): readonly [string, string] =>
  kind === 'object' ? ['{', '}'] : ['[', ']']

/** Badge content text for a container header. */
export const getBadgeContent = (kind: ContainerKind, isEmpty: boolean, size: number): string =>
  kind === 'object' ? 'obj' : isEmpty ? 'empty' : String(size)

/** Collapsed count label, e.g. `3 keys` or `5 items`. */
export const getCountLabel = (kind: ContainerKind, size: number): string => {
  const unit = kind === 'object' ? 'key' : 'item'
  return `${size} ${size === 1 ? unit : `${unit}s`}`
}
