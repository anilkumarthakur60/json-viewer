import type { JsonObject } from '@anil-labs/json-viewer-core'

/**
 * A rich sample document — the same payload used by every framework demo.
 * It exercises strings, numbers, booleans, null, nested objects, arrays of
 * strings, arrays of objects and a deeply nested tree so the viewer can show
 * off expand/collapse, type colours, badges and copy-to-clipboard.
 */
export const demoData: JsonObject = {
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
    geo: {
      lat: 51.5074,
      lng: -0.1278,
    },
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
      schedule: {
        quietHours: {
          from: '22:00',
          to: '07:00',
          days: ['sat', 'sun'],
        },
      },
    },
  },
  metrics: {
    commits: 12873,
    followers: 45210,
    ratios: [0.12, 0.48, 0.91, 1],
  },
}
