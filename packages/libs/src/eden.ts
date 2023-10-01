import { edenTreaty } from '@elysiajs/eden';
import type { App } from 'api';

// @ts-expect-error false positive
export const eden = edenTreaty<App>('http://localhost:3005', {
  $fetch: {
    credentials: 'include',
    mode: 'cors',
  },
});
