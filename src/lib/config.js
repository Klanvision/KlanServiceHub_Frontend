/**
 * Unified Frontend Configuration & Single Source of Truth for URLs
 * 
 * Changing VITE_API_URL or NEXT_PUBLIC_API_URL in .env automatically updates
 * all API requests, auth endpoints, Hono RPC clients, and assets.
 */

export const getBackendApiUrl = () => {
  // 1. Explicit Vite Environment Variable (Primary)
  if (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_URL) {
    return import.meta.env.VITE_API_URL.replace(/\/+$/, '');
  }

  // 2. Next.js / Process Environment Variable (Compatibility)
  if (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL.replace(/\/+$/, '');
  }
  if (typeof import.meta !== 'undefined' && import.meta.env?.NEXT_PUBLIC_API_URL) {
    return import.meta.env.NEXT_PUBLIC_API_URL.replace(/\/+$/, '');
  }

  // 3. Auto-detect production Cloudflare Pages hostname
  if (typeof window !== 'undefined' && window.location?.hostname?.endsWith('pages.dev')) {
    return 'https://klanservicehub-backend.klanservicehub.workers.dev';
  }

  // 4. Default for Local Development
  return 'http://localhost:5000';
};

export const getFrontendAppUrl = () => {
  if (typeof import.meta !== 'undefined' && import.meta.env?.VITE_APP_BASE_URL) {
    return import.meta.env.VITE_APP_BASE_URL.replace(/\/+$/, '');
  }
  if (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_APP_BASE_URL) {
    return process.env.NEXT_PUBLIC_APP_BASE_URL.replace(/\/+$/, '');
  }
  if (typeof window !== 'undefined' && window.location?.origin) {
    return window.location.origin;
  }
  return 'https://klanservicehub-frontend.pages.dev';
};

export const API_BASE_URL = getBackendApiUrl();
export const APP_BASE_URL = getFrontendAppUrl();
