// Builds every framework example into dist-demos/<name>/ so the whole set can
// be deployed to Vercel as one static site (linked from docs as "Demos"). The
// landing page embeds the actual built engine and renders a real instance of
// it, rather than describing the product from the outside.
import { execSync } from 'node:child_process'
import { copyFileSync, mkdirSync, rmSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const outDir = resolve(root, 'dist-demos')
const REPO = 'https://github.com/anilkumarthakur60/json-viewer'

// Brand colors are each framework's own established identity color  used so
// a visitor can scan the grid by color the way they'd recognize a framework's
// own logo, not as arbitrary decoration.
const bindings = [
  {
    dir: 'react',
    title: 'React',
    brand: '#61dafb',
    desc: '<code>useJsonViewer</code>, a hook that mounts the engine on a ref.',
  },
  {
    dir: 'vue',
    title: 'Vue',
    brand: '#42b883',
    desc: '<code>useJsonViewer</code>, a composable that mounts the engine in <code>onMounted</code>.',
  },
  {
    dir: 'svelte',
    title: 'Svelte',
    brand: '#ff3e00',
    desc: 'A <code>jsonViewer</code> action  put it on a <code>&lt;div&gt;</code>, get a tree.',
  },
  {
    dir: 'solid',
    title: 'Solid',
    brand: '#2c4f7c',
    desc: 'A component that mounts the engine inside <code>createEffect</code>.',
  },
  {
    dir: 'element',
    title: 'Web Component',
    brand: '#e34f26',
    desc: 'A <code>&lt;json-viewer&gt;</code> custom element  drop it in any page.',
  },
]

const demos = [{ dir: 'vanilla', title: 'Vanilla / Core' }, ...bindings]

function run(command, cwd) {
  execSync(command, { cwd, stdio: 'inherit' })
}

rmSync(outDir, { recursive: true, force: true })
mkdirSync(outDir, { recursive: true })

console.log('> Building workspace packages')
run('pnpm --filter "./packages/*" -r build', root)

for (const demo of demos) {
  const base = `/${demo.dir}/`
  const exampleDir = resolve(root, 'examples', demo.dir)
  const target = resolve(outDir, demo.dir)
  console.log(`> Building ${demo.dir} demo`)
  run(`pnpm exec vite build --base=${base} --outDir "${target}" --emptyOutDir`, exampleDir)
}

console.log('> Copying engine build for the landing page')
const engineDir = resolve(outDir, '_engine')
mkdirSync(engineDir, { recursive: true })
copyFileSync(
  resolve(root, 'packages/core/dist/index.global.js'),
  resolve(engineDir, 'json-viewer.js'),
)
copyFileSync(resolve(root, 'packages/core/dist/styles.css'), resolve(engineDir, 'styles.css'))

// The same payload every framework example renders  reused here so the
// landing page's live widget shows the identical data every demo link leads to.
const demoData = {
  id: 42,
  name: 'Ada Lovelace',
  handle: '@ada',
  active: true,
  verified: false,
  balance: 1284.75,
  rank: null,
  joinedAt: '2019-03-14T09:26:53Z',
  address: {
    street: '12 Analytical Way',
    city: 'London',
    postalCode: 'EC1A 1BB',
    country: 'UK',
    geo: { lat: 51.5074, lng: -0.1278 },
  },
  roles: ['admin', 'author', 'reviewer'],
  tags: ['pioneer', 'mathematician', 'writer'],
  projects: [
    {
      id: 'p-001',
      title: 'Analytical Engine notes',
      stars: 1843,
      archived: false,
      collaborators: ['babbage', 'menabrea'],
    },
    {
      id: 'p-002',
      title: 'Bernoulli number algorithm',
      stars: 9720,
      archived: false,
      collaborators: [],
    },
  ],
  settings: {
    theme: 'dark',
    notifications: {
      email: true,
      push: false,
      channels: ['security', 'billing'],
      schedule: { quietHours: { from: '22:00', to: '07:00', days: ['sat', 'sun'] } },
    },
  },
  metrics: { commits: 12873, followers: 45210, ratios: [0.12, 0.48, 0.91, 1] },
}

function bindingCard(b) {
  return `        <a class="card" href="/${b.dir}/" style="--brand:${b.brand}">
          <span class="card-title">${b.title}</span>
          <span class="card-desc">${b.desc}</span>
        </a>`
}

function landingPage() {
  return `<!doctype html>
<html lang="en" style="color-scheme: dark">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
    <meta name="theme-color" content="#14141f" />
    <title>@anil-labs/json-viewer  Live Demos</title>
    <link rel="stylesheet" href="/_engine/styles.css" />
    <style>
      :root {
        --bg: #14141f;
        --panel: #1e1e2e;
        --text: #cdd6f4;
        --muted: #7f849c;
        --accent: #89b4fa;
        --accent-warm: #f9e2af;
        --mono: 'JetBrains Mono', ui-monospace, 'SFMono-Regular', Menlo, Consolas, monospace;
      }
      * { box-sizing: border-box; }
      h1, h2, p, a, code { overflow-wrap: anywhere; }
      html, body { margin: 0; padding: 0; }
      body {
        background: var(--bg);
        color: var(--text);
        font-family: var(--mono);
        overflow-x: hidden;
        min-height: 100vh;
      }
      a { color: inherit; }
      code {
        font-family: var(--mono);
        background: rgba(137, 180, 250, 0.12);
        color: var(--accent);
        padding: 0.1em 0.35em;
        border-radius: 4px;
        font-size: 0.92em;
      }
      .topbar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 14px 24px;
        border-bottom: 1px solid rgba(205, 214, 244, 0.08);
      }
      .topbar-brand {
        display: flex;
        align-items: center;
        gap: 8px;
        min-width: 0;
        font-size: 13px;
        color: var(--muted);
        overflow-wrap: anywhere;
      }
      .topbar-dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: var(--accent);
        box-shadow: 0 0 8px var(--accent);
      }
      .topbar-link {
        flex-shrink: 0;
        font-size: 13px;
        text-decoration: none;
        color: var(--muted);
        transition: color 0.15s ease;
      }
      .topbar-link:hover,
      .topbar-link:focus-visible { color: var(--accent); }
      main {
        max-width: 880px;
        margin: 0 auto;
        padding: 56px 24px 80px;
      }
      .eyebrow {
        margin: 0 0 12px;
        font-size: 12px;
        letter-spacing: 0.08em;
        color: var(--accent-warm);
      }
      .title {
        margin: 0 0 16px;
        font-size: clamp(24px, 7vw, 42px);
        font-weight: 700;
        letter-spacing: -0.01em;
        line-height: 1.15;
        overflow-wrap: anywhere;
      }
      .tagline {
        margin: 0 0 32px;
        max-width: 56ch;
        font-size: 15px;
        line-height: 1.6;
        color: var(--muted);
        overflow-wrap: anywhere;
      }
      .panel {
        border-radius: 10px;
        overflow: hidden;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.35);
        border: 1px solid rgba(205, 214, 244, 0.08);
      }
      .panel .jv-root {
        max-height: 60vh;
        overflow: auto;
      }
      .caption {
        margin: 14px 0 48px;
        font-size: 13px;
        color: var(--muted);
      }
      .section-label {
        margin: 0 0 18px;
        font-size: 14px;
        font-weight: 600;
        color: var(--text);
      }
      .grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 14px;
      }
      .card-eyebrow {
        display: block;
        font-size: 11px;
        letter-spacing: 0.08em;
        color: var(--accent);
        margin-bottom: 2px;
      }
      .card {
        display: flex;
        flex-direction: column;
        gap: 6px;
        padding: 16px 18px;
        border-radius: 10px;
        border: 1px solid rgba(205, 214, 244, 0.1);
        border-left: 3px solid var(--brand, var(--accent));
        background: var(--panel);
        text-decoration: none;
        transition: border-color 0.15s ease, transform 0.15s ease;
      }
      .card:hover,
      .card:focus-visible {
        border-color: var(--brand, var(--accent));
        transform: translateY(-2px);
      }
      .card.card-engine {
        background: rgba(137, 180, 250, 0.06);
        border-left-color: var(--accent);
      }
      .card-title { font-size: 15px; font-weight: 600; }
      .card-desc { font-size: 13px; color: var(--muted); line-height: 1.5; }
      footer {
        max-width: 880px;
        margin: 0 auto;
        padding: 0 24px 48px;
        font-size: 12px;
        color: var(--muted);
      }
      footer a { color: var(--muted); text-decoration: underline; }
      footer a:hover, footer a:focus-visible { color: var(--accent); }
      :focus-visible {
        outline: 2px solid var(--accent);
        outline-offset: 2px;
      }
      @media (max-width: 760px) {
        .grid { grid-template-columns: repeat(2, 1fr); }
      }
      @media (max-width: 480px) {
        .grid { grid-template-columns: 1fr; }
      }
      @media (prefers-reduced-motion: no-preference) {
        .reveal {
          animation: reveal 0.4s ease both;
        }
        .reveal:nth-child(1) { animation-delay: 0ms; }
        .reveal:nth-child(2) { animation-delay: 60ms; }
        .reveal:nth-child(3) { animation-delay: 120ms; }
        .reveal:nth-child(4) { animation-delay: 180ms; }
      }
      @keyframes reveal {
        from { opacity: 0; transform: translateY(6px); }
        to { opacity: 1; transform: translateY(0); }
      }
    </style>
  </head>
  <body>
    <div class="topbar">
      <span class="topbar-brand"><span class="topbar-dot"></span>anil-labs/json-viewer</span>
      <a class="topbar-link" href="${REPO}">source ↗</a>
    </div>
    <main>
      <p class="eyebrow reveal">live demos</p>
      <h1 class="title reveal">@anil-labs/json-viewer</h1>
      <p class="tagline reveal">
        A framework-agnostic JSON tree viewer. What's below isn't a screenshot 
        it's the actual built package, rendering real data.
      </p>

      <div class="panel reveal">
        <div id="viewer"></div>
      </div>
      <p class="caption">
        Click a row to expand or collapse it. Every value has its own copy button.
      </p>

      <h2 class="section-label">see it in your framework</h2>
      <div class="grid">
        <a class="card card-engine" href="/vanilla/">
          <span class="card-eyebrow">the engine</span>
          <span class="card-title">Vanilla / Core</span>
          <span class="card-desc">No wrapper  construct <code>JsonViewer</code> directly and it renders its own DOM.</span>
        </a>
${bindings.map(bindingCard).join('\n')}
      </div>
    </main>
    <footer>MIT Licensed · <a href="${REPO}/tree/main/docs">Documentation</a></footer>
    <script src="/_engine/json-viewer.js"></script>
    <script>
      new JsonViewer.JsonViewer({
        data: ${JSON.stringify(demoData, null, 2)},
        target: document.getElementById('viewer'),
        darkMode: true,
        expanded: true,
        rootControls: true,
        copyable: true,
      })
    </script>
  </body>
</html>
`
}

writeFileSync(resolve(outDir, 'index.html'), landingPage())
console.log('> Demos written to dist-demos/')
