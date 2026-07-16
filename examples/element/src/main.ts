import '@anil-labs/json-viewer-element'
import '@anil-labs/json-viewer-core/styles.css'
import './style.css'
import type {
  CopyEventPayload,
  JsonViewerElement,
  ToggleEventPayload,
} from '@anil-labs/json-viewer-element'
import { demoData } from './seed'

const $ = <T extends Element = HTMLElement>(sel: string): T => document.querySelector(sel) as T

// `data` is an arbitrary JS value, so it's set as a property (not an attribute).
const viewer = $<JsonViewerElement>('#viewer')
viewer.data = demoData

// --- Dark / light toggle -------------------------------------------------
// The element reads its theme from the `dark-mode` attribute; the page chrome
// follows via a `data-theme` on <html>.
let dark = true
const themeBtn = $<HTMLButtonElement>('#theme')
const applyTheme = (): void => {
  viewer.setAttribute('dark-mode', String(dark))
  document.documentElement.dataset.theme = dark ? 'dark' : 'light'
  themeBtn.textContent = dark ? 'Switch to light' : 'Switch to dark'
}
themeBtn.addEventListener('click', () => {
  dark = !dark
  applyTheme()
})
applyTheme()

// --- Expand / collapse controls -----------------------------------------
$<HTMLButtonElement>('#expand').addEventListener('click', () => viewer.expandAll())
$<HTMLButtonElement>('#collapse').addEventListener('click', () => viewer.collapseAll())

// --- Event log -----------------------------------------------------------
const logEl = $('#log')
let logged = false
const log = (kind: string, detail: string): void => {
  if (!logged) {
    logEl.innerHTML = ''
    logged = true
  }
  const row = document.createElement('div')
  row.className = 'log-row'
  row.innerHTML = `<span class="k">${kind}</span> ${detail}`
  logEl.prepend(row)
}

const eventDetail = <T>(e: Event): T => (e as CustomEvent<T>).detail

// `event.detail` carries the typed payload on every jv:* event.
viewer.addEventListener('jv:toggle', (e) => {
  const p = eventDetail<ToggleEventPayload>(e)
  log('toggle', `${p.path} → ${p.expanded ? 'expanded' : 'collapsed'}`)
})
viewer.addEventListener('jv:copy', (e) => {
  const p = eventDetail<CopyEventPayload>(e)
  log('copy ✓', `${p.path} = ${JSON.stringify(p.value)}`)
})
