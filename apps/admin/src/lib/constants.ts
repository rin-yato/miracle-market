import { dev } from '$app/environment';

const apiUrl = dev
  ? 'http://localhost:3005'
  : 'https://market.just-miracle.space';

export const appConfigs = {
  api: {
    url: apiUrl,
    googleAuth: `${apiUrl}/auth/google`,
  },
};
