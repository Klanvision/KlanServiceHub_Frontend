export default {
  async fetch(request, env) {
    try {
      if (env && env.ASSETS && typeof env.ASSETS.fetch === 'function') {
        const response = await env.ASSETS.fetch(request);
        // If static asset not found, serve SPA root
        if (response.status === 404) {
          const url = new URL(request.url);
          // If asking for missing favicon, return empty 204
          if (url.pathname.endsWith('favicon.ico')) {
            return new Response(null, { status: 204 });
          }
          if (!url.pathname.includes('.')) {
            const indexRequest = new Request(new URL('/index.html', url.origin), request);
            return await env.ASSETS.fetch(indexRequest);
          }
        }
        return response;
      }
    } catch (err) {
      console.error('[ASSET_SERVE_ERROR]:', err);
    }
    return new Response('KlanServiceHub Frontend Initializing...', {
      status: 200,
      headers: { 'content-type': 'text/html; charset=utf-8' },
    });
  },
};
