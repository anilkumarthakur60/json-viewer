import type { JsonValue } from './types'

/**
 * Copies text via a hidden `<textarea>` and legacy `execCommand('copy')`.
 * Fallback for when the async Clipboard API is unavailable (insecure context or
 * older browser). Returns whether the copy succeeded; never throws.
 */
const legacyCopyText = (text: string): boolean => {
  if (typeof document === 'undefined') return false

  const textarea = document.createElement('textarea')
  textarea.value = text
  textarea.setAttribute('readonly', '')
  textarea.style.position = 'fixed'
  textarea.style.top = '-9999px'
  textarea.style.left = '-9999px'
  document.body.appendChild(textarea)

  const selection = document.getSelection()
  const previousRange = selection && selection.rangeCount > 0 ? selection.getRangeAt(0) : null

  textarea.select()

  let succeeded = false
  try {
    succeeded = document.execCommand('copy') === true
  } catch {
    // execCommand can throw in some browsers; leave succeeded as false.
  }

  document.body.removeChild(textarea)

  if (selection && previousRange) {
    selection.removeAllRanges()
    selection.addRange(previousRange)
  }

  return succeeded
}

/**
 * Serializes a JSON value and copies it to the clipboard. Resolves to `true` on
 * success and `false` on any failure (circular reference, missing Clipboard API,
 * rejected write). Falls back to `execCommand('copy')` when needed.
 */
export const copyJsonToClipboard = async (data: JsonValue): Promise<boolean> => {
  let text: string
  try {
    const serialized = JSON.stringify(data, null, 2)
    // JSON.stringify yields undefined only for a top-level function / undefined.
    text = serialized ?? (typeof data === 'function' ? data.toString() : 'undefined')
  } catch {
    return false
  }

  if (
    typeof navigator !== 'undefined' &&
    navigator.clipboard &&
    typeof navigator.clipboard.writeText === 'function'
  ) {
    try {
      await navigator.clipboard.writeText(text)
      return true
    } catch {
      // Permission denied or insecure context  try the legacy fallback.
    }
  }

  return legacyCopyText(text)
}
