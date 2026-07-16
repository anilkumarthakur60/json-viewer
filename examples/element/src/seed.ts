import type { JsonValue } from '@anil-labs/json-viewer-element'

/**
 * A rich demo document — strings, numbers (int + float), booleans, null, a
 * nested object (address/geo), an array of strings, an array of objects and a
 * deeply nested structure. Enough to show expand/collapse, type colors and
 * badges across every value kind the viewer renders.
 */
export const demoData: JsonValue = {
  id: 'usr_10x9a2',
  name: 'Ada Lovelace',
  age: 36,
  active: true,
  premium: false,
  middleName: null,
  balance: 1428.75,
  joinedAt: '2019-03-14T08:30:00.000Z',
  address: {
    street: '12 Analytical Engine Way',
    city: 'London',
    postcode: 'EC1A 1BB',
    country: 'United Kingdom',
    geo: { lat: 51.5074, lng: -0.1278 },
  },
  roles: ['admin', 'engineer', 'author'],
  tags: ['mathematics', 'computing', 'poetry'],
  projects: [
    { id: 1, name: 'Analytical Engine', year: 1837, published: true, collaborators: 2 },
    { id: 2, name: 'Bernoulli Notes', year: 1843, published: true, collaborators: 0 },
    { id: 3, name: 'Note G', year: 1843, published: false, collaborators: null },
  ],
  settings: {
    theme: 'dark',
    notifications: { email: true, sms: false, push: true },
    limits: { maxProjects: 25, storageMb: 5120 },
  },
  metrics: {
    logins: 482,
    lastScore: 98.6,
    streak: [1, 1, 0, 1, 1, 1, 0],
    history: {
      '2024': { commits: 1204, reviews: 88 },
      '2025': { commits: 1657, reviews: 143, breakdown: { open: 12, merged: 131 } },
    },
  },
}
