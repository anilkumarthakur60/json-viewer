import { createEffect, createSignal, For, Show } from 'solid-js'
import { JsonViewer } from '@anil-labs/json-viewer-solid'
import type { CopyEventPayload, ToggleEventPayload } from '@anil-labs/json-viewer-core'
import { demoData } from './seed'

type LogEntry = { kind: string; detail: string }

export default function App() {
  const [dark, setDark] = createSignal(true)
  const [expanded, setExpanded] = createSignal(true)
  const [log, setLog] = createSignal<LogEntry[]>([])

  const push = (kind: string, detail: string): void => {
    setLog((prev) => [{ kind, detail }, ...prev].slice(0, 40))
  }

  const onToggle = (p: ToggleEventPayload): void => push(p.expanded ? 'expand' : 'collapse', p.path)

  const onCopy = (p: CopyEventPayload): void =>
    push('copy ✓', `${p.path} → ${JSON.stringify(p.value)}`)

  // Reflect the chrome theme onto the document so the whole page flips too.
  createEffect(() => {
    document.documentElement.dataset.theme = dark() ? 'dark' : 'light'
  })

  // A keyed remount: whenever the theme or expand-all state changes we
  // re-seed the viewer so the new defaults apply to every node at once.
  const viewerKey = (): string => `${dark() ? 'dark' : 'light'}:${expanded() ? 'open' : 'closed'}`

  return (
    <main class="page">
      <div class="hero">
        <span class="badge">SolidJS</span>
        <h1>@anil-labs/json-viewer</h1>
        <p class="tag">
          A framework-agnostic JSON tree viewer  expand/collapse with persistent state, syntax
          highlighting, rainbow brackets, type badges and copy-to-clipboard. One core engine, every
          framework binding.
        </p>
      </div>

      <div class="toolbar">
        <button type="button" onClick={() => setDark((d) => !d)}>
          {dark() ? '☾ Dark' : '☀ Light'}
        </button>
        <button type="button" onClick={() => setExpanded(true)} disabled={expanded()}>
          Expand all
        </button>
        <button type="button" onClick={() => setExpanded(false)} disabled={!expanded()}>
          Collapse all
        </button>
      </div>

      <div class="panel">
        <Show when={viewerKey()} keyed>
          {() => (
            <JsonViewer
              data={demoData}
              darkMode={dark()}
              expanded={expanded()}
              onToggle={onToggle}
              onCopy={onCopy}
            />
          )}
        </Show>
      </div>

      <section class="log-wrap">
        <h2>Events</h2>
        <div class="log">
          <Show
            when={log().length > 0}
            fallback={<div class="empty">Toggle a node or copy a value…</div>}
          >
            <For each={log()}>
              {(row) => (
                <div class="log-row">
                  <span class="k">{row.kind}</span> {row.detail}
                </div>
              )}
            </For>
          </Show>
        </div>
      </section>

      <footer>
        The same <code>@anil-labs/json-viewer-core</code> engine powers every framework binding.{' '}
        <a href="https://github.com/anilkumarthakur60/json-viewer">View source on GitHub</a>
      </footer>
    </main>
  )
}
