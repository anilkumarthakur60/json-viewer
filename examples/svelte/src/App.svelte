<script lang="ts">
  import { jsonViewer } from '@anil-labs/json-viewer-svelte'
  import type {
    JsonViewerActionOptions,
    ToggleEventPayload,
    CopyEventPayload,
  } from '@anil-labs/json-viewer-svelte'
  import { demoData } from './seed'

  type LogEntry = { kind: string; detail: string }

  let darkMode = $state(true)
  let expanded = $state(true)
  let log = $state<LogEntry[]>([])

  const push = (kind: string, detail: string): void => {
    log = [{ kind, detail }, ...log].slice(0, 40)
  }

  // The action re-runs its `update` whenever this derived object changes, so the
  // dark/light toggle and Expand-All / Collapse-All buttons drive the viewer by
  // simply flipping reactive state.
  const options: JsonViewerActionOptions = $derived({
    data: demoData,
    darkMode,
    expanded,
    onToggle: (p: ToggleEventPayload) =>
      push('toggle', `${p.path} → ${p.expanded ? 'expanded' : 'collapsed'}`),
    onCopy: (p: CopyEventPayload) => push('copy ✓', `copied ${p.path}`),
  })
</script>

<main class="page" class:dark={darkMode} class:light={!darkMode}>
  <div class="hero">
    <span class="badge">Svelte 5 · runes · use:action</span>
    <h1>@anil-labs/json-viewer</h1>
    <p class="tag">
      A framework-agnostic JSON tree viewer — expand/collapse, syntax highlighting, rainbow
      brackets, type badges, dark/light themes and copy-to-clipboard. Rendered here with the
      <code>use:jsonViewer</code> Svelte action.
    </p>
  </div>

  <div class="toolbar">
    <button type="button" class="btn" onclick={() => (darkMode = !darkMode)}>
      {darkMode ? '☀️ Light mode' : '🌙 Dark mode'}
    </button>
    <button type="button" class="btn" onclick={() => (expanded = true)}>Expand all</button>
    <button type="button" class="btn" onclick={() => (expanded = false)}>Collapse all</button>
  </div>

  <div class="panel">
    <div use:jsonViewer={options}></div>
  </div>

  <section class="log-wrap">
    <h2>Events</h2>
    <div class="log">
      {#if log.length === 0}
        <div class="empty">Toggle a node or copy a value…</div>
      {:else}
        {#each log as row}
          <div class="log-row"><span class="k">{row.kind}</span> {row.detail}</div>
        {/each}
      {/if}
    </div>
  </section>

  <footer>
    The same <code>@anil-labs/json-viewer-core</code> engine powers every framework binding.
    <a href="https://github.com/anilkumarthakur60/json-viewer">View source on GitHub</a>
  </footer>
</main>
