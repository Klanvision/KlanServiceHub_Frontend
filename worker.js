export default {
  async fetch(request, env) {
    try {
      if (env && env.ASSETS && typeof env.ASSETS.fetch === 'function') {
        const response = await env.ASSETS.fetch(request);
        if (response.status === 404) {
          const url = new URL(request.url);
          if (url.pathname.endsWith('favicon.ico') || url.pathname.endsWith('icon.svg')) {
            return new Response(null, { status: 204 });
          }
          // Serve SPA index.html fallback for client-side routing
          const indexRequest = new Request(new URL('/index.html', url.origin), request);
          return await env.ASSETS.fetch(indexRequest);
        }
        return response;
      }
    } catch (err) {
      console.error('[ASSET_SERVE_ERROR]:', err);
    }
    return new Response('KlanServiceHub Frontend Loading...', {
      status: 500,
      headers: { 'content-type': 'text/plain; charset=utf-8' },
    });
  },
};
