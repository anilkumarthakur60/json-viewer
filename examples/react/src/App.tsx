import { useEffect, useState } from 'react'
import { JsonViewer } from '@anil-labs/json-viewer-react'
import type { CopyEventPayload, ToggleEventPayload } from '@anil-labs/json-viewer-core'
import { demoData } from './seed'

interface LogEntry {
  id: number
  kind: string
  detail: string
}

let nextId = 0

export default function App() {
  const [dark, setDark] = useState(true)
  const [expanded, setExpanded] = useState(true)
  const [log, setLog] = useState<LogEntry[]>([])

  const push = (kind: string, detail: string): void => {
    setLog((prev) => [{ id: nextId++, kind, detail }, ...prev].slice(0, 40))
  }

  const onToggle = (p: ToggleEventPayload): void => push(p.expanded ? 'expand' : 'collapse', p.path)

  const onCopy = (p: CopyEventPayload): void =>
    push('copy ✓', `${p.path} → ${JSON.stringify(p.value)}`)

  // Reflect the chrome theme onto the document so the whole page flips too.
  useEffect(() => {
    document.documentElement.dataset.theme = dark ? 'dark' : 'light'
  }, [dark])

  // `darkMode` and `expanded` are pushed into the engine reactively. The
  // Expand/Collapse buttons are disabled when the state already matches, so
  // every click is a real transition that re-applies to every node at once.
  return (
    <main className="page">
      <div className="hero">
        <span className="badge">React</span>
        <h1>@anil-labs/json-viewer</h1>
        <p className="tag">
          A framework-agnostic JSON tree viewer — expand/collapse with persistent state, syntax
          highlighting, rainbow brackets, type badges and copy-to-clipboard. One core engine, every
          framework binding.
        </p>
      </div>

      <div className="toolbar">
        <button type="button" onClick={() => setDark((d) => !d)}>
          {dark ? '☾ Dark' : '☀ Light'}
        </button>
        <button type="button" onClick={() => setExpanded(true)} disabled={expanded}>
          Expand all
        </button>
        <button type="button" onClick={() => setExpanded(false)} disabled={!expanded}>
          Collapse all
        </button>
      </div>

      <div className="panel">
        <JsonViewer
          data={demoData}
          darkMode={dark}
          expanded={expanded}
          onToggle={onToggle}
          onCopy={onCopy}
        />
      </div>

      <section className="log-wrap">
        <h2>Events</h2>
        <div className="log">
          {log.length === 0 ? (
            <div className="empty">Toggle a node or copy a value…</div>
          ) : (
            log.map((row) => (
              <div className="log-row" key={row.id}>
                <span className="k">{row.kind}</span> {row.detail}
              </div>
            ))
          )}
        </div>
      </section>

      <footer>
        The same <code>@anil-labs/json-viewer-core</code> engine powers every framework binding.{' '}
        <a href="https://github.com/anilkumarthakur60/json-viewer">View source on GitHub</a>
      </footer>
    </main>
  )
}
