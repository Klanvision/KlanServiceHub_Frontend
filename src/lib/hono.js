import { hc } from 'hono/client';
import { getBackendApiUrl } from './config.js';

export const client = hc(getBackendApiUrl(), {
    fetch: (input, init) => fetch(input, { ...init, credentials: 'include' })
});
