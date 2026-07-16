import type { JsonValue } from '@anil-labs/json-viewer-core'

/**
 * A rich sample payload — strings, numbers, booleans, null, a nested object
 * (address), an array of strings (roles), an array of objects (orders) and a
 * deeply nested structure (metadata.nested). Enough to show off expand/collapse,
 * type colors and badges.
 */
export const demoData: JsonValue = {
  id: 42,
  name: 'Ada Lovelace',
  email: 'ada@analytical-engine.dev',
  active: true,
  premium: false,
  deletedAt: null,
  balance: 1289.75,
  roles: ['admin', 'engineer', 'author'],
  address: {
    street: '12 Analytical Ave',
    city: 'London',
    postcode: 'EC1A 1BB',
    country: 'UK',
    coordinates: { lat: 51.5074, lng: -0.1278 },
  },
  orders: [
    {
      id: 'ord_1001',
      total: 249.99,
      paid: true,
      items: [
        { sku: 'KB-01', name: 'Mechanical Keyboard', qty: 1, price: 149.99 },
        { sku: 'MS-07', name: 'Wireless Mouse', qty: 2, price: 50.0 },
      ],
    },
    {
      id: 'ord_1002',
      total: 19.99,
      paid: false,
      items: [{ sku: 'CB-usbc', name: 'USB-C Cable', qty: 1, price: 19.99 }],
    },
  ],
  settings: {
    theme: 'dark',
    notifications: { email: true, sms: false, push: true },
    experiments: ['new-dashboard', 'fast-checkout'],
  },
  metadata: {
    createdAt: '1815-12-10T00:00:00.000Z',
    tags: ['pioneer', 'mathematician'],
    nested: {
      level1: {
        level2: {
          level3: {
            level4: ['deep', 'structure', { done: true, count: 3 }],
          },
        },
      },
    },
  },
}
