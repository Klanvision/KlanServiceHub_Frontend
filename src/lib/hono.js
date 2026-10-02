import { hc } from 'hono/client';

const baseUrl =
    (typeof import.meta !== 'undefined' && import.meta.env && (import.meta.env.VITE_API_URL || import.meta.env.NEXT_PUBLIC_API_URL || import.meta.env.VITE_APP_BASE_URL)) ||
    (typeof process !== 'undefined' && process.env && (process.env.VITE_API_URL || process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_APP_BASE_URL)) ||
    'https://klanservicehub-backend.klanservicehub.workers.dev';

export const client = hc(baseUrl, {
    fetch: (input, init) => fetch(input, { ...init, credentials: 'include' })
});
