import type { JsonValue, JsonObject, JsonArray } from './types'

export const isJsonNull = (value: JsonValue): value is null => value === null

export const isJsonUndefined = (value: JsonValue): value is undefined => value === undefined

export const isJsonString = (value: JsonValue): value is string => typeof value === 'string'

export const isJsonNumber = (value: JsonValue): value is number => typeof value === 'number'

export const isJsonBoolean = (value: JsonValue): value is boolean => typeof value === 'boolean'

export const isJsonDate = (value: JsonValue): value is Date => value instanceof Date

export const isJsonRegExp = (value: JsonValue): value is RegExp => value instanceof RegExp

export const isJsonFunction = (value: JsonValue): value is (...args: unknown[]) => unknown =>
  typeof value === 'function'

export const isJsonArray = (value: JsonValue): value is JsonArray => Array.isArray(value)

/** Plain objects only — excludes Date, RegExp, Array and functions. */
export const isJsonObject = (value: JsonValue): value is JsonObject =>
  value !== null &&
  typeof value === 'object' &&
  !Array.isArray(value) &&
  !(value instanceof Date) &&
  !(value instanceof RegExp)

/** Container types (object or array) that have expandable children. */
export const isContainer = (value: JsonValue): value is JsonObject | JsonArray =>
  isJsonObject(value) || isJsonArray(value)
