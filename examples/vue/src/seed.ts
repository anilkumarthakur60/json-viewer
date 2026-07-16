import type { JsonObject } from '@anil-labs/json-viewer-core'

/**
 * A rich sample document exercising every value kind the viewer renders:
 * strings, numbers, booleans, null, nested objects, arrays of strings,
 * arrays of objects and a deeply-nested structure.
 */
export const demoData: JsonObject = {
  id: 4815162342,
  username: 'ada.lovelace',
  displayName: 'Ada Lovelace',
  email: 'ada@analytical-engine.io',
  active: true,
  verified: false,
  balance: 1284.75,
  loginCount: 0,
  lastLogin: null,
  bio: 'Mathematician · first programmer · writes notes longer than the paper.',
  roles: ['owner', 'admin', 'billing', 'developer'],
  address: {
    street: '12 Analytical Way',
    city: 'London',
    postcode: 'EC1A 1BB',
    country: 'United Kingdom',
    geo: {
      lat: 51.5155,
      lng: -0.0922,
    },
  },
  orders: [
    {
      ref: 'ORD-1001',
      total: 249.99,
      paid: true,
      items: ['keyboard', 'mouse'],
    },
    {
      ref: 'ORD-1002',
      total: 19.5,
      paid: false,
      items: ['usb-c cable'],
    },
  ],
  settings: {
    theme: 'system',
    density: 'comfortable',
    experimental: null,
    notifications: {
      email: true,
      sms: false,
      push: {
        enabled: true,
        quietHours: {
          from: '22:00',
          to: '07:00',
          channels: ['marketing', 'digest'],
        },
      },
    },
  },
  tags: [],
  metadata: {},
}
