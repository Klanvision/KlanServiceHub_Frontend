export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Forward API and health check requests directly to backend
    if (url.pathname.startsWith('/api/') || url.pathname === '/api' || url.pathname === '/health') {
      // 1. Direct Service Binding (Zero-latency internal worker-to-worker call)
      if (env?.BACKEND && typeof env.BACKEND.fetch === 'function') {
        return env.BACKEND.fetch(request);
      }

      // 2. Fallback to HTTPS fetch
      const backendBase =
        env?.BACKEND_URL ||
        env?.VITE_API_URL ||
        env?.NEXT_PUBLIC_API_URL ||
        'https://klanservicehub-backend.klanservicehub.workers.dev';

      const targetUrl = new URL(url.pathname + url.search, backendBase);
      const requestHeaders = new Headers(request.headers);
      requestHeaders.delete('host');

      const proxyRequest = new Request(targetUrl.toString(), {
        method: request.method,
        headers: requestHeaders,
        body: ['GET', 'HEAD'].includes(request.method) ? undefined : request.body,
        redirect: 'follow',
      });

      try {
        return await fetch(proxyRequest);
      } catch (err) {
        return new Response(JSON.stringify({ error: 'Backend proxy error', details: err?.message || String(err) }), {
          status: 502,
          headers: { 'content-type': 'application/json' },
        });
      }
    }

    // Serve static assets via Cloudflare Assets binding
    if (env?.ASSETS && typeof env.ASSETS.fetch === 'function') {
      try {
        const response = await env.ASSETS.fetch(request);
        if (response.status !== 404) {
          return response;
        }
      } catch (e) {
        // Fallback to SPA index
      }

      // SPA Fallback for client-side routing
      try {
        const indexUrl = new URL('/index.html', url.origin);
        return await env.ASSETS.fetch(new Request(indexUrl.toString(), { method: 'GET' }));
      } catch (err) {
        console.error('[SPA_FALLBACK_ERROR]:', err);
      }
    }

    return new Response('<!doctype html><html><head><meta http-equiv="refresh" content="0;url=/"></head><body>Redirecting...</body></html>', {
      status: 200,
      headers: { 'content-type': 'text/html; charset=utf-8' },
    });
  },
};
