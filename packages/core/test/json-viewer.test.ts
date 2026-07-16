import { describe, it, expect, beforeEach, vi } from 'vitest'
import { JsonViewer } from '../src'
import type { CopyEventPayload, JsonViewerOptions, ToggleEventPayload } from '../src'

const sample = {
  name: 'John',
  age: 30,
  active: true,
  tags: ['a', 'b'],
  address: { city: 'NYC', zip: '10001' },
  nothing: null,
}

const mount = (opts: Partial<JsonViewerOptions> = {}): JsonViewer => {
  const host = document.createElement('div')
  document.body.append(host)
  return new JsonViewer({ data: sample, target: host, ...opts })
}

describe('JsonViewer', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
  })

  it('renders keys and values and is dark by default', () => {
    const jv = mount()
    expect(jv.el.classList.contains('jv-dark')).toBe(true)
    expect(jv.el.innerHTML).toContain('"name"')
    expect(jv.el.innerHTML).toContain('"John"')
    expect(jv.el.querySelector('.jv-root-controls')).not.toBeNull()
    jv.destroy()
  })

  it('renders the light theme when darkMode is false', () => {
    const jv = mount({ darkMode: false })
    expect(jv.el.classList.contains('jv-light')).toBe(true)
    jv.destroy()
  })

  it('a nested collapse survives an ancestor collapse+expand', () => {
    const jv = mount()
    jv.toggle('$.address')
    expect(jv.isExpanded('$.address')).toBe(false)
    jv.toggle('$')
    jv.toggle('$')
    expect(jv.isExpanded('$.address')).toBe(false)
    jv.destroy()
  })

  it('expandAll / collapseAll flip the baseline', () => {
    const jv = mount()
    jv.collapseAll()
    expect(jv.isExpanded('$')).toBe(false)
    expect(jv.isExpanded('$.address')).toBe(false)
    jv.expandAll()
    expect(jv.isExpanded('$')).toBe(true)
    expect(jv.isExpanded('$.address')).toBe(true)
    jv.destroy()
  })

  it('emits toggle with the node path, key and new state', () => {
    const jv = mount()
    let payload: ToggleEventPayload | null = null
    jv.on('toggle', (p) => (payload = p))
    jv.toggle('$.address', 'address')
    expect(payload).toEqual({ path: '$.address', key: 'address', expanded: false })
    jv.destroy()
  })

  it('copies a value and emits copy', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(globalThis.navigator, 'clipboard', {
      value: { writeText },
      configurable: true,
    })
    const jv = mount()
    let copied: CopyEventPayload | null = null
    jv.on('copy', (p) => (copied = p))
    const copyBtn = jv.el.querySelector<HTMLButtonElement>('[data-action="copy"]')
    copyBtn?.click()
    await new Promise((r) => setTimeout(r, 0))
    expect(writeText).toHaveBeenCalled()
    expect(copied).not.toBeNull()
    jv.destroy()
  })

  it('setData re-renders with the new data', () => {
    const jv = mount()
    jv.setData({ hello: 'world' })
    expect(jv.el.innerHTML).toContain('"hello"')
    expect(jv.el.innerHTML).toContain('"world"')
    jv.destroy()
  })

  it('renders arrays with an item count badge when collapsed', () => {
    const jv = mount({ data: [1, 2, 3], expanded: false })
    expect(jv.el.innerHTML).toContain('3 items')
    jv.destroy()
  })
})
