import { hc } from 'hono/client';

const getBaseUrl = () => {
    if (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_URL) {
        return import.meta.env.VITE_API_URL.replace(/\/+$/, '');
    }
    if (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_API_URL) {
        return process.env.NEXT_PUBLIC_API_URL.replace(/\/+$/, '');
    }
    if (typeof window !== 'undefined' && window.location?.origin) {
        return window.location.origin;
    }
    if (typeof import.meta !== 'undefined' && import.meta.env?.VITE_APP_BASE_URL) {
        return import.meta.env.VITE_APP_BASE_URL.replace(/\/+$/, '');
    }
    if (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_APP_BASE_URL) {
        return process.env.NEXT_PUBLIC_APP_BASE_URL.replace(/\/+$/, '');
    }
    return 'http://localhost:5000';
};

export const client = hc(getBaseUrl(), {
    fetch: (input, init) => fetch(input, { ...init, credentials: 'include' })
});
