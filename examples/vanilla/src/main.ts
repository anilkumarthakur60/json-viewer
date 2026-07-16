import { JsonViewer } from '@anil-labs/json-viewer-core'
import type { CopyEventPayload, ToggleEventPayload } from '@anil-labs/json-viewer-core'
import '@anil-labs/json-viewer-core/styles.css'
import './style.css'
import { demoData } from './seed'

const $ = <T extends Element = HTMLElement>(sel: string): T => document.querySelector(sel) as T

let darkMode = true

// The core viewer renders its own DOM into `target`. We drive expand/collapse
// and theme through its imperative API, so the built-in root controls are off.
const viewer = new JsonViewer({
  data: demoData,
  target: $('#viewer'),
  darkMode,
  rootControls: false,
})

$<HTMLButtonElement>('#expand-all').addEventListener('click', () => viewer.expandAll())
$<HTMLButtonElement>('#collapse-all').addEventListener('click', () => viewer.collapseAll())

const themeBtn = $<HTMLButtonElement>('#toggle-theme')
const applyTheme = (): void => {
  viewer.setDarkMode(darkMode)
  document.body.classList.toggle('theme-dark', darkMode)
  document.body.classList.toggle('theme-light', !darkMode)
  themeBtn.textContent = darkMode ? 'Light theme' : 'Dark theme'
}
themeBtn.addEventListener('click', () => {
  darkMode = !darkMode
  applyTheme()
})
applyTheme()

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

viewer.on('toggle', (p: ToggleEventPayload) => log(p.expanded ? 'expand' : 'collapse', p.path))
viewer.on('copy', (p: CopyEventPayload) => log('copy', `${p.path} — ${JSON.stringify(p.value)}`))
