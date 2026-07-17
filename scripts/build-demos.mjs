// Builds every framework example into dist-demos/<name>/ so the whole set can
// be deployed to Vercel as one static site (linked from docs as "Demos").
import { execSync } from 'node:child_process'
import { mkdirSync, rmSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const outDir = resolve(root, 'dist-demos')

const demos = [
  { dir: 'vanilla', title: 'Vanilla / Core' },
  { dir: 'react', title: 'React' },
  { dir: 'vue', title: 'Vue' },
  { dir: 'svelte', title: 'Svelte' },
  { dir: 'solid', title: 'Solid' },
  { dir: 'element', title: 'Web Component' },
]

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

writeFileSync(resolve(outDir, 'index.html'), landingPage())
console.log('> Demos written to dist-demos/')

function landingPage() {
  const items = demos
    .map((d) => `      <li><a href="/${d.dir}/">${d.title}</a></li>`)
    .join('\n')
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>@anil-labs/json-viewer — Demos</title>
  </head>
  <body>
    <h1>@anil-labs/json-viewer — Live Demos</h1>
    <ul>
${items}
    </ul>
  </body>
</html>
`
}
