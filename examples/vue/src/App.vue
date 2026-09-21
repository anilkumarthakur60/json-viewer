<script setup lang="ts">
import { ref } from 'vue'
import { JsonViewer } from '@anil-labs/json-viewer-vue'
import type { CopyEventPayload, ToggleEventPayload } from '@anil-labs/json-viewer-vue'
import { demoData } from './seed'

const dark = ref(true)
const allExpanded = ref(true)

interface LogEntry {
  id: number
  kind: string
  detail: string
}

const log = ref<LogEntry[]>([])
let nextId = 0

const push = (kind: string, detail: string): void => {
  log.value = [{ id: nextId++, kind, detail }, ...log.value].slice(0, 40)
}

const onToggle = (payload: ToggleEventPayload): void => {
  push('toggle', `${payload.path} → ${payload.expanded ? 'expanded' : 'collapsed'}`)
}

const onCopy = (payload: CopyEventPayload): void => {
  push('copy ✓', `${payload.path}  ${JSON.stringify(payload.value)}`)
}

const toggleTheme = (): void => {
  dark.value = !dark.value
}

const expandAll = (): void => {
  allExpanded.value = true
}

const collapseAll = (): void => {
  allExpanded.value = false
}
</script>

<template>
  <main class="page" :class="{ light: !dark }">
    <div class="hero">
      <span class="badge">Vue · &lt;JsonViewer&gt;</span>
      <h1>@anil-labs/json-viewer</h1>
      <p class="tag">
        A framework-agnostic JSON tree viewer expand/collapse, syntax highlighting, rainbow
        brackets, type badges, dark/light themes and copy-to-clipboard. Zero backend, all in the
        browser.
      </p>
    </div>

    <div class="toolbar">
      <button type="button" class="btn" @click="toggleTheme">
        {{ dark ? '☾ Dark' : '☀ Light' }}
      </button>
      <button type="button" class="btn" @click="expandAll">Expand All</button>
      <button type="button" class="btn" @click="collapseAll">Collapse All</button>
    </div>

    <div class="panel">
      <JsonViewer
        :data="demoData"
        :dark-mode="dark"
        :expanded="allExpanded"
        :root-controls="false"
        @toggle="onToggle"
        @copy="onCopy"
      />
    </div>

    <section class="log-wrap">
      <h2>Events</h2>
      <div class="log">
        <div v-if="log.length === 0" class="empty">Toggle a node or copy a value…</div>
        <div v-for="entry in log" :key="entry.id" class="log-row">
          <span class="k">{{ entry.kind }}</span> {{ entry.detail }}
        </div>
      </div>
    </section>

    <footer>
      The same <code>@anil-labs/json-viewer-core</code> engine powers every framework binding.
      <a href="https://github.com/anilkumarthakur60/json-viewer">View source on GitHub</a>
    </footer>
  </main>
</template>
