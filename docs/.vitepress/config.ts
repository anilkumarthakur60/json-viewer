import { defineConfig } from 'vitepress'

const REPO = 'https://github.com/anilkumarthakur60/json-viewer'
const DEMOS = 'https://anil-labs-json-viewer.vercel.app'

export default defineConfig({
  base: process.env.DOCS_BASE ?? '/',
  lang: 'en-US',
  title: '@anil-labs/json-viewer',
  description:
    'A framework-agnostic JSON tree viewer  persistent expand/collapse, syntax-highlighted data types, dark/light themes, typed events and copy-to-clipboard. One core engine, and bindings for React, Vue, Svelte, Solid and a Web Component.',
  cleanUrls: true,
  lastUpdated: true,
  head: [['meta', { name: 'theme-color', content: '#3b82f6' }]],
  themeConfig: {
    nav: [
      { text: 'Guide', link: '/guide/getting-started' },
      { text: 'Frameworks', link: '/frameworks/vanilla' },
      { text: 'Reference', link: '/reference/api' },
      { text: 'Demos', link: DEMOS },
    ],
    sidebar: [
      {
        text: 'Guide',
        items: [
          { text: 'Getting Started', link: '/guide/getting-started' },
          { text: 'Data Types', link: '/guide/data-types' },
          { text: 'Expand & Collapse', link: '/guide/expand-collapse' },
          { text: 'Events', link: '/guide/events' },
          { text: 'Theming', link: '/guide/theming' },
        ],
      },
      {
        text: 'Frameworks',
        items: [
          { text: 'Vanilla / Core', link: '/frameworks/vanilla' },
          { text: 'React', link: '/frameworks/react' },
          { text: 'Vue', link: '/frameworks/vue' },
          { text: 'Svelte', link: '/frameworks/svelte' },
          { text: 'Solid', link: '/frameworks/solid' },
          { text: 'Web Component', link: '/frameworks/web-component' },
        ],
      },
      {
        text: 'Reference',
        items: [{ text: 'API', link: '/reference/api' }],
      },
    ],
    socialLinks: [{ icon: 'github', link: REPO }],
    editLink: {
      pattern: `${REPO}/edit/main/docs/:path`,
      text: 'Edit this page on GitHub',
    },
    search: {
      provider: 'local',
    },
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2026 Er. Anil Kumar Thakur',
    },
  },
})
