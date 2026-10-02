export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Proxy API and health requests to backend
    if (url.pathname.startsWith('/api/') || url.pathname === '/api' || url.pathname === '/health') {
      const backendBase =
        env?.BACKEND_URL ||
        env?.VITE_API_URL ||
        env?.NEXT_PUBLIC_API_URL ||
        'https://klanservicehub-backend.klanservicehub.workers.dev';

      const targetUrl = new URL(url.pathname + url.search, backendBase);

      const requestHeaders = new Headers(request.headers);
      requestHeaders.set('host', targetUrl.host);
      if (!requestHeaders.has('x-forwarded-host')) {
        requestHeaders.set('x-forwarded-host', url.host);
      }
      if (!requestHeaders.has('x-forwarded-proto')) {
        requestHeaders.set('x-forwarded-proto', url.protocol.replace(':', ''));
      }

      const proxyRequest = new Request(targetUrl.toString(), {
        method: request.method,
        headers: requestHeaders,
        body: ['GET', 'HEAD'].includes(request.method) ? undefined : request.body,
        redirect: 'manual',
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

    if (env && env.ASSETS && typeof env.ASSETS.fetch === 'function') {
      try {
        const response = await env.ASSETS.fetch(request);
        if (response.status !== 404) {
          return response;
        }
      } catch (e) {
        // Continue to fallback
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
