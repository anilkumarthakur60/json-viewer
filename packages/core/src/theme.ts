import type { JsonValue } from './types'
import {
  isJsonNull,
  isJsonUndefined,
  isJsonString,
  isJsonNumber,
  isJsonBoolean,
  isJsonDate,
  isJsonRegExp,
  isJsonArray,
  isJsonObject,
} from './type-guards'

interface ColorPalette {
  readonly null: string
  readonly string: string
  readonly number: string
  readonly boolean: string
  readonly date: string
  readonly regexp: string
  readonly arrayEmpty: string
  readonly array: string
  readonly objectEmpty: string
  readonly object: string
  readonly default: string
}

const DARK_PALETTE: ColorPalette = {
  null: '#f38ba8',
  string: '#a6e3a1',
  number: '#fab387',
  boolean: '#f9e2af',
  date: '#94e2d5',
  regexp: '#cba6f7',
  arrayEmpty: '#9399b2',
  array: '#89b4fa',
  objectEmpty: '#9399b2',
  object: '#f5c2e7',
  default: '#cdd6f4',
}

const LIGHT_PALETTE: ColorPalette = {
  null: '#e03131',
  string: '#2f9e44',
  number: '#e8590c',
  boolean: '#f59f00',
  date: '#0c8599',
  regexp: '#7048e8',
  arrayEmpty: '#868e96',
  array: '#1971c2',
  objectEmpty: '#868e96',
  object: '#c2255c',
  default: '#343a40',
}

const DARK_BRACKET_COLORS: readonly string[] = [
  '#f38ba8',
  '#fab387',
  '#f9e2af',
  '#a6e3a1',
  '#89dceb',
  '#cba6f7',
]

const LIGHT_BRACKET_COLORS: readonly string[] = [
  '#e03131',
  '#e8590c',
  '#f59f00',
  '#2f9e44',
  '#1098ad',
  '#7048e8',
]

/** Key color based on the value's type and theme mode. */
export const getKeyColor = (value: JsonValue, darkMode: boolean): string => {
  const palette = darkMode ? DARK_PALETTE : LIGHT_PALETTE
  if (isJsonNull(value) || isJsonUndefined(value)) return palette.null
  if (isJsonString(value)) return palette.string
  if (isJsonNumber(value)) return palette.number
  if (isJsonBoolean(value)) return palette.boolean
  if (isJsonDate(value)) return palette.date
  if (isJsonRegExp(value)) return palette.regexp
  if (isJsonArray(value)) return value.length === 0 ? palette.arrayEmpty : palette.array
  if (isJsonObject(value))
    return Object.keys(value).length === 0 ? palette.objectEmpty : palette.object
  return palette.default
}

/** Rainbow bracket color for a nesting level (6-color cycle). */
export const getBracketColor = (level: number, darkMode: boolean): string => {
  const colors = darkMode ? DARK_BRACKET_COLORS : LIGHT_BRACKET_COLORS
  return colors[level % colors.length] ?? colors[0] ?? '#cdd6f4'
}
