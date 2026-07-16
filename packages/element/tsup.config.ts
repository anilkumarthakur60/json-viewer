import { defineConfig } from 'tsup'

export default defineConfig([
  {
    entry: ['src/index.ts'],
    format: ['esm', 'cjs'],
    dts: true,
    sourcemap: true,
    clean: true,
    target: 'es2020',
    external: ['@anil-labs/json-viewer-core'],
  },
  {
    // Self-contained IIFE for CDN <script> use (bundles the core).
    entry: { index: 'src/index.ts' },
    format: ['iife'],
    globalName: 'JsonViewerElement',
    sourcemap: true,
    target: 'es2020',
  },
])
