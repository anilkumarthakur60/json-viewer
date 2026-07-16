import type { JsonValue } from '@anil-labs/json-viewer-core'

/**
 * A rich demo document that exercises every renderer path:
 * strings, numbers, booleans, null, nested objects, arrays of strings,
 * arrays of objects and a deeply nested structure.
 */
export const demoData = {
  id: 1024,
  name: 'Ada Lovelace',
  active: true,
  verified: false,
  nickname: null,
  balance: 2481.75,
  loginCount: 87,
  roles: ['admin', 'engineer', 'author'],
  tags: ['pioneer', 'mathematics', 'computing'],
  address: {
    street: '12 Analytical Ave',
    city: 'London',
    postcode: 'W1A 1AA',
    country: 'UK',
    geo: { lat: 51.5074, lng: -0.1278 },
  },
  projects: [
    { id: 'p-1', title: 'Analytical Engine', stars: 1843, archived: false },
    { id: 'p-2', title: 'Note G', stars: 512, archived: true },
    { id: 'p-3', title: 'Bernoulli Numbers', stars: 274, archived: false },
  ],
  settings: {
    theme: 'dark',
    locale: 'en-GB',
    notifications: {
      email: true,
      sms: false,
      push: { marketing: false, security: true, digest: null },
    },
    experimental: {
      features: ['rainbow-brackets', 'copy-path', 'persistent-state'],
      limits: { maxDepth: 12, maxNodes: 5000, maxStringLength: 2048 },
    },
  },
  createdAt: '1843-10-01T00:00:00.000Z',
} satisfies JsonValue
