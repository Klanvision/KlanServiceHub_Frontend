import { hc } from 'hono/client';
import { getBackendApiUrl } from './config.js';
import { getAuthToken } from './api-client.js';

export const client = hc(getBackendApiUrl(), {
    fetch: (input, init = {}) => {
        const token = getAuthToken();
        const headers = new Headers(init.headers || {});
        if (token && !headers.has('Authorization')) {
            headers.set('Authorization', `Bearer ${token}`);
            headers.set('x-session-token', token);
        }
        return fetch(input, { ...init, headers, credentials: 'include' });
    }
});
