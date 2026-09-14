export default {
  async fetch(request, env) {
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
        const url = new URL(request.url);
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
